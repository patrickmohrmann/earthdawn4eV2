import LpTransactionData from "../../data/advancement/lp-transaction.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class AssignLpPrompt extends HandlebarsApplicationMixin( ApplicationV2 ) {

  constructor( options = {} ) {
    super( options );
    const object = options.object || {};
    this.resolve = options.resolve;
    this.object = {
      selectedActors: object.selectedActors || [],
      amount: object.amount || "",
      description: object.description || ''
    };
  }

  static async waitPrompt( options = {} ) {
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( options ).render( true, { focus: true } );
    } );
  }

  static DEFAULT_OPTIONS = {
    id: "assign-legend-prompt",
    uniqueId: String( ++globalThis._appId ),
    classes: ['earthdawn4e', 'assign-legend'],
    tag: "form",
    window: {
      frame: true,
      title: "LOCALIZE!!! Assign LP"//game.i18n.localize( 'ED.Dialogs.Title.assignLp' ),
    },
    actions: {
      //close: AssignLpPrompt.close,
      assignLP: AssignLpPrompt._assignLP,
    },
    form: {
      handler: AssignLpPrompt.handleFormSubmission,
      submitOnChange: true,
      closeOnSubmit: false,
    },
    position: {
      width: 500,
      height: 800,
    },
  }

  static PARTS = {
    form: {
      template: 'systems/ed4e/templates/prompts/assign-legend.hbs',
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  async _prepareContext( options = {} ) {
    const context = {};
    context.object = this.object;
    context.user = game.users.filter( u => u.active )

    const actorUserActive = game.users.filter(
      u => u.active && u.character
    ).map(
      user => ( {actorId: user.character.id, actorName: user.character.name, playerName: user.name}
      )
    );
    const actorUserInactive =  game.users.filter(
      u => !u.active && u.character
    ).map(
      user => ( {actorId: user.character.id, actorName: user.character.name, playerName: user.name} )
    );
    const notGMs = game.users.filter( user => !user.isGM )
    const actorsOwnedNotConfigured = game.actors.filter(
      actor => notGMs.map(
        user => actor.testUserPermission( user,"OWNER" ) && user.character?.id !== actor.id
      ).some( Boolean )
    ).map(
      actor => ( {actorId: actor.id, actorName: actor.name} )
    );
    context.actorUserActive = actorUserActive;
    context.actorUserInactive = actorUserInactive;
    context.actorsNoUserConfigured = actorsOwnedNotConfigured;

    context.buttons = [
      {
        type: "button",
        label: game.i18n.localize('ED.Dialogs.Buttons.cancel'),
        cssClass: "cancel",
        icon: "fas fa-times",
        action: "close",
      },
      {
        type: "button",
        label: game.i18n.localize('ED.Dialogs.Buttons.ok'),
        cssClass: "assignLP",
        icon: "fas fa-check",
        action: "assignLP",
      }
    ]

    return context;
  }

  static async handleFormSubmission( event, form, formData ) {
    const data = foundry.utils.expandObject( formData.object );
    // make array if only one actor is selected
    this.object.selectedActors = [].concat( data.selectedActors || [] );
    this.object.amount = data.amount || 0;
    this.object.description = data.description || 'No description provided';
    return this.object;
  }

  static async close( options = {} ) {
    this.resolve?.(null);
    return super.close( options );
  }

  static async _assignLP( event ) {
    event.preventDefault();
    if ( !this.object.amount ) return ui.notifications.error( game.i18n.localize( 'ED.Dialogs.Errors.noLp' ) );
    // await this.submit( { preventRender: true } );


    const { selectedActors, amount, description } = this.object;
    const transactionData = selectedActors.reduce( ( obj, actorId ) => {
      if ( !actorId ) return obj; // Skip if actorId is null
      const actor = game.actors.get(actorId);
      if ( !actor ) return obj; // Skip if actor is not found
      return {
        ...obj,
        [actorId]: new LpTransactionData( {
          amount,
          description,
          lpBefore: actor.system.lp.current,
          lpAfter: actor.system.lp.current + amount,
        } ),
      };
    }, {} );

    this.resolve?.( transactionData );
    return this.close();
  }
}


/*
export class AssignLpPromptOld extends FormApplication {
  constructor(object = {}, options = {}) {
    super(object, options);
    this.resolve = options.resolve;
    this.object = {
      ...this.object,
      selectedActors: object.selectedActors || [],
      amount: object.amount || "",
      description: object.description || ''
    };
  }

  static async waitPrompt(object = {}, options = {}) {
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(object, options).render(true, { focus: true });
    });
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
    return game.i18n.localize('ED.Dialogs.Title.assignLp');
  }

  get template() {
    return 'systems/ed4e/templates/prompts/assign-legend.hbs';
  }

  activateListeners(html) {
    super.activateListeners(html);
    $(this.form.querySelector('button.cancel')).on('click', this.close.bind(this));
    $(this.form.querySelector('button.ok')).on('click', this._assignLP.bind(this));
  }

  async getData(options = {}) {
    const context = super.getData(options);
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

  async _updateObject(event, formData) {
    this._updateFormData(formData);
    const selectedActorIds = formData.selectedActors || [];
    return formData;
  }

  async _updateFormData(formData) {
    this.object.selectedActors = formData.selectedActors || [];
    this.object.amount = formData.amount || 0;
    this.object.description = formData.description || 'No description provided';
    return this.object;
  }

  async close(options = {}) {
    this.resolve?.(null);
    return super.close(options);
  }

  async _assignLP(event) {
    event.preventDefault();
    if ( !this.object.amount ) return ui.notifications.error(game.i18n.localize('ED.Dialogs.Errors.noLp'));
    await this.submit({ preventRender: true });


    const { selectedActors, amount, description } = this.object;
    const transactionData = selectedActors.reduce((obj, actorId) => {
      if (!actorId) return obj; // Skip if actorId is null
      const actor = game.actors.get(actorId);
      if (!actor) return obj; // Skip if actor is not found
      return {
        ...obj,
        [actorId]: new LpTransactionData({
          amount,
          description,
          lpBefore: actor.system.lp.current,
          lpAfter: actor.system.lp.current + amount,
        }),
      };
    }, {});

    this.resolve?.(transactionData);
    return this.close();
  }
}*/
