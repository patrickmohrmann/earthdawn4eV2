import NamegiverTemplate from "./templates/namegiver.mjs";

/**
 * System data definition for NPCs.
 * @mixin
 */
export default class NpcData extends NamegiverTemplate {

    /** @inheritDoc */
    static _systemType = "npc";

    /* -------------------------------------------- */

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