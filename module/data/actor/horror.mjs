import SentientTemplate from "./templates/sentient.mjs";

/**
 * System data definition for dragons.
 * @mixin
 */
export default class HorrorData extends SentientTemplate {

    /** @inheritDoc */
    static _systemType = "horror";

    /* -------------------------------------------- */

    /** @inheritDoc */
    static defineSchema() {
        return super.defineSchema();
        // TODO: horror marks (e.g., array of documentIDs)?
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