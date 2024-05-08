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
    const activeUser = game.users.filter( u => u.active )
    const inactiveUser = game.users.filter( u => !u.active )
    context.user = game.users.filter( u => u.active )
    context.actorUserActive = [];
    context.actorUserInactive = [];
    for ( let i = 0; i < activeUser.length; i++ ) {
      let user = activeUser[i]
      if ( user.character ){
        context.actorUserActive.push(
          {
          actorName: user.character.name,
          playerName: user.name,
          actorId: user.character._id,
          }
        )
      }
    }
    for ( let i = 0; i < inactiveUser.length; i++ ) {
      let user = inactiveUser[i]
      if ( user.character ){
        context.actorUserInactive.push(
          {
          actorName: user.character.name,
          playerName: user.name
          }
        )
      }
    }
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


      // variable -- getting result from input field
      const resultLp = document.getElementById("legendPoints").value;
      const resultDescription = document.getElementById("description").value;
      
      if (resultLp !== ''){

        const actors = canvas.tokens.controlled.map(token => token.actor);
      // find all selected tokens and map them to the actor
      const context = this.getData()
      const actors1 = game.actors.map( key => key.context.object.actorUserActive.actorId )
      // const actors = game.actors.get(context.object.)
      // update the legendpoint total of the actor with the result of the pop up input
      const transactionData = {
          amount: Number( resultLp ),
          lpBefore: actors.system.lp.current,
          lpAfter: actors.system.lp.current + Number( resultLp ),
          description: resultDescription,
      }
      actors.addLpTransaction( "earnings", transactionData)
    }

    await this.submit( {preventRender: true} );

    this.resolve?.( this.object );
    return this.close();
  }

}