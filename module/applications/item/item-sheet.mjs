import ED4E from "../../config.mjs";
import ClassTemplate from "../../data/item/templates/class.mjs";

/**
 * Extend the basic ActorSheet with modifications
 * @augments {ItemSheet}
 */
export default class ItemSheetEd extends ItemSheet {

  constructor( options = {} ) {
    super( options );

    // mapping of drop event target classes to handling function
    this._dropCallbackMapping = {
      "abilities-pool": this._onDropAdvancementAbility.bind( this ),
    };
  }

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
        {
          navSelector: '.item-advancement-tabs',
          contentSelector: '.item-advancement-body',
          initial: 'main'
        }
      ],
      dragDrop: [
        {
          dragSelector: ".item",
          dropSelector: "span.abilities-list",
        }
      ]
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
    systemData.isPlayer = !game.user.isGM;
    systemData.isClass = this.item.system instanceof ClassTemplate ;
    systemData.config = ED4E;

    return systemData;
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    // All listeners below are only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Triggering weight calculation for physical items
    html.find( ".weight-calculation--button" ).click( this._onWeightCalculation.bind( this ) );

    // Effect Management
    html.find( ".effect-add" ).click( this._onEffectAdd.bind( this ) );
    html.find( ".effect-edit" ).click( this._onEffectEdit.bind( this ) );
    html.find( ".effect-delete" ).click( this._onEffectDelete.bind( this ) );

    // add extra Level to a class sheet
    html.find( ".class__add-level" ).click( this._onClassLevelAdd.bind( this ) );
    html.find( ".class__delete-level" ).click( this._onClassLevelDelete.bind( this ) );

    // drop abilities on advancement fields
    //html.find( "span.abilities-list" ).ondrop( this._onDropAdvancementAbility( this ) );
  }

  /* ----------------------------------------------------------------------- */
  /*                Item CRUD                                                */
  /* ----------------------------------------------------------------------- */

  /**
   * Handle adding a level to the class' advancement.
   * @param { event } event   The originating click event.
   */
  _onClassLevelAdd( event ) {
    event.preventDefault();
    this.item.system.advancement.addLevel();
    this.render();
  }

  /**
   * Handle removing the last added level from the class' advancement.
   * @param { event } event   The originating click event.
   */
  _onClassLevelDelete( event ) {
    event.preventDefault();
    this.item.system.advancement.deleteLevel();
    this.render();
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
  /*                          Drag & Drop Handler                            */
  /* ----------------------------------------------------------------------- */

  _onDropAdvancementAbility( event ) {
    event.preventDefault();
    const transferData = JSON.parse( event.dataTransfer.getData( "text/plain" ) );
    const poolType = event.target.dataset.poolType;
    const level = event.target.closest(".advancement-level").dataset.level;
    const levelIndex = event.target.closest(".advancement-level").dataset.levelIndex;
    const abilities = fromUuidSync( transferData.uuid );
    this.item.system.advancement.levels[levelIndex].addAbilities(
      [abilities],
      poolType
    );
  }

  _onDragOver( event ) {
    super._onDragOver( event );
  }

  _onDrop( event ) {
    event.preventDefault();
    const transferData = JSON.parse( event.dataTransfer.getData( "text/plain" ) );

    let dropFunction;
    switch ( transferData.type ) {
      case "Item":
        dropFunction = event.target?.dataset?.dropFunction;
        break;
      default:
        return super._onDrop( event );
    }

    if ( dropFunction ) {
      this._dropCallbackMapping[dropFunction]( event );
      this.render();
    }
  }
  _onDropItemOnAdvancement( event ) {
    const data = JSON.parse( event.dataTransfer.getData( "text/plain" ) );
    console.log( data );
  }


  /* ----------------------------------------------------------------------- */
  /*                Auto calculation for equipments weight                   */
  /* ----------------------------------------------------------------------- */

  /**
   * Handle autorecalculation of physical items for actors, based on the namegiver modifier for weight.
   */
  async _onWeightCalculation( ) {
    this.item.tailorToNamegiver( this.item.parent.namegiver );
  }
}

