import { SparseDataModel } from "../abstract.mjs";
import { MappingField } from "../fields.mjs";
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
          nullable: true
        } ),
      abilityOptions: new MappingField(
        new fields.SetField(
          new fields.ForeignDocumentField(
            AbilityTemplate,
            {
              required: false,
              nullable: true,
              idOnly: true,
              label: "An Ability in this options pool.",
              hint: "An Ability in this options pool."
            }
          ),
          {
            required: true,
            nullable: true,
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
      tmp: new fields.EmbeddedDataField(AdvancementLevelData)
    };
  }
}