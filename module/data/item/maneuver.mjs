import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on Maneuver items.
 * @property {number} extraSuccesses        extra successes to trigger the maneuver
 */
export default class ManeuverData extends SystemDataModel{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            extraSuccesses: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Knack.extraSuccesses"
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