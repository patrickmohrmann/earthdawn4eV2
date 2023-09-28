import SystemDataModel from "../../abstract.mjs";

/**
 * A template for all actors that share the common template.
 *
 * @mixin
 */
export default class CommonTemplate extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return super.defineSchema();
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