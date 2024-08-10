/* eslint-disable complexity */
import EdRollOptions from "../data/other/roll-options.mjs";
import ED4E from "../config.mjs";
import RollPrompt from "../applications/global/roll-prompt.mjs";
import DocumentCreateDialog from "../applications/global/document-creation.mjs";

import LegendPointHistory from "../applications/advancement/lp-history.mjs";
import LpEarningTransactionData from "../data/advancement/lp-earning-transaction.mjs";
import LpSpendingTransactionData from "../data/advancement/lp-spending-transaction.mjs";
import LpTrackingData from "../data/advancement/lp-tracking.mjs";
import { sum } from "../utils.mjs";
import PromptFactory from "../applications/global/prompt-factory.mjs";
import validateAbilityUpgrade from "../applications/global/validation-upgrade.mjs";
import ClassTemplate from "../data/item/templates/class.mjs";

const futils = foundry.utils;

/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @augments {Actor}
 */
export default class ActorEd extends Actor {

  _promptFactory = PromptFactory.fromDocument( this );

  /**
   * The class items if this actor has any (has to be of type "character" or "npc" for this).
   * @type {[ItemEd]}
   */
  get classes() {
    return this.items.filter( item => item.system instanceof ClassTemplate );
  }

  /**
   * The actor's currently available legend points.
   * @type {number}
   */
  get currentLp() {
    return this.system.lp.current;
  }

  /**
   * The actor's currently available money in silver.
   * @type {number}
   */
  get currentSilver() {
    return 1000;
  }

  /**
   * Returns the discipline items if this actor has any (has to be of type "character" or "npc" for this).
   * @type {Item[]}
   */
  get disciplines() {
    return this.items.filter( item => item.type === "discipline" );
  }

  /**
   * Whether this actor has more than one discipline. Returns `true` if this actor has more than one discipline, `false` otherwise
   * @type {boolean}
   */
  get isMultiDiscipline() {
    return this.disciplines.length > 1;
  }

  /**
   * The lowest circle of all disciplines this actor has.
   * @type {number}
   */
  get minCircle() {
    return Math.min( ...this.disciplines.map( discipline => discipline.system.level ) );
  }

  /**
   * Returns the namegiver item if this actor has one (has to be of type "character" or "npc" for this).
   * @type {Item|undefined}
   */
  get namegiver() {
    return this.items.filter( item => item.type === "namegiver" )[0];
  }

