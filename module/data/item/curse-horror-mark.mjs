import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on Curse and Horror Mark items.
 */
export default class CurseHorrorMarkData extends PhysicalItemTemplate{

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