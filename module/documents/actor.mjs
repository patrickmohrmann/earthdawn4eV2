/* eslint-disable complexity */
import EdRollOptions from "../data/other/roll-options.mjs";
import ED4E from "../config.mjs";
import RollPrompt from "../applications/global/roll-prompt.mjs";
import { DocumentCreateDialog } from "../applications/global/document-creation.mjs";

import LegendPointHistoryEarnedPrompt from "../applications/global/lp-history.mjs"
import LpEarningTransactionData from "../data/advancement/lp-earning-transaction.mjs";
import LpSpendingTransactionData from "../data/advancement/lp-spending-transaction.mjs";
import LpTrackingData from "../data/advancement/lp-tracking.mjs";
import { sum } from "../utils.mjs";
import RecoveryPrompt from "../applications/global/recovery-prompt.mjs";
import EdRoll from "../dice/ed-roll.mjs";
// import TakeDamagePrompt from "../applications/global/take-damage-prompt.mjs";
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
   * Checks if the actor is wearing any piece of armor that is part of a piecemeal armor set.
   * Piecemeal armor is a type of armor that is made up of several different pieces.
   * Returns true if the actor is wearing at least one piece of piecemeal armor, false otherwise.
   * @type {boolean}
   */
  get wearsPiecemealArmor() {
    return this.itemTypes.armor.some( armor => armor.system.piecemealArmor.selector );
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
    this.update( { "system.karma.value": this.system.karma.max } );
  }

  /**
   * Expand Item Cards by clicking on the name span
   */
  expandItemCards() {
    const itemDescriptionDocument = document.getElementsByClassName( "card__description" );
    const currentItemElement = itemDescriptionDocument.nextElementSibling;
    currentItemElement.classList.toggle( "d-none" )
  }

