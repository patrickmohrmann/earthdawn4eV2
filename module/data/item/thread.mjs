import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on items that represents threads weaved to patterns.
 */
export default class ThreadData extends SystemDataModel{

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