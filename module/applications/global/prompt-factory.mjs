const DialogClass = foundry.applications.api.DialogV2;
const fields = foundry.data.fields;

export default class PromptFactory {
  constructor(document) {
    this.document = document;
  }

  _promptTypeMapping = {
    recovery: this.recoveryPrompt.bind(this),
    takeDamage: this.takeDamagePrompt.bind(this),
    jumpUp: this.jumpUpPrompt.bind(this),
  };

  /**
   * Generates a {@link DialogV2Button} object for a cancel button.
   * It provides a standardized way to create a cancel button configuration
   * for dialogs within the application, ensuring consistency in appearance and behavior.
   *
   * @param {boolean} isDefaultButton - Determines if the cancel button should be marked as the default action.
   * @returns {DialogV2Button} An object containing properties for the cancel button's action, label, icon, CSS class, and default status.
   */
  static getCancelButtonConfig(isDefaultButton = true) {
    return {
      action: 'close', // The action to be taken when the button is clicked, here it's to close the dialog.
      label: 'ED.Dialogs.Buttons.cancel', // The text label for the button, localized.
      icon: 'fa-light fa-times', // The icon class from FontAwesome, here using a light variant of the 'times' icon.
      class: 'cancel default button-cancel', // Additional CSS classes for styling the button.
      default: isDefaultButton, // Marks this button as the default action, affecting its appearance and behavior.
    };
  }

  async getPrompt(type) {
    return this._promptTypeMapping[type]();
  }

  async recoveryPrompt() {
    const buttons = [];
    if (this.document.system.characteristics.recoveryTestsRecource.value > 0)
      buttons.push({
        action: 'recovery',
        label: 'ED.Dialogs.Buttons.recovery',
        icon: 'fa-light fa-heart-circle-plus',
        class: 'recovery default button-recovery',
        default: false,
        callback: (_) => {
          return 'recovery';
        },
      });
    if (this.document.system.characteristics.recoveryTestsRecource.stunRecoveryAvailabilty)
      buttons.push({
        action: 'recoverStun',
        label: 'ED.Dialogs.Buttons.recoverStun',
        icon: 'fa-light fa-head-side-medical',
        class: 'recoverStun default button-recoverStun',
        default: false,
        callback: (_) => {
          return 'recoverStun';
        },
      });
    buttons.push({
      action: 'nightRest',
      label: 'ED.Dialogs.Buttons.nightRest',
      icon: 'fa-duotone fa-campfire',
      class: 'nightRest default button-nightRest',
      default: true,
      callback: (_) => {
        return 'nightRest';
      },
    });
    buttons.push( this.constructor.getCancelButtonConfig() );

    return DialogClass.wait({
      rejectClose: false,
      id: 'recovery-mode-prompt',
      uniqueId: String(++globalThis._appId),
      classes: ['earthdawn4e', 'recovery-prompt'],
      window: {
        title: game.i18n.localize('ED.Dialogs.Title.recovery'),
        minimizable: false,
      },
      modal: false,
      buttons: buttons,
    });
  }

  async takeDamagePrompt() {
    const formFields = {
      damage: new fields.NumberField({
        required: true,
        name: 'damage',
        initial: 1,
        integer: true,
        positive: true,
        label: 'ED.Dialogs.damage',
        hint: 'localize: The amount of damage to take',
      }),
      damageType: new fields.StringField({
        required: true,
        nullable: false,
        name: 'damageType',
        initial: 'standard',
        blank: false,
        label: 'ED.Dialogs.damageType',
        hint: 'localize: The type of damage to take',
        choices: {
          standard: 'ED.Dialogs.damageStandard',
          stun: 'ED.Dialogs.damageStun',
        },
      }),
      armorType: new fields.StringField({
        required: true,
        nullable: false,
        name: 'armorType',
        initial: 'physical',
        blank: false,
        label: 'ED.Dialogs.armorType',
        hint: 'localize: The type of armor to use',
        choices: {
          physical: 'ED.Dialogs.physical',
          mystical: 'ED.Dialogs.mystical',
        },
      }),
      ignoreArmor: new fields.BooleanField({
        required: true,
        name: 'ignoreArmor',
        initial: false,
        label: 'ED.Dialogs.ignoreArmor',
        hint: 'localize: Whether to ignore armor when taking damage',
      }),
    };
    return DialogClass.wait({
      rejectClose: false,
      id: 'take-damage-prompt',
      uniqueId: String(++globalThis._appId),
      classes: ['earthdawn4e', 'take-damage-prompt', 'take-damage__dialog'],
      //tag: "form",
      window: {
        title: game.i18n.localize('ED.Dialogs.Title.takeDamage'),
        minimizable: false,
      },
      form: {
        submitOnChange: false,
        closeOnSubmit: true,
      },
      modal: false,
      buttons: [
        {
          action: 'takeDamage',
          label: 'ED.Dialogs.Buttons.takeDamage',
          icon: 'fa-solid fa-heart-crack',
          class: 'takeDamage default button__take-damage',
          default: false,
          callback: (event, button, dialog) => {
            const formData = new FormDataExtended(button.form);
            return formData.object;
          },
        },
        this.constructor.getCancelButtonConfig(),
      ],
      content: await renderTemplate('systems/ed4e/templates/actor/prompts/take-damage-prompt.hbs', formFields),
    });
  }

  async jumpUpPrompt() {
    const jumpUpAbilities = this.document.getItemsByEdid('jump-up');
    if ( foundry.utils.isEmpty( jumpUpAbilities ) ) return;

    const buttons = jumpUpAbilities.map((ability) => {
      return {
        action: ability.id,
        label: ability.name,
        icon: '',
        class: `button-jump-up ${ability.name}`,
        default: false,
        callback: (_) => {
          return ability.id;
        },
      };
    });
    const noAbilityButton = this.constructor.getCancelButtonConfig();
    noAbilityButton.label = game.i18n.localize( 'ED.Dialogs.Buttons.noAbility' );
    buttons.push( noAbilityButton );

    // TODO: adapt CSS to overwrite class "form-footer" with flexcol
    return DialogClass.wait( {
      rejectClose: false,
      id: 'jump-up-prompt',
      uniqueId: String( ++globalThis._appId ),
      classes: ["earthdawn4e", "jump-up-prompt jump-up flexcol"],
      window: {
        title: game.i18n.localize( "ED.Dialogs.Title.jumpUp" ),
        minimizable: false,
      },
      modal: false,
      buttons: buttons,
    } );
  }
}