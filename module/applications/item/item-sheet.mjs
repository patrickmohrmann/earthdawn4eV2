import ED4E from "../../config.mjs";

/**
 * Extend the basic ActorSheet with modifications
 * @augments {ItemSheet} extends ItemSheet
 */
export default class ItemSheetEd extends ItemSheet {

  
  activateListeners( html ) {
    super.activateListeners( html );

    $( document ).on( 'keydown', 'form', function ( ev ) { return ev.key !== 'Enter'; } );

     /**
         * @description Delete item from Item
         */
     html.find( '.item-delete' ).click( async ( ev ) => {
      let li = $( ev.currentTarget ).parents( '.item-name' )
      let itemId = li.attr( 'data-item-id' );
      let confirmationResult = await this.confirmationBox();
      if ( confirmationResult.result === false ) {
        return false;
      } else {
        this.item.deleteEmbeddedDocuments( 'Item', [itemId] );
      }
    } );

    /**
     * @description Edit item 
     */
    html.find( '.item-edit' ).click( ( ev ) => {
      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.item.get( li.data( 'itemId' ) );
      item.sheet.render( true );
    } );

    html.find( '.effect-add' ).click( () => {
      let itemNumber = this.item.effects.size;
      let itemData = {name: `New Effect ` + itemNumber,
                      icon: "systems/ed4e/assets/icons/effect.png",
                      duration: {rounds: 1},
                      origin: this.item.id
                    }
      this.item.createEmbeddedDocuments( "ActiveEffect", [itemData] )
    } );

    html.find( '.effect-edit' ).click( ( ev ) => {
      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.item.effects.get( li.data( 'itemId' ) );
      item.sheet.render( true );
    } );
    html.find( '.effect-delete' ).click( async ( ev ) => {
      let li = $( ev.currentTarget ).parents( '.item-name' )
      let itemId = li.attr( 'data-item-id' );
      let confirmationResult = await this.confirmationBox();
      if ( confirmationResult.result === false ){
        return false
      }
      else{
        this.item.deleteEmbeddedDocuments( 'ActiveEffect', [itemId] );
      }
    });
  }

  async confirmationBox(){
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
            callback: ( html )  =>{
              resolve( {
                result: false,
              } );
            }
          }
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
            classes: ["earthdawn4e", "sheet", "item", "item-sheet"],
            width: 800,
            height: 800,
            tabs: [{
                navSelector: '.item-sheet-tabs',
                contentSelector: '.item-sheet-body',
                initial: 'main',
            }]
        } );
    }

    /** @override */
    get template() {
        return `systems/ed4e/templates/item/${this.item.type}-sheet.hbs`
    }

      // HTML enrichment
  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment["system.description.value"] = await TextEditor.enrichHTML( this.item.system.description.value, {async: true, secrets: this.item.isOwner} );
     return expandObject( enrichment );
  }
 
  async getData() {
    const systemData = super.getData();
    systemData.enrichment =  await this._enableHTMLEnrichment();
    console.log( '[EARTHDAWN] Item data: ', systemData );

    systemData.config = ED4E;
    
    return systemData;
  }
}
