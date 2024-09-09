import ItemDescriptionTemplate from "./templates/item-description.mjs";
import NoneNamegiverPowerData from "./templates/none-namegiver-power.mjs";

/**
 * Data model template with information on Maneuver items.
 * @property {number} extraSuccesses        extra successes to trigger the maneuver
 */
export default class ManeuverData extends NoneNamegiverPowerData.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            extraSuccesses: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
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