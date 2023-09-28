import CommonTemplate from "./common.mjs";

/**
 * A template for all actors that represent sentient beings and have such stats.
 * @mixin
 */
export default class SentientTemplate extends CommonTemplate {

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