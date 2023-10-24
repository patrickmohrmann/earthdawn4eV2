import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on Ability items.
 * @property {string} action action type 
 * @property {number} strain strain 
 */
export default class AbilityTemplate extends SystemDataModel {
    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            action: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "standard",
                label: "ED.Item.ability.action"
            } ), 
            attribute: new foundry.data.fields.StringField( {
                required: true,
                nullable: true,
                blank: true,
                label: "ED.Item.ability.attribute"
            } ), 
            tier: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "novice",
                label: "ED.Item.ability.tier"
            } ), 
            strain: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ability.strain"
            } ), 
            rank: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ability.rank"
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