

/**
 * The application responsible for handling Legend Point History of Earned Points
 * @augments {FormApplication}
 * @param {TakeDamagePrompt} takeDamage         The data model which is the
 *      target data structure to be updated by the form.
 * @param {FormApplicationOptions} [options={}]     Additional options which
 *      modify the rendering of the sheet.
 */
export default class TakeDamagePrompt extends FormApplication {
  constructor( actor, resolve, ...args ) {
    super( ...args );
    this.resolve = resolve;
    this.actor = actor;
  }

  getData() {
    const data = super.getData();
    // const damage = {
    //   damage: formData.damage,
    //   type: formData.type,
    //   ignoreArmor: formData.ignoreArmor,
    // };
    data.actor = this.actor; // Add actor data to the template data

    return data;
  }
  /**
   * @param {object} actor actor
   * @returns {Promise<string>}     A promise that resolves to the value of the
   */
  static async waitPrompt( actor ) {
    return new Promise( ( resolve ) => {
      const prompt = new TakeDamagePrompt( actor, resolve );
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
      height: 320,
      width: 230,
      resizable: true,
      classes: [...options.classes, "earthdawn4e", "take-damage-prompt"],
    };
  }
  get title() {
    return game.i18n.localize( "ED.Dialogs.Title.takeDamage" );
  }
  get template() {
    return "systems/ed4e/templates/actor/prompts/take-damage-prompt.hbs";
  }
  activateListeners( html ) {
    super.activateListeners( html );

    html.find( '.button__take-damage' ).click( async ( event ) => {
      event.preventDefault();

      // Get the form data
      const formData = new FormData( event.currentTarget.form );

      // Convert the form data to an object
      const formObject = Object.fromEntries( formData );

      // Resolve the Promise with the form data
      this.resolve( formObject );

      this.close();
    } );
  }

  async _updateObject( event, formData ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( { preventRender: true } );
  }

}