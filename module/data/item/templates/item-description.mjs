/**
 * Data model template with item description
 */
export default class ItemDescriptionTemplate extends foundry.abstract.DataModel {

    /** @inheritdoc */
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