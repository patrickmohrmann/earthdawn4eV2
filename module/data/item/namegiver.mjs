import SystemDataModel from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on namegiver items.
 * @property {number} dexterityValue            dexterity value
 * @property {number} strengthValue             strength value
 * @property {number} constitutionValue         constitution value
 * @property {number} perceptionValue           perception value
 * @property {number} willpowerValue            willpower value
 * @property {number} charismaValue             charisma value
 * @property {number} karmamodifier             initiative value
 * @property {object} movement                  movement group object
 * @property {number} movement.walk             movement type walk modifications
 * @property {number} movement.fly              movement type fly modifications
 * @property {number} movement.swim             movement type swim modifications
 * @property {number} movement.burrow           movement type burrow modifications
 * @property {number} movement.climb            movement type climb modifications
 */
export default class NamegiverData extends SystemDataModel.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            dexterityValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 10,
                label: "ED.Item.Namegiver.dexterityValue"
            } ), 
            strengthValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 10,
                label: "ED.Item.Namegiver.strengthValue"
            } ), 
            toughnessValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 10,
                label: "ED.Item.Namegiver.toughnessValue"
            } ), 
            perceptionValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 10,
                label: "ED.Item.Namegiver.perceptionValue"
            } ), 
            willpowerValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 10,
                label: "ED.Item.Namegiver.willpowerValue"
            } ), 
            charismaValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 10,
                label: "ED.Item.Namegiver.charismaValue"
            } ), 
            karmamodifier: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Namegiver.karmamodifier"
            } ), 
            movement: new foundry.data.fields.SchemaField( {
                walk: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.Namegiver.walk"
                } ),
                fly: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.Namegiver.fly"
                } ),
                swim: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.Namegiver.swim"
                } ),
                burrow: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.Namegiver.burrow"
                } ),
                climb: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.Namegiver.climb"
                } ),
            },
            {
                label: "ED.Item.Namegiver.movement"
            } ),
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