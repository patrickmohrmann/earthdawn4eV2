import AbilityTemplateTemplate from "./templates/ability.mjs";

/**
 * Data model template with information on Attack items.
 */
export default class AttackData extends AbilityTemplateTemplate{

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