import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on weapon items.
 */
export default class WeaponData extends PhysicalItemTemplate{

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