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
    return mergeObject( super.defaultOptions, {
      classes: ['earthdawn4e', 'sheet', 'actor', 'character-sheet'],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: '.actor-sheet-tabs',
          contentSelector: '.actor-sheet-body',
          initial: 'main',
        },
      ],
    } );
  }

  /** @override */
  get template() {
    return `systems/ed4e/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment['system.description.value'] = await TextEditor.enrichHTML( this.actor.system.description.value, {
      async: true,
      secrets: this.actor.isOwner,
    } );
    return expandObject( enrichment );
  }

  async _enableHTMLEnrichmentItem( itemC ) {
   let enrichmentItem = {};
   // itemC.system.enrichmentItem = await TextEditor.enrichHTML( itemC.system.description.value, {
    enrichmentItem = await TextEditor.enrichHTML( itemC.system.description.value, {
      async: true,
      secrets: this.actor.isOwner,
    } );
    return expandObject( enrichmentItem );
  }

  /* -------------------------------------------- */
  /*  Get Data            */
  /* -------------------------------------------- */
  async getData() {
    const systemData = super.getData();
    systemData.enrichment = await this._enableHTMLEnrichment();
    let  itemCollection = this.actor.items;
    for ( const itemC of itemCollection ) {
      console.log ( itemC )
      itemC.system.description.value = await this._enableHTMLEnrichmentItem( itemC );
      console.log ( itemC )
    }
    // console.log( '[EARTHDAWN] Item data: ', systemData );

    systemData.config = ED4E;

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
    html.find( "table.table__attribute .rollable" ).click( this._onRollAttribute.bind( this ) );

    // Owned Item management
    html.find( ".item-delete" ).click( this._onItemDelete.bind( this ) );

    // Effect Management
    html.find( ".effect-add" ).click( this._onEffectAdd.bind( this ) );
    html.find( ".effect-edit" ).click( this._onEffectEdit.bind( this ) );
    html.find( ".effect-delete" ).click( this._onEffectDelete.bind( this ) );

    // Karma refresh button --> karma ritual
    html.find( ".button__Karma-refresh" ).click( this._onKarmaRefresh.bind( this ) );

    // item card description
    // Item summaries
    html.find( ".card__name" ).click( event => this._onCardExpand( event ) );

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
   * Handle creating an owned ActiveEffect for the Actor.
   * @param {Event} event     The originating click event.
   * @returns {Promise|null}  Promise that resolves when the changes are complete.
   * @private
   */
  _onEffectAdd( event ) {
    event.preventDefault();
    return this.actor.createEmbeddedDocuments( 'ActiveEffect', [{
      label: `New Effect`,
      icon: 'systems/earthdawn4e/assets/effect.png',
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
    const li = event.currentTarget.closest( ".item-name" );
    const effect = this.actor.effects.get( li.dataset.itemId );
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
    const li = event.currentTarget.closest( ".item-name" );
    const effect = this.actor.effects.get( li.dataset.itemId );
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
    const li = event.currentTarget.closest( ".item-name" );
    const item = this.actor.items.get( li.dataset.itemId );
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
    const li = event.currentTarget.closest( ".item-name" );
    const item = this.actor.items.get( li.dataset.itemId );
    return item.sheet?.render( true );
  }

  _onKarmaRefresh ( ) {
    this.actor.karmaRitual();
  }


  _onCardExpand( event ) {
    event.preventDefault();
    const toggler = $( event.currentTarget );
    const cardAbilityClass = toggler.parent( ".card__ability" );
    const itemNameClass = cardAbilityClass.parent( ".item-name" );
    const itemDescription = itemNameClass.children( ".card__description" );

    itemDescription.toggleClass( "card__description--toggle" );
  }

}
