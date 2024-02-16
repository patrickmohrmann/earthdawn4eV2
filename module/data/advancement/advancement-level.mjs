import { SparseDataModel } from "../abstract.mjs";
import { FormulaField, IdentifierField } from "../fields.mjs";
import ED4E from "../../config.mjs";
import AbilityTemplate from "../item/templates/ability.mjs";

/**
 * A level in an advancement.
 */
export default class AdvancementLevelData extends SparseDataModel {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      identifier: new IdentifierField( {
        required: true,
        nullable: false,
        label: "ED.identifier",
        hint: "ED.data.hints.ClearIdentifierForThis"
      } ),
      level: new fields.NumberField( {
        required: true,
        nullable: false,
        initial: 1,
        label: "ED.level",
        hint: "ED.TheLevelThisAdvancementDescribes"
      } ),
      tier: new fields.StringField( {
        required: true,
        nullable: false,
        choices: ED4E.tier,
        initial: "none",
        label: "ED.tier",
        hint: "ED.The tier to which this level belongs to"
      } ),
      abilities: new fields.ArrayField(
        new fields.ForeignDocumentField(
          AbilityTemplate,
          {
            required: false,
            nullable: true,
            idOnly: true,
            initial: null,
            label: "ED.Ability",
            hint: "ED.AnAbilityGrantedOnThisLevel"
          }
        ),
        {
          required: true,
          label: "ED.advancement.levelAbilities",
          hint: "ED.TheSetOfAbilitiesGrantedOnThisLevel"
        }
      ),
      freeAbilities: new fields.ArrayField(
        new fields.ForeignDocumentField(
          AbilityTemplate,
          {
            required: false,
            nullable: true,
            idOnly: true,
            label: "ED.Ability",
            hint: "ED.AnAbilityGrantedForFreeOnThisLevel"
          }
        ),
        {
          required: true,
          label: "ED.advancement.levelAbilities",
          hint: "ED.TheSetOfAbilitiesGrantedForFreeOnThisLevel"
        }
      ),
      specialAbilities: new fields.ArrayField(
        new fields.ForeignDocumentField(
          AbilityTemplate,
          {
            required: false,
            nullable: true,
            idOnly: true,
            label: "ED.SpecialAbility",
            hint: "ED.ASpecialAbilityGrantedOnThisLevel"
          }
        ),
        {
          required: true,
          label: "ED.advancement.levelSpecialAbilities",
          hint: "ED.TheSetOfSpecialAbilitiesGrantedOnThisLevel"
        }
      ),
      effects: new fields.ArrayField(
        new fields.ForeignDocumentField(
          ActiveEffect,
          {
            required: false,
            nullable: true,
            idOnly: true,
            label: "ED.ActiveEffect",
            hint: "ED.AnActiveEffectGrantedOnThisLevel"
          }
        ),
        {
          required: true,
          label: "ED.advancement.levelActiveEffects",
          hint: "ED.TheSetOfActiveAbilitesGrantedOnThisLevel"
        }
      ),
      resourceStep: new FormulaField( {
        required: true,
        nullable: true,
        blank: true,
        deterministic: false
      } ),
    }
  }
}