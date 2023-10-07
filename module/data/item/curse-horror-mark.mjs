import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on Curse and Horror Mark items.
 */
export default class CurseHorrorMarkData extends SystemDataModel {

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