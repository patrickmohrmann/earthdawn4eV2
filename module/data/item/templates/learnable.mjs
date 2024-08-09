import SystemDataModel from "../../abstract.mjs";

/**
 * Template to be mixed in with data models that can be acquired through legend points (like abilities and spells).
 * @property {boolean} canBeLearned Whether the item fulfills all requirements to be learned.
 * @mixin
 */
export default class LearnableTemplate extends SystemDataModel {

  /**
   * @description Whether the entity fulfills all requirements to be learned.
   * @type {boolean}
   */
  get canBeLearned() {
    throw new Error( "A subclass of the LearnableTemplate must implement the canBeLearned getter." );
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