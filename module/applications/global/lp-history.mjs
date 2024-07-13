
import LpEarningTransactionData from "../../data/advancement/lp-earning-transaction.mjs";
import LpTrackingData from "../../data/advancement/lp-tracking.mjs";
import LpTransactionData from "../../data/advancement/lp-transaction.mjs";

/**
 * 
 * @param {object} inputs actor data
 * @returns 
 */
// export async function getLegendPointHistoryData( inputs ) {
//   return new Promise( ( resolve ) => {
//     let history = new LegendPointHistoryEarnedPrompt( inputs, resolve );
//     history.render( true );
//   } )
// }

/**
 * The application responsible for handling Legend Point History of Earned Points
 *
 * @augments {FormApplication}
 *
 * @param {LegendPointHistoryEarnedPrompt} legendpointHistoryEarned         The data model which is the
 *      target data structure to be updated by the form.
 * @param {FormApplicationOptions} [options={}]     Additional options which
 *      modify the rendering of the sheet.
 */
export default class LegendPointHistoryEarnedPrompt extends FormApplication {
  constructor( legendpointHistoryEarned , options = {} ) {
     legendpointHistoryEarned ??= new LpTrackingData();
    super( legendpointHistoryEarned );
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
    return game.i18n.localize( "X-Legend Point History - Earned" );
  }

  get template() {
    return 'systems/ed4e/templates/actor/legend-points/history.hbs';
  }

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    $( this.form.querySelector( 'button.ok' ) ).on( 'click', this.ok.bind( this ) );

    $( this.form ).on( 'click', '.toggle-details', this._toggleDetails.bind( this ) );


    $(this.form.querySelector('.add-earning-icon')).on('click', () => {
      console.log("Binding");
    
      // Assuming `amount`, `description` are to be fetched or are predefined
      const amount = 0; // Placeholder value
      const description = ''; // Placeholder value
    
      // Calculate lpBefore and lpAfter based on current lp
      const lpBefore = this.actor.system.lp.current;
      const lpAfter = lpBefore + amount;
    
      // Create a new LpTransactionData instance
      const transaction = new LpEarningTransactionData({
        amount,
        description,
        lpBefore,
        lpAfter,
      });
    
      // Ensure the transactions array exists
      if (!this.actor.system.lp.transactions) {
        this.actor.system.lp.transactions = []; // Initialize if it doesn't exist
      }
    
      // Add the new transaction
      this.actor.addLpTransaction("earnings", transaction);
      console.log("ACTOR LP Transactions: ", this.actor.system.lp.transactions);
      this.render(true);
      
      console.log("ACTOR LP ", this.actor.system.lp.earnings);
    });

  }
  
  _toggleDetails(event) {
    event.preventDefault();
  
    const currentItem = $(event.currentTarget);
    // Adjusted traversal to reflect the actual structure
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