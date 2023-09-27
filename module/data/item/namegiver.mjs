import SystemDataModel from "../abstract.mjs";
import WeaponData from "./weapon.mjs";

/**
 * Data model template with information on namegiver items.
 */
export default class NamegiverData extends SystemDataModel{

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