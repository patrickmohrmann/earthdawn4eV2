/**
 * Extend the basic ActorSheet with modifications
 * @extends {ActorSheet}
 */
export default class ActorSheetEd extends ActorSheet {

    
    baseListeners( html ) {
        super.activateListeners( html );
  

        $( document ).on( 'keydown', 'form', function ( ev ) { return ev.key !== 'Enter'; } );
  
        /**
         * @description Delete items from Actor
         */
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
  
        /**
         * @description Edit item 
         */
        html.find( '.item-edit' ).click( ( ev ) => {
          const li = $( ev.currentTarget ).parents( '.item-name' );
          const item = this.actor.items.get( li.data( 'itemId' ) );
          item.sheet.render( true );
        } );
  
        /**
         * @description show Earthdawn Active Effect on Token
         */
        html.find( '.link-checkbox-effect' ).click( async ( ev ) => {
          ev.preventDefault();
    
          const li = $( ev.currentTarget ).parents( '.item-name' );
          const item = this.actor.effects.get( li.data( 'itemId' ) );
          let visibleState = ev.target.checked;
          let disabledState = !visibleState;
    
          await item.update( { disabled: disabledState } );
        } );
    
        /**
         * @description Delete Earthdawn Active Effect from the Actor
         */
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
    
        /**
         * @description add Earthdawn Active Effect to the Actor
         */
        html.find( '.effect-add' ).click( () => {
          let itemNumber = this.actor.effects.size;
          let itemData = {
            label: `New Effect ` + itemNumber,
            icon: 'systems/earthdawn4e/assets/effect.png',
            duration: { rounds: 1 },
            origin: this.actor.id,
          };
    
          this.actor.createEmbeddedDocuments( 'ActiveEffect', [itemData] );
        } );
    
        /**
         * @description Edit Effects on the Actor
         */
        html.find( '.effect-edit' ).click( ( ev ) => {
          const li = $( ev.currentTarget ).parents( '.item-name' );
          const item = this.actor.effects.get( li.data( 'itemId' ) );
          item.sheet.render( true );
        } );
    
      }


    async confirmationBox() {
    return await new Promise( ( resolve ) => {
        new Dialog( {
        title: `Confirm Delete`,
        content: `Are You Sure?

                `,
        buttons: {
            ok: {
            label: game.i18n.localize( 'earthdawn.o.ok' ),
            callback: ( html ) => {
                resolve( {
                result: true,
                } );
            },
            },
            cancel: {
            label: game.i18n.localize( 'earthdawn.c.cancel' ),
            callback: ( html ) => {
                resolve( {
                result: false,
                } );
            },
            },
        },
        default: 'ok',
        } ).render( true );
    } );
    }

    /**
     * @override
     */
    static get defaultOptions() {
        return mergeObject( super.defaultOptions, {
            classes: ["earthdawn4e", "sheet", "actor", "character-sheet"],
            width: 800,
            height: 800,
            tabs: [{
                navSelector: '.actor-sheet-tabs',
                contentSelector: '.actor-sheet-body',
                initial: 'main',
              },]
        } );
    }

    /** @override */
    get template() {
        return `systems/ed4e/templates/actor/${this.actor.type}-sheet.hbs`
    }
}
