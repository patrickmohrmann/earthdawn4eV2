import { DocumentCreateDialog } from '../applications/document-creation.mjs';


/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @augments {Actor}
 */
export default class ActorEd extends Actor {

  /** @inheritDoc */
  static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
    return DocumentCreateDialog.waitPrompt( data, { documentCls: Actor, parent, pack, options } );
  }

  activateListeners( html ) {
    super.activateListeners( html );

    $( document ).on( 'keydown', 'form', ( ev ) => { return ev.key !== 'Enter'; } );

    html.find( '.item-delete' ).click( async ( ev ) => {
      let li = $( ev.currentTarget ).parents( '.item-name' )
      let itemId = li.attr( 'data-item-id' );
      let confirmationResult = await this.confirmationBox();
      if ( confirmationResult.result === false ) {
        return false;
      } else {
        this.actor.deleteEmbeddedDocuments( 'Item', [itemId] );
      }
    } );

    html.find( '.item-edit' ).click( ( ev ) => {
      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.actor.items.get( li.data( 'itemId' ) );
      item.sheet.render( true );
    } );

    html.find( '.link-checkbox-effect' ).click( async ( ev ) => {
      ev.preventDefault();

      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.actor.effects.get( li.data( 'itemId' ) );
      let visibleState = ev.target.checked;
      let disabledState = !visibleState;

      await item.update( { disabled: disabledState } );
    } );

    html.find( '.effect-delete' ).click( async ( ev ) => {
      let li = $( ev.currentTarget ).parents( '.item-name' )
      let itemId = li.attr( 'data-item-id' );
      let confirmationResult = await this.confirmationBox();
      if ( confirmationResult.result === false ) {
        return false;
      } else {
        this.actor.deleteEmbeddedDocuments( 'ActiveEffect', [itemId] );
      }
    } );

    html.find( '.effect-add' ).click( () => {
      let itemNumber = this.actor.effects.size;
      let itemData = {
        label: `New Effect ` + itemNumber,
        icon: 'systems/ed4e/assets/icons/effect.png',
        duration: { rounds: 1 },
        origin: this.actor.id,
      };

      this.actor.createEmbeddedDocuments( 'ActiveEffect', [itemData] );
    } );

    html.find( '.effect-edit' ).click( ( ev ) => {
      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.actor.effects.get( li.data( 'itemId' ) );
      item.sheet.render( true );
    } );

  }

    _applyBaseEffects( baseCharacteristics ) {
      let overrides = {};
      // Organize non-disabled effects by their application priority
      // baseCharacteristics is list of attributes that need to have Effects applied before Derived Characteristics are calculated
      const changes = this.effects.reduce( ( changes, e ) => {
        if ( e.changes.length < 1 ) {
          return changes;
        }
        if ( e.disabled || e.isSuppressed || !baseCharacteristics.includes( e.changes[0].key ) ) {
          return changes;
        }
        
        return changes.concat(
          
          e.changes.map( ( c ) => {
            // eslint-disable-next-line no-param-reassign
            c = foundry.utils.duplicate( c );
            c.effect = e;
            c.priority = c.priority ?? c.mode * 10;
            return c;
          } ),
        );
      }, [] );
  
      changes.sort( ( a, b ) => a.priority - b.priority );
  
      // Apply all changes
      for ( let change of changes ) {
        const result = change.effect.apply( this, change );
        if ( result !== null ) overrides[change.key] = result[change.key];
      }
  
      // Expand the set of final overrides
      this.overrides = foundry.utils.expandObject( { ...foundry.utils.flattenObject( this.overrides ), ...overrides } );
    }
}
