import ManeuverData from "./maneuver.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import KnackTemplate from "./templates/knack-item.mjs";

/**
 * Data model template with information on items that are used to represent custom active effects.
 */
export default class KnackManeuverData extends ManeuverData.mixin(
  KnackTemplate,
  ItemDescriptionTemplate,
) {

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