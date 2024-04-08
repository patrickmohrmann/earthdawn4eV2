import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on talent items.
 */
export default class TalentData extends AbilityTemplate.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            talentCategory: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "Discipline",
                label: 'localize: Talent Type',
                hint: 'localize: Type of the Talent',
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