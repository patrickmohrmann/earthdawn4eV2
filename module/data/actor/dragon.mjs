import SentientTemplate from "./templates/sentient.mjs";

/**
 * System data definition for dragons.
 * @mixin
 */
export default class DragonData extends SentientTemplate {

  /** @inheritDoc */
  static _systemType = "dragon";

  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    return super.defineSchema();
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