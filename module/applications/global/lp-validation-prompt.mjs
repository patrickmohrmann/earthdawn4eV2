// export default class LpValidationPrompt extends FormApplication {
//     constructor(object, options = {}) {
//         super(object, options);
//         this.item = object;
//     }

//     static get defaultOptions() {
//         return mergeObject(super.defaultOptions, {
//             id: "lp-validation-prompt",
//             title: "Legend Point Cost",
//             template: "systems/ed4e/templates/prompts-popups/lp-validation-prompt.hbs",
//             width: 400,
//             height: "auto",
//             classes: ["yourSystemName", "lp-validation"],
//             submitOnChange: true,
//             closeOnSubmit: false
//         });
//     }

//     getData() {
//         // This method provides data to the template. Adjust as necessary.
//         return {
//             item: this.item
//         };
//     }

//     activateListeners(html) {
//         super.activateListeners(html);

//         // Enable the OK button only if the "confirm-anyway" checkbox is checked
//         html.find('input[name="confirm-anyway"]').change(event => {
//             const isChecked = event.currentTarget.checked;
//             html.find('button[name="ok"]').prop('disabled', !isChecked);
//         });

//         // Bind the Free button click event
//         html.find('button[name="free"]').click(this._onFree.bind(this));

//         // Bind the OK button click event
//         html.find('button[name="ok"]').click(this._onOk.bind(this));

//         // Bind the Cancel button click event
//         html.find('button[name="cancel"]').click(this._onCancel.bind(this));
//     }

    
    

//     async _updateObject(event, formData) {
//         event.preventDefault(); // Prevent the default form submission behavior

//         // Process the formData
//         console.log("Form data submitted:", formData);

//         // Example: Update this.item based on formData
//         // This is a placeholder. Replace with actual logic to update your item or other entities.
//         for (const [key, value] of Object.entries(formData)) {
//             if (this.item.hasOwnProperty(key)) {
//                 this.item[key] = value;
//             }
//         }

//         console.log("Updated item:", this.item);

//         // Optionally, close the form after updating
//         this.close();
//     }

//     async _onFree(event) {
//         event.preventDefault();
//         // Implement your logic for the Free action
//         console.log("Free action triggered");
//         this.close(); // Close the dialog
//     }

//     async _onCancel(event) {
//         event.preventDefault();
//         // Implement your logic for the Cancel action
//         console.log("Cancel action triggered");
//         this.close(); // Close the dialog
//     }

// }

import LpSpendingTransactionData from "../../data/advancement/lp-spending-transaction.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class LpValidationPrompt extends HandlebarsApplicationMixin( ApplicationV2 ) {

  constructor( options = {}, actor ) {
    super( options );
    const object = options.object || {};
    this.resolve = options.resolve;
    this.object = {
      confirmAnyway: false,
      actor: actor,
      bookingResult: ""
    };
  }

  static async waitPrompt( options = {} ) {
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( options ).render( true, { focus: true } );
    } );
  }

  static DEFAULT_OPTIONS = {
    id: "validate-lp-prompt",
    uniqueId: String( ++globalThis._appId ),
    classes: ['earthdawn4e', 'validate-Lp'],
    tag: "form",
    window: {
      frame: true,
      title: "LOCALIZE!!! Validate LP"//game.i18n.localize( 'ED.Dialogs.Title.assignLp' ),
    },
    actions: {
      //close: AssignLpPrompt.close,
      bookLp: LpValidationPrompt._bookLp,
      bookFree: LpValidationPrompt._bookFree
    },
    form: {
      handler: LpValidationPrompt.#onFormSubmission,
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
      template: "systems/ed4e/templates/prompts-popups/lp-validation-prompt.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  async _prepareContext( options = {} ) {
    const context = {};
    context.object = this.object;


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
        cssClass: "bookLp",
        icon: "fas fa-check",
        action: "bookLp",
      },
      {
        type: "button",
        label: game.i18n.localize('ED.Dialogs.Buttons.ok'),
        cssClass: "bookFree",
        icon: "fas fa-check",
        action: "bookFree",
      }
    ]

    return context;
  }

  static async #onFormSubmission( event, form, formData ) {
    const data = foundry.utils.expandObject( formData.object );
    // make array if only one actor is selected
    this.object.confirmAnyway = data.confirmAnyway 
    return this.object;
  }

  static async close( options = {} ) {
    this.resolve?.(null);
    return super.close( options );
  }

  static async _bookLp( event ) {
    event.preventDefault();
    this.object.bookingResult = "free"
    const transactionData = new LpSpendingTransactionData({
        entityType: "item.type",
        type: "spendings",
        amount: 50,
        date: new Date(),
        // itemUuid: "item.uuid",
        // lpBefore: this.object.actor.object.system.lp.current,
        // lpAfter: this.object.actor.object.system.lp.current - 50,
        name: "item.name",
        // description: "description"
      })
      const transactionSuccess = await this.object.actor.object.addLpTransaction("spendings", transactionData);

    this.resolve?.( transactionSuccess );
    return this.close();
  }
  static async _bookFree( event ) {
    event.preventDefault();
    this.object.bookingResult = "free"
    const transactionData = new LpSpendingTransactionData({
        entityType: "item.type",
        type: "spendings",
        amount: 50,
        date: new Date(),
        // itemUuid: "item.uuid",
        // lpBefore: this.object.actor.object.system.lp.current,
        // lpAfter: this.object.actor.object.system.lp.current - 50,
        name: "item.name",
        // description: "description"
      })
      const transactionSuccess = await this.object.actor.object.addLpTransaction("spendings", transactionData);

    this.resolve?.( transactionSuccess );
    return this.close();
  }
}