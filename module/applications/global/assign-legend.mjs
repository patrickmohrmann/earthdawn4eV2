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

    // actorUserActive = game.users.filter( u => u.active && u.character )
    // const userAll = game.users.filter( u => u.character )
    context.user = game.users.filter( u => u.active )
    const actorUserActive = game.users.filter( u => u.active && u.character ).map( user => ( {actorId: user.character.id, actorName: user.character.name, playerName: user.name} ) )
    const actorUserInactive =  game.users.filter( u => !u.active && u.character ).map( user => ( {actorId: user.character.id, actorName: user.character.name, playerName: user.name} ) )
    const notGMs = game.users.filter( user => !user.isGM ) 
    const actorsOwnedNotConfigured = game.actors.filter( actor => notGMs.map( user => actor.testUserPermission( user,"OWNER" ) && user.character?.id !== actor.id ).some( Boolean ) ).map( actor => ( {actorId: actor.id, actorName: actor.name} ) )
    context.actorUserActive = actorUserActive;
    context.actorUserInactive = actorUserInactive;
    context.actorsNoUserConfigured = actorsOwnedNotConfigured;

    // for ( let i = 0; i < userAll.length; i++ ) {
    //   if ( userAll[i].active === true ) {
    //     context.actorUserActive.push(
    //       {
    //       actorName: userAll[i].character.name,
    //       playerName: userAll[i].name,
    //       actorId: userAll[i].character._id,
    //       }
    //     )
    //   } else if ( userAll[i].active === false ) {
    //     context.actorUserInactive.push(
    //       {
    //       actorName: userAll[i].character.name,
    //       playerName: userAll[i].name,
    //       actorId: userAll[i].character._id,
    //       }
    //     )
    //   } 
    // }
    // const ownedCharacters = game.actors.filter( a => a.type === 'character' && a.hasPlayerOwner )
    // for ( let i = 0; i < ownedCharacters.length; i++ ) {
    //   for ( let x = 0; x < context.actorUserActive.length; x++ ) {
    //     if ( ownedCharacters[i].id !== context.actorUserActive[x].actorId ) {
    //       for ( let y = 0; y < context.actorUserInactive.length; y++ ) { 
    //         if ( ownedCharacters[i].id !== context.actorUserInactive[y].actorId ) {

    //           context.actorsNoUserConfigured.push(
    //             {
    //             actorName: ownedCharacters[i].name,
    //             actorId: ownedCharacters[i]._id,
    //             }
    //           )
    //         } 
    //       }
    //     }
    //   }
    // }
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