import {FormulaField, MappingField} from "../fields.mjs";
import {sum} from "../../utils.mjs";
import getDice from "../../dice/step-tables.mjs";

export default class EdRollOptions extends foundry.abstract.DataModel {
    /** @inheritDoc */
    static defineSchema() {
        return {
            step: new foundry.data.fields.SchemaField( {
                base: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: 1,
                    label: "earthdawn.baseStep",
                    hint: "earthdawn.baseStepForTheRoll",
                    min: 1,
                    step: 1,
                    integer: true,
                } ),
                modifiers: new MappingField( new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: 1,
                    label: "earthdawn.modifierStep",
                    hint: "earthdawn.modifierStepForTheRoll",
                    min: 0,
                    step: 1,
                    integer: true,
                } ), {
                    required: true,
                    initialKeysOnly: false,
                    label: "allModifiers",
                    hint: "keys are localizable labels of the given step modifying value"
                } ),
                total: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: this.initTotalStep,
                    label: "earthdawn.totalStep",
                    hint: "earthdawn.totalStepForTheRoll",
                    min: 1,
                    step: 1,
                    integer: true,
                } ),
            }, {
                required: true,
                nullable: false,
                label: "localize: step info",
                hint: "localize: all data about how the step is composed"
            } ),
            karma: this.#bonusResource,
            devotion: this.#bonusResource,
            extraDice: new foundry.data.fields.SchemaField( {
                terms: new foundry.data.fields.ArrayField(
                    new FormulaField( {nullable: true} ), {
                        required: true,
                        nullable: false,
                        initial: [],
                        label: "array of dice terms",
                        hint: "extra dice terms used for the roll",
                    }
                ),
                labels: new foundry.data.fields.ArrayField(
                    new foundry.data.fields.StringField(), {
                        required: true,
                        nullable: false,
                        initial: [],
                        label: "labels for the extra dice terms",
                        hint: "each label corresponds to one dice in terms",
                    }
                ),
            }, {
                required: true,
                nullable: false,
                label: "localize: ExtraDice",
                hint: "localize: any extra dice terms for the roll with their labels",
            } ),
            target: new foundry.data.fields.SchemaField( {
                base: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: 1,
                    label: "earthdawn.baseDifficulty",
                    hint: "earthdawn.baseDifficultyForTheRoll",
                    min: 1,
                    step: 1,
                    integer: true,
                } ),
                modifiers: new MappingField( new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: 1,
                    label: "earthdawn.modifierDifficulty",
                    hint: "earthdawn.modifierDifficultyForTheRoll",
                    min: 1,
                    step: 1,
                    integer: true,
                } ), {
                    required: true,
                    initialKeysOnly: false,
                    label: "allModifiers",
                    hint: "keys are localizable labels of the given difficulty modifying value"
                } ),
                total: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: 1,
                    label: "earthdawn.totalDifficulty",
                    hint: "earthdawn.totalDifficultyForTheRoll",
                    min: 1,
                    step: 1,
                    integer: true,
                } ),
            }, {
                required: true,
                nullable: false,
                label: "localize: difficulty info",
                hint: "localize: all data about how the difficulty is composed"
            } ),
            strain: new foundry.data.fields.SchemaField( {
                base: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "earthdawn.strain"
                } ),
                modifiers: new MappingField( new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: 1,
                    label: "earthdawn.modifierStep",
                    hint: "earthdawn.modifierStepForTheRoll",
                    min: 0,
                    step: 1,
                    integer: true,
                } ), {
                    required: true,
                    initialKeysOnly: false,
                    label: "allModifiers",
                    hint: "keys are localizable labels of the given step modifying value"
                } ),
                total: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    initial: this.initTotalStrain,
                    label: "earthdawn.totalStep",
                    hint: "earthdawn.totalStepForTheRoll",
                    min: 0,
                    step: 1,
                    integer: true,
                } ),
            }, {
                required: true,
                nullable: false,
                label: "localize: step info",
                hint: "localize: all data about how the step is composed"
            } ),
            chatFlavor: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: true,
                initial: "",
                label: "localize: roll chat flavour",
                hint: "localize: text that is added to the chatmessage when this call is put to chat"
            } ),
            rollType: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: true,
                initial: "",
                label: "localize: roll type",
                hint: "localize: type of this roll, like action or effect test, or arbitrary step roll"
            } ),
        };
    }

    /** @inheritDoc */
    updateSource( changes={}, options={} ) {
        const diff = super.updateSource( changes, options );
        this.step.total = this.#totalStep;
        this.karma.dice = getDice( this.karma.step );
        this.devotion.dice = getDice( this.devotion.step );
        return diff;
    }

    static initTotalStep( source ) {
        const step = source.step?.base ?? source.base ?? 1;
        return step + sum( Object.values( source.step?.modifiers ?? {} ) );
    }

    static initTotalStrain( source ) {
        const strain = source.strain?.base ?? source.base ?? 0;
        return strain + sum( Object.values( source.strain?.modifiers ?? {} ) );
    }

    get #totalStep() {
        return this.step.base + sum( Object.values( this.step.modifiers ) );
    }

    static initDiceForStep( parent ) {
        return getDice( parent.step );
    }

    /**
     * @type {object}
     * @property {number} something
     */
    static get #bonusResource() {
        return new foundry.data.fields.SchemaField( {
            pointsUsed: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                initial: 0,
                label: "earthdawn.karmaPoints",
                hint: "earthdawn.howManyKarmaPointsAreUsedForThisRoll",
                min: 0,
                step: 1,
                integer: true,
            } ),
            available: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                initial: 0,
                label: "earthdawn.availableKarmaPoints",
                hint: "earthdawn.howManyKarmaPointsAreAvailable",
                min: 0,
                step: 1,
                integer: true,
            } ),
            step: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                initial: 4,
                label: "earthdawn.karmaStep",
                hint: "earthdawn.whatIsTheStepForKarmaDice",
                min: 1,
                step: 1,
                integer: true,
            } ),
            dice: new FormulaField( {
                required: true,
                initial: this.initDiceForStep,
                label: "earthdawn.diceForStep",
                hint: "earthdawn.TheDiceForGivenStep"
            } ),
        }, {
            required: true,
            nullable: false
        } );
    }
}