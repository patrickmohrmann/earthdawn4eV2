import LpIncreaseTemplate from "../../data/item/templates/lp-increase.mjs";
import ActorEd from "../../documents/actor.mjs";
import ItemEd from "../../documents/item.mjs";
import LearnableTemplate from "../../data/item/templates/learnable.mjs";

const DialogClass = foundry.applications.api.DialogV2;
const fields = foundry.data.fields;

/**
 * A factory class for creating prompts for various actions.
 */
export default class PromptFactory {

  constructor( document ) {
    if ( new.target === PromptFactory ) {
      throw new TypeError( "Cannot construct PromptFactory instances directly; use `fromDocument static method." );
    }
    this.document = document;
  }

  _promptTypeMapping = {};

  /**
   * A {@link DialogV2Button} object for a button with data action "cancel".
   * @type {DialogV2Button}
   */
  static get cancelButton() {
    return {
      action:  "close",
      label:   "ED.Dialogs.Buttons.cancel",
      icon:    "fa-light fa-times",
      class:   "cancel button-cancel",
      default: false,
    };
  }

  /**
   * A {@link DialogV2Button} object for a button with data action "free".
   * @type {DialogV2Button}
   */
  static get freeButton() {
    return {
      action:  "free",
      label:   "ED.Dialogs.Buttons.free",
      icon:    "fa-thin fa-turn-up",
      class:   "free button-free",
      default: false,
    };
  }

  /**
   * A {@link DialogV2Button} object for a button with data action "spendLp".
   * @type {DialogV2Button}
   */
  static get spendLpButton() {
    return {
      action:  "spendLp",
      label:   "ED.Dialogs.Buttons.spendLp",
      icon:    "fa-solid fa-turn-up",
      class:   "spendLp button-spendLp",
      default: false,
    };
  }

  static get completeButton() {
    return {
      action:  "complete",
      label:   "ED.Dialogs.Buttons.complete",
      icon:    "fa-light fa-check",
      class:   "complete button-complete",
      default: false,
    };
  }

  static get goBackButton() {
    return {
      action:   "goBack",
      label:    "ED.Dialogs.Buttons.goBack",
      icon:     "fa-light fa-arrow-left",
      cssClass: "button-go-back",
      default:  false,
    };
  }

  static get continueButton() {
    return {
      action:   "continue",
      label:    "ED.Dialogs.Buttons.continue",
      icon:     "fa-light fa-arrow-right",
      cssClass: "button-continue",
      default:  false,
    };
  }

  /**
   * A {@link DialogV2Button} object for a button with data action "versatility".
   * @type {DialogV2Button}
   */
  static get versatilityButton() {
    return {
      action:  "versatility",
      label:   "ED.Dialogs.Buttons.versatility",
      icon:    "fa-sharp-duotone fa-solid fa-shapes",
      class:   "versatility button-versatility",
      default: false,
    };
  }

  /**
   * Creates an instance of the appropriate factory class based on the document type.
   * @param {object} document - The document object.
   * @returns {PromptFactory} - An instance of the appropriate factory class.
   * @throws {TypeError} - If no factory class is found for the document type.
   */
  static fromDocument( document ) {
    const FactoryClass = document instanceof ActorEd ? ActorPromptFactory
      : document instanceof ItemEd ? ItemPromptFactory
        : null;
    if ( !FactoryClass ) {
      throw new TypeError( `No factory class found for document type: ${document.type}` );
    }
    return new FactoryClass( document );
  }

  /**
   * Retrieves a prompt based on the specified type.
   * @param {string} type - The type of prompt to retrieve.
   * @returns {Promise} - A promise that resolves to the result of the prompt.
   */
  async getPrompt( type ) {
    return this._promptTypeMapping[type]();
  }

}

class ActorPromptFactory extends PromptFactory {

  _promptTypeMapping = {
    recovery:   this._recoveryPrompt.bind( this ),
    takeDamage: this._takeDamagePrompt.bind( this ),
    jumpUp:     this._jumpUpPrompt.bind( this ),
    knockDown:  this._knockDownPrompt.bind( this ),
  };

  async _recoveryPrompt() {
    const buttons = [];
    if ( this.document.system.characteristics.recoveryTestsResource.value > 0 ) buttons.push( {
      action:  "recovery",
      label:   "ED.Dialogs.Buttons.recovery",
      icon:    "fa-light fa-heart-circle-plus",
      class:   "recovery default button-recovery",
      default: false
    } );
    if ( this.document.system.characteristics.recoveryTestsResource.stunRecoveryAvailable ) buttons.push( {
      action:  "recoverStun",
      label:   "ED.Dialogs.Buttons.recoverStun",
      icon:    "fa-light fa-head-side-medical",
      class:   "recoverStun default button-recoverStun",
      default: false
    } );
    buttons.push( {
      action:  "nightRest",
      label:   "ED.Dialogs.Buttons.nightRest",
      icon:    "fa-duotone fa-campfire",
      class:   "nightRest default button-nightRest",
      default: true
    } );
    buttons.push( this.constructor.cancelButton() );

    return DialogClass.wait( {
      id:       "recovery-mode-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes:  [ "earthdawn4e", "recovery-prompt" ],
      window:   {
        title:       "ED.Dialogs.Title.recovery",
        minimizable: false
      },
      modal:   false,
      buttons: buttons
    } );
  }

