/* eslint-disable complexity */
import EdRollOptions from "../data/other/roll-options.mjs";
import ED4E from "../config.mjs";
import RollPrompt from "../applications/global/roll-prompt.mjs";
import { DocumentCreateDialog } from "../applications/global/document-creation.mjs";

import LegendPointHistoryEarnedPrompt from "../applications/global/lp-history.mjs";
import LpEarningTransactionData from "../data/advancement/lp-earning-transaction.mjs";
import LpSpendingTransactionData from "../data/advancement/lp-spending-transaction.mjs";
import LpTrackingData from "../data/advancement/lp-tracking.mjs";
import { sum } from "../utils.mjs";
import PromptFactory from "../applications/global/prompt-factory.mjs";

const futils = foundry.utils;

/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @augments {Actor}
 */
export default class ActorEd extends Actor {

  _promptFactory = new PromptFactory( this );

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

  /**
   * @inheritDoc
   * @userFunction            UF_TokenResources-preCreate
   */
  async _preCreate( data, options, userId ) {
    await super._preCreate( data, options, userId );

    // Configure prototype token settings
    if ( this.type === "character" ) {
      const prototypeToken = {
        sight: {enabled: true},
        actorLink: true,
        disposition: 1,   // Friendly
        displayBars: 50,  // Always Display bar 1 and 2
        displayName: 30,  // Display nameplate on hover
        bar1: {
          attribute: "healthRate"
        },
        bar2: {
          attribute: "karma"
        }
      };

      this.updateSource( { prototypeToken } )
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

   */
  async legendPointHistoryEarned() {
    // let history = await getLegendPointHistoryData( actor );
    const lpUpdateData = await LegendPointHistoryEarnedPrompt.waitPrompt(
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
      step: attributeStep,
      attribute: `${ game.i18n.localize( ED4E.attributes[attributeId].label ) }`
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType: "action",
        rollType: "attribute",
        strain: 0,
        target: undefined,
        step: step,
        devotionRequired: false,
        chatFlavor: chatFlavor
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
  async rollAbility( ability, options = {}, inputDifficulty, triggeredMessId) {
    const attributeStep = this.system.attributes[ability.system.attribute].step;
    const abilityStep = attributeStep + ability.system.level;
    const difficulty = !inputDifficulty ? await ability.system.getDifficulty() : inputDifficulty;
    const targetActor = 1 
    if ( difficulty === undefined || difficulty === null ) {
      ui.notifications.error( "ability is not part of Targeting Template, please call your Administrator!" );
      return;
    }
    const difficultyFinal = { base: difficulty };
    const devotionRequired = !!ability.system.devotionRequired;
    const strain = { base: ability.system.strain };
    const chatFlavor = game.i18n.format( "ED.Chat.Flavor.rollAbility", {
      sourceActor: this.name,
      ability: ability.name,
      step: abilityStep
    } );
    let abilityFinalStep = { base: abilityStep };
    const rollType = ability.system.rollType;
    let edRollOptions;
    if ( rollType === "ability" )  { 
      edRollOptions = EdRollOptions.fromActor(
        {
          testType: "action",
          rollType: rollType,
          triggeredMessId: triggeredMessId ? triggeredMessId : undefined,
          strain: strain,
          target: difficultyFinal,
          step: abilityFinalStep,
          devotionRequired: devotionRequired,
          chatFlavor: chatFlavor
        },
        this
      );
    } else if ( rollType === "attack" ) {
      const attackData = await this.getAttackData ( ability, false, false, false );
      if (attackData === undefined ) {
        return
      }
      if ( game.settings.get( "ed4e", "automaticAmmunitionReduction" ) === true ) {
        if ( attackData.weapon.system.weaponType === "missile" || attackData.weapon.weaponType === "thrown" ) {
          const ammunitionType = attackData.weapon.system.ammunition.type;
          const ammunition = this.items.find( ammo => ammo.system.ammunitionType === ammunitionType );
          if ( !ammunition || ammunition.system.quantity < 1 ) { 
            ui.notifications.error( "No ammunition found" );
            return;
          }
          const newAmmunition = await this.removeQuantity( attackData.weapon );
          ammunition.update( { "system.quantity": newAmmunition } );
        }
      }

      abilityFinalStep = 
      { base: abilityStep, 
        modifiers: {}
      };
      if (attackData.modifier.range !== 0) {
        abilityFinalStep.modifiers[game.i18n.localize("ED.Rolls.Modifiers.longRange")] = attackData.modifier.range;
        }
        if (attackData.modifier.tailWeapon !== 0) {
        abilityFinalStep.modifiers[game.i18n.localize("ED.Rolls.Modifiers.tailWeapon")] = attackData.modifier.tailWeapon;
        }
      edRollOptions = EdRollOptions.fromActor(
        {
          actor: this.id,
          targetTokens: attackData.targetsArray,
          testType: "action",
          rollType: rollType,
          strain: strain,
          target: difficultyFinal,
          step: abilityFinalStep,
          devotionRequired: devotionRequired,
          chatFlavor: chatFlavor
        },
        this
      );
    }
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  async attackSubstitude ( ability, type, options = {} ) {
    const unarmed = type.itemId === "unarmed-attack" ? true : false
    const tailAttack = type.itemId === "tail-attack" ? true : false
    const attackData = await this.getAttackData( undefined, true, unarmed, tailAttack);
    if (attackData === undefined ) {
      return
    }
    let abilityFinalStep = 
    { base: ability, 
      modifiers: {}
    };
    if (attackData.modifier.range !== 0) {
    abilityFinalStep.modifiers[game.i18n.localize("ED.Rolls.Modifiers.longRange")] = attackData.modifier.range;
    }
    if (attackData.modifier.tailWeapon !== 0) {
    abilityFinalStep.modifiers[game.i18n.localize("ED.Rolls.Modifiers.tailWeapon")] = attackData.modifier.tailWeapon;
    }
    const currentTarget = game.user.targets.first()?.actor;
    const difficulty = currentTarget.system.characteristics.defenses.physical.value
    const difficultyFinal = { base: difficulty };
    let weaponName = attackData.weapon === "unarmed" ? game.i18n.localize("ED.Chat.FlavorLocalize.unarmed") : 
        attackData.weapon === "tail" ? game.i18n.localize("ED.Chat.FlavorLocalize.tail") : 
        attackData.weapon.name; 
    
    let chatFlavor = game.i18n.format( "ED.Chat.Flavor.attackSubstitude", {
      sourceActor: this.name,
      step: ability,
      weapon: weaponName
    } );
    if ( tailAttack === true && attackData.weapon !== "tail" ) {
      chatFlavor = game.i18n.format( "ED.Chat.Flavor.attackSubstitudeTail", {
        sourceActor: this.name,
        step: ability,
        weapon: weaponName
      } );
    }
    const edRollOptions = EdRollOptions.fromActor(
      {
        actor: this.id,
        targetTokens: attackData.targetsArray,
        testType: "action",
        rollType: "attack",
        strain: 0,
        target: difficultyFinal,
        step: abilityFinalStep,
        devotionRequired: false,
        chatFlavor: chatFlavor
      },
      this
    );  
  const roll = await RollPrompt.waitPrompt( edRollOptions, options );
  this.#processRoll( roll );
  }


  /**
   * 
   * @param {Object or Number} ability 
   * @param {Boolean} substitude 
   * @param {Boolean} unarmed 
   * @param {Boolean} tailAttack
   * @returns 
   */
  async getAttackData ( ability, substitude, unarmed, tailAttack ) {
    let weapon;
    const holdingType = ability?.system.combatAbility.requiredItemStatus;
    let modifier = {
      tailWeapon: 0,
      range: 0,
    }
    if ( substitude === true ) {
      if ( unarmed === true ) {
        weapon = "unarmed";
      } else if ( tailAttack === true ) {
        const tailWeapon = this.itemTypes.weapon.find( weapon => weapon.system.itemStatus === "tail" );
        if ( tailWeapon ) {
          weapon = tailWeapon;
          modifier.tailWeapon += -2;
        } else {
        weapon = "tail";
        modifier.tailWeapon += -2;
        }
      } else {
      const mainhand = this.itemTypes.weapon.find( weapon => weapon.system.itemStatus === "mainHand" || weapon.system.itemStatus === "twoHands" ); 
        weapon = mainhand;
      }
    } else if ( holdingType === "mainHand") {
      const mainhand = this.itemTypes.weapon.find( weapon => weapon.system.itemStatus === "mainHand" || weapon.system.itemStatus === "twoHands" ); 
      if ( mainhand?.system.weaponType === ability.system.combatAbility.requiredCombatType ) {
        weapon = mainhand;
      } 
    } else if ( holdingType === "offHand" ) {
      const offHand = this.itemTypes.weapon.find( weapon => weapon.system.itemStatus === "offHand" );
      if ( offHand?.system.weaponType === "melee" ) {
        weapon = offHand;
      } 
    } else if ( holdingType === "tail" ) {
      // add code for tail weapon Earthdawn Active Effect here see #909
      const tailWeapon = this.itemTypes.weapon.find( weapon => weapon.system.itemStatus === "tail" );
      if ( tailWeapon?.system.weaponType === "melee" ) {
        weapon = tailWeapon;
        modifier.tailWeapon += -2;
      } 
      if ( !weapon ) {
        weapon = "tail";
        modifier.tailWeapon += -2;
      }
    } else if (holdingType === "unarmed") {
      const tailWeapon = this.itemTypes.weapon.find(weapon => weapon.system.itemStatus === "tail");
      if (tailWeapon) {
        weapon = await new Promise((resolve) => {
          new Dialog({
            title: "Choose Weapon",
            content: "<p>Choose the weapon you want to use</p>",
            buttons: {
              tail: {
                label: "tail",
                callback: () => resolve(tailWeapon)
              },
              unarmed: {
                label: "unarmed",
                callback: () => resolve("unarmed")
              }
            }
          }).render(true);
        });
      } else {
        weapon = "unarmed";
      }
      if ( weapon !== "unarmed" ) {
        modifier.tailWeapon += -2;
      }
    }
    if (!weapon) {
      const requiredCombatType = ability.system.combatAbility.requiredCombatType;
      const requiredItemStatus = ability.system.combatAbility.requiredItemStatus;
      const unequippedWeapons = this.itemTypes.weapon.filter(weapon => weapon.system.weaponType === requiredCombatType);
      let requiredNextStatus = "";
      if (requiredItemStatus === "mainHand") {
        if ( requiredCombatType === "melee" ) {
          requiredNextStatus = "mainHand";
        } else if ( requiredCombatType === "missile" ) {
          requiredNextStatus = "twoHands";
        }
      } else if (requiredItemStatus === "offHand") {
        requiredNextStatus = "offHand";
      } else if (requiredItemStatus === "tail") {
        requiredNextStatus = "tail";
      }

      weapon = await new Promise((resolve) => {
        const weaponOptions = unequippedWeapons.map((weapon, index) => {
          return `<option value="${index}">${weapon.name}</option>`;
        }).join("");
    
        new Dialog({
          title: "Choose Weapon",
          content: `
            <p>Choose the weapon you want to use</p>
            <select id="weapon-choice">${weaponOptions}</select>
          `,
          buttons: {
            choose: {
              label: "Choose",
              callback: async (html) => {
                const selectedIndex = html.find("#weapon-choice").val();
                const selectedWeapon = unequippedWeapons[selectedIndex];
      
                // Function to check if the item status matches the required next status
                function isItemStatusValid(weapon) {
                  return weapon.system.itemStatus === requiredNextStatus;
                }
      
                // Loop to rotate item status until it matches the required next status
                while (!isItemStatusValid(selectedWeapon)) {
                  await this.rotateItemStatus(selectedWeapon.id);
                  // Optionally, you can add a delay here to avoid potential infinite loops
                  // await new Promise(resolve => setTimeout(resolve, 100));
                }
      
                resolve(selectedWeapon);
              }
            },
            cancel: {
              label: "Cancel",
              callback: () => resolve(null)
            }
          },
          default: "choose"
        }).render(true);
      });
    }

    const targets = Array.from(game.user.targets);
    const targetsArray = await this.getTargets( targets );
    if (targetsArray.length === 0) {
      ui.notifications.error("No targets selected");
      return;
    }
    
    const automaticRangeCalculation = game.settings.get( "ed4e", "automaticRangeCalculation" );
    if ( automaticRangeCalculation === false ) {
      return { weapon, targetsArray, modifier};
    } else {
      const firstTarget = targetsArray[0]
      const firstTargetToken = canvas.tokens.get(firstTarget.id);
      const firstTargetRadius = firstTargetToken.document.width / 2;
      const firstTargetDistance = await this.getDistanceToTarget( firstTargetToken );
      const targetTokenDiameter = firstTargetToken.document.width;
      const attackerTokenDocument = this.getActiveTokens()[0];
      // const attackerToken = canvas.tokens.get(this.id);
      const attackTokenRadius = attackerTokenDocument.document.width / 2;
      const attackerTokenDiameter = attackerTokenDocument.document.width;
      const gridDistance = game.scenes.active.grid.distance;
      let distance = firstTargetDistance.distance

      if ( targetTokenDiameter > 1 ) {
        distance -= (firstTargetRadius ) * gridDistance;
      } 

      if ( attackerTokenDiameter > 1 ) {
        distance -= (attackTokenRadius ) * gridDistance;
      }

      distance = Math.round( distance );
      //let rangeModifier = 0;
      let range;  
        let weaponShortRangeMin = 1;
        let weaponShortRangeMax = 1;
        let weaponLongRangeMin = 1;
        let weaponLongRangeMax = 1;
        if ( weapon !== "unarmed" && weapon !== "tail" ) {      
        weaponShortRangeMin = weapon.system.range.shortMin >= 0 ? weapon.system.range.shortMin : 1;
        weaponShortRangeMax = weapon.system.range.shortMax >= 0 ? weapon.system.range.shortMax : 1;
        weaponLongRangeMin = weapon.system.range.longMin >= 0 ? weapon.system.range.longMin : 1;
        weaponLongRangeMax = weapon.system.range.longMax >= 0 ? weapon.system.range.longMax : 1;
        }

      if (  weaponLongRangeMax < distance ) {
        ui.notifications.error( "Target is out of range" );
        return;
      } else if ( weaponShortRangeMin > distance && weaponShortRangeMin !== 1 ) {
        ui.notifications.error( "Target is to close" );
        return;
      } else if ( weaponShortRangeMax >= distance && weaponShortRangeMin <= distance ) {
        range = "short";
        return { weapon, targetsArray, modifier  };
      } else if ( weaponLongRangeMin <= distance && weaponLongRangeMax >= distance ) {
        range = "long";
        modifier.range += -2;
        return { weapon, targetsArray, modifier };
      }
    }
  }

  async getTargets( targets ) {
    const targetArray = [];
    for ( const target of targets ) {
      targetArray.push( {
        name: target.name,
        id: target.id,
        type: target.actor.type,
        img: target.actor.img,
      } );
    }
    return targetArray;
  }

  async getDistanceToTarget( target ) {
    const actorToken = this.getActiveTokens()[0];
    const targetToken = canvas.tokens.get(target.id);
    const distance = canvas.grid.measurePath([actorToken.center, target.center])
    return distance;
  }

  /**
   * @summary                     Equipment rolls are a subset of Action test resembling non-attack actions like Talents, skills etc.
   * @description                 Roll an Equipment item. use {@link RollPrompt} for further input data.
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

    const difficultyFinal = { base: difficulty };
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
        chatFlavor: chatFlavor
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
      base: recoveryStep,
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
      step: recoveryStep
    } );
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType: "effect",
        rollType: "recovery",
        rollSubType: recoveryMode,
        strain: 0,
        target: undefined,
        step: recoveryFinalStep,
        devotionRequired: false,
        chatFlavor: chatFlavor
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
      user: game.user._id,
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
      step: knockdownStep
    } );

    const knockdownStepFinal = {
      base: knockdownStep,
      modifiers: {
        "localize: Global Knockdown Bonus": this.system.singleBonuses.knockdownEffects.value,
      }
    };
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType: "action",
        rollType: "knockdown",
        strain: strain,
        target: difficultyFinal,
        step: knockdownStepFinal,
        devotionRequired: devotionRequired,
        chatFlavor: chatFlavor
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
      step: jumpUpStep
    } );

    const difficulty = { base: 6 };
    const jumpUpStepFinal = { base: jumpUpStep };
    const edRollOptions = EdRollOptions.fromActor(
      {
        testType: "action",
        rollType: "jumpUp",
        strain: strain,
        target: difficulty,
        step: jumpUpStepFinal,
        devotionRequired: devotionRequired,
        chatFlavor: chatFlavor
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
  async #processRoll( roll ) {
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
      "attack": () => this.#processAttackResult( roll ),
      "recovery": () => this.#processRecoveryResult( roll ),
      "knockdown": () => this.#processKnockdownResult( roll ),
      "jumpUp": () => this.#processJumpUpResult( roll )
    };

    const processRollType = rollTypeProcessors[roll.options.rollType];

    if ( processRollType ) {
      processRollType();
    } else {
      await roll.toMessage();
    }
  }

  async #processAttackResult( roll ) {
    await roll.evaluate();
    roll.toMessage();
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
      wounds: "system.characteristics.health.wounds",
      standardDamage: "system.characteristics.health.damage.standard",
      stunDamage: "system.characteristics.health.damage.stun",
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
      async: true,
      secrets: this.isOwner
    } );
    return futils.expandObject( enrichment );
  }

  async _enableHTMLEnrichmentEmbeddedItems() {
    for ( const item of this.items ) {
      item.system.description.value = futils.expandObject( await TextEditor.enrichHTML( item.system.description.value, {
          async: true,
          secrets: this.isOwner
        } )
      );
    }
  }

  async addLpTransaction( type, transactionData ) {
    const oldTransactions = this.system.lp[type];
    const TransactionModel = type === "earnings" ? LpEarningTransactionData : LpSpendingTransactionData;
    const transaction = new TransactionModel( transactionData );

    return this.update( {
      [`system.lp.${ type }`]: oldTransactions.concat( [ transaction ] )
    } );
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
            if ( !( itemToUpdate.system.isTwoHandedRanged && equippedShield?.system.bowUsage ) ) addUnequipItemUpdate( "shield", [ "equipped" ] );
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

}