import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 */
export default class ClassTemplate extends SystemDataModel{

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