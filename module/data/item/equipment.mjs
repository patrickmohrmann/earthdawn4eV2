import PhysicalItemTemplate from "./templates/physical-item.mjs";
import WeaponData from "./weapon.mjs";

/**
 * Data model template with information on equipment items.
 */
export default class EquipmentData extends PhysicalItemTemplate{

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