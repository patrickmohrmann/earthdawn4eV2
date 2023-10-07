import AbilityTemplate from "./templates/ability.mjs";

/**
 * Data model template with information on Skill items.
 */
export default class SkillData extends AbilityTemplate {

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