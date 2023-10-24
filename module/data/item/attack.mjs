import NoneNamegiverPowerData from "./templates/none-namegiver-power.mjs";

/**
 * Data model template with information on Attack items.
 */
export default class AttackData extends NoneNamegiverPowerData {

    /** @inheritDoc */
    static defineSchema() {
        return {};
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
