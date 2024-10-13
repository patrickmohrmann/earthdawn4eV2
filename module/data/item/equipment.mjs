import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

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
        label:    "ED.Data.Item.Labels.Equipment.consumable",
        hint:     "ED.Data.Item.Hints.Equipment.consumable",
      } ),
      // different ammo types are availabel see issue #
      ammunition: new fields.SchemaField( {
        type: new fields.StringField( {
          required: true,
          nullable: true,
          blank:    true,
          initial:  "",
          choices:  ED4E.ammunitionType,
          label:    "ED.Data.Item.Labels.Equipment.ammunition",
          hint:     "ED.Data.Item.Hints.Equipment.ammunition"
        } ),
      } ),
      bundleSize: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.Equipment.bundleSize",
        hint:     "ED.Data.Item.Hints.Equipment.bundleSize"
      } ),
    } );
  }

  /* -------------------------------------------- */
  /*  Migrations                  */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static migrateData( source ) {
    super.migrateData( source );
    // specific migration functions
  }
}