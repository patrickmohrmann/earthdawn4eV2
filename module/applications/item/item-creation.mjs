/**
 * Derivate of Foundry's Item.createDialog() functionality.
 */
export class ItemCreateDialog extends FormApplication {
  
  /** @inheritDoc */
  constructor( data = {}, { resolve, pack = null, parent = null, options = {} } = {} ) {
    super( data, options );

    this.resolve = resolve;
    this.pack = pack;
    this.parent = parent;

    this._updateCreationData( data );
  }

  get title() {
    return game.i18n.format( "DOCUMENT.Create", { type: game.i18n.localize( "DOCUMENT.Item" ) } );
  }

  get template() {
    return "systems/ed4e/templates/item/item-creation.hbs";
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return {
      ...options,
      closeOnSubmit: false,
      submitOnChange: true,
      submitOnClose: false,
      height: "auto",
      width: "auto",
      resizable: true,
      classes: [...options.classes, "earthdawn4e", "create-document", "create-item"],
    };
  }

  get initialData() {
    return this.object;
  }

  /** @type {object} */
  createData = {};

  getData( options = {} ) {
    const folders = this.parent ? [] : game.folders.filter( ( f ) => f.type === "Item" && f.displayed );

    const types = CONFIG.ED4E.typeGroups.Item;
    const typesRadio = Object.fromEntries(
      Object.entries( types ).map( ( [k, v], i ) => {
        return [k, v.reduce( ( a, v ) => ( { ...a, [v]: v} ), {} )]
      } )
    );

    const createData = this.createData;

    return {
      folders,
      name: createData.name,
      defaultName: Item.implementation.defaultName(),
      folder: createData.folder,
      hasFolders: folders.length > 0,
      currentType: createData.type,
      types,
      typesRadio
    };
  }

  /**
   * @param {JQuery} jq jQuery HTML instance
   */
  activateListeners( jq ) {
    super.activateListeners( jq );

    this.form.querySelector( "button.create-document" ).addEventListener( "click", this._createItem.bind( this ) );
  }

  _updateObject( event, formData ) {
    const data = foundry.utils.expandObject( formData );

    this._updateCreationData( data );

    this.render();
  }

  _updateCreationData( data = {} ) {
    // Fill in default type if missing
    data.type ||= CONFIG.Item.defaultType || game.documentTypes.Item[1];

    this.createData = mergeObject( this.initialData, data, { inplace: false } );
    this.createData.system ??= {};

    // Clean up data
    if ( !data.folder && !this.initialData.folder ) delete this.createData.folder;

    return this.createData;
  }

  /**
   * @param {Event} event
   */
  async _createItem( event ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( { preventRender: true } );

    let createData = this._updateCreationData( this.createData );
    createData.name ||= Item.implementation.defaultName();
    createData = new Item.implementation( createData ).toObject();

    const options = {};
    if ( this.pack ) options.pack = this.pack;
    if ( this.parent ) options.parent = this.parent;
    options.renderSheet = true;

    const promise = Item.implementation.create( createData, options );

    this.resolve?.( promise );
    this.close();
  }

  close( options = {} ) {
    this.resolve?.( null );
    return super.close( options );
  }

  /**
   * Wait for dialog to the resolved.
   * @param {object} [data] Initial data to pass to the constructor.
   * @param {object} [options] Options to pass to the constructor.
   * @returns {Promise<Item|null>} Created item or null.
   */
  static waitPrompt( data, options = {} ) {
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( data, options ).render( true, { focus: true } );
    } );
  }
}