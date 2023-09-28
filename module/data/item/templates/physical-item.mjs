import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on physical items.
 */
export default class PhysicalItemTemplate extends SystemDataModel {

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