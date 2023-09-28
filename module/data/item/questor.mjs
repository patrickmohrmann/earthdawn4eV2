import ClassTemplate from "./templates/class.mjs";

/**
 * Data model template with information on the questor path items.
 */
export default class QuestorData extends ClassTemplate{

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