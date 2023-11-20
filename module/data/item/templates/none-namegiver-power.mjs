import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on Attack items.
 * @property {number} powerStep    attack step
 * @property {number} damageStep    damage step
 * @property {number} strain        strain
 * @property {string} action        action type
 */
export default class NoneNamegiverPowerData extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            action: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "standard",
                label: "ED.Item.Power.action"
            } ), 
            strain: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Power.strain"
            } ),
            powerStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Power.powerStep"
            } ),
            damageStep: new foundry.data.fields.NumberField( {
                required: false,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Power.damageStep"
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
