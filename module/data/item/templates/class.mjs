import { ItemDataModel } from "../../abstract.mjs";
import AdvancementData from "../../advancement/base-advancement.mjs";
import LpIncreaseTemplate from "./lp-increase.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 * @property {number} level         either circle or rank of the class 
 * @property {string} identifier    type of class
 * @mixes LpIncreaseTemplate
 */
export default class ClassTemplate extends ItemDataModel.mixin(
  LpIncreaseTemplate
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      level: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  1,
        integer:  true
      } ),
      advancement: new fields.EmbeddedDataField(
        AdvancementData,
        {
          required: true,
          label:    "ED.advancement",
          hint:     "ED.advancementSchemaForThisClass"
        }
      )
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