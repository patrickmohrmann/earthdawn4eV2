import ED4E from "../../config.mjs";

/**
 * Extend the basic ActorSheet with modifications
 * @augments {ItemSheet}
 */
export default class ItemSheetEd extends ItemSheet {

  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      classes: ['earthdawn4e', 'sheet', 'item', 'item-sheet'],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: '.item-sheet-tabs',
          contentSelector: '.item-sheet-body',
          initial: 'main',
        },
      ],
    } );
  }

  /** @override */
  get template() {
    // return `systems/ed4e/templates/item/${this.item.type}-sheet.hbs`
    return `systems/ed4e/templates/item/item-sheet.hbs`;
  }

  // HTML enrichment
  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment['system.description.value'] = await TextEditor.enrichHTML( this.item.system.description.value, {
      async: true,
      secrets: this.item.isOwner,
    } );
    return expandObject( enrichment );
  }

  async getData() {
    const systemData = super.getData();
    systemData.enrichment = await this._enableHTMLEnrichment();
    // console.log( '[EARTHDAWN] Item data: ', systemData );

    systemData.config = ED4E;

    return systemData;
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners( html ) {

    // Triggering weight calculation for physical items
    html.find( ".weight-calculation--button" ).click( this._onWeightCalculation.bind( this ) );

    super.activateListeners( html );

    // All listeners below are only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Effect Management
    html.find( ".effect-add" ).click( this._onEffectAdd.bind( this ) );
    html.find( ".effect-edit" ).click( this._onEffectEdit.bind( this ) );
    html.find( ".effect-delete" ).click( this._onEffectDelete.bind( this ) );
  }

  /**
   * Handle creating an owned ActiveEffect for the Actor.
   * @param {Event} event     The originating click event.
   * @returns {Promise|null}  Promise that resolves when the changes are complete.
   * @private
   */
  _onEffectAdd( event ) {
    event.preventDefault();
    return this.item.createEmbeddedDocuments( 'ActiveEffect', [{
      label: `New Effect`,
      icon: 'systems/earthdawn4e/assets/effect.png',
      duration: { rounds: 1 },
      origin: this.item.uuid
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
    const effect = this.item.effects.get( li.dataset.itemId );
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
    const effect = this.item.effects.get( li.dataset.itemId );
    return effect.sheet?.render( true );
  }

  /* ----------------------------------------------------------------------- */
  /*                Auto calculation for equipments weight                   */
  /* ----------------------------------------------------------------------- */

  /**
   * Handle autorecalculation of physical items for actors, based on the namegiver modifier for weight.
   */
  async _onWeightCalculation( ) {
    const item = this.object;
    const itemWeight = item.system.weight.value;
    const itemName = item.name;
    let itemCalculationCheck = item.system.weight.weightCalculated;
    if( itemWeight > 0 ) {
      if ( item.isOwned ) {
        if ( !itemCalculationCheck ) {
          const namegiver = item.parent.items.filter( item => item.type === 'namegiver' );
          item.system.weight.value = namegiver[0].system.weightMultiplier * itemWeight;
          item.name = namegiver[0].name + " - " + itemName;
          item.system.weight.weightCalculated = true;
          item.system.weight.weightMultiplier = namegiver[0].system.weightMultiplier
          this.render( true );
          } else {
            ui.notifications.warn( game.i18n.localize( "this items weight has already been changed!" ) );
            return;
          }
        } else {
          return;
        }
    } else {
      ui.notifications.warn( game.i18n.localize( "this item has no weight value" ) )
    }
    return;
  }
}

