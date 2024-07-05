import ItemDescriptionTemplate from "./templates/item-description.mjs";
import MagicTemplate from "./templates/sorcery-item.mjs";

/**
 * Data model template with information on Spell items.
 */
export default class SpellData extends MagicTemplate.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            testing: new fields.SchemaField( {
                attuned: new fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Item.Knack.standardEffect"
                } ),
                readyToCast: new fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Item.Knack.standardEffect"
                } ),
            } )
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