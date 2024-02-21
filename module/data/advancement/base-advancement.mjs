import { SparseDataModel } from "../abstract.mjs";
import { DocumentUUIDField, MappingField } from "../fields.mjs";
import AbilityTemplate from "../item/templates/ability.mjs";
import AdvancementLevelData from "./advancement-level.mjs";

/**
 * Advancement of Disciplines, Paths and Questors
 */

export default class AdvancementData extends SparseDataModel {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      levels: new fields.ArrayField(
        new fields.EmbeddedDataField(
          AdvancementLevelData,
          {
            required: false,
            nullable: true,
            label: "ED.advancementLevel",
            hint: "ED.aLevelInThisAdvancement"
          }
        ),
        {
          required: true,
          nullable: true,
          initial: [new AdvancementLevelData( {level: 1} )],
        } ),
      abilityOptions: new MappingField(
        new fields.ArrayField(
          new DocumentUUIDField(
            AbilityTemplate,
            {
              label: "An Ability in this options pool.",
              hint: "An Ability in this options pool."
            }
          ),
          {
            required: true,
            label: "ED.advancement.abilityPool",
            hint: "The set of available abilities at the given tier."
          } ),
        {
          initialKeys: CONFIG.ED4E.tier,
          initialKeysOnly: true,
          required: true,
          nullable: false,
          label: "ED.advancement.abilityOptions",
          hint: ""
        } ),
    };
  }

  /**
   * Add a new level to this advancement.
   * @param {object} [data={}]    If provided, will initialize the new level with the given data.
   */
  addLevel( data = {} ) {
    this.updateSource( {
      levels: this.levels.concat(
        new AdvancementLevelData(
          {
            ...data,
            level: this.levels.length + 1
          }
        )
      )
    } );
  }

  /**
   * Remove the last {@link amount} levels added from this advancement.
   * @param {number} [amount=1]   The number of levels to remove.
   */
  deleteLevel( amount = 1 ) {
    this.updateSource( {
      levels: this.levels.slice( 0, -( amount ?? 1 ) )
    } );
  }

  /**
   * Add abilities to the given type of options pool.
   * @param {[Item]} abilities              An array of ability item IDs to add.
   * @param {ED4E.abilityPools} poolType    The type of pool the abilities are added to.
   */
  addAbilities( abilities, poolType ) {
    const propertyKey = `abilityOptions.${poolType}`;
    const currentAbilities = this.abilityOptions[poolType];
    const abilityIDs = abilities.map( ability => ability.uuid ?? ability );
    this.updateSource( {
      [propertyKey]: currentAbilities.concat( abilityIDs ),
    } );
  }

  removeAbilities( abilities, poolType ) {
    const propertyKey = `abilityOptions.${poolType}`;
    const currentAbilities = this.abilityOptions[poolType];
    const abilityUUIDs = abilities.map( ability => ability.uuid ?? ability );

    this.updateSource( {
      [propertyKey]: currentAbilities.filter( uuid => !abilityUUIDs.includes( uuid ) ),
    } );
  }
}