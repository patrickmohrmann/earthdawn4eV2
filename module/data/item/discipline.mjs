import ClassTemplate from "./templates/class.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on discipline items.
 * @property {number} durability durability value
 */
export default class DisciplineData extends ClassTemplate.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            durability: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Class.durability"
            } ), 
            spellcasting: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Class.spellcasting"
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