import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on Special items.
 */
export default class SpecialAbilityData extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return {};
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