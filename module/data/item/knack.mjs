import AbilityTemplate from "./templates/ability.mjs";

/**
 * Data model template with information on Knack items.
 */
export default class KnackData extends AbilityTemplate {

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