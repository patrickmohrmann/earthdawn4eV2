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
        return this.mergeSchema( super.defineSchema(), {
            devotionRequired: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Devotion.label.devotionRequired",
                hint: "ED.Item.Devotion.hint.devotionRequired"
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
