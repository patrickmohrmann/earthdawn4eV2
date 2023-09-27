import SystemDataModel from "../abstract.mjs";
import WeaponData from "./weapon.mjs";

/**
 * Data model template with information on items that are used to represent custom active effects.
 */
export default class EffectData extends SystemDataModel{

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