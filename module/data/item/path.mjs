import ClassTemplate from "./templates/class.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import DisciplineData from "./discipline.mjs";

/**
 * Data model template with information on path items.
 * @property {string} sourceDiscipline source discipline related to the path
 */
export default class PathData extends ClassTemplate.mixin(
  ItemDescriptionTemplate
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      sourceDiscipline: new fields.ForeignDocumentField( DisciplineData, {
        idOnly: true,
        label:  "ED.Item.Class.sourceDiscipline"
      } ),
      bloodMagicDamage: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  2,
        integer:  true,
        label:    "ED.Item.Class.bloodMagicDamage"
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