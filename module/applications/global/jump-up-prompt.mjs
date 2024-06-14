/**
 * The application responsible for Jumping up from being knocked down
 * @augments {FormApplication}
 * @param {JumpUpItemsPrompt} jumpUp    a list of items to choose from to jump up   
 * @param {FormApplicationOptions} [options={}]     Additional options which modify the rendering of the sheet.
 */
export default class JumpUpItemsPrompt extends FormApplication {
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
      const prompt = new JumpUpItemsPrompt( actor, resolve );
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
      classes: [...options.classes, "earthdawn4e", "jump-up-prompt"],
    };
  }
  get title() {
    return game.i18n.localize( "ED.Dialogs.Title.jumpUp" );
  }
  get template() {
    return "systems/ed4e/templates/actor/prompts/jump-up-prompt.hbs";
  }

  activateListeners( html ) {
    super.activateListeners( html );

    $( document ).ready()

    const buttons = html.find( '.jump-up-item button' );

    buttons.each( ( index, button ) => {
      const buttonData = button.dataset.button;
      html.find( `button[data-button="${buttonData}"]` ).click( ( event ) => {
        this.resolve( buttonData );
        this.close();
      } );

    } );
  }

  async _updateObject( event, formData ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( { preventRender: true } );
    this.resolve( false )
    return this.close();
  }
}