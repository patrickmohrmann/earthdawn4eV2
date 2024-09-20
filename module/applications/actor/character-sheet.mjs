import ActorSheetEd from "./base-sheet.mjs";

/**
 * An Actor sheet for player character type actors.
 */
export default class ActorSheetEdCharacter extends ActorSheetEd {

  static get defaultOptions() {
    return foundry.utils.mergeObject( super.defaultOptions, {
      classes: [ "earthdawn4e", "sheet", "actor", "character-sheet", ],
    } );
  }

  /** @inheritDoc */
  async _onDropItem( event, data ) {
    const item = await Item.implementation.fromDropData( data );
    const isInActor = this.actor.uuid === item.parent?.uuid;

    if ( !isInActor && item.system.learnable ) return item.system.constructor.learn( this.actor, item );

    return super._onDropItem( event, data );
  }
}