/**
 * Triggers a prompt for updating the Legend Point (LP) history of the actor.
 * Updates the LPTrackingData of the actor based on the input from the prompt.
 * @returns {Promise<Actor>} A Promise that resolves to the updated Actor instance.
 */
  async legendPointHistoryEarned() {
    // let history = await getLegendPointHistoryData( actor );
    const lpUpdateData = await LegendPointHistoryEarnedPrompt.waitPrompt( new LpTrackingData( this.system.lp.toObject() ), { actor: this } );
    return this.update( { system: { lp: lpUpdateData } } );
  }

  /**
   * Roll a generic attribute test. Uses {@link RollPrompt} for further input data.
   * @param {string} attributeId  The 3-letter id for the attribute (e.g. "per").
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollAttribute( attributeId, options = {} ) {
    const attributeStep = this.system.attributes[attributeId].step;
    const step = { base: attributeStep };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollAttribute", {
      sourceActor: this.name,
      step: attributeStep,
      attribute: `${game.i18n.localize( ED4E.attributes[attributeId].label )}`
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
      testType: "action",
      rollType: "attribute",
      strain: 0,
      target: undefined,
      step: step,
      devotionRequired: false,
      chatFlavor: chatFlavor,
      },
      this,
     );
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
    const abilityStep = attributeStep + ability.system.level;
    const difficulty = await ability.system.getDifficulty();
    if ( difficulty === undefined || difficulty === null ) {
      ui.notifications.error( "ability is not part of Targeting Template, please call your Administrator!" );
      return;
    }
    const difficultyFinal = { base: difficulty }
    const devotionRequired = ability.system.devotionRequired ? true : false;
    const strain = { base: ability.system.strain };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollAbility", {
      sourceActor: this.name,
      ability: ability.name,
      step: abilityStep
    } );
    const abilityFinalStep = { base: abilityStep }
    const edRollOptions = EdRollOptions.fromActor(
      {
      testType: "action",
      rollType: "ability",
      strain: strain,
      target: difficultyFinal,
      step: abilityFinalStep,
      devotionRequired: devotionRequired,
      chatFlavor: chatFlavor,
      },
      this,
     );
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
    const difficulty = await equipment.system.getDifficulty()
    if ( difficulty === undefined || difficulty === null ) {
      ui.notifications.error( "ability is not part of Targeting Template, please call your Administrator!" );
      return;
    }
    const difficultyFinal = { base: difficulty }
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollEquipment", {
      sourceActor: this.name,
      equipment: equipment.name,
      step: arbitraryStep
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
      testType: "action",
      rollType: "equipment",
      strain: 0,
      target: difficultyFinal,
      step: arbitraryStep,
      devotionRequired: false,
      chatFlavor: chatFlavor,
      },
      this,
     );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  async rotateItemStatus( itemId, backwards = false ) {
    const item = this.items.get( itemId );
    const nextStatus = backwards ? item.system.previousItemStatus : item.system.nextItemStatus;
    return this._updateItemStates( item, nextStatus );
  }
  // async takeDamage( options = {} ) {
  //   const takeDamage = await TakeDamagePrompt.waitPrompt( this );
  //   console.log( "takeDamage", takeDamage )
  // }

  async takeDamageManual( options = {} ) {
    const takeDamage = await TakeDamagePrompt.waitPrompt( this );
    const amount = takeDamage.damage;
    const damageType = takeDamage.damageType;
    const armorType = takeDamage.armorType;
    const ignoreArmor = takeDamage.ignoreArmor === "on" ? true : false;
  // async takeDamageManual( options = {} ) {
  //   const takeDamage = await TakeDamagePrompt.waitPrompt( this );
  //   const amount = takeDamage.damage;
  //   const damageType = takeDamage.damageType;
  //   const armorType = takeDamage.armorType;
  //   const ignoreArmor = takeDamage.ignoreArmor === "on" ? true : false;

  //   this.takeDamage( amount, false, damageType, armorType, ignoreArmor );
  // }
  }

  async rollRecovery( options = {} ) {
    const recoveryMode = await RecoveryPrompt.waitPrompt( this );
    let recoveryStep = this.system.attributes.tou.step + this.system.globalBonuses.allRecoveryEffects.value;
    const stunDamage = this.system.characteristics.health.damage.stun;
    const totalDamage = this.system.characteristics.health.damage.total;
    const currentWounds = this.system.characteristics.health.wounds;
    const newWounds = currentWounds > 0 ? currentWounds - 1 : 0;
    const recoveryTestPerDay = this.system.characteristics.recoveryTestsRecource.max;
    const woundsPath = `system.characteristics.health.wounds`;
    const recoveryTestAvailablePath = `system.characteristics.recoveryTestsRecource.value`;
    const recoveryStunAvailabiltyPath = `system.characteristics.recoveryTestsRecource.stunRecoveryAvailabilty`;

    // logic which is not triggering a roll
    if ( recoveryMode === "recovery" ) {
      if ( this.system.characteristics.recoveryTestsRecource.value < 1 ) {
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
      if ( this.system.characteristics.recoveryTestsRecource.value < 1 ) {
        ui.notifications.warn( "Localize: Not enough recovery tests available." );
        return;
      } else {
        if ( stunDamage === 0 ) {
          ui.notifications.warn( "Localize: You don'T have Stun damage" );
          return;
        } else {
          recoveryStep += this.system.attributes.wil.step
        }
      }
    }
    else {
      return
    }

    let chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollRecovery", {
      sourceActor: this.name,
      step: recoveryStep
    } );
    const recoveryFinalStep = { base: recoveryStep }
    const edRollOptions = EdRollOptions.fromActor(
      {
      testType: "effect",
      rollType: "recovery",
      rollSubType: recoveryMode,
      strain: 0,
      target: undefined,
      step: recoveryFinalStep,
      devotionRequired: false,
      chatFlavor: chatFlavor,
      },
      this,
     );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }


  /**
   * @summary                       Take the given amount of strain as damage.
   * @param {number} strain         The amount of strain damage take
   */
  takeStrain( strain ) {
    if ( !strain ) return;
    this.takeDamage( strain, true, "standard", undefined, true );
  }

  /**
   * Only for actors of type Sentient (character, npc, creature, spirits, horror, dragon). Take the given amount of
   * damage according to the parameters.
   * @param {number} amount                                     The unaltered amount of damage this actor should take.
   * @param {boolean} isStrain                                  Whether this damage is strain or not.
   * @param {("standard"|"stun")} damageType                    The type of damage. One of either 'standard' or 'stun'.
   * @param {("physical"|"mystical")} [armorType]               The type of armor that protects from this damage, one of either
   *                                                            'physical', 'mystical', or 'none'.
   * @param {boolean} [ignoreAmor]                                Whether armor should be ignored when applying this damage.
   */
  // eslint-disable-next-line max-params
  takeDamage( amount, isStrain, damageType = "standard", armorType, ignoreAmor ) {
    const { armor, health } = this.system.characteristics;
    const finalAmount = amount - ( ignoreAmor || !armorType ? 0 : armor[armorType].value );
    const newDamage = health.damage[damageType] + finalAmount;

    const updates = { [`system.characteristics.health.damage.${damageType}`]: newDamage };

    if ( finalAmount > health.woundThreshold ) {
      switch ( damageType ) {
        case "standard":
          updates[`system.characteristics.health.wounds`] = health.wounds + 1;
          break;
        case "stun":
          updates[`system.condition.harried`] = true;
          break;
        // Add more cases here for other damage types
      }
    }

    this.update( updates );
    let messageData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker( { actor: this.actor } ),
      content: "THIS WILL BE FIXED LATER see #756"
    };
    if ( isStrain === false ) {
      ChatMessage.create( messageData );
    }

    if ( !this.system.condition.knockedDown && finalAmount >= health.woundThreshold ) {
      this.knockdownTest( finalAmount );
    }
  }

  async knockdownTest( amount, options = {} ) {
    if ( this.system.condition.knockedDown === true ) {
      ui.notifications.warn( "Localize: You are already knocked down." );
      return;
    }
    const { attributes, characteristics } = this.system;
    let devotionRequired = false;
    let strain = 0;
    let knockdownStep = attributes.str.step;

    const knockdownAbilities = this.items.filter( item => item.system.edid === "knock-down" );

    if ( knockdownAbilities.length > 0 ) {
      const knockdownAbilityId = await KnockDownItemsPrompt.waitPrompt( knockdownAbilities );

      if ( knockdownAbilityId ) {
        const selectedAbility = knockdownAbilities.find( ability => ability.id === knockdownAbilityId );
        if ( selectedAbility ) {
          const { attribute, level, devotionRequired: devotion, strain: abilityStrain } = selectedAbility.system;
          knockdownStep = attributes[attribute].step + level;
          devotionRequired = devotion ? true : false;
          strain = { base: abilityStrain };
        }
      }
    }
    const difficulty = amount > 0 ? amount - characteristics.health.woundThreshold : 0;
    const difficultyFinal = { base: difficulty };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.knockdownTest", {
      sourceActor: this.name,
      step: knockdownStep
    } );

    const knockdownStepFinal = { base: knockdownStep + this.system.singleBonuses.knockdownEffects.value };
    const edRollOptions = EdRollOptions.fromActor(
      {
      testType: "action",
      rollType: "knockdown",
      strain: strain,
      target: difficultyFinal,
      step: knockdownStepFinal,
      devotionRequired: devotionRequired,
      chatFlavor: chatFlavor,
      },
      this,
     );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );

    this.#processRoll( roll );
  }

  async jumpUp( options = {} ) {
    if ( this.system.condition.knockedDown === false ) {
      ui.notifications.warn( "Localize: You are not knocked down." );
      return;
    }
    const { attributes } = this.system;
    let devotionRequired = false;
    let strain = 2;
    let jumpUpStep = attributes.dex.step;

    const jumpUpAbilities = this.items.filter( item => item.system.edid === "jump-up" );

    if ( jumpUpAbilities.length > 0 ) {
      const jumpUpAbilityId = await JumpUpItemsPrompt.waitPrompt( jumpUpAbilities );

      if ( jumpUpAbilityId ) {
        const selectedAbility = jumpUpAbilities.find( ability => ability.id === jumpUpAbilityId );

        if ( selectedAbility ) {
          const { attribute, level, devotionRequired: devotion, strain: abilityStrain } = selectedAbility.system;
          jumpUpStep = attributes[attribute].step + level;
          devotionRequired = devotion ? true : false;
          strain = { base: abilityStrain };
        }
      }
    }

    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.jumpUp", {
      sourceActor: this.name,
      step: jumpUpStep
    } );

    const difficulty = { base: 6 };
    const jumpUpStepFinal = { base: jumpUpStep };
    // const edRollOptions = await this.createEdRollOptions( "action", "jumpUp", strain, difficulty, jumpUpStepFinal, devotionRequired, chatFlavor );
    const edRollOptions = EdRollOptions.fromActor(
      {
      testType: "action",
      rollType: "jumpUp",
      strain: strain,
      target: difficulty,
      step: jumpUpStepFinal,
      devotionRequired: devotionRequired,
      chatFlavor: chatFlavor,
      },
      this,
     );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );

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
    this.update( { [`system.${resourceType}.value`]: ( available - amount ) } );
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
  #processRoll( roll ) {
    if ( !roll ) {
      // No roll available, do nothing.
      return;
    }

    // Check if this uses karma or strain at all
    this.takeDamage( roll.totalStrain, true, "standard", undefined, true );

    const { karma, devotion } = roll.options;
    const resourcesUsedSuccessfully = this.#useResource( 'karma', karma.pointsUsed ) && this.#useResource( 'devotion', devotion.pointsUsed );

    if ( !resourcesUsedSuccessfully ) {
      ui.notifications.warn( "Localize: Not enough karma,devotion or recovery. Used all that was available." );
    }

    const rollTypeProcessors = {
      "recovery": () => this.#processRecoveryResult( roll ),
      "knockdown": () => this.#processKnockdownResult( roll ),
      "jumpUp": () => this.#processJumpUpResult( roll ),
    };

    const processRollType = rollTypeProcessors[roll.options.rollType];

    if ( processRollType ) {
      processRollType();
    } else {
      roll.toMessage();
    }
  }

  async #processJumpUpResult( roll ) {
    await roll.evaluate();

    if ( roll._total && roll.isSuccess ) {
      this.update( { [`system.condition.knockedDown`]: false } );
    }

    roll.toMessage();
  }

  async #processKnockdownResult( roll ) {
    await roll.evaluate();
    if ( !roll._total ) {
      return;
    } else {
      if ( roll.isSuccess === false ) {
        this.update( { [`system.condition.knockedDown`]: true, } );
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
  async #processRecoveryResult( roll ) {
    await roll.evaluate();

    if ( !roll._total ) {
      return;
    }

    const { characteristics } = this.system;
    const { health, recoveryTestsRecource } = characteristics;
    const { damage, wounds } = health;
    const { stun, standard, total } = damage;

    const rollTotal = roll._total;
    const healingRate = Math.max( rollTotal - wounds, 1 );
    const newWounds = Math.max( wounds - 1, 0 );
    const newPhysicalDamage = Math.max( standard - healingRate, 0 );
    const newStunDamage = Math.max( stun - healingRate, 0 );

    const recoveryTestPerDay = recoveryTestsRecource.max;
    const recoveryTestsCurrent = recoveryTestsRecource.value;

    const updatePaths = {
      wounds: `system.characteristics.health.wounds`,
      standardDamage: `system.characteristics.health.damage.standard`,
      stunDamage: `system.characteristics.health.damage.stun`,
      recoveryTestAvailable: `system.characteristics.recoveryTestsRecource.value`,
      recoveryStunAvailability: `system.characteristics.recoveryTestsRecource.stunRecoveryAvailabilty`,
    };

    const updateData = {};

    switch ( roll.options.rollSubType ) {
      case "recovery":
        updateData[updatePaths.standardDamage] = newPhysicalDamage;
        updateData[updatePaths.stunDamage] = newStunDamage;
        updateData[updatePaths.recoveryStunAvailability] = false;
        updateData[updatePaths.recoveryTestAvailable] = recoveryTestsCurrent - 1;
        break;
      case "nightRest":
        if ( wounds > 0 && total === 0 ) {
          updateData[updatePaths.wounds] = newWounds;
        } else if ( total > 0 ) {
          updateData[updatePaths.standardDamage] = newPhysicalDamage;
          updateData[updatePaths.stunDamage] = newStunDamage;
        }
        updateData[updatePaths.recoveryStunAvailability] = false;
        updateData[updatePaths.recoveryTestAvailable] = recoveryTestPerDay - ( wounds > 0 || total > 0 ? 1 : 0 );
        break;
      case "recoverStun":
        updateData[updatePaths.stunDamage] = newStunDamage;
        updateData[updatePaths.recoveryStunAvailability] = true;
        updateData[updatePaths.recoveryTestAvailable] = recoveryTestsCurrent - 1;
        break;
      default:
        ui.notifications.warn( "Localize: No recovery type found." );
        return;
    }

    this.update( updateData );
    roll.toMessage();
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

  async _enableHTMLEnrichmentEmbeddedItems() {
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

  async _updateItemStates( itemToUpdate, nextStatus ) {
    const updates = [];
    const originalItemUpdate = { _id: itemToUpdate.id, "system.itemStatus": nextStatus };
    const equippedWeapons = this.itemTypes.weapon.filter(
      weapon => ["mainHand", "offHand", "twoHands"].includes( weapon.system.itemStatus )
    );
    const addUnequipItemUpdate = ( itemType, statuses ) => {
      this.itemTypes[itemType].filter(
        item => statuses.includes( item.system.itemStatus )
      ).forEach(
        item => updates.push( { _id: item.id, "system.itemStatus": "carried" } )
      );
    }

    switch ( itemToUpdate.type ) {
      case "armor":

        if ( nextStatus === "equipped" ) {
          if ( itemToUpdate.system.piecemealArmor?.selector ) {
            if ( !this.wearsPiecemealArmor ) {
              addUnequipItemUpdate( "armor", ["equipped"] );
            } else {
              // A complete set of piecemeal armor can have up to 5 size points. Armor pieces come in three sizes and
              // cost a corresponding number of points: large (3), medium (2), and small (1). A set of piecemeal armor
              // cannot have more than one size of a particular type.
              const equippedArmor = this.itemTypes.armor.filter( armor => armor.system.itemStatus === "equipped" );
              const sameSizePiece = equippedArmor.find( armor => armor.system.piecemealArmor.size === itemToUpdate.system.piecemealArmor.size );
              if ( sameSizePiece ) {
                updates.push( { _id: sameSizePiece.id, "system.itemStatus": "carried" } );
              } else {
                // Check if the total size of the equipped armor pieces and the size of the item to update exceeds the
                // maximum allowed size for a piecemeal armor set (5 size points). If it does, break the operation to
                // prevent equipping the item.
                // eslint-disable-next-line max-depth
                if (
                  sum( equippedArmor.map( armor => armor.system.piecemealArmor.size ) )
                  + itemToUpdate.system.piecemealArmor.size > 5
                ) {
                  ui.notifications.warn( game.i18n.localize( "ED4E.Notifications.Warn.piecemealArmorSizeExceeded" ) );
                  break;
                }
              }
              const equippedNonPiecemealArmor = this.itemTypes.armor.find( armor => armor.system.itemStatus === "equipped" && !armor.system.piecemealArmor?.selector );
              if ( equippedNonPiecemealArmor ) {
                updates.push( { _id: equippedNonPiecemealArmor.id, "system.itemStatus": "carried" } );
              }
            }
          } else {
            // Unequip other armor
            if ( nextStatus === "equipped" ) addUnequipItemUpdate( "armor", ["equipped"] );
          }
        }
        updates.push( originalItemUpdate );
        break;
      case "weapon":

        switch ( nextStatus ) {
          case "twoHands":
            const equippedShield = this.itemTypes.shield.find( shield => shield.system.itemStatus === "equipped" );
            addUnequipItemUpdate( "weapon", ["mainHand", "offHand", "twoHands"] );
            if ( !( itemToUpdate.system.isTwoHandedRanged && equippedShield.system.bowUsage ) ) addUnequipItemUpdate( "shield", ["equipped"] );
            break;
          case "mainHand":
          case "offHand":
            addUnequipItemUpdate( "weapon", [nextStatus, "twoHands"] );
            break;
          case "tail":
            addUnequipItemUpdate( "weapon", ["tail"] );
            break;
        }

        updates.push( originalItemUpdate );
        break;
      case "shield":

        if ( nextStatus === "equipped" ) {
          // Unequip other shields
          addUnequipItemUpdate( "shield", ["equipped"] );
          // If there's a bow and the shield allows it, no need to unequip the weapon
          const bowAllowed = equippedWeapons[0]?.system.isTwoHandedRanged && itemToUpdate.system.bowUsage;
          // If there's a two-handed weapon or two one-handed weapons, unequip one
          const unequipSomeWeapon = equippedWeapons.some( weapon => weapon.system.itemStatus === "twoHands" ) || equippedWeapons.length > 1;
          if ( !bowAllowed && unequipSomeWeapon ) {
            // Prefer to unequip off-hand weapon, if available
            const weaponToUnequip = equippedWeapons.find( weapon => weapon.system.itemStatus === "offHand" ) || equippedWeapons[0];
            updates.push( { _id: weaponToUnequip.id, "system.itemStatus": "carried" } );
          }
        }

        updates.push( originalItemUpdate );
        break;
      case "equipment":
      default:
        updates.push( originalItemUpdate );
        break;
    }
    return this.updateEmbeddedDocuments( "Item", updates );
  }
}