import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

/**
 * Data model template with information on Skill items.
 */
export default class SkillData extends AbilityTemplate.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            skillType: new fields.StringField( {
                required: true,
                initial: "general",
                options: ED4E.skillType,
                label: "ED.Item.Skill.skillType"
            } ),
        } );
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