import EdRollOptions from "../data/other/roll-options.mjs";
import ED4E from "../config.mjs";
import RollPrompt from "../applications/global/roll-prompt.mjs";
import { DocumentCreateDialog } from "../applications/global/document-creation.mjs";
import CharacterGenerationPrompt from "../applications/actor/character-generation-prompt.mjs";
import { mapObject } from "../utils.mjs";

import LegendPointHistoryEarnedPrompt from "../applications/global/legend-point-history-earned-prompt.mjs"

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

  async characterGeneration () {
    const generation = await CharacterGenerationPrompt.waitPrompt();
    if ( !generation ) return;

    const attributeData = mapObject(
      await generation.getFinalAttributeValues(),
      ( attribute, value ) => [attribute, {initialValue: value}]
    );
    const additionalKarma = generation.availableAttributePoints;

    const newActor = await this.constructor.create( {
      name: "Rename me! I was just created",
      type: "character",
      system: {
        attributes: attributeData,
        karma: {
          freeAttributePoints: additionalKarma,
        },
      },
    } );

    const namegiverDocument = await generation.namegiverDocument;
    const classDocument = await generation.classDocument;
    const abilities = ( await generation.abilityDocuments ).map(
      documentData => {
        documentData.system.source.class = namegiverDocument.uuid;
        return documentData;
      }
    );

    await newActor.createEmbeddedDocuments( "Item", [
      namegiverDocument,
      classDocument,
      ...abilities,
    ] );

    const actorApp = newActor.sheet.render( true, {focus: true} );
    // actorApp.activateTab("actor-notes-tab");
  }

  /**
   * Legend point History earned prompt trigger
   */
  async legendPointHistoryEarned() {
    const historyEarned = await LegendPointHistoryEarnedPrompt.waitPrompt();
    this.#processHistoryEarned ( historyEarned );
  }

  #processHistoryEarned( historyEarned ) {
    if ( historyEarned ) {
      return;
    }
  }


  /**
   * Roll a generic attribute test. Uses {@link RollPrompt} for further input data.
   * @param {string} attributeId  The 3-letter id for the attribute (e.g. "per").
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollAttribute( attributeId, options = {} ) {
    const attributeStep = this.system.attributes[attributeId].step;
    const edRollOptions = new EdRollOptions( {
      rollType: "action",
      step: { base: attributeStep },
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, available: this.system.karma.value, step: this.system.karma.step },
      devotion: { available: this.system.devotion.value, step: this.system.devotion.step },
      chatFlavor: `${game.i18n.localize( ED4E.attributes[attributeId].label )} Test`,
    } );
    const roll = await RollPrompt.waitPrompt( edRollOptions, options );
    this.#processRoll( roll );
  }

  /**
   * @description                 Roll an Ability. use {@link RollPrompt} for further input data.
   * @param {object} ability      ability.
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollAbility( ability, options = {} ) {
    const attributeStep = this.system.attributes[ability.system.attribute].step;
    const abilityFinalStep = attributeStep + ability.system.level;
    const difficulty = await this.getTarget( ability );
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

  async getTarget( ability ) {

    let difficulty = 0;
    let currentTarget = game.user.targets.first()?.actor;
    let currentTargets = [...game.user.targets.map( ( t ) => t.actor )];
    let numTargets = game.user.targets.size;
    let targetDifficultySetting = ability.system.difficulty.target
    let groupDiffciultySetting = ability.system.difficulty.group
    let fixedDifficultySetting = ability.system.difficulty.fixed

    if ( numTargets <= 0 || targetDifficultySetting === "none" ) {
      if ( fixedDifficultySetting > 0 ) {
        difficulty = fixedDifficultySetting;
      } else {
        difficulty = 0; 
      }
      
    } else {
      let baseDifficulty = 0;
      let additionalTargetDifficulty = 0;

      if ( fixedDifficultySetting > 0 ) {
        difficulty = fixedDifficultySetting;
      }
      else if ( groupDiffciultySetting !== "none" ) {
        switch ( groupDiffciultySetting ) {
          case 'hightestX':
            additionalTargetDifficulty = numTargets - 1;
          case 'highestOfGroup':
            baseDifficulty = _getAggregatedDefense(currentTargets, targetDifficultySetting, Math.max);
            break;
          case 'lowestX':
            additionalTargetDifficulty = numTargets - 1;
          case 'lowestOfGroup':
            baseDifficulty = _getAggregatedDefense(currentTargets, targetDifficultySetting, Math.min);
            break;
        }
        difficulty = baseDifficulty + additionalTargetDifficulty;
      } else {
        difficulty = currentTarget?.system.characteristics.defenses[targetDifficultySetting].value ?? 0;
      }

        
      }

      /**
       * @param { Array } targets array of all targets
       * @param { string } targetDefenseType defense 
       * @param { any } aggregate ???
       * @returns { number} return  
       */
      function _getAggregatedDefense( targets, targetDefenseType, aggregate = Math.max ) {
        return targets.length > 0 ? aggregate( ...targets.map( ( t ) => t.system.characteristics.defenses[targetDefenseType].value ) ) : 0;
      }
      return difficulty;
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
  }

  /**
   * Use a resource (karma, devotion) by deducting the amount. This will always happen, even if not enough is available.
   * Look out for the return value to see if that was the case.
   * @param {"karma"|"devotion"} resourceType The type of resource to use. One of either "karma" or "devotion".
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
   * </ul>
   * @param {EdRoll} roll The prepared Roll.
   */
  #processRoll( roll ) {
    if ( !roll ) {
      // No roll available, do nothing.
      return;
    }
    // Check if this uses karma or strain at all
    this.takeDamage( roll.options.strain.total, "standard", undefined, true );
    if (
        !this.#useResource( 'karma', roll.options.karma.pointsUsed )
        || !this.#useResource( 'devotion', roll.options.devotion.pointsUsed )
    ) {
      ui.notifications.warn( "Localize: Not enough karma or devotion. Used all that was available." );
    }
    if ( roll.options.devotion.pointsUsed < 1 && roll.options.devotion.pointsRequired ) {
      ui.notifications.warn( "Localize: This ability requires the use of one devotion point." );
      return;
    }
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
    return expandObject( enrichment );
  }

  async _enableHTMLEnrichmentEmbeddedItems( ) {
    for ( const item of this.items ) {
      item.system.description.value = expandObject( await TextEditor.enrichHTML( item.system.description.value, {
            async: true,
            secrets: this.isOwner,
          } )
      );
    }
  }
}