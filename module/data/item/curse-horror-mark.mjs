import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on Curse and Horror Mark items.
 * @property {} curseStep           curse step
 * @property {} curseType           type of the curse
 * @property {} curseActive         is the curse active
 * @property {} curseDetected       is the curse known
 */
export default class CurseHorrorMarkData extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            curseStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Curse.curseStep"
            } ), 
            curseType: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "Silver",
                label: "ED.Item.Curse.curseType"
            } ),
            curseActive: new foundry.data.fields.BooleanField( {
                required: true,
                label: "ED.Item.Curse.curseActive"
            } ),
            curseDetected: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Curse.curseDetected"
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