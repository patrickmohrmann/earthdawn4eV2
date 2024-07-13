const DialogClass = foundry.applications.api.DialogV2;
const fields = foundry.data.fields;

export default class PromptFactory {

  constructor( document ) {
    this.document = document;
  }

  _promptTypeMapping = {
    recovery: this._recoveryPrompt.bind( this ),
    takeDamage: this._takeDamagePrompt.bind( this ),
    jumpUp: this._jumpUpPrompt.bind( this ),
    knockDown: this._knockDownPrompt.bind( this )
  };

  /**
   * Generates a {@link DialogV2Button} object for a cancel button.
   * It provides a standardized way to create a cancel button configuration
   * for dialogs within the application, ensuring consistency in appearance and behavior.
   * @param {boolean} isDefaultButton - Determines if the cancel button should be marked as the default action.
   * @returns {DialogV2Button} An object containing properties for the cancel button's action, label, icon, CSS class, and default status.
   */
  static getCancelButtonConfig( isDefaultButton = true ) {
    return {
      action: "close", // The action to be taken when the button is clicked, here it's to close the dialog.
      label: "ED.Dialogs.Buttons.cancel", // The text label for the button, localized.
      icon: "fa-light fa-times", // The icon class from FontAwesome, here using a light variant of the 'times' icon.
      class: "cancel default button-cancel", // Additional CSS classes for styling the button.
      default: isDefaultButton // Marks this button as the default action, affecting its appearance and behavior.
    };
  }

  async getPrompt( type ) {
    return this._promptTypeMapping[type]();
  }

  async _recoveryPrompt() {
    const buttons = [];
    if ( this.document.system.characteristics.recoveryTestsResource.value > 0 ) buttons.push( {
      action: "recovery",
      label: "ED.Dialogs.Buttons.recovery",
      icon: "fa-light fa-heart-circle-plus",
      class: "recovery default button-recovery",
      default: false
    } );
    if ( this.document.system.characteristics.recoveryTestsResource.stunRecoveryAvailable ) buttons.push( {
      action: "recoverStun",
      label: "ED.Dialogs.Buttons.recoverStun",
      icon: "fa-light fa-head-side-medical",
      class: "recoverStun default button-recoverStun",
      default: false
    } );
    buttons.push( {
      action: "nightRest",
      label: "ED.Dialogs.Buttons.nightRest",
      icon: "fa-duotone fa-campfire",
      class: "nightRest default button-nightRest",
      default: true
    } );
    buttons.push( this.constructor.getCancelButtonConfig() );

    return DialogClass.wait( {
      id: "recovery-mode-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes: [ "earthdawn4e", "recovery-prompt" ],
      window: {
        title: "ED.Dialogs.Title.recovery",
        minimizable: false
      },
      modal: false,
      buttons: buttons
    } );
  }

  async _takeDamagePrompt() {
    const formFields = {
      damage: new fields.NumberField( {
        required: true,
        name: "damage",
        initial: 1,
        integer: true,
        positive: true,
        label: "ED.Dialogs.damage",
        hint: "localize: The amount of damage to take"
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
          stun: "ED.Dialogs.damageStun"
        }
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
          mystical: "ED.Dialogs.mystical"
        }
      } ),
      ignoreArmor: new fields.BooleanField( {
        required: true,
        name: "ignoreArmor",
        initial: false,
        label: "ED.Dialogs.ignoreArmor",
        hint: "localize: Whether to ignore armor when taking damage"
      } )
    };
    return DialogClass.wait( {
      id: "take-damage-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes: [ "earthdawn4e", "take-damage-prompt", "take-damage__dialog" ],
      // tag: "form",
      window: {
        title: "ED.Dialogs.Title.takeDamage",
        minimizable: false
      },
      form: {
        submitOnChange: false,
        closeOnSubmit: true
      },
      modal: false,
      buttons: [
        {
          action: "takeDamage",
          label: "ED.Dialogs.Buttons.takeDamage",
          icon: "fa-solid fa-heart-crack",
          class: "takeDamage default button__take-damage",
          default: false,
          callback: ( event, button, _ ) => {
            const formData = new FormDataExtended( button.form );
            return formData.object;
          }
        },
        this.constructor.getCancelButtonConfig()
      ],
      content: await renderTemplate(
        "systems/ed4e/templates/actor/prompts/take-damage-prompt.hbs",
        formFields
      ),
      rejectClose: false
    } );
  }

  async _jumpUpPrompt() {
    const buttons = await this._getAbilityButtons( "jump-up" );

    const noAbilityButton = this.constructor.getCancelButtonConfig();
    noAbilityButton.label = "ED.Dialogs.Buttons.noAbility";
    buttons.push( noAbilityButton );

    return DialogClass.wait( {
      rejectClose: false,
      id: "jump-up-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes: [ "earthdawn4e", "jump-up-prompt jump-up flexcol" ],
      window: {
        title: "ED.Dialogs.Title.jumpUp",
        minimizable: false
      },
      modal: false,
      buttons: buttons
    } );
  }

  async _knockDownPrompt() {
    const buttons = await this._getAbilityButtons( "knock-down" );

    const noAbilityButton = this.constructor.getCancelButtonConfig();
    noAbilityButton.label = "ED.Dialogs.Buttons.noAbility";
    buttons.push( noAbilityButton );

    return DialogClass.wait( {
      rejectClose: false,
      id: "knock-down-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes: [ "earthdawn4e", "knock-down-prompt knockdown flexcol" ],
      window: {
        title: "ED.Dialogs.Title.knockDown",
        minimizable: false
      },
      modal: false,
      buttons: buttons
    } );
  }

  async _getAbilityButtons( edid ) {
    const abilities = this.document.getItemsByEdid( edid );
    return abilities.map( ( ability ) => {
      return {
        action: ability.id,
        label: ability.name,
        icon: "",
        class: `button-${ edid } ${ ability.name }`,
        default: false
      };
    } );
    // TODO: adapt CSS to overwrite class "form-footer" with flexcol
  }
}