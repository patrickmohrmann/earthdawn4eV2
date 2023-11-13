import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on Ability items.
 * @property {string} action action type 
 * @property {string} attribute attribute
 * @property {string} tier talent tier
 * @property {number} strain strain 
 * @property {number} rank rank 
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
                label: "ED.Item.Ability.action"
            } ),
            // TODO: do all actions have an attribute?
            attribute: new foundry.data.fields.StringField( {
                required: true,
                nullable: true,
                blank: true,
                label: "ED.Item.Ability.attribute"
            } ), 
            tier: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "novice",
                label: "ED.Item.Ability.tier"
            } ), 
            strain: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Ability.strain"
            } ), 
            rank: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Ability.rank"
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