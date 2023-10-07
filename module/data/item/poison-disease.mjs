import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on Poison and Disease items.
 */
export default class PoisonDiseaseData extends SystemDataModel {

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