import SystemDataModel from "../../abstract.mjs";

/**
 * Template to be mixed in with data models that can be acquired through legend points (like abilities and spells).
 * @property {boolean} canBeLearned Whether the item fulfills all requirements to be learned.
 * @mixin
 */
export default class LearnableTemplate extends SystemDataModel {

  /**
   * @description Whether the entity can be learned. Should always be true if mixed in, as a shortcut for checkin
   * if this is mixed in.
   * @type {boolean}
   */
  get learnable() {
    return true;
  }

  /**
   * @description Whether the entity fulfills all requirements to be learned.
   * @type {boolean}
   */
  get canBeLearned() {
    throw new Error( "A subclass of the LearnableTemplate must implement the canBeLearned getter." );
  }

  /**
   * @description The amount of legend points required to learn this entity.
   * @type {number}
   */
  get requiredLpToLearn() {
    throw new Error( "A subclass of the LearnableTemplate must implement the 'requiredLpToLearn' getter." );
  }

  /**
   * Learn the entity by an actor. This means creating a new item instance onn the actor, either without spending LP on
   * level 0 for items with a level, or by spending LP.
   * @param {ActorEd} actor             The actor that is learning the entity.
   * @param {ItemEd} item               The item that is being learned.
   * @returns {Promise<ItemEd>|false}   The created Item instance if learned, or false if the entity was not learned.
   * @abstract
   */
  static async learn( actor, item ) {
    throw new Error( "A subclass of the LearnableTemplate must implement the 'learn' method." );
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