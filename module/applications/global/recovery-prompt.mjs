/**
 * The application is responsible for handling recovery tests
 * @augments {FormApplication}
 * @param {RecoveryPrompt} recovery   a list of Options to choose from to recover
 * @param {FormApplicationOptions} [options={}]     Additional options which modify the rendering of the sheet.
 */
export default class RecoveryPrompt extends FormApplication {
  constructor( actor, resolve, ...args ) {
    super( ...args );
    this.resolve = resolve;
    this.actor = actor;
  }

  getData() {
    const data = super.getData();
    data.actor = this.actor;
    return data;
  }
  /**
   * @param {object} actor actor
   * @returns {Promise<string>}     A promise that resolves to the value of the
   */
  static async waitPrompt( actor ) {
    return new Promise( ( resolve ) => {
      const prompt = new RecoveryPrompt( actor, resolve ) ;
      prompt.render( true );
    } );
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return {
      ...options,
      closeOnSubmit: false,
      submitOnChange: true,
      submitOnClose: false,
      height: 185,
      width: 280,
      resizable: true,
      classes: [...options.classes, "earthdawn4e", "recovery-prompt"],
    };
  }
  get title() {
    return game.i18n.localize( "ED.Dialogs.Title.recovery" );
  }
  get template() {
    return "systems/ed4e/templates/actor/prompts/recovery-prompt.hbs";
  }

  activateListeners( html ) {
    super.activateListeners( html );

    html.find( ".button-recovery" ).click( ( event ) => {
      this.resolve( "recovery" );
      this.close();
    } );

    html.find( ".button-recoverStun" ).click( ( event ) => {
      this.resolve( "recoverStun" );
      this.close();
    } );

    html.find( ".button-nightRest" ).click( ( event ) => {
      this.resolve( "nightRest" );
      this.close();
    } );
  }
  async _updateObject( event, formData ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( { preventRender: true } );
    return this.close();
  }
}