import SentientTemplate from "./templates/sentient.mjs";

/**
 * System data definition for dragons.
 * @mixin
 */
export default class SpiritData extends SentientTemplate {

    /** @inheritDoc */
    static _systemType = "spirit";

    /* -------------------------------------------- */

    /** @inheritDoc */
    static defineSchema() {
        return super.defineSchema();
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