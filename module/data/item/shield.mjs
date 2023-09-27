import PhysicalItemTemplate from "./templates/physical-item.mjs";
import WeaponData from "./weapon.mjs";

/**
 * Data model template with information on shield items.
 */
export default class ShieldData extends PhysicalItemTemplate{

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