import AbilityTemplate from "./templates/ability.mjs";

/**
 * Data model template with information on Devotion items.
 */
export default class DevotionData extends AbilityTemplate {

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
