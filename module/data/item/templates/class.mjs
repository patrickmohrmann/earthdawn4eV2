import { ItemDataModel } from "../../abstract.mjs";
import AdvancementData from "../../advancement/base-advancement.mjs";
import LpIncreaseTemplate from "./lp-increase.mjs";
import LearnableTemplate from "./learnable.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 * @property {number} level         either circle or rank of the class 
 * @property {string} identifier    type of class
 * @augments {ItemDataModel}
 * @augments {LearnableTemplate}
 * @augments {LpIncreaseTemplate}
 * @mixes LearnableTemplate
 * @mixes LpIncreaseTemplate
 */
export default class ClassTemplate extends ItemDataModel.mixin(
  LearnableTemplate,
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
  /*  Legend Building                             */
  /* -------------------------------------------- */

  /** @inheritDoc */
  get increasable() {
    return true;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  get learnable() {
    return true;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  get requiredLpForIncrease() {
    return 0;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  get requiredLpToLearn() {
    return 0;
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