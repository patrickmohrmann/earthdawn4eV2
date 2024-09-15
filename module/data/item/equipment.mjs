import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on equipment items.
 * @property {boolean} consumable check if item will be consumed on usage
 * @property {string} ammunition which type of ammo it is.
 */
export default class EquipmentData extends PhysicalItemTemplate.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            consumable: new fields.BooleanField( {
                required: true,
                label: "ED.Item.Equipment.consumable"
            } ),
            // different ammo types are availabel see issue #
            ammunition: new fields.SchemaField( {
                type: new fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                label: "ED.Item.Weapon.ammunition"
                } ),
            } ),
            bundleSize: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.General.bundleSize"
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