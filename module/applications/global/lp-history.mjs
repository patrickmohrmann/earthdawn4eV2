
import LpTrackingData from "../../data/advancement/lp-tracking.mjs";

/**
 * 
 * @param {object} inputs actor data
 * @returns 
 */
export async function getLegendPointHistoryData( inputs ) {
  return new Promise( ( resolve ) => {
    let history = new LegendPointHistoryEarnedPrompt( inputs, resolve );
    history.render( true );
  } )
}

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
    legendpointHistoryEarned ??= new LpTrackingData()
    super( legendpointHistoryEarned );
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   */
  static async waitPrompt( data, options = {} ) {
    data ??= new LpTrackingData();
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
      classes: [...options.classes, 'earthdawn4e', 'legend-point__history--earned'],
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

    $( this.form.querySelector( 'button.ok' ) ).on( 'click', this.close.bind( this ) );
  }

  async _updateObject( event, formData ) {
    const data = foundry.utils.expandObject( formData );
    data.namegiver ||= null;

    // Reset selected class if class type changed
    if ( data.isAdept !== this.object.isAdept ) data.selectedClass = null;

    this.object.updateSource( data );

    // Re-render sheet with updated values
    this.render();
  }

  /** @inheritDoc */
  async close( options = {} ) {
    this.resolve?.( null );
    return super.close( options );
  }
}