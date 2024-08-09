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
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      durability: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.durability",
        hint:     "ED.Data.Item.Hints.durability",
      } ),
      // identifier for additional disciplines
      order: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      1,
        initial:  1,
        positive: true,
        integer:  true,
        label:    "ED.Data.Item.Labels.order",
        hint:     "ED.Data.Item.Hints.order",
      } ),
      disciplineIndex: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      1,
        initial:  1,
        positive: true,
        integer:  true,
      } ),
      spellcasting: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.spellcasting",
        hint:     "ED.Data.Item.Hints.spellcasting",
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