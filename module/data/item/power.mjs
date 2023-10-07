import AbilityTemplate from "./templates/ability.mjs";

/**
 * Data model template with information on Power items.
 */
export default class PowerData extends AbilityTemplate {

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