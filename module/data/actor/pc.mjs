import NamegiverTemplate from "./templates/namegiver.mjs";

/**
 * System data definition for PCs.
 * @mixin
 */
export default class PcData extends NamegiverTemplate {

    /** @inheritDoc */
    static _systemType = "character";

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