import { FormulaField, MappingField } from '../fields.mjs';
import { sum } from '../../utils.mjs';
import getDice from '../../dice/step-tables.mjs';

export default class EdRollOptions extends foundry.abstract.DataModel {
  /** @inheritDoc */
  static defineSchema() {
    return {
      step: new foundry.data.fields.SchemaField(
        {
          base: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            initial: 1,
            label: 'earthdawn.baseStep',
            hint: 'earthdawn.baseStepForTheRoll',
            min: 1,
            step: 1,
            integer: true,
          } ),
          modifiers: new MappingField(
            new foundry.data.fields.NumberField( {
              required: true,
              nullable: false,
              initial: 1,
              label: 'earthdawn.modifierStep',
              hint: 'earthdawn.modifierStepForTheRoll',
              min: 0,
              step: 1,
              integer: true,
            } ),
            {
              required: true,
              initialKeysOnly: false,
              label: 'allModifiers',
              hint: 'keys are localizable labels of the given step modifying value',
            },
          ),
          total: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            initial: this.initTotalStep,
            label: 'earthdawn.totalStep',
            hint: 'earthdawn.totalStepForTheRoll',
            min: 1,
            step: 1,
            integer: true,
          } ),
        },
        {
          required: true,
          nullable: false,
          label: 'localize: step info',
          hint: 'localize: all data about how the step is composed',
        },
      ),
      karma: this.#bonusResource,
      devotion: this.#bonusResource,
      extraDice: new MappingField( new foundry.data.fields.NumberField( {
        required: true,
        nullable: false,
        initial: 1,
        label: 'earthdawn.baseStep',
        hint: 'earthdawn.baseStepForTheRoll',
        min: 1,
        step: 1,
        integer: true,
      } ), {
        required: true,
        initialKeysOnly: false,
        label: 'extra Steps apart from step, karma and devotion',
        hint: 'keys are localized labels of the given extra step',
      } ),
      target: new foundry.data.fields.SchemaField(
        {
          base: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            initial: 0,
            label: 'earthdawn.baseDifficulty',
            hint: 'earthdawn.baseDifficultyForTheRoll',
            min: 0,
            step: 1,
          } ),
          modifiers: new MappingField(
            new foundry.data.fields.NumberField( {
              required: true,
              nullable: true,
              initial: 0,
              label: 'earthdawn.modifierDifficulty',
              hint: 'earthdawn.modifierDifficultyForTheRoll',
              min: 0,
              step: 1,
            } ),
            {
              required: true,
              initialKeysOnly: false,
              label: 'allModifiers',
              hint: 'keys are localizable labels of the given difficulty modifying value',
            },
          ),
          total: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            initial: this.initTotalTarget,
            label: 'earthdawn.totalDifficulty',
            hint: 'earthdawn.totalDifficultyForTheRoll',
            min: 0,
            step: 1,
            integer: true,
          } ),
          public: new foundry.data.fields.BooleanField( {
            required: true,
            nullable: false,
            initial: true,
            label: "X.targetPublic",
            hint: "X.whetherTheDifficultyIsKnownPublicly"
          } ),
        },
        {
          required: true,
          nullable: false,
          label: 'localize: difficulty info',
          hint: 'localize: all data about how the difficulty is composed',
        },
      ),
      strain: new foundry.data.fields.SchemaField(
        {
          base: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            min: 0,
            initial: 0,
            integer: true,
            label: 'earthdawn.strain',
          } ),
          modifiers: new MappingField(
            new foundry.data.fields.NumberField( {
              required: true,
              nullable: false,
              initial: 1,
              label: 'earthdawn.modifierStep',
              hint: 'earthdawn.modifierStepForTheRoll',
              min: 0,
              step: 1,
              integer: true,
            } ),
            {
              required: true,
              initialKeysOnly: false,
              label: 'allModifiers',
              hint: 'keys are localizable labels of the given step modifying value',
            },
          ),
          total: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            initial: this.initTotalStrain,
            label: 'earthdawn.totalStep',
            hint: 'earthdawn.totalStepForTheRoll',
            min: 0,
            step: 1,
            integer: true,
          } ),
        },
        {
          required: true,
          nullable: false,
          label: 'localize: step info',
          hint: 'localize: all data about how the step is composed',
        },
      ),
      chatFlavor: new foundry.data.fields.StringField( {
        required: true,
        nullable: false,
        blank: true,
        initial: '',
        label: 'localize: roll chat flavour',
        hint: 'localize: text that is added to the chatmessage when this call is put to chat',
      } ),
      rollType: new foundry.data.fields.StringField( {

        required: true,
        nullable: false,
        blank: true,
        initial: 'arbitrary',
        label: 'localize: roll type',
        hint: 'localize: type of this roll, like action or effect test, or arbitrary step roll',
      } ),
    };
  }

  get totalTarget() {
    return this.target.base + sum( Object.values( this.target.modifiers ) );
  }

  static initTotal( source, attribute, defaultValue ){
    const value = source?.[attribute]?.base ?? source.base ?? defaultValue;
    return value + sum( Object.values( source?.[attribute]?.modifiers ?? {} ) );
  }

  static initTotalStep( source ) {
    return EdRollOptions.initTotal( source, "step", 1 );
  }

  static initTotalStrain( source ) {
    return EdRollOptions.initTotal( source, "strain", 0 );
  }

  static initTotalTarget( source ) {
    return EdRollOptions.initTotal( source, "target", 1 );
  }

  get totalStep() {
    return this.step.base + sum( Object.values( this.step.modifiers ) );
  }

  /** @inheritDoc */
  updateSource( changes = {}, options = {} ) {
    return super.updateSource(
      mergeObject( changes, {
        "step.total": this.totalStep,
        "target.total": this.totalTarget,
        "karma.dice": getDice( this.karma.step ),
        "devotion.dice": getDice( this.devotion.step ),
      } ),
      options
    );
  }

  static initDiceForStep( parent ) {
    return getDice( parent.step.total ?? parent.step );
  }

  /**
   * @description Bonus resources to be add globally
   * @type {object}
   * @property {number} something Value of the global bonus
   */
  static get #bonusResource() {
    return new foundry.data.fields.SchemaField(
      {
        pointsUsed: new foundry.data.fields.NumberField( {
          required: true,
          nullable: false,
          initial: 0,
          label: 'earthdawn.karmaPoints',
          hint: 'earthdawn.howManyKarmaPointsAreUsedForThisRoll',
          min: 0,
          step: 1,
          integer: true,
        } ),
        pointsRequired: new foundry.data.fields.BooleanField( {
          required: true,
          nullable: false,
          initial: false,
          label: "X.pointsRequired",
          hint: "X.necessaryPointsToUseThisAbility",
        } ),
        available: new foundry.data.fields.NumberField( {
          required: true,
          nullable: false,
          initial: 0,
          label: 'earthdawn.availableKarmaPoints',
          hint: 'earthdawn.howManyKarmaPointsAreAvailable',
          min: 0,
          step: 1,
          integer: true,
        } ),
        step: new foundry.data.fields.NumberField( {
          required: true,
          nullable: false,
          initial: 4,
          label: 'earthdawn.karmaStep',
          hint: 'earthdawn.whatIsTheStepForKarmaDice',
          min: 1,
          step: 1,
          integer: true,
        } ),
        dice: new FormulaField( {
          required: true,
          initial: this.initDiceForStep,
          label: 'earthdawn.diceForStep',
          hint: 'earthdawn.TheDiceForGivenStep',
        } ),
      },
      {
        required: true,
        nullable: false,
      },
    );
  }


}