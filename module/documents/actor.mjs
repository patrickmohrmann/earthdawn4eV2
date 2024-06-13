import EdRollOptions from "../data/other/roll-options.mjs";
import ED4E from "../config.mjs";
import RollPrompt from "../applications/global/roll-prompt.mjs";
import { DocumentCreateDialog } from "../applications/global/document-creation.mjs";

import LegendPointHistoryEarnedPrompt from "../applications/global/lp-history.mjs"
import LpEarningTransactionData from "../data/advancement/lp-earning-transaction.mjs";
import LpSpendingTransactionData from "../data/advancement/lp-spending-transaction.mjs";
import LpTrackingData from "../data/advancement/lp-tracking.mjs";
import RecoveryPrompt from "../applications/global/recovery-prompt.mjs";
import EdRoll from "../dice/ed-roll.mjs";
import TakeDamagePrompt from "../applications/global/take-damage-prompt.mjs";
import KnockDownItemsPrompt from "../applications/global/knock-down-prompt.mjs";
import JumpUpItemsPrompt from "../applications/global/jump-up-prompt.mjs";
// import { getLegendPointHistoryData } from "../applications/global/lp-history.mjs";
/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @augments {Actor}
 */
export default class ActorEd extends Actor {

  /** @inheritDoc */
  static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
    return DocumentCreateDialog.waitPrompt( data, { documentCls: Actor, parent, pack, options } );
  }

  /**
   * Returns the namegiver item if this actor has one (has to be of type "character" or "npc" for this).
   * @type {Item|undefined}
   */ 
  get namegiver() {
    return this.items.filter( item => item.type === 'namegiver' )[0];
  }

  /**
   * Taken from the ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}).
   * Returns an array of items that match a given EDID and optionally an item type.
   * @param {string} edid           The SWID of the item(s) which you want to retrieve
   * @param {string} type           Optionally, a type name to restrict the search
   * @returns {Item[]|undefined}    An array containing the found items
   */
  getItemsByEdid( edid, type ) {
    const edidFilter = ( item ) => item.system.edid === edid;
    if ( !type ) return this.items.filter( edidFilter );

    const itemTypes = this.itemTypes;
    if ( !Object.hasOwn( itemTypes, type ) ) throw new Error( `Type ${type} is invalid!` );

    return itemTypes[type].filter( edidFilter );
  }

  /**
   * Taken from the ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}).
   * Fetch an item that matches a given EDID and optionally an item type.
   * @param {string} edid         The EDID of the item(s) which you want to retrieve
   * @param {string} type         Optionally, a type name to restrict the search
   * @returns {Item|undefined}    The matching item, or undefined if none was found.
   */
  getSingleItemByEdid( edid, type ) {
    return this.getItemsByEdid( edid, type )[0];
  }

  /** 
   * Perform the karma ritual for this actor to set the current karma points to maximum.
   * Only to be used for namegivers with a discipline.
   */
  karmaRitual() {
    this.update( {"system.karma.value": this.system.karma.max} );
  }

  /**
   * Expand Item Cards by clicking on the name span
   * @param {object} item item
   */
  expandItemCards( item ) {
    console.log( "card wurde geklickt" )
    const itemDescriptionDocument = document.getElementsByClassName( "card__description" );
    const currentItemElement = itemDescriptionDocument.nextElementSibling;
    currentItemElement.classList.toggle( "d-none" )
  }

  /**
   * Legend point History earned prompt trigger
   * @returns {Promise<void>}
   */
  async legendPointHistoryEarned( ) {
    // let history = await getLegendPointHistoryData( actor );
    const lpUpdateData = await LegendPointHistoryEarnedPrompt.waitPrompt( new LpTrackingData( this.system.lp.toObject() ), {actor: this} );
    return this.update( {system: { lp: lpUpdateData }} )
  }

  /**
   * Roll a generic attribute test. Uses {@link RollPrompt} for further input data.
   * @param {string} attributeId  The 3-letter id for the attribute (e.g. "per").
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollAttribute( attributeId, options = {} ) {
    const attributeStep = this.system.attributes[attributeId].step;
    const edRollOptions = new EdRollOptions( {
      testType: "action",
      step: { base: attributeStep },
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: `${game.i18n.localize( ED4E.attributes[attributeId].label )} Test`,
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  /**
   * @summary                     Ability rolls are a subset of Action test resembling non-attack actions like Talents, skills etc.
   * @description                 Roll an Ability. use {@link RollPrompt} for further input data.
   * @param {ItemEd} ability      ability must be of type AbilityTemplate & TargetingTemplate
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollAbility( ability, options = {} ) {
    const attributeStep = this.system.attributes[ability.system.attribute].step;
    const abilityFinalStep = attributeStep + ability.system.level;
    const difficulty = await ability.system.getDifficulty();
    if ( difficulty === undefined || difficulty === null ) {
      ui.notifications.error( "ability is not part of Targeting Template, please call your Administrator!" );
      return;
    }
    const edRollOptions = new EdRollOptions( {
      rollType: "action",
      step: { base: abilityFinalStep },
      strain: { base: ability.system.strain},
      target: { base: difficulty },
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { pointsUsed: ability.system.devotionRequired ? 1: 0, pointsRequired: ability.system.devotionRequired, available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: ability.name + " Test",
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  /**
   * @summary                     Equipment rolls are a subset of Action test resembling non-attack actions like Talents, skills etc.
   * @description                 Roll an Equipment. use {@link RollPrompt} for further input data.
   * @param {ItemEd} equipment    Equipment must be of type EquipmentTemplate & TargetingTemplate
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
   async rollEquipment( equipment, options = {} ) {
    const arbitraryStep = equipment.system.usableItem.arbitraryStep
    const difficulty = equipment.system.getDifficulty();
    if ( !difficulty ) {
      ui.notifications.error( game.i18n.localize( "X.ability is not part of Targeting Template, please call your Administrator!" ) );
      return;
    }
    const edRollOptions = new EdRollOptions( {
      testType: "action",
      step: { base: arbitraryStep },
      target: { base: difficulty },
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: equipment.name + " Equipment Test",
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  async takeDamageManual( options = {} ) {
    const takeDamage = await TakeDamagePrompt.waitPrompt( this );
    const amount = takeDamage.damage;
    const damageType = takeDamage.damageType;
    const armorType = takeDamage.armorType;
    const ignoreArmor = takeDamage.ignoreArmor === "on" ? true : false; 

    this.takeDamage( amount, damageType, armorType, ignoreArmor );
    console.log( "takeDamage", takeDamage )
  }

  async rollRecovery( options = {} ) {
    const recoveryMode = await RecoveryPrompt.waitPrompt( this );
    let recoveryFinalStep = this.system.attributes.tou.step + this.system.globalBonuses.allRecoveryEffects.value;
    const stunDamage = this.system.characteristics.health.damage.stun;
    const totalDamage = this.system.characteristics.health.damage.total;
    const currentWounds = this.system.characteristics.health.wounds;
    const newWounds = currentWounds > 0 ? currentWounds - 1 : 0;
    const recoveryTestPerDay = this.system.characteristics.recoveryTests.max;
    const woundsPath = `system.characteristics.health.wounds`;
    const recoveryTestAvailablePath = `system.characteristics.recoveryTests.value`;
    const recoveryStunAvailabiltyPath = `system.characteristics.recoveryTests.stun`;

    if ( recoveryMode === "recovery" ) {
      if ( this.system.characteristics.recoveryTests.value < 1 ) {
        ui.notifications.warn( "Localize: Not enough recovery tests available." );
        return;
      } else {
        if ( totalDamage === 0 ) {
          ui.notifications.warn( "Localize: No Injuries, no recovery needed" );
          return;
        }
      }
    }
    else if ( recoveryMode === "nightRest" ) {
      if ( totalDamage === 0 && currentWounds === 0 ) {
        this.update( {
          [`${recoveryStunAvailabiltyPath}`]: false,
          [`${recoveryTestAvailablePath}`]: recoveryTestPerDay
        } );
        return;
      } else if ( totalDamage === 0 && currentWounds > 0 ) {
        this.update( {
          [`${recoveryStunAvailabiltyPath}`]: false,
          [`${recoveryTestAvailablePath}`]: recoveryTestPerDay - 1,
          [`${woundsPath}`]: newWounds
        } );
        return;
      }
    }
    else if ( recoveryMode === "recoverStun" ) {
      if ( this.system.characteristics.recoveryTests.value < 1 ) {
        ui.notifications.warn( "Localize: Not enough recovery tests available." );
        return;
      } else {
        if ( stunDamage === 0 ) {
          ui.notifications.warn( "Localize: You don'T have Stun damage" );
          return;
        } else {
          recoveryFinalStep += this.system.attributes.wil.step
        }
      }
    }
    else {
      return
    }

    let chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollRecovery", { 
        sourceActor: this.name,
        step: recoveryFinalStep
      } );

    const edRollOptions = new EdRollOptions( {
      testType: "effect",
      rollType: "recovery",
      step: { base: recoveryFinalStep},
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: chatFlavor,
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll, recoveryMode );
  }

  /**
   * @summary                       Take the given amount of strain as damage.
   * @param {number} strain         The amount of strain damage take
   */
  takeStrain( strain ) {
    if ( !strain ) return;
    this.takeDamage( strain, "standard", undefined, true );
  }

  /**
   * Only for actors of type Sentient (character, npc, creature, spirits, horror, dragon). Take the given amount of
   * damage according to the parameters.
   * @param {number} amount                                     The unaltered amount of damage this actor should take.
   * @param {("standard"|"stun")} damageType                    The type of damage. One of either 'standard' or 'stun'.
   * @param {("physical"|"mystical")} [armorType]               The type of armor that protects from this damage, one of either
   *                                                            'physical', 'mystical', or 'none'.
   * @param {boolean} [ignoreAmor]                                Whether armor should be ignored when applying this damage.
   */
  // eslint-disable-next-line max-params
  takeDamage( amount, damageType = "standard", armorType, ignoreAmor ) {
    const finalAmount = amount - (
        ( ignoreAmor || !armorType )
            ? 0
            : this.system.characteristics.armor[armorType].value
    );
      const newDamage = this.system.characteristics.health.damage[damageType] + finalAmount ;
      this.update( {[`system.characteristics.health.damage.${damageType}`]: newDamage} );
      if ( newDamage > this.system.characteristics.health.woundThreshold && damageType === "standard" ) {
        const newWounds = this.system.characteristics.health.wounds + 1;
        this.update( {[`system.characteristics.health.wounds`]: newWounds} );
      } else if ( newDamage > this.system.characteristics.health.woundThreshold && damageType === "stun" ) {
        this.update( {[`system.condition.harried`]: true} );
      }
      if ( finalAmount >= this.system.characteristics.health.woundThreshold + 5 && this.system.condition.knockedDown === false ) {
        ui.notifications.warn( "Localize: You are down!- Knockdown test under Construction" );
        this.knockdownTest( finalAmount );
      }
  }

  async knockdownTest( amount ) {
    let  knockdownStep = this.system.attributes.str.step;
    const knockdownItems = this.items.filter( item => item.system.edid === "knock-down" );
    if ( knockdownItems.length > 0 ) {
      const knockdownAbilityId = await KnockDownItemsPrompt.waitPrompt ( knockdownItems );
      if ( knockdownAbilityId ) {
        for ( const item of knockdownItems ) {
          if ( item.id === knockdownAbilityId ) {
            const attributeStep = this.system.attributes[item.system.attribute].step;
            knockdownStep = attributeStep + item.system.level;
          }
        }
      }
    }
    const difficulty = amount - this.system.characteristics.health.woundThreshold;
    let chatFlavor = game.i18n.format( "ED.Chat.Flavor.knockdownTest", { 
      sourceActor: this.name,
      step: knockdownStep
    } );
    const edRollOptions = new EdRollOptions( {
      testType: "action",
      rollType: "knockdown",
      target: { base: difficulty },
      // step: { base: knockdownStep + this.system.globalBonuses.allKnockdownEffects.value }, 
      step: { base: knockdownStep}, 
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: chatFlavor,
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions );
    this.#processRoll( roll );
  }

  async jumpUp() {
    let jumpUpStep = this.system.attributes.dex.step;
    const jumpUpItems = this.items.filter( item => item.system.edid === "jump-up" );
    if ( jumpUpItems.length > 0 ) {
      const jumpUpAbilityId = await JumpUpItemsPrompt.waitPrompt ( jumpUpItems );
      if ( jumpUpAbilityId ) {
        for ( const item of jumpUpItems ) {
          if ( item.id === jumpUpAbilityId ) {
            const attributeStep = this.system.attributes[item.system.attribute].step;
            jumpUpStep = attributeStep + item.system.level;
          }
        }
      }
    }
    let chatFlavor = game.i18n.format( "ED.Chat.Flavor.jumpUp", { 
      sourceActor: this.name,
      step: jumpUpStep
    } );
    const edRollOptions = new EdRollOptions( {
      testType: "action",
      rollType: "jumpUp",
      target: { base: 6 },
      step: { base: jumpUpStep },
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: chatFlavor,
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions );
    this.#processRoll( roll );
  }


  /**
   * Use a resource (karma, devotion) by deducting the amount. This will always happen, even if not enough is available.
   * Look out for the return value to see if that was the case.
   * @param {"karma"|"devotion"|"recovery"} resourceType The type of resource to use. One of either "karma" or "devotion".
   * @param {number} amount                   The amount to use of the resource.
   * @returns {boolean}                       Returns `true` if the full amount was deducted (enough available), 'false'
   *                                          otherwise.
   */
  #useResource( resourceType, amount ) {
    const available = this.system[resourceType].value;
    this.update( {[`system.${resourceType}.value`]: ( available - amount ) } );
    return amount <= available;
  }

  /**
   * Evaluate a Roll and process its data in this actor. This includes (if applicable):
   * <ul>
   *     <li>taking strain damage</li>
   *     <li>reducing resources (karma, devotion)</li>
   *     <li>recover from damage</li>
   * </ul>
   * @param {EdRoll} roll The prepared Roll.
   * @param {string} recoveryMode type of recovery
   */
  #processRoll( roll, recoveryMode ) {
    if ( !roll ) {
      // No roll available, do nothing.
      return;
    }
    // Check if this uses karma or strain at all
    this.takeDamage( roll.totalStrain, "standard", undefined, true );
    if (
        !this.#useResource( 'karma', roll.options.karma.pointsUsed )
        || !this.#useResource( 'devotion', roll.options.devotion.pointsUsed )
    ) {
      ui.notifications.warn( "Localize: Not enough karma,devotion or recovery. Used all that was available." );
    }

    // catch recovery test before toMessage
    if ( roll.options.rollType === "recovery" ) {
      this.#processRecoveryResult( roll, recoveryMode );
    } else if ( roll.options.rollType === "knockdown" ) {
      this.#processKnockdownResult( roll );
    } else if ( roll.options.rollType === "jumpUp" ) {
      this.#processJumpUpResult( roll );
    } else {
    roll.toMessage();
    }
  }

  async #processJumpUpResult ( roll ) {
    await roll.evaluate();
    if ( !roll._total ) {
      return;
    } else {
      if ( roll.isSuccess === true ) {
        this.update( {[`system.condition.knockedDown`]: false, } );
      }
    }
    roll.toMessage();
  }
  async #processKnockdownResult ( roll )  {
    await roll.evaluate();
    if ( !roll._total ) {
      return;
    } else {
      if ( roll.isSuccess === false ) {
        this.update( {[`system.condition.knockedDown`]: true, } );
      }
    }
    roll.toMessage();
  }

  /**
   * Process the result of a recovery roll. This will reduce the damage taken by the amount rolled.
   * @param {EdRoll} roll The roll to process.
   * @param {string} recoveryMode type of the recovery
   * @returns {Promise<void>}
   */
  async #processRecoveryResult( roll, recoveryMode ) { 
    await roll.evaluate();
    if ( !roll._total ) {
      return;
    } else {
      const rollTotal = roll._total;
      const stunDamage = this.system.characteristics.health.damage.stun;
      const standardDamage = this.system.characteristics.health.damage.standard;
      const totalDamage = this.system.characteristics.health.damage.total;
      const currentWounds = this.system.characteristics.health.wounds;
      const healingRate = rollTotal - currentWounds > 0 ? rollTotal - currentWounds : 1;
      const newWounds = currentWounds > 0 ? currentWounds - 1 : 0;
      const newPhysicalDamage = standardDamage > 0 ? standardDamage - healingRate : 0;
      const newStunDamage = stunDamage > 0 ? stunDamage - healingRate : 0 ;
      const recoveryTestPerDay = this.system.characteristics.recoveryTests.max;
      const recoveryTestsCurrent = this.system.characteristics.recoveryTests.value;
      const woundsPath = `system.characteristics.health.wounds`;
      const standardDamagePath = `system.characteristics.health.damage.standard`;
      const stunDamagePath = `system.characteristics.health.damage.stun`;
      const recoveryTestAvailablePath = `system.characteristics.recoveryTests.value`;
      const recoveryStunAvailabiltyPath = `system.characteristics.recoveryTests.stun`;
    if ( recoveryMode === "recovery" ) {
      this.update( {
        [`${standardDamagePath}`]: newPhysicalDamage,
        [`${stunDamagePath}`]: newStunDamage,
        [`${recoveryStunAvailabiltyPath}`]: false,
        [`${recoveryTestAvailablePath}`]: recoveryTestsCurrent - 1
      } );
    } else if ( recoveryMode === "nightRest" ) {
      if ( currentWounds > 0  && totalDamage === 0 ) {
        this.update( {
          [`${woundsPath}`]: newWounds,
          [`${recoveryStunAvailabiltyPath}`]: false,
          [`${recoveryTestAvailablePath}`]: recoveryTestPerDay - 1
        } );
      } else if ( totalDamage > 0 ) {
      this.update( {
        [`${standardDamagePath}`]: newPhysicalDamage,
        [`${stunDamagePath}`]: newStunDamage,
        [`${recoveryStunAvailabiltyPath}`]: false,
        [`${recoveryTestAvailablePath}`]: recoveryTestPerDay - 1
      } );
    } else if ( currentWounds === 0  && totalDamage === 0 ) {
      this.update( {
        [`${recoveryStunAvailabiltyPath}`]: false,
        [`${recoveryTestAvailablePath}`]: recoveryTestPerDay
      } );
    }
    } else if ( recoveryMode === "recoverStun" ) {
      this.update( {
        [`${stunDamagePath}`]: newStunDamage,
        [`${recoveryStunAvailabiltyPath}`]: true,
        [`${recoveryTestAvailablePath}`]: recoveryTestsCurrent - 1
      } );
      console.log( "ACTORDATA STUN", this.system.characteristics.health.damage.stun )
    } else {  
      ui.notifications.warn( "Localize: No recovery type found." );
      return;
    }
    roll.toMessage();
  }
  }

  _applyBaseEffects( baseCharacteristics ) {
    let overrides = {};
    // Organize non-disabled effects by their application priority
    // baseCharacteristics is list of attributes that need to have Effects applied before Derived Characteristics are calculated
    const changes = this.effects.reduce( ( changes, e ) => {
      if ( e.changes.length < 1 ) {
        return changes;
      }
      if ( e.disabled || e.isSuppressed || !baseCharacteristics.includes( e.changes[0].key ) ) {
        return changes;
      }

      return changes.concat(

          e.changes.map( ( c ) => {
            // eslint-disable-next-line no-param-reassign
            c = foundry.utils.duplicate( c );
            c.effect = e;
            c.priority = c.priority ?? c.mode * 10;
            return c;
          } ),
      );
    }, [] );

    changes.sort( ( a, b ) => a.priority - b.priority );

    // Apply all changes
    for ( let change of changes ) {
      const result = change.effect.apply( this, change );
      if ( result !== null ) overrides[change.key] = result[change.key];
    }

    // Expand the set of final overrides
    this.overrides = foundry.utils.expandObject( { ...foundry.utils.flattenObject( this.overrides ), ...overrides } );
  }

  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment['system.description.value'] = await TextEditor.enrichHTML( this.system.description.value, {
      async: true,
      secrets: this.isOwner,
    } );
    return foundry.utils.expandObject( enrichment );
  }

  async _enableHTMLEnrichmentEmbeddedItems( ) {
    for ( const item of this.items ) {
      item.system.description.value = foundry.utils.expandObject( await TextEditor.enrichHTML( item.system.description.value, {
            async: true,
            secrets: this.isOwner,
          } )
      );
    }
  }

  async addLpTransaction( type, transactionData ) {
    const oldTransactions = this.system.lp[type];
    const TransactionModel = type === "earnings" ? LpEarningTransactionData : LpSpendingTransactionData
    const transaction = new TransactionModel( transactionData )

    return this.update( { 
      [`system.lp.${type}`]: oldTransactions.concat( [transaction] )
    } )
  }
}