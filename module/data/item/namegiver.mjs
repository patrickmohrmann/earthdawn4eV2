import SystemDataModel from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import MovementFields from '../actor/templates/movement.mjs';
import { DocumentUUIDField, IdentifierField, MappingField } from "../fields.mjs";
import AbilityTemplate from "../item/templates/ability.mjs";

/**
 * Data model template with information on namegiver items.
 * @property {object} attributeValues                           Attribute Schema Object
 * @property {number} attributeValues.dexterityValue            dexterity value
 * @property {number} attributeValues.strengthValue             strength value
 * @property {number} attributeValues.constitutionValue         constitution value
 * @property {number} attributeValues.perceptionValue           perception value
 * @property {number} attributeValues.willpowerValue            willpower value
 * @property {number} attributeValues.charismaValue             charisma value
 * @property {number} karmamodifier                             initiative value
 * @property {object} movement                                  movement Schema Object
 * @property {number} movement.walk                             movement type walk modifications
 * @property {number} movement.fly                              movement type fly modifications
 * @property {number} movement.swim                             movement type swim modifications
 * @property {number} movement.burrow                           movement type burrow modifications
 * @property {number} movement.climb                            movement type climb modifications
 */
export default class NamegiverData extends SystemDataModel.mixin(
  ItemDescriptionTemplate
) {
    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            attributeValues: new MappingField(
              new foundry.data.fields.NumberField( {
                  required: true,
                  nullable: false,
                  min: 1,
                  initial: 10,
                  integer: true,
                  positive: true,
              } ), {
                  initialKeys: CONFIG.ED4E.attributes,
                  initialKeysOnly: true,
                  label: "ED.items.namegiver.attributes"
              } ),
            karmamodifier: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Namegiver.karmamodifier"
            } ),
            ...MovementFields.movement,
            weightMultiplier: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                initial: 1,
                integer: false,
                positive: true,
                label: "ED.Item.Namegiver.weightMultiplier"
            } ),
            abilities: new MappingField(
                new fields.ArrayField(
                  new DocumentUUIDField(
                    AbilityTemplate,
                    {
                      label: "ED.Ability",
                      hint: "ED.AnAbilityGrantedOnThisLevel"
                    }
                  ),
                  {
                    required: true,
                    label: "ED.advancement.abilityPoolLevel",
                    hint: "ED.TheSetOfAbilitiesGrantedOnThisLevel"
                  }
                ),
                {
                  initialKeys: CONFIG.ED4E.abilityPools,
                  initialKeysOnly: true,
                  required: true,
                  nullable: false,
                  label: "ED.advancement.levelAbilities",
                  hint: "good stoff"
                }
              ),
        } );
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