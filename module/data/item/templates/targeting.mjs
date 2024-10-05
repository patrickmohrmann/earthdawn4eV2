import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on Ability items.
 * @property {string} action action type
 * @property {string} attribute attribute
 * @property {string} tier talent tier
 * @property {number} strain strain
 * @property {number} level rank
 * @mixin
 */
export default class TargetTemplate extends SystemDataModel {
  /** @inheritDoc */
  static defineSchema() {
    return this.mergeSchema( super.defineSchema(), {
      difficulty: new foundry.data.fields.SchemaField( {
        target: new foundry.data.fields.StringField( {
          nullable: false,
          blank:    false,
          initial:  "none",
          label:    "X.TargetDifficulty"
        } ),
        group: new foundry.data.fields.StringField( {
          nullable: false,
          blank:    false,
          initial:  "none",
          label:    "X.GroupDifficulty"
        } ),
        fixed: new foundry.data.fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "X.FixedDifficulty"
        } ),
      } ),
    } );
  }

  /**
   *  
   * @returns {number} return
   * @userFunction              UC_Actions-getDifficulty
   */
  getDifficulty() {
    let difficulty;
    let currentTarget = game.user.targets.first()?.actor;
    let currentTargets = [ ...game.user.targets.map( ( t ) => t.actor ) ];
    let numTargets = game.user.targets.size;
    let targetDifficultySetting = this.difficulty.target;
    let groupDifficultySetting = this.difficulty.group;
    let fixedDifficultySetting = this.difficulty.fixed;

    if ( numTargets <= 0 || targetDifficultySetting === "none" ) {
      if ( fixedDifficultySetting > 0 ) {
        difficulty = fixedDifficultySetting;
      } else {
        difficulty = 0;
      }
    } else {
      let baseDifficulty;
      let additionalTargetDifficulty = 0;
      // noinspection FallThroughInSwitchStatementJS
      switch ( groupDifficultySetting ) {
        case "highestX":
          additionalTargetDifficulty = numTargets - 1;
        case "highestOfGroup":
          baseDifficulty = TargetTemplate._getAggregatedDefense( currentTargets, targetDifficultySetting, Math.max );
          break;
        case "lowestX":
          additionalTargetDifficulty = numTargets - 1;
        case "lowestOfGroup":
          baseDifficulty = TargetTemplate._getAggregatedDefense( currentTargets, targetDifficultySetting, Math.min );
          break;
        default:
          baseDifficulty = currentTarget?.system.characteristics.defenses[targetDifficultySetting].value ?? 0;
      }
      difficulty = baseDifficulty + additionalTargetDifficulty;
    }

    return difficulty;
  }


  /**
   * @param { Array } targets array of all targets
   * @param { string } targetDefenseType defense
   * @param { any } aggregate ???
   * @returns { number} return
   * @userFunction              UC_Actions-getAggregatedDefense
   */
  static _getAggregatedDefense( targets, targetDefenseType, aggregate = Math.max ) {
    return targets.length > 0 ? aggregate( ...targets.map( ( t ) => t.system.characteristics.defenses[targetDefenseType].value ) ) : 0;
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static migrateData( source ) {
    super.migrateData( source );
    // specific migration functions
  }
}