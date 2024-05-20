import LpTransactionData from "../../data/advancement/lp-transaction.mjs";

/**
 * The application responsible for assigning Legend Points to player characters
 * @param {object}     data                 The object this application edits.
 * @param {number}     data.amount          The LP amount to be assigned.
 * @param {string}     data.description     A description text for the LP transaction entry.
 * @param {string[]}   data.selectedActors  The IDs of the selected actors.
 */
export default class AssignLpPrompt extends FormApplication {
  constructor( data = {}, options = {} ) {
    super( data );
    this.resolve = options.resolve;
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   */
  static async waitPrompt( data = {}, options = {} ) {
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( data, options ).render( true, { focus: true } );
    } );
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return {
      ...options,
      closeOnSubmit: false,
      submitOnChange: true,
      submitOnClose: false,
      height: 800,
      width: 500,
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

    context.user = game.users.filter( u => u.active )

    const actorUserActive = game.users.filter( u => u.active && u.character ).map( user => ( {actorId: user.character.id, actorName: user.character.name, playerName: user.name} ) )
    const actorUserInactive =  game.users.filter( u => !u.active && u.character ).map( user => ( {actorId: user.character.id, actorName: user.character.name, playerName: user.name} ) )
    const notGMs = game.users.filter( user => !user.isGM )
    const actorsOwnedNotConfigured = game.actors.filter( actor => notGMs.map( user => actor.testUserPermission( user,"OWNER" ) && user.character?.id !== actor.id ).some( Boolean ) ).map( actor => ( {actorId: actor.id, actorName: actor.name} ) )
    context.actorUserActive = actorUserActive;
    context.actorUserInactive = actorUserInactive;
    context.actorsNoUserConfigured = actorsOwnedNotConfigured;

    return context;
  }

  async _updateObject( event, formData ) {
    this.object = foundry.utils.expandObject( formData );

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

    const { selectedActors, amount, description } = this.object;

    const transactionData = selectedActors.reduce(
      ( obj, actorId ) => {
        // can assume its only world actors
        const actor = game.actors.get( actorId );
        return {
          ...obj,
          [actorId]: new LpTransactionData( {
            amount,
            description,
            lpBefore: actor.system.lp.current,
            lpAfter: actor.system.lp.current + amount,
          } ),
        };
      },
      {}
    );

    this.resolve?.( transactionData );
    return this.close();
  }

}