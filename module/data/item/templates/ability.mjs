import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on Ability items.
 */
export default class AbilityTemplate extends SystemDataModel {

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