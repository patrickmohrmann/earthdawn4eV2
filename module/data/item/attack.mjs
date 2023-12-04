import NoneNamegiverPowerData from "./templates/none-namegiver-power.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on Attack items.
 */
export default class AttackData extends NoneNamegiverPowerData.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            
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
