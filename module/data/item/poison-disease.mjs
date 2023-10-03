import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on Poison and Disease items.
 */
export default class PoisonDiseaseData extends PhysicalItemTemplate{

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