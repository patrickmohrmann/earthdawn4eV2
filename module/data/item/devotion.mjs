import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on Devotion items.
 */
export default class DevotionData extends AbilityTemplate.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            devotionRequired: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Devotion.label.devotionRequired",
                hint: "ED.Item.Devotion.hint.devotionRequired"
            } ),
            durability: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Class.durability"
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
