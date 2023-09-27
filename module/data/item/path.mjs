import ClassTemplate from "./templates/class.mjs";
import WeaponData from "./weapon.mjs";

/**
 * Data model template with information on path items.
 */
export default class PathData extends ClassTemplate{

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