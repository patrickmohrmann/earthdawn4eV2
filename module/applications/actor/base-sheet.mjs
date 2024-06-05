import ED4E from "../../config.mjs";

/**
 * Extend the basic ActorSheet with modifications
 * @augments {ActorSheet}
 */
export default class ActorSheetEd extends ActorSheet {

  /**
   * @override
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject( super.defaultOptions, {
      classes: ['earthdawn4e', 'sheet', 'actor', 'character-sheet'],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: '.actor-sheet-tabs',
          contentSelector: '.actor-sheet-body',
          initial: 'main',
        },
        {
          navSelector: '.actor-sheet-spell-tabs',
          contentSelector: '.actor-sheet-spell-body',
          initial: 'spell-matrix-tab',
        },
      ],
      scrollY: [
        ".main", 
      ],
    } );
  }

  /** @override */
  get template() {
    return `systems/ed4e/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */
  /*  Get Data            */
  /* -------------------------------------------- */
  async getData() {
    const systemData = super.getData();
    systemData.systemFields = this.document.system.schema.fields;
    systemData.enrichment = await this.actor._enableHTMLEnrichment();
    await this.actor._enableHTMLEnrichmentEmbeddedItems();
    systemData.config = ED4E;
    systemData.splitTalents = game.settings.get("ed4e", "talentsSplit" );
    return systemData;
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    // View Item Sheets
    html.find( ".item-edit" ).click( this._onItemEdit.bind( this ) );

    // All listeners below are only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute tests
    html.find( ".attribute-card__grid--item .rollable" ).click( this._onRollAttribute.bind( this ) );

    // Ability tests
    html.find( ".card__ability .rollable" ).click( this._onRollAbility.bind( this ) );

    // Equipment tests
    html.find( ".card__equipment .rollable" ).click( this._onRollEquipment.bind( this ) );

    // take strain
    html.find( ".card__ability .take-strain" ).click( this._takeStrain.bind( this ) );

    // toggle holding Tpye of an owned item
    html.find( ".item__status" ).click( this._onChangeItemStatus.bind( this ) );
    
    // Find HTML element with class xxx and on right click call function yyyy
    html.find('.item__status').on('contextmenu'), function(event) {
      event.preventDefault();
      _onChangeItemStatus(event, up);
    }

    // Owned Item management
    html.find( ".item-delete" ).click( this._onItemDelete.bind( this ) );

    // Effect Management
    html.find( ".effect-add" ).click( this._onEffectAdd.bind( this ) );
    html.find( ".effect-edit" ).click( this._onEffectEdit.bind( this ) );
    html.find( ".effect-delete" ).click( this._onEffectDelete.bind( this ) );

    // Karma refresh button --> karma ritual
    html.find( ".button__Karma-refresh" ).click( this._onKarmaRefresh.bind( this ) );

    // item card description shown on item click
    html.find( ".card__name" ).click( event => this._onCardExpand( event ) );

    // Legend point History (Earned)
    html.find( ".legend-point__history--earned" ).click( this._onLegendPointHistoryEarned.bind( this ) );
  }

  /**
    * Handle changing the holding type of an owned item.
    * @description itemStatus.value = 
    * 1: owned, 
    * 2: carried, 
    * 3: equipped, 
    * 4: mainHand, 
    * 5: offHand, 
    * 6: twoHanded, 
    * 7: tail
    * @param {Event} event      The originating click event.
    * 
    * @private
    */
    // eslint-disable-next-line complexity
    _onChangeItemStatus( event ) {
     event.preventDefault();
     const li = event.currentTarget.closest( ".item-id" );
     const item = this.actor.items.get( li.dataset.itemId );
     const currentItemStatus = item.system.itemStatus.value;
     let itemStatusNumber = 0;

     if ( currentItemStatus === 1 ) {
      itemStatusNumber = 1;
     } else if ( currentItemStatus === 2 ) {
      itemStatusNumber = 2;
     } else if ( currentItemStatus === 3 ) {
      itemStatusNumber = 3;
     } else if ( currentItemStatus === 4 ) {
      itemStatusNumber = 4;
     } else if ( currentItemStatus === 5 ) {
      itemStatusNumber = 5;
     } else if ( currentItemStatus === 6 ) {
      itemStatusNumber = 6;
     } else if ( currentItemStatus === 7 ) {
      itemStatusNumber = 7;
     } 

     if ( item.type === "weapon" ) {

      let maxItemStatus = 0
      maxItemStatus = this.actor.items.filter(i => i.type === "namegiver" && i.system.tailAttack === true).length > 0 ? 7 : 6;
      let newItemStatusPre = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
      const newItemStatus = newItemStatusPre === 3 ? 4 : newItemStatusPre;
      item.update( { "system.itemStatus.value": newItemStatus } );
     } else if ( item.type === "armor" ) {
      const maxItemStatus = 3
      const newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
      item.update( { "system.itemStatus.value": newItemStatus } );
     } else if ( item.type === "shield" ) {
      const maxItemStatus = 3
      const newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
      item.update( { "system.itemStatus.value": newItemStatus } );
     } else if ( item.type === "equipment" ) {
      const maxItemStatus = 3
      const newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
      item.update( { "system.itemStatus.value": newItemStatus } );
     } 
    }

  /**
   * Legend Point history earned
   * @param { Event } event    The originating click event.
   * @private
   */
  _onLegendPointHistoryEarned( event ) {
    event.preventDefault();
    this.actor.legendPointHistoryEarned( this.actor );
  }
  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollAttribute( event ) {
    event.preventDefault();
    const attribute = event.currentTarget.dataset.attribute;
    this.actor.rollAttribute( attribute, {event: event} );
  }

  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollAbility( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-id" );
    const ability = this.actor.items.get( li.dataset.itemId );
    this.actor.rollAbility( ability, {event: event} );
  }

  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollEquipment( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-id" );
    const equipment = this.actor.items.get( li.dataset.itemId );
    this.actor.rollEquipment( equipment, {event: event} );
  }

  /**
   * @description Take strain is used for non rollable abilities which requires strain. player can click on the icon to take the strain damage
   * @param {Event} event     The originating click event
   * @private
   */
  _takeStrain( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-id" );
    const ability = this.actor.items.get( li.dataset.itemId );
    this.actor.takeStrain( ability.system.strain );
  }


  /**
   * Handle creating an owned ActiveEffect for the Actor.
   * @param {Event} event     The originating click event.
   * @returns {Promise|null}  Promise that resolves when the changes are complete.
   * @private
   */
  _onEffectAdd( event ) {
    event.preventDefault();
    return this.actor.createEmbeddedDocuments( 'ActiveEffect', [{
      label: `New Effect`,
      icon: 'icons/svg/item-bag.svg',
      duration: { rounds: 1 },
      origin: this.actor.uuid
    }] );
  }

  /**
   * Handle deleting an existing Owned ActiveEffect for the Actor.
   * @param {Event} event                       The originating click event.
   * @returns {Promise<ActiveEffect>|undefined} The deleted item if something was deleted.
   * @private
   */
  _onEffectDelete( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const effect = this.actor.effects.get( itemId );
    if ( !effect ) return;
    return effect.deleteDialog();
  }

  /**
   * Handle editing an existing Owned ActiveEffect for the Actor.
   * @param {Event}event    The originating click event.
   * @returns {any}         The rendered item sheet.
   * @private
   */

  _onEffectEdit( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const effect = this.actor.effects.get( itemId );
    return effect.sheet?.render( true );
  }

  /**
   * Handle deleting an existing Owned Item for the Actor.
   * @param {Event} event                 The originating click event.
   * @returns {Promise<ItemEd>|undefined} The deleted item if something was deleted.
   * @private
   */
  async _onItemDelete( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const item = this.actor.items.get( itemId );
    if ( !item ) return;
    return item.deleteDialog();
  }

  /**
   * Handle editing an existing Owned Item for the Actor.
   * @param {Event}event    The originating click event.
   * @returns {ItemSheetEd} The rendered item sheet.
   * @private
   */
  _onItemEdit( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const item = this.actor.items.get( itemId );
    return item.sheet?.render( true );
  }

  _onKarmaRefresh ( ) {
    this.actor.karmaRitual();
  }

  _onCardExpand( event ) {
    event.preventDefault();

    const itemDescription = $( event.currentTarget )
    .parent( ".item-id" )
    .parent( ".card__ability" )
    .children( ".card__description" );

    itemDescription.toggleClass( "card__description--toggle" );
  }
}