  /** @inheritDoc */
  static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
    return DocumentCreateDialog.waitPrompt( data, { documentCls: Actor, parent, pack, options } );
  }

  async _preCreate( data, options, userId ) {
    await super._preCreate( data, options, userId );

    // Configure prototype token settings
    if ( this.type === "character" ) {
      const prototypeToken = {
        sight:       {enabled: true},
        actorLink:   true,
        disposition: 1,   // Friendly
        displayBars: 50,  // Always Display bar 1 and 2
        displayName: 30,  // Display nameplate on hover
        bar1:        {
          attribute: "healthRate"
        },
        bar2: {
          attribute: "karma"
        }
      };

      this.updateSource( { prototypeToken } );
    }
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
   * @param {string} [type]           Optionally, a type name to restrict the search
   * @returns {Item[]|undefined}    An array containing the found items
   */
  getItemsByEdid( edid, type ) {
    const edidFilter = ( item ) => item.system.edid === edid;
    if ( !type ) return this.items.filter( edidFilter );

    const itemTypes = this.itemTypes;
    if ( !Object.hasOwn( itemTypes, type ) ) throw new Error( `Type ${ type } is invalid!` );

    return itemTypes[type].filter( edidFilter );
  }

  /**
   * Taken from the ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}).
   * Fetch an item that matches a given EDID and optionally an item type.
   * @param {string} edid         The EDID of the item(s) which you want to retrieve
   * @param {string} [type]         Optionally, a type name to restrict the search
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
   * @param {('standard'|'blood'|'any')} [type] The type of wounds that is to be checked.
   * @returns {boolean} True if there is a positive amount of wounds of the given type marked on this actor, false otherwise.
   */
  hasWounds( type = "any" ) {
    const hasStandardWounds = this.system.characteristics.health.wounds > 0;
    const hasBloodWounds = this.system.characteristics.health.bloodMagic.wounds > 0;
    switch ( type ) {
      case "standard":
        return hasStandardWounds;
      case "blood":
        return hasBloodWounds;
      case "any":
        return hasStandardWounds || hasBloodWounds;
      default:
        return undefined;
    }
  }

  /**
   * @param {('standard'|'lethal'|'stun'|'blood'|'any')} [type] The type of damage that is to be checked. Standard
   * damage is any of either lethal or stun damage.
   * @returns {boolean} True if there is a positive amount of damage of the given type marked on this actor, false otherwise.
   */
  hasDamage( type = "any" ) {
    const hasLethalDamage = this.system.characteristics.health.damage.standard > 0;
    const hasStunDamage = this.system.characteristics.health.damage.stun > 0;
    const hasBloodDamage = this.system.characteristics.health.bloodMagic.damage > 0;
    switch ( type ) {
      case "standard":
        return hasLethalDamage || hasStunDamage;
      case "lethal":
        return hasLethalDamage;
      case "stun":
        return hasStunDamage;
      case "blood":
        return hasBloodDamage;
      case "any":
        return hasLethalDamage || hasStunDamage || hasBloodDamage;
      default:
        return undefined;
    }
  }


  /**
   * Expand Item Cards by clicking on the name span
   */
  expandItemCards() {
    const itemDescriptionDocument = document.getElementsByClassName( "card__description" );
    const currentItemElement = itemDescriptionDocument.nextElementSibling;
    currentItemElement.classList.toggle( "d-none" );
  }

  /**
   * Triggers a prompt for updating the Legend Point (LP) history of the actor.
   * Updates the LPTrackingData of the actor based on the input from the prompt.
   * @returns {Promise<Actor>} A Promise that resolves to the updated Actor instance.
   * @UserFunction            UF_LpTracking-legendPointHistory
   * @see ../../documentation/User Functions/UF_LpTracking-legendPointHistory.md
   */
  async legendPointHistory() {
    // let history = await getLegendPointHistoryData( actor );
    const lpUpdateData = await LegendPointHistory.waitPrompt(
      new LpTrackingData( this.system.lp.toObject() ),
      { actor: this }
    );
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
      step:        attributeStep,
      attribute:   `${ game.i18n.localize( ED4E.attributes[attributeId].label ) }`
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType:         "action",
        rollType:         "attribute",
        strain:           0,
        target:           undefined,
        step:             step,
        devotionRequired: false,
        chatFlavor:       chatFlavor
      },
      this
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
    const difficultyFinal = { base: difficulty };
    const devotionRequired = !!ability.system.devotionRequired;
    const strain = { base: ability.system.strain };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollAbility", {
      sourceActor: this.name,
      ability:     ability.name,
      step:        abilityStep
    } );
    const abilityFinalStep = { base: abilityStep };
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType:         "action",
        rollType:         "ability",
        strain:           strain,
        target:           difficultyFinal,
        step:             abilityFinalStep,
        devotionRequired: devotionRequired,
        chatFlavor:       chatFlavor
      },
      this
    );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  /**
   * @summary                     Equipment rolls are a subset of Action test resembling non-attack actions like Talents, skills etc.
   * @description                 Roll an Equipment item. use {@link RollPrompt} for further input data.
   * @param {ItemEd} equipment    Equipment must be of type EquipmentTemplate & TargetingTemplate
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollEquipment( equipment, options = {} ) {
    const arbitraryStep = equipment.system.usableItem.arbitraryStep;
    const difficulty = equipment.system.getDifficulty();
    if ( !difficulty ) {
      ui.notifications.error( game.i18n.localize( "X.ability is not part of Targeting Template, please call your Administrator!" ) );

      return;
    }
    const difficultyFinal = { base: difficulty };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollEquipment", {
      sourceActor: this.name,
      equipment:   equipment.name,
      step:        arbitraryStep
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType:         "action",
        rollType:         "equipment",
        strain:           0,
        target:           difficultyFinal,
        step:             arbitraryStep,
        devotionRequired: false,
        chatFlavor:       chatFlavor
      },
      this
    );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  async rotateItemStatus( itemId, backwards = false ) {
    const item = this.items.get( itemId );
    const nextStatus = backwards ? item.system.previousItemStatus : item.system.nextItemStatus;
    return this._updateItemStates( item, nextStatus );
  }

  async rollRecovery( recoveryMode, options = {} ) {

    const { attributes, characteristics, globalBonuses } = this.system;

    let recoveryStep = attributes.tou.step;
    const recoveryFinalStep = {
      base:      recoveryStep,
      modifiers: {},
    };
    if ( globalBonuses.allRecoveryEffects.value > 0 ) recoveryFinalStep.modifiers["localize: Global Recovery Bonus"] = globalBonuses.allRecoveryEffects.value;

    const { stun: stunDamage, total: totalDamage } = characteristics.health.damage;
    const currentWounds = characteristics.health.wounds;
    const newWounds = Math.max( currentWounds - 1, 0 );

    const recoveryTestPerDay = characteristics.recoveryTestsResource.max;
    const availableRecoveryTestResource = characteristics.recoveryTestsResource.value;

    const woundsPath = "system.characteristics.health.wounds";
    const recoveryTestAvailablePath = "system.characteristics.recoveryTestsResource.value";
    const recoveryStunAvailablePath = "system.characteristics.recoveryTestsResource.stunRecoveryAvailable";

    switch ( recoveryMode ) {

      case "recovery":
        if ( availableRecoveryTestResource < 1 ) {
          ui.notifications.warn( "LocalizeLabel: Not enough recovery tests available." );
          return;
        } else if ( totalDamage === 0 ) {
          ui.notifications.warn( "LocalizeLabel: No Injuries, no recovery needed" );
          return;
        }
        break;

      case "nightRest":
        if ( totalDamage === 0 ) {
          const updateData = {
            [recoveryStunAvailablePath]: true,
            [recoveryTestAvailablePath]: currentWounds === 0 ? recoveryTestPerDay : recoveryTestPerDay - 1
          };
          if ( currentWounds > 0 ) updateData[woundsPath] = newWounds;
          this.update( updateData );
          return;
        }
        break;

      case "recoverStun":
        if ( availableRecoveryTestResource < 1 ) {
          ui.notifications.warn( "Localize: Not enough recovery tests available." );
          return;
        }
        if ( stunDamage === 0 ) {
          ui.notifications.warn( "Localize: You don'T have Stun damage" );
          return;
        }
        // TODO: won't be visible in the prompt until modifiers input is implemented
        recoveryFinalStep.modifiers["localize: Wil for Stun Recovery"] = this.system.attributes.wil.step;
        break;

      default:
        console.warn( "ED4E | ActorEd.rollRecovery: No recovery type found" );
        return;
    }

    let chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollRecovery", {
      sourceActor: this.name,
      step:        recoveryStep
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType:         "effect",
        rollType:         "recovery",
        rollSubType:      recoveryMode,
        strain:           0,
        target:           undefined,
        step:             recoveryFinalStep,
        devotionRequired: false,
        chatFlavor:       chatFlavor
      },
      this
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
   * @param {boolean} [ignoreArmor]                             Whether armor should be ignored when applying this damage.
   */
  // eslint-disable-next-line max-params
  takeDamage( amount, isStrain, damageType = "standard", armorType, ignoreArmor ) {
    const { armor, health } = this.system.characteristics;
    const finalAmount = amount - ( ignoreArmor || !armorType ? 0 : armor[armorType].value );
    const newDamage = health.damage[damageType] + finalAmount;

    const updates = { [`system.characteristics.health.damage.${ damageType }`]: newDamage };

    if ( finalAmount > health.woundThreshold ) {
      switch ( damageType ) {
        case "standard":
          updates["system.characteristics.health.wounds"] = health.wounds + 1;
          break;
        case "stun":
          updates["system.condition.harried"] = true;
          break;
        // Add more cases here for other damage types
      }
    }

    this.update( updates );
    let messageData = {
      user:    game.user._id,
      speaker: ChatMessage.getSpeaker( { actor: this.actor } ),
      content: "THIS WILL BE FIXED LATER see #756"
    };
    if ( isStrain === false ) {
      ChatMessage.create( messageData );
    }

    if ( !this.system.condition.knockedDown && finalAmount >= health.woundThreshold + 5 ) {
      this.knockdownTest( finalAmount );
    }
  }

  async knockdownTest( damageTaken, options = {} ) {
    if ( this.system.condition.knockedDown === true ) {
      ui.notifications.warn( "Localize: You are already knocked down." );
      return;
    }
    const { attributes, characteristics } = this.system;
    let devotionRequired = false;
    let strain = 0;
    let knockdownStep = attributes.str.step;

    const knockdownAbility = await fromUuid(
      await this.getPrompt( "knockDown" )
    );

    if ( knockdownAbility ) {
      const { attribute, level, devotionRequired: devotion, strain: abilityStrain } = knockdownAbility.system;
      knockdownStep = ( attributes[attribute]?.step || knockdownStep ) + level;
      devotionRequired = !!devotion;
      strain = { base: abilityStrain };
    }

    const difficultyFinal = {
      base: Math.max( damageTaken - characteristics.health.woundThreshold, 0 ),
    };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.knockdownTest", {
      sourceActor: this.name,
      step:        knockdownStep
    } );

    const knockdownStepFinal = {
      base:      knockdownStep,
      modifiers: {
        "localize: Global Knockdown Bonus": this.system.singleBonuses.knockdownEffects.value,
      }
    };
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType:         "action",
        rollType:         "knockdown",
        strain:           strain,
        target:           difficultyFinal,
        step:             knockdownStepFinal,
        devotionRequired: devotionRequired,
        chatFlavor:       chatFlavor
      },
      this
    );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );

    this.#processRoll( roll );
  }

  async jumpUp( options = {} ) {
    if ( !this.system.condition.knockedDown ) {
      ui.notifications.warn( "LocalizeLabel: You are not knocked down.", { localize: true } );
      return;
    }
    const { attributes } = this.system;
    let devotionRequired = false;
    let strain = 2;
    let jumpUpStep = attributes.dex.step;

    const selectedAbility = await fromUuid(
      await this.getPrompt( "jumpUp" )
    );

    if ( selectedAbility ) {
      const { attribute, level, devotionRequired: devotion, strain: abilityStrain } = selectedAbility.system;
      jumpUpStep = ( attributes[attribute]?.step || jumpUpStep ) + level;
      devotionRequired = !!devotion;
      strain = { base: abilityStrain };
    }

    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.jumpUp", {
      sourceActor: this.name,
      step:        jumpUpStep
    } );

    const difficulty = { base: 6 };
    const jumpUpStepFinal = { base: jumpUpStep };
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType:         "action",
        rollType:         "jumpUp",
        strain:           strain,
        target:           difficulty,
        step:             jumpUpStepFinal,
        devotionRequired: devotionRequired,
        chatFlavor:       chatFlavor
      },
      this
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
    this.update( { [`system.${ resourceType }.value`]: ( available - amount ) } );
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
   */
  #processRoll( roll ) {
    if ( !roll ) {
      // No roll available, do nothing.
      return;
    }

    // Check if this uses karma or strain at all
    this.takeDamage( roll.totalStrain, true, "standard", undefined, true );

    const { karma, devotion } = roll.options;
    const resourcesUsedSuccessfully = this.#useResource( "karma", karma.pointsUsed ) && this.#useResource( "devotion", devotion.pointsUsed );

    if ( !resourcesUsedSuccessfully ) {
      ui.notifications.warn( "Localize: Not enough karma,devotion or recovery. Used all that was available." );
    }

    const rollTypeProcessors = {
      "recovery":  () => this.#processRecoveryResult( roll ),
      "knockdown": () => this.#processKnockdownResult( roll ),
      "jumpUp":    () => this.#processJumpUpResult( roll )
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
      this.update( { "system.condition.knockedDown": false } );
    }

    roll.toMessage();
  }

  async #processKnockdownResult( roll ) {
    await roll.evaluate();
    if ( !roll._total ) {
      return;
    } else {
      if ( roll.isSuccess === false ) {
        this.update( { "system.condition.knockedDown": true } );
      }
    }
    roll.toMessage();
  }

  /**
   * Process the result of a recovery roll. This will reduce the damage taken by the amount rolled.
   * @param {EdRoll} roll The roll to process.
   * @returns {Promise<ChatMessage | object>} The created ChatMessage or the data for it.
   */
  async #processRecoveryResult( roll ) {
    await roll.evaluate();

    if ( !roll._total ) {
      return;
    }

    const { characteristics } = this.system;
    const { health, recoveryTestsResource } = characteristics;
    const { damage, wounds } = health;
    const { stun, standard, total } = damage;

    const rollTotal = roll._total;
    const healingRate = Math.max( rollTotal - wounds, 1 );
    const newWounds = Math.max( wounds - 1, 0 );
    const newPhysicalDamage = Math.max( standard - healingRate, 0 );
    const newStunDamage = Math.max( stun - healingRate, 0 );

    const recoveryTestPerDay = recoveryTestsResource.max;
    const recoveryTestsCurrent = recoveryTestsResource.value;

    const updatePaths = {
      wounds:                "system.characteristics.health.wounds",
      standardDamage:        "system.characteristics.health.damage.standard",
      stunDamage:            "system.characteristics.health.damage.stun",
      recoveryTestAvailable: "system.characteristics.recoveryTestsResource.value",
      stunRecoveryAvailable: "system.characteristics.recoveryTestsResource.stunRecoveryAvailable"
    };

    const updateData = {};

    switch ( roll.options.rollSubType ) {
      case "recovery":
        updateData[updatePaths.standardDamage] = newPhysicalDamage;
        updateData[updatePaths.stunDamage] = newStunDamage;
        updateData[updatePaths.stunRecoveryAvailable] = true;
        updateData[updatePaths.recoveryTestAvailable] = recoveryTestsCurrent - 1;
        break;
      case "nightRest":
        if ( wounds > 0 && total === 0 ) {
          updateData[updatePaths.wounds] = newWounds;
        } else if ( total > 0 ) {
          updateData[updatePaths.standardDamage] = newPhysicalDamage;
          updateData[updatePaths.stunDamage] = newStunDamage;
        }
        updateData[updatePaths.stunRecoveryAvailable] = true;
        updateData[updatePaths.recoveryTestAvailable] = recoveryTestPerDay - ( wounds > 0 || total > 0 ? 1 : 0 );
        break;
      case "recoverStun":
        updateData[updatePaths.stunDamage] = newStunDamage;
        updateData[updatePaths.stunRecoveryAvailable] = false;
        updateData[updatePaths.recoveryTestAvailable] = recoveryTestsCurrent - 1;
        break;
      default:
        ui.notifications.warn( "Localize: No recovery type found." );
        return;
    }

    this.update( updateData );
    return roll.toMessage();
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
          c = futils.duplicate( c );
          c.effect = e;
          c.priority = c.priority ?? c.mode * 10;
          return c;
        } )
      );
    }, [] );

    changes.sort( ( a, b ) => a.priority - b.priority );

    // Apply all changes
    for ( let change of changes ) {
      const result = change.effect.apply( this, change );
      if ( result !== null ) overrides[change.key] = result[change.key];
    }

    // Expand the set of final overrides
    this.overrides = futils.expandObject( { ...futils.flattenObject( this.overrides ), ...overrides } );
  }

  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment["system.description.value"] = await TextEditor.enrichHTML( this.system.description.value, {
      async:   true,
      secrets: this.isOwner
    } );
    return futils.expandObject( enrichment );
  }

  async _enableHTMLEnrichmentEmbeddedItems() {
    for ( const item of this.items ) {
      item.system.description.value = futils.expandObject( await TextEditor.enrichHTML( item.system.description.value, {
          async:   true,
          secrets: this.isOwner
        } )
      );
    }
  }


  async _updateItemStates( itemToUpdate, nextStatus ) {
    const updates = [];
    const originalItemUpdate = { _id: itemToUpdate.id, "system.itemStatus": nextStatus };
    const equippedWeapons = this.itemTypes.weapon.filter(
      weapon => [ "mainHand", "offHand", "twoHands" ].includes( weapon.system.itemStatus )
    );
    const addUnequipItemUpdate = ( itemType, statuses ) => {
      this.itemTypes[itemType].filter(
        item => statuses.includes( item.system.itemStatus )
      ).forEach(
        item => updates.push( { _id: item.id, "system.itemStatus": "carried" } )
      );
    };

    switch ( itemToUpdate.type ) {
      case "armor":

        if ( nextStatus === "equipped" ) {
          if ( itemToUpdate.system.piecemealArmor?.selector ) {
            if ( !this.wearsPiecemealArmor ) {
              addUnequipItemUpdate( "armor", [ "equipped" ] );
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
            if ( nextStatus === "equipped" ) addUnequipItemUpdate( "armor", [ "equipped" ] );
          }
        }
        updates.push( originalItemUpdate );
        break;
      case "weapon":

        switch ( nextStatus ) {
          case "twoHands": {
            const equippedShield = this.itemTypes.shield.find( shield => shield.system.itemStatus === "equipped" );
            addUnequipItemUpdate( "weapon", [ "mainHand", "offHand", "twoHands" ] );
            if ( !( itemToUpdate.system.isTwoHandedRanged && equippedShield.system.bowUsage ) ) addUnequipItemUpdate( "shield", [ "equipped" ] );
            break;
          }
          case "mainHand":
          case "offHand": {
            addUnequipItemUpdate( "weapon", [ nextStatus, "twoHands" ] );
            break;
          }
          case "tail": {
            addUnequipItemUpdate( "weapon", [ "tail" ] );
            break;
          }
        }

        updates.push( originalItemUpdate );
        break;
      case "shield":

        if ( nextStatus === "equipped" ) {
          // Unequip other shields
          addUnequipItemUpdate( "shield", [ "equipped" ] );
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

  /**
   * Retrieves a specific prompt based on the provided prompt type.
   * This method delegates the call to the `_promptFactory` instance's `getPrompt` method,
   * effectively acting as a proxy to access various prompts defined within the factory.
   * @param {( "recovery" | "takeDamage" | "jumpUp" | "knockDown" )} promptType - The type of prompt to retrieve.
   * @returns {Promise<any>} - A promise that resolves to the specific prompt instance or logic
   * associated with the given `promptType`. The exact return type depends on promptType.
   */
  async getPrompt( promptType ) {
    return this._promptFactory.getPrompt( promptType );
  }


  /**
   * #############################################################
   * Legend Point Tracking
   * #############################################################
   */


  /**
   *
   * @param {object} attribute     The attribute to upgrade
   * @returns {ActorEd}            The updated actor
   * @UserFunction                 UF_LPTracking-upgradeAttribute
   */
  async upgradeAttribute( attribute ) {
    const attributeOldIncrease = this.system.attributes[attribute].timesIncreased;
    // add a system setting to turn the max level increase off #788 - turn off Legendpoint Restrictions with system Settings
    if ( attributeOldIncrease >= 3 ) {
      ui.notifications.warn( game.i18n.localize( "ED.Actor.LpTracking.Spendings.maxIncreaseReached" ) );
      return;
    }
    const attributeName = ED4E.attributes[attribute].label;
    const legendPointsCostConfig = ED4E.legendPointsCost;
    const requiredLp = legendPointsCostConfig[attributeOldIncrease + 5];

    const description = game.i18n.format( "ED.Actor.LpTracking.Spendings.descriptionAttribute", {
      previousLevel: attributeOldIncrease,
      newLevel:      attributeOldIncrease + 1,
      attributeName: attributeName,
    } );
    const transactionData = new LpSpendingTransactionData( {
      entityType:  "attribute",
      type:        "spendings",
      amount:      requiredLp,
      date:        new Date(),
      name:        attributeName,
      description: description
    } );
    // add the _showOptionsPrompt function to show the options for the user to choose
    await this.update( { [`system.attributes.${attribute}.timesIncreased`]: attributeOldIncrease + 1 } );
    return this.addLpTransaction( "spendings", transactionData );
  }


  /**
   * @param {object} ability  The ability to upgrade
   * @returns {ActorEd}       The updated actor
   * @UserFunction            UF_LPTracking-upgradeAbility
   */
  async upgradeAbility( ability ) {
    const abilityOldLevel = ability.system.level;
    const newIncrease = abilityOldLevel + 1;
    const description = game.i18n.format( "ED.Actor.LpTracking.Spendings.descriptionAbility", {
      previousLevel: abilityOldLevel,
      newLevel:      newIncrease,
      abilityName:   ability.name,
    } );

    const validationData = await validateAbilityUpgrade( ability, this );
    const validateResult = await this._showOptionsPrompt ( this, ability, validationData );

    if ( validateResult === "cancel" ) return;

    const requiredLp = validateResult === "free" ? 0 : validationData.requiredLp;

    const transactionData = new LpSpendingTransactionData( {
      entityType:  ability.type,
      type:        "spendings",
      amount:      requiredLp,
      date:        new Date(),
      itemUuid:    ability.uuid,
      name:        ability.name,
      description: description
    } );
    await ability.update( { "system.level": newIncrease } );
    return this.addLpTransaction( "spendings", transactionData );
  }

  /**
   * @param {ItemEd} classItem    The class item to upgrade
   * @UserFunction                UF_LPTracking-upgradeDiscipline
   * @returns {ActorEd}            The updated actor
   */
  async upgradeDiscipline( classItem ) {
    const disciplineIndex = classItem.system.disciplineIndex;
    const classOldLevel = classItem.system.level;
    const classNewLevel = classOldLevel + 1;
    const classNewLevelIndex = classNewLevel - 1;

    // validate if the class can be upgraded
    const currentDisciplineTalents = this.items.filter( item => item.type === "talent" && item.system.talentCategory === "discipline" && item.system.sourceClass.identifier === classItem.uuid );
    if ( classOldLevel >= 15 ) {
      ui.notifications.warn( "Klasse hat bereits das maximale Level erreicht" );
      return;
    }

    const currentTier = classItem.system.advancement.levels[classNewLevelIndex].tier;
    const tierMap = {
      [ED4E.tier.novice.toLowerCase()]:     1,
      [ED4E.tier.journeyman.toLowerCase()]: 2,
      [ED4E.tier.warden.toLowerCase()]:     3,
      [ED4E.tier.master.toLowerCase()]:     4
    };
    const reverseTierMap = {
      1: [ ED4E.tier.novice.toLowerCase() ],
      2: [ ED4E.tier.journeyman.toLowerCase() ],
      3: [ ED4E.tier.warden.toLowerCase() ],
      4: [ ED4E.tier.master.toLowerCase() ]
    };

    let currentIndex = tierMap[currentTier];
    if ( !currentIndex ) {
      ui.notifications.warn( "Tier nicht gefunden" );
      return;
    }

    let newLevelTier = disciplineIndex > 1 ? currentIndex + disciplineIndex - 1 : currentIndex;
    newLevelTier = Math.min( newLevelTier, 4 );
    newLevelTier = reverseTierMap[newLevelTier];


    const settingOption = game.settings.get( "ed4e", "lpTrackingAllTalents" );
    if ( settingOption === "disciplineTalents" ) {
      ui.notifications.warn( "Basis = Disziplin Talente für den Kreisaufstieg" );
      const relevantItems = currentDisciplineTalents.filter( item => item.system.sourceClass.identifier === classItem.uuid );
      const allItemsMeetLevelRequirement = relevantItems.every( item => item.system.level >= classNewLevel );


      if ( !allItemsMeetLevelRequirement ) {
        // If any item does not meet the level requirement, notify the user
        return ui.notifications.warn( "Mindestens ein Talent hat nicht das erforderliche Level." );
      }
    } else if ( settingOption === "allTalents" ) {
      ui.notifications.warn( "Alle Talente für den kreisaufstieg verwenden" );
    } else if ( settingOption === "allTalentsHouseRule" ) {
      ui.notifications.warn( "Alle Talente ohne verringerte kosten - Hausregel" );
    }

    const fetchItemsByIds = async ( ids ) => {
      return Promise.all( ids.map( uuid => fromUuid( uuid ) ) );
    };

    const classLevels = classItem.system.advancement.levels[classNewLevelIndex];
    const abilityOptions = classItem.system.advancement.abilityOptions;

    const newDisciplineTalents = await fetchItemsByIds( classLevels.abilities.class );
    const freeTalents = await fetchItemsByIds( classLevels.abilities.free );
    const specialAbilities = await fetchItemsByIds( classLevels.abilities.special );
    const effects = await fetchItemsByIds( classLevels.effects );

    const noviceTalents = await fetchItemsByIds( abilityOptions.novice );
    const journeymanTalents = await fetchItemsByIds( abilityOptions.journeyman );
    const wardenTalents = await fetchItemsByIds( abilityOptions.warden );
    const masterTalents = await fetchItemsByIds( abilityOptions.master );

    let talentOptions = [
      ...noviceTalents,
      ...journeymanTalents,
      ...wardenTalents,
      ...masterTalents
    ];

    if ( classNewLevelIndex >= 0 && classNewLevelIndex <= 3 ) {
      talentOptions = noviceTalents;
    } else if ( classNewLevelIndex >= 4 && classNewLevelIndex <= 7 ) {
      talentOptions = [ ...noviceTalents, ...journeymanTalents ];
    } else if ( classNewLevelIndex >= 8 && classNewLevelIndex <= 11 ) {
      talentOptions = [ ...noviceTalents, ...journeymanTalents, ...wardenTalents ];
    } else if ( classNewLevelIndex >= 12 ) {
      talentOptions = [ ...noviceTalents, ...journeymanTalents, ...wardenTalents, ...masterTalents ];
    }

    let filteredTalentOptions = [];
    for ( const talent of talentOptions ) {
      const isDuplicate = await this.checkDuplicateAbility( talent );
      if ( !isDuplicate ) {
        filteredTalentOptions.push( talent );
      }
    }

    const optionsHtml = filteredTalentOptions.map( ( talent, index ) => `<option value="${index}">${talent.name}</option>` ).join( "" );

    // Helper function to create embedded documents if not duplicate
    const createIfNotDuplicate = async ( items, category, tier, level, identifier ) => {
      for ( const item of items ) {
        const isDuplicate = await this.checkDuplicateAbility( item );
        if ( !isDuplicate ) {
          await this.createEmbeddedDocuments( "Item", [ item ], {
            noPrompt:        true,
            talentCategory:  category,
            tier:            tier,
            classLevel:      level,
            classIdentifier: identifier
          } );
        }
      }
    };

    // Create and render the dialog
    new Dialog( {
      title:   "Choose a Talent",
      content: `<form><div class="form-group"><label>Talent:</label><select id="talent-choice">${optionsHtml}</select></div></form>`,
      buttons: {
        ok: {
          label:    "Confirm",
          callback: async ( html ) => {
            const selectedIndex = parseInt( html.find( "#talent-choice" ).val(), 10 );
            const selectedTalent = filteredTalentOptions[selectedIndex];

            await this.createEmbeddedDocuments( "Item", [ selectedTalent ], {
              noPrompt:        true,
              talentCategory:  "optional",
              tier:            newLevelTier,
              classLevel:      classNewLevel,
              classIdentifier: classItem.uuid
            } );

            await createIfNotDuplicate( newDisciplineTalents, "discipline", newLevelTier, classNewLevel, classItem.uuid );
            await createIfNotDuplicate( freeTalents, "free", newLevelTier, classNewLevel, classItem.uuid );
            await createIfNotDuplicate( specialAbilities, "special", newLevelTier, classNewLevel, classItem.uuid );
            await createIfNotDuplicate( effects, "effect", newLevelTier, classNewLevel, classItem.uuid );

            // Update the class level
            await classItem.update( { "system.level": classNewLevel } );
            await this.upgradeFreeTalents( classItem, classNewLevel );
          }
        },
        cancel: {
          label:    "Cancel",
          callback: () => {
            return;
          }
        },
      },
      default: "ok"
    } ).render( true );
  }

  /**
   *
   * @param {object} classItem      class item to be used for the upgrade
   * @param {number} newLevel       new level of the class
   * @UserFunction                  UF_LPTracking-upgradeFreeTalents
   */
  async upgradeFreeTalents( classItem, newLevel ) {
    this.items
      .filter( item => item.type === "talent" && item.system.talentCategory === "free" && item.system.sourceClass.identifier === classItem.uuid )
      .forEach( talent => talent.updateSource( { "system.level": newLevel } ) );
  }

  /**
   *
   * @param {object} ability    ability to be checked for duplicates
   * @returns                   returns true if the ability is a duplicate, false otherwise
   * @UserFunction              UF_LPTracking-checkDuplicateAbility
   */
  async checkDuplicateAbility( ability ) {
    const itemsOfType = this.items.filter( item => item.type === ability.type );
    return itemsOfType.some( item => item.name === ability.name && item.system.edid !== "thread-weaving" && item.system.edid !== "matrix" );
  }



  /**
   * @description                     Add a new LP transaction to the actor's system data for a new or upgraded item
   * @param {object} item             item to be added
   * @param bookingResult
   * @param {object} validationData   validation data for the item
   * @UserFunction                    UF_LPTracking-addItemLpTransaction
   */
  async addItemLpTransaction( item, validationData, bookingResult ) {

    const description = game.i18n.format( "ED.Dialogs.LegendPoints.spendLp", {
      previousLevel: item.system.level - 1,
      newLevel:      item.system.level,
    } );

    let requiredLp = 0;
    if ( bookingResult === "free" ) {
      requiredLp = 0;
    } else if ( bookingResult === "spend" ) {
      requiredLp = validationData.requiredLp;
    }else if ( bookingResult === "cancel" ) {
      return;
    }

    // add Prompt for LP spending which can be skipped by a certain click (shift+RIghtclick or so)
    // only after confirming the promt, this shall go on.
    const transactionData = new LpSpendingTransactionData( {
      entityType:  item.type,
      type:        "spendings",
      amount:      validationData.requiredLp,
      date:        new Date(),
      itemUuid:    item.uuid,
      name:        item.name,
      description: description
    } );
    const transactionSuccess = await this.addLpTransaction( "spendings", transactionData );
  }

  /**
   * @description                                 Add a new LP transaction to the actor's system data
   * @param {('earnings'|'spendings')} type       Type of the transaction
   * @param {object} transactionData   Data of the transaction
   * @returns {ActorEd}                           The updated actor data
   * @UserFunction                                UF_LPTracking-addLpTransaction
   * @see                             ../../documentation/User Functions/UF_LpTracking-addLpTransaction.md
   */
  async addLpTransaction( type, transactionData ) {
    const oldTransactions = this.system.lp[type];
    const TransactionModel = type === "earnings" ? LpEarningTransactionData : LpSpendingTransactionData;
    const transaction = new TransactionModel( transactionData );

    return this.update( {
      [`system.lp.${type}`]: oldTransactions.concat( [ transaction ] )
    } );
  }



  /**
   * needs to be rebuild later after paths, questors and threads are implemented to show all relevant information
   * @param {object} actor            actor to be used for the prompt
   * @param {object} item             item to be added or upgraded
   * @param {Array} validationData    validation data for the item
   * @returns                         returns the result of the prompt which defines the LP spending and grouping of the item
   * @UserFunction                    UF_LPTracking-showOptionsPrompt
   */
  async _showOptionsPrompt( actor, item, validationData ) {

    return new Promise( ( resolve ) => {
      const actorName = actor.name;
      const itemName = item.name;
      const currentLp = actor.system.lp.current;
      const requiredLp = validationData.requiredLp;
      let actorHealth = "is healthy";
      if ( actor.system.characteristics.health.damage.total > 0 ) {
        actorHealth = "is not healthy, do you want to increase anyway?";
      }
      let buttons = {};
      if ( item.type === "talent" && validationData.interaction === "create" ) {
        // Initial check for the item itself having an ed-id of "versatility"
        if ( item.system.edid === "versatility" ) {
          buttons.versatility = {
            label:    "Versatility",
            callback: () => resolve( "versatility" )
          };
        } else {
          // Define buttons without the "Cancel" button initially
          buttons = {
            discipline: {
              label:    "Discipline",
              callback: () => resolve( "discipline" )
            },
            optional: {
              label:    "Optional",
              callback: () => resolve( "optional" )
            },
            free: {
              label:    "Free / Other",
              callback: () => resolve( "free" )
            }
          };
          // Additional check for any item of type "talent" with an ed-id of "versatility" in the actor's items
          const hasVersatilityTalent = actor.items.filter( item => item.type === "talent" && item.system.edid === "versatility" );
          const numberOfVersatilityTalents = actor.items.filter( item => item.type === "talent"
            && item.system.talentCategory === "versatility"
            && item.system.edid !== "versatility" );

          if ( hasVersatilityTalent.length > 0 ) {
            let versatilityMaxLevel = 0;
            hasVersatilityTalent.forEach( element => {
              versatilityMaxLevel += element.system.level;
            } );
            if ( ( versatilityMaxLevel  ) > numberOfVersatilityTalents.length ) {
              buttons.versatility = {
                label:    "Versatility?",
                callback: () => resolve( "versatility" )
              };
            }
          }
        }
      } else if ( item.type === "discipline" ) {
        buttons = {
          confirm: {
            label:    "confirm",
            callback: () => resolve( "addDiscipline" )
          }
        };
      } else {
        buttons = {
          free: {
            label:    "Free",
            callback: () => resolve( "free" )
          },
          spend: {
            label:    "Spend LP",
            callback: () => resolve( "spend" )
          },
        };
      }
      // Add the "Cancel" button here to ensure it's always on the right
      buttons.cancel = {
        label:    "Cancel",
        callback: () => resolve( "cancel" )
      };

      let d = new Dialog( {
        title:   "LP Options",
        content: `<p>Increase ${itemName}</p>
                  <p>Current LP: ${currentLp}</p>
                  <p>required LP: ${requiredLp}</p>
                  <p>Actor: ${actorName}</p>
                  <p>Current Damage: ${actorHealth}</p>`,
        buttons: buttons,
        default: "spend",
        close:   () => resolve( null )
      } );
      d.render( true );
    } );
  }
}