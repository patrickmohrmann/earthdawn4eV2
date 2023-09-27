import ClassTemplate from "./templates/class.mjs";
import WeaponData from "./weapon.mjs";

/**
 * Data model template with information on discipline items.
 */
export default class DisciplineData extends ClassTemplate{

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