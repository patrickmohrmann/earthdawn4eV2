const DialogClass = foundry.applications.api.DialogV2;
const fields = foundry.data.fields;

export default class PromptFactory {

  constructor( document ) {
    this.document = document;
  }

  _promptTypeMapping = {
    "recovery": this.recoveryPrompt.bind( this ),
    "takeDamage": this.takeDamagePrompt.bind( this ),
  }

  async getPrompt( type ) {
    return this._promptTypeMapping[ type ]();
  }

  async recoveryPrompt() {
    const buttons = [];
    if ( this.document.system.characteristics.recoveryTestsRecource.value > 0 ) buttons.push( {
      action: "recovery",
      label: game.i18n.localize( "ED.Dialogs.Buttons.recovery"),
      icon: "fa-light fa-heart-circle-plus",
      class: "recovery default button-recovery",
      default: false,
      callback: _ => { return "recovery" },
    } );
    if ( this.document.system.characteristics.recoveryTestsRecource.stunRecoveryAvailabilty ) buttons.push( {
      action: "recoverStun",
      label: game.i18n.localize( "ED.Dialogs.Buttons.recoverStun"),
      icon: "fa-light fa-head-side-medical",
      class: "recoverStun default button-recoverStun",
      default: false,
      callback: _ => { return "recoverStun" },
    } );
    buttons.push( {
      action: "nightRest",
      label: game.i18n.localize( "ED.Dialogs.Buttons.nightRest"),
      icon: "fa-duotone fa-campfire",
      class: "nightRest default button-nightRest",
      default: true,
      callback: _ => { return "nightRest" },
    } );
    buttons.push( {
      action: "close",
      label: game.i18n.localize( "ED.Dialogs.Buttons.cancel"),
      icon: "fa-light fa-times",
      class: "cancel default button-cancel",
      default: false,
    } );

    return DialogClass.wait( {
      id: "recovery-mode-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes: ["earthdawn4e", "recovery-prompt"],
      window: {
        title: game.i18n.localize( "ED.Dialogs.Title.recovery" ),
        minimizable: false,
      },
      modal: false,
      buttons: buttons,
    } );
  }

  async takeDamagePrompt() {
    const formFields = {
      damage: new fields.NumberField( {
        required: true,
        name: "damage",
        initial: 1,
        integer: true,
        positive: true,
        label: "ED.Dialogs.damage",
        hint: "localize: The amount of damage to take",
      } ),
      damageType: new fields.StringField( {
        required: true,
        nullable: false,
        name: "damageType",
        initial: "standard",
        blank: false,
        label: "ED.Dialogs.damageType",
        hint: "localize: The type of damage to take",
        choices: {
          standard: "ED.Dialogs.damageStandard",
          stun: "ED.Dialogs.damageStun",
        },
      } ),
      armorType: new fields.StringField( {
        required: true,
        nullable: false,
        name: "armorType",
        initial: "physical",
        blank: false,
        label: "ED.Dialogs.armorType",
        hint: "localize: The type of armor to use",
        choices: {
          physical: "ED.Dialogs.physical",
          mystical: "ED.Dialogs.mystical",
        },
      } ),
      ignoreArmor: new fields.BooleanField( {
        required: true,
        name: "ignoreArmor",
        initial: false,
        label: "ED.Dialogs.ignoreArmor",
        hint: "localize: Whether to ignore armor when taking damage",
      } ),
    };
    return DialogClass.wait( {
      id: "take-damage-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes: ["earthdawn4e", "take-damage-prompt", "take-damage__dialog"],
      //tag: "form",
      window: {
        title: game.i18n.localize( "ED.Dialogs.Title.takeDamage" ),
        minimizable: false,
      },
      form: {
        submitOnChange: false,
        closeOnSubmit: true,
      },
      modal: false,
      buttons: [
        {
          action: "takeDamage",
          label: game.i18n.localize( "ED.Dialogs.Buttons.takeDamage"),
          icon: "fa-solid fa-heart-crack",
          class: "takeDamage default button__take-damage",
          default: false,
          callback: ( event, button, dialog ) => {
            const formData = new FormDataExtended( button.form );
            return formData.object;
          }
        },
        {
          action: "close",
          label: game.i18n.localize( "ED.Dialogs.Buttons.cancel"),
          icon: "fa-light fa-times",
          class: "cancel default button-cancel",
          default: true,
        },
      ],
      content: await renderTemplate(
        "systems/ed4e/templates/actor/prompts/take-damage-prompt.hbs",
        formFields,
      ),
      rejectClose: false,
    } );
  }

}