import EdRollOptions from "../data/other/roll-options.mjs";
import EdRoll from "../dice/ed-roll.mjs";
import ED4E from "../config.mjs";
import RollPrompt from "../applications/global/roll-prompt.mjs";


/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @augments {Actor}
 */
export default class ActorEd extends Actor {

  /**
   * Roll a generic attribute test. Uses {@link RollPrompt} for further input data.
   * @param {string} attributeId  The 3-letter id for the attribute (e.g. "per").
   * @param {object} options      Any additional options for the {@link EdRoll}.
   */
  async rollAttribute( attributeId, options = {} ) {
    const attributeStep = this.system.attributes[attributeId].step;
    const edRollOptions = new EdRollOptions( {
      step: { base: attributeStep },
      karma: { pointsUsed: this.system.karma.useAlways ? 1 : 0, step: this.system.karma.step },
      devotion: { step: this.system.devotion.step },
      chatFlavor: `${game.i18n.localize( ED4E.attributes[attributeId].label )} Test`,
    } );
    // RollPrompt.waitPrompt( edRollOptions ).then( this.#processRoll );
    const roll = await RollPrompt.waitPrompt( edRollOptions );
    this.#processRoll( roll );
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
  takeDamage( amount, damageType = "standard", armorType, ignoreAmor ) {
    const finalAmount = amount - (
        ( ignoreAmor || !armorType )
            ? 0
            : this.system.characteristics.armor[armorType].value
    );
    const newDamage = this.system.characteristics.health.damage[damageType] + finalAmount;
    this.update( {[`system.characteristics.health.damage.${damageType}`]: newDamage} );
  }

  /**
   * Use a resource (karma, devotion) by deducting the amount, if possible.
   * @param {"karma"|"devotion"} resourceType The type of resource to use. One of either "karma" or "devotion".
   * @param {number} amount                   The amount to use of the resource.
   * @returns {boolean}                       If enough of the resource is available deduct the `amount` and return
   *                                          `true`. If not available, return 'false' and do not change system data.
   */
  #useResource( resourceType, amount ) {
    const available = this.system[resourceType].value;
    if ( amount > available ) {
      return false;
    } else {
      this.update( {[`system.${resourceType}.value`]: ( available - amount ) } );
      return true;
    }
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
    // Check if this uses karma or strain at all
    this.takeDamage( roll.edRollOptions.strain, "standard" );
    if (
        !this.#useResource( 'karma', roll.edRollOptions.karma.pointsUsed )
        || !this.#useResource( 'devotion', roll.edRollOptions.devotion.pointsUsed )
    ) {
      ui.notifications.warn("Localize: Not enough karma or devotion. Move this to validation of EdRollData later.");
      //return;
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
}
