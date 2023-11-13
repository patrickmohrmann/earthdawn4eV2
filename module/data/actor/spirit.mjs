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
        // TODO: spirit rating (or whatever it's called in english, german "Geisterstärke")?
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