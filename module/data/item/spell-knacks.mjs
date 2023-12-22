import ItemDescriptionTemplate from "./templates/item-description.mjs";
import MagicTemplate from "./templates/sorcery-item.mjs";

/**
 * Data model template with information on Spell items.
 */
export default class SpellKnackData extends MagicTemplate.mixin(
    ItemDescriptionTemplate
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