  async _takeDamagePrompt() {
    const formFields = {
      damage: new fields.NumberField( {
        required: true,
        name:     "damage",
        initial:  1,
        integer:  true,
        positive: true,
        label:    "ED.Dialogs.damage",
        hint:     "localize: The amount of damage to take"
      } ),
      damageType: new fields.StringField( {
        required: true,
        nullable: false,
        name:     "damageType",
        initial:  "standard",
        blank:    false,
        label:    "ED.Dialogs.damageType",
        hint:     "localize: The type of damage to take",
        choices:  {
          standard: "ED.Dialogs.damageStandard",
          stun:     "ED.Dialogs.damageStun"
        }
      } ),
      armorType: new fields.StringField( {
        required: true,
        nullable: false,
        name:     "armorType",
        initial:  "physical",
        blank:    false,
        label:    "ED.Dialogs.armorType",
        hint:     "localize: The type of armor to use",
        choices:  {
          physical: "ED.Dialogs.physical",
          mystical: "ED.Dialogs.mystical"
        }
      } ),
      ignoreArmor: new fields.BooleanField( {
        required: true,
        name:     "ignoreArmor",
        initial:  false,
        label:    "ED.Dialogs.ignoreArmor",
        hint:     "localize: Whether to ignore armor when taking damage"
      } )
    };
    return DialogClass.wait( {
      id:       "take-damage-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes:  [ "earthdawn4e", "take-damage-prompt", "take-damage__dialog" ],
      // tag: "form",
      window:   {
        title:       "ED.Dialogs.Title.takeDamage",
        minimizable: false
      },
      form: {
        submitOnChange: false,
        closeOnSubmit:  true
      },
      modal:   false,
      buttons: [
        {
          action:   "takeDamage",
          label:    "ED.Dialogs.Buttons.takeDamage",
          icon:     "fa-solid fa-heart-crack",
          class:    "takeDamage default button__take-damage",
          default:  false,
          callback: ( event, button, _ ) => {
            const formData = new FormDataExtended( button.form );
            return formData.object;
          }
        },
        this.constructor.cancelButton()
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

    const noAbilityButton = this.constructor.cancelButton();
    noAbilityButton.label = "ED.Dialogs.Buttons.noAbility";
    buttons.push( noAbilityButton );

    return DialogClass.wait( {
      rejectClose: false,
      id:          "jump-up-prompt",
      uniqueId:    String( ++globalThis._appId ),
      classes:     [ "earthdawn4e", "jump-up-prompt jump-up flexcol" ],
      window:      {
        title:       "ED.Dialogs.Title.jumpUp",
        minimizable: false
      },
      modal:   false,
      buttons: buttons
    } );
  }

  async _knockDownPrompt() {
    const buttons = await this._getAbilityButtons( "knock-down" );

    const noAbilityButton = this.constructor.cancelButton();
    noAbilityButton.label = "ED.Dialogs.Buttons.noAbility";
    buttons.push( noAbilityButton );

    return DialogClass.wait( {
      rejectClose: false,
      id:          "knock-down-prompt",
      uniqueId:    String( ++globalThis._appId ),
      classes:     [ "earthdawn4e", "knock-down-prompt knockdown flexcol" ],
      window:      {
        title:       "ED.Dialogs.Title.knockDown",
        minimizable: false
      },
      modal:   false,
      buttons: buttons
    } );
  }

  async _getAbilityButtons( edid ) {
    const abilities = this.document.getItemsByEdid( edid );
    return abilities.map( ( ability ) => {
      return {
        action:  ability.uuid,
        label:   ability.name,
        icon:    "",
        class:   `button-${ edid } ${ ability.name }`,
        default: false
      };
    } );
    // TODO: adapt CSS to overwrite class "form-footer" with flexcol
  }

}

class ItemPromptFactory extends PromptFactory {

  _promptTypeMapping = {
    lpIncrease:   this._lpIncreasePrompt.bind( this ),
    learnAbility: this._learnAbilityPrompt.bind( this ),

  };

  async _lpIncreasePrompt() {
    if ( !this.document.system.hasMixin( LpIncreaseTemplate ) ) {
      throw new Error( "Item must be a subclass of LpIncreaseTemplate to use this prompt." );
    }

    const validationTemplate = "systems/ed4e/templates/advancement/advancement-requirements.hbs";
    const content = await renderTemplate(
      validationTemplate,
      {
        render:             { requirements: true },
        writtenRules:       this.document?.system?.increaseRules,
        requirementGroups: this.document?.system?.increaseValidationData ?? {},
      },
    );

    return DialogClass.wait( {
      id:       "lp-increase-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes:  [ "earthdawn4e", "lp-increase-prompt" ],
      window:   {
        title:       "ED.Dialogs.Title.lpIncrease",
        minimizable: false
      },
      modal:   false,
      content,
      buttons: [
        this.constructor.freeButton,
        this.constructor.spendLpButton,
        this.constructor.cancelButton
      ],
      rejectClose: false,
    } );
  }

  async _learnAbilityPrompt() {
    if ( !this.document.system.hasMixin( LearnableTemplate ) ) {
      throw new Error( "Item must be a subclass of LearnableTemplate to use this prompt." );
    }

    const content = `
    <p>${ game.i18n.localize( "ED.Dialogs.learnOnZeroOrOne" ) }</p>
    `;

    return DialogClass.wait( {
      id:       "learn-ability-prompt",
      uniqueId: String( ++globalThis._appId ),
      classes:  [ "earthdawn4e", "learn-ability-prompt" ],
      window:   {
        title:       "ED.Dialogs.Title.learnAbility",
        minimizable: false
      },
      modal:   false,
      content,
      buttons: [
        {
          action:  "add",
          label:   "ED.Dialogs.Buttons.add",
          icon:    "fa-thin fa-plus",
          class:   "free button-add",
          default: false,
        },
        {
          action:  "learn",
          label:   "ED.Dialogs.Buttons.learn",
          icon:    "fa-solid fa-turn-up",
          class:   "spendLp button-learn",
          default: false,
        },
        this.constructor.cancelButton
      ],
      rejectClose: false,
    } );
  }
}