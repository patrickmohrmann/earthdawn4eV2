import LpTransactionData from "../../data/advancement/lp-transaction.mjs";

/**
 * The application responsible for assigning Legend Points to player characters
 */
export default class AssignLpPrompt extends FormApplication {
  constructor( assignLp, options = {} ) {
    assignLp ??= new LpTransactionData();
    super( assignLp );
    this.resolve = options.resolve;
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   * @param {object} [actors]         actors
   */
  static async waitPrompt( data, options = {} ) {
    data ??= new LpTransactionData();
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( data, options ).render( true, { focus: true } );
    } );
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return {

      ...options,
      height: 850,
      width: 1000,
      resizable: true,
      classes: [...options.classes, 'earthdawn4e', 'assign-legend'],
      tabs: [
        {
          navSelector: '.prompt-tabs',
          contentSelector: '.tab-body',
          initial: 'base-input',
        },
      ],
    };
  }

  get title() {
    return game.i18n.localize( 'X-Assign LP' );
  }

  get template() {
    return 'systems/ed4e/templates/prompts/assign-legend.hbs';
  }

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );
    $( this.form.querySelector( 'button.cancel' ) ).on( 'click', this.close.bind( this ) );
    $( this.form.querySelector( 'button.ok' ) ).on( 'click', this._assignLP.bind( this ) );
  }

  async getData( options = {} ) {
    const context = super.getData( options );
    context.actorsActive = game.users.filter( u => u.active ).map( u => u.character )
    context.actorsInactive = game.users.filter( u => !u.active ).map( u => u.character )
    return context;
  }

  async _updateObject( event, formData ) {
    const data = foundry.utils.expandObject( formData );

    data.namegiver ??= null;

    this.object.updateSource( data );

    // Re-render sheet with updated values
    this.render();
  }

  /** @inheritDoc */
  async close( options = {} ) {
    this.resolve?.( null );
    return super.close( options );
  }

  async _assignLP( event ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( {preventRender: true} );

    this.resolve?.( this.object );
    return this.close();
  }

}