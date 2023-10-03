import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on Maneuver items.
 */
export default class ManeuverData extends PhysicalItemTemplate{

    /** @inheritDoc */
    static defineSchema() {
        return {};
    }

    /* -------------------------------------------- */
    /*  Migrations                                  */
    /* -------------------------------------------- */

    /** @inheritDoc */
    static migrateData(source) {
        super.migrateData(source);
        // specific migration functions
    }
}