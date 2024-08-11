import ItemDescriptionTemplate from "./templates/item-description.mjs";
import MagicTemplate from "./templates/magic-item.mjs";
import LearnableTemplate from "./templates/learnable.mjs";

/**
 * Data model template with information on Spell items.
 * @mixes LearnableTemplate
 */
export default class SpellData extends MagicTemplate.mixin(
  ItemDescriptionTemplate,
  LearnableTemplate
)  {

  /** @inheritDoc */
  static defineSchema() {
    return this.mergeSchema( super.defineSchema(), {
            
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