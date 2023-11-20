import SentientTemplate from "./sentient.mjs";

/**
 * A template for all actors that represent namegivers, that is, PCs and NPCs.
 * @mixin
 */
export default class NamegiverTemplate extends SentientTemplate {

    /** @inheritDoc */
    static defineSchema() {
        return super.defineSchema();
    }

    /* -------------------------------------------- */
    /*  Migrations                                  */
    /* -------------------------------------------- */

    /** @inheritDoc */
    static migrateData( source ) {
        super.migrateData( source );
        // specific migration functions
    }
}