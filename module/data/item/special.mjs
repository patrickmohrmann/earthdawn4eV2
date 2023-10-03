import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on Special items.
 */
export default class SpecialData extends PhysicalItemTemplate{

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