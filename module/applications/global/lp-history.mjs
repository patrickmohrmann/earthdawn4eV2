import LpTrackingData from "../../data/advancement/lp-tracking.mjs";

/**
 * The application responsible for handling Legend Point related interactions and data.
 * @augments {FormApplication}
 *
 * @param {LegendPointHistoryPrompt} legendPointHistory         The data model which is the
 *      target data structure to be updated by the form.
 * @param {FormApplicationOptions} [options={}]     Additional options which
 *      modify the rendering of the sheet.
 */
export default class LegendPointHistoryPrompt extends FormApplication {
  constructor( legendPointHistory , options = {} ) {
     legendPointHistory ??= new LpTrackingData();
    super( legendPointHistory );
    this.actor = options.actor;
    this.resolve = options.resolve;
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   */
  static async waitPrompt( data, options = {} ) {
    data ??= new LpTrackingData(); 
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( data, options ) .render( true, { focus: true } );
    } );
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return {
      ...options,
      closeOnSubmit: false,
      submitOnChange: true,
      submitOnClose: false,
      height: 850,
      width: 1000,
      resizable: true,
      classes: [...options.classes, 'earthdawn4e', 'legend-point__history'],
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
    return game.i18n.localize( "X-Legend Point History" );
  }

  get template() {
    return 'systems/ed4e/templates/actor/legend-points/history.hbs';
  }

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    $( this.form.querySelector( 'button.ok' ) ).on( 'click', this.ok.bind( this ) );

    $( this.form ).on( 'click', '.toggle-details', this._toggleTransactionDetails.bind( this ) );

    // toggle function for the Legend point History entreis
     html.on('click', '.group-header', event => {
      const header = event.currentTarget;
      const itemUuid = header.dataset.itemUuid;
  
      // Toggle the folded/unfolded state for each entry related to the clicked header
      html.find(`.group-entry[data-item-uuid="${itemUuid}"]`).each((entry) => {
        if ($(entry).hasClass('folded')) {
          $(entry).removeClass('folded').addClass('unfolded');
        } else {
          $(entry).removeClass('unfolded').addClass('folded');
        }
      });
    });

  }
  
  
  /**
   * @description               Toggles the visibility of spending details when a table row is clicked.
   * @param {Event} event       The click event.
   * @UserFunction              UF_LpTracking-toggleTransactionDetails
   */
  _toggleTransactionDetails(event) {
    event.preventDefault();
    const currentItem = $(event.currentTarget);
    const detailsDiv = currentItem.closest('tr').next('tr').find('.spendings-details');
    if (detailsDiv.length > 0) {
      detailsDiv.toggleClass("is-visible");
    } else {
      console.error("Failed to find .spendings-details related to the clicked item.");
    }
  }

  async _updateObject( event, formData ) {
    const data = foundry.utils.expandObject( formData );
    this.object.updateSource( data );
    // Re-render sheet with updated values
    this.render();
  }

  /** @inheritDoc */
  async close( options = {} ) {
    this.resolve?.( null );
    return super.close( options );
  }

  /** @inheritDoc */
  async ok( event ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( { preventRender: true } );
    this.resolve?.( this.object );
    return this.close( );
  }
}