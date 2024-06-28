import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

/**
 * Data model template with information on talent items.
 */
export default class TalentData extends AbilityTemplate.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            talentCategory: new fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "discipline",
                label: 'localize: Talent Type',
                hint: 'localize: Type of the Talent',
              } ),
            talentIdentifier: new fields.StringField( {
                required: true,
                nullable: true,
                blank: true,
                // prefill with the uuid of the talent on creation+talentname??? or just talentname will see    
                label: 'localize: Talent identifier',
                hint: 'localize: identifier of the Talent',
              } ),
            magic: new fields.SchemaField( {
                threadWeaving: new fields.BooleanField( {
                    required: true,
                    nullable: false,
                    initial: false,
                    label: "ED.Item.Talent.threadWeavingTalent",
                    hint: "X.does this talent represent a thread weaving talent"
                } ),
                spellcasting: new fields.BooleanField( {
                    required: true,
                    nullable: false,
                    initial: false,
                    label: "ED.Item.Talent.Spellcasting",
                    hint: "X.does this talent represent the spellcasting talent"
                } ),
                magicType: new fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    trim: true,
                    choices: ED4E.spellcastingTypes,
                    label: "ED.Item.Talent.magicType",
                    hint: "X.the type of thread weaving this talent belongs to",
                } ),
            }, {
                required: true,
                nullable: false,
                label: "ED.Item.Header.magicTalent",
                hint: "X.Talent information for spellcasting",
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