/**
 * The application responsible for handling test against being knocked down
 * @augments {FormApplication}
 * @param {KnockDownItemsPrompt} knockDownItems     a list of items to choose from to withstand knockdown
 * @param {FormApplicationOptions} [options={}]     Additional options which modify the rendering of the sheet.
 */
export default class KnockDownItemsPrompt extends FormApplication {
  constructor( actor, resolve, ...args ) {
    super( ...args );
    this.resolve = resolve;
    this.actor = actor;
  }

  getData() {
    const data = super.getData();
    data.actor = this.actor; // Add actor data to the template data
    return data;
  }
  /**
   * @param {object} actor actor
   * @returns {Promise<string>}     A promise that resolves to the value of the
   */
  static async waitPrompt( actor ) {
    return new Promise( ( resolve ) => {
      const prompt = new KnockDownItemsPrompt( actor, resolve );
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
      classes: [...options.classes, "earthdawn4e", "knock-down-prompt"],
    };
  }
  get title() {
    return game.i18n.localize( "ED.Dialogs.Title.knockDown" );
  }
  get template() {
    return "systems/ed4e/templates/actor/prompts/knock-down-prompt.hbs";
  }

  activateListeners( html ) {
    super.activateListeners( html );
    $( document ).ready()
    const buttons = html.find( '.knock-down-item button' );
    buttons.each( ( index, button ) => {
      const className = button.classList[0]; 
      console.log( "className: ", className )
      html.find( `.${className}` ).click( ( event ) => {
        this.resolve( className );
        this.close();
      } );

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