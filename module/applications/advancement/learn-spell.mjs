import ED4E from "../../config.mjs";
import PromptFactory from "../global/prompt-factory.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class LearnSpellPrompt extends HandlebarsApplicationMixin( ApplicationV2 ) {

  /**
   * @inheritDoc
   * @param {Partial<Configuration>} [options]  Options used to configure the Application instance.
   * @param {Function} options.resolve          The function to call when the dialog is resolved.
   * @param {ActorEd} options.actor             The actor that is learning the spell.
   * @param {ItemEd} options.spell              The spell that is being learned.
   */
  constructor( options ) {
    super( options );

    this.resolve = options.resolve;
    this.actor = options.actor;
    this.spell = options.spell;

    const fields = foundry.data.fields;
    this.dataModel = new class extends foundry.abstract.DataModel {
      static defineSchema() {
        return {
          lpCost:       new fields.NumberField( {
            min:      0,
            integer:  true,
            step:     1,
            initial:  options.spell.system.requiredLpToLearn,
            label:    "ED.Data.Other.Labels.lpCost",
            hint:     "ED.Data.Other.Hints.lpCost",
          } ),
          patterncraft: new fields.BooleanField( {
            initial:  true,
            label:    "ED.Data.Other.Labels.patterncraftToLearnSpell",
            hint:     "ED.Data.Other.Hints.patterncraftToLearnSpell",
          } ),
          freePatterncraft: new fields.BooleanField( {
            initial:  true,
            label:    "ED.Data.Other.Labels.freePatterncraftToLearnSpell",
            hint:     "ED.Data.Other.Hints.freePatterncraftToLearnSpell",
          } ),
          useRecoveryTest: new fields.BooleanField( {
            initial:  true,
            label:    "ED.Data.Other.Labels.useRecoveryTestToLearnSpell",
            hint:     "ED.Data.Other.Hints.useRecoveryTestToLearnSpell",
          } ),
          patterncraftSuccessful: new fields.BooleanField( {
            initial:  false,
            label:    "ED.Data.Other.Labels.patterncraftSuccessful",
            hint:     "ED.Data.Other.Hints.patterncraftSuccessful",
          } ),
          teacher:      new fields.BooleanField( {
            initial:  true,
            label:    "ED.Data.Other.Labels.teacherToLearnSpell",
            hint:     "ED.Data.Other.Hints.teacherToLearnSpell",
          } ),
          teacherRank:  new fields.NumberField( {
            min:      0,
            integer:  true,
            step:     1,
            initial:  0,
            label:    "ED.Data.Other.Labels.teacherRank",
            hint:     "ED.Data.Other.Hints.teacherRank",
          } ),
          teacherTestSuccessful: new fields.BooleanField( {
            initial:  false,
            label:    "ED.Data.Other.Labels.teacherTestSuccessful",
            hint:     "ED.Data.Other.Hints.teacherTestSuccessful",
          } ),
          learnDifficulty: new fields.NumberField( {
            min:      0,
            integer:  true,
            step:     1,
            initial:  options.spell.system.learningDifficulty,
            label:    "ED.Data.Other.Labels.learnDifficulty",
            hint:     "ED.Data.Other.Hints.learnDifficulty",
          } ),
        };
      }
    };
  }

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    id:      "learn-spell-prompt",
    classes: [ "earthdawn4e", "learn-spell" ],
    tag:     "form",
    window:  {
      frame: true,
      icon:  "fa-thin fa-scroll",
      title: "ED.Dialogs.LearnSpell.title",
    },
    actions: {
      useTeacherSpellcasting: this._spellcastingTest,
      patterncraftTest:       this._patterncraftTest,
      free:                   this._learnAndClose,
      spendLp:                this._learnAndClose,
    },
    form:    {
      handler:        LearnSpellPrompt.#onFormSubmission,
      submitOnChange: true,
      closeOnSubmit:  false,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    form: {
      template: "systems/ed4e/templates/actor/legend-points/learn-spell.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  };

  /**
   * Wait for dialog to be resolved.
   * @param {Partial<Configuration>} [options]  Options used to configure the Application instance.
   * @param {object} [options.actor]            The actor to which the lpHistory belongs.
   * @param {object} [options.resolve]          The function to call when the dialog is resolved.
   */
  static async waitPrompt( options = {} ) {
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( options ).render( true, { focus: true } );
    } );
  }

  static async #onFormSubmission( event, form, formData ) {
    const data = foundry.utils.expandObject( formData.object );
    this.dataModel.updateSource( data );
    this.render();
  }

  static async _spellcastingTest( _ ) {
    const roll = await this.actor.rollAbility(
      this.actor.getSingleItemByEdid(
        game.settings.get( "ed4e", "edidSpellcasting" ),
        "talent",
      ),
      {
        target:     { base: this.spell.system.learningDifficulty },
        chatFlavor: game.i18n.format(
          "ED.Dialogs.LearnSpell.chatFlavorLearnSpellTeacherTest : XY is trying to get help from their teacher to learn a spell.",
          { spell: this.spell.name },
        ),
      }
    );
    if ( !roll ) return;

    if ( roll.isSuccess ) {
      this.dataModel.updateSource( { teacherTestSuccessful: true } );
      this.render();
    }
    return roll;
  }

  static async _patterncraftTest( _ ) {
    const modifiers = {};
    if ( this.dataModel.teacherTestSuccessful ) modifiers[ game.i18n.localize( "X-Localize: Teacher Bonus Must be without periods" ) ] = this.dataModel.teacherRank;

    const roll = await this.actor.rollAbility(
      this.actor.getSingleItemByEdid(
        game.settings.get( "ed4e", "edidPatterncraft" ),
        "talent"
      ),
      {
        target:     { base: this.spell.system.learningDifficulty },
        step:       { modifiers },
        chatFlavor: game.i18n.format(
          "ED.Dialogs.LearnSpell.chatFlavorLearnSpellpatterncraft : XY is trying to learn a new spell.",
          { spell: this.spell.name },
        ),
      }
    );
    if ( !roll ) return;

    if ( roll.isSuccess ) this.dataModel.updateSource( { patterncraftSuccessful: true } );
    if ( this.dataModel.useRecoveryTest ) {
      if ( this.dataModel.freePatterncraft ) {
        this.dataModel.updateSource( { freePatterncraft: false } );
      } else {
        this.actor.update( {
          "system.characteristics.recoveryTestsResource.value": this.actor.system.characteristics.recoveryTestsResource.value - 1
        } );
      }
      this.render();
    }
    return roll;
  }

  static async _learnAndClose( event, target ) {
    this.resolve?.( target.dataset.action );
    return this.close();
  }

  async _prepareContext( _ ) {
    const context = {};
    context.source = this.dataModel;
    context.fields = this.dataModel.schema.fields;

    context.actor = this.actor;
    context.actorFields = this.actor.system.schema.fields;
    context.hasDamage = this.actor.hasWounds( "standard" ) || this.actor.hasDamage( "standard" );

    context.spell = this.spell;

    context.config = ED4E;

    context.buttons = [
      PromptFactory.freeButton,
      PromptFactory.spendLpButton,
      PromptFactory.cancelButton,
    ];

    return context;
  }
}