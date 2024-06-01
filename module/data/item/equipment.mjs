import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import MatrixTemplate from "./templates/matrix.mjs";

/**
 * Data model template with information on equipment items.
 * @property {boolean} consumable check if item will be consumed on usage
 * @property {string} ammoType which type of ammo it is.
 */
export default class EquipmentData extends PhysicalItemTemplate.mixin(
    ItemDescriptionTemplate,
    MatrixTemplate
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
            ammoType: new fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                label: "ED.Item.Equipment.ammoType"
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