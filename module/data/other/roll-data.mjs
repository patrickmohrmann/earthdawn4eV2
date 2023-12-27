import {FormulaField, MappingField} from "../fields.mjs";
import {sum} from "../../utils.mjs";

export default class RollData extends foundry.abstract.DataModel {
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
                    label: "earthdawn.totalStep",
                    hint: "earthdawn.totalStepForTheRoll",
                    min: 1,
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
                label: "step info",
                hint: "all data about how the step is composed"
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
                label: "ExtraDice",
                hint: "any extra dice terms for the roll with their labels",
            } ),
            target: new foundry.data.fields.SchemaField( {
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
                    label: "earthdawn.totalStep",
                    hint: "earthdawn.totalStepForTheRoll",
                    min: 1,
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
                    initial: 1,
                    label: "earthdawn.totalStep",
                    hint: "earthdawn.totalStepForTheRoll",
                    min: 1,
                    step: 1,
                    integer: true,
                } ),
            }, {
                required: true,
                nullable: false,
                label: "step info",
                hint: "all data about how the step is composed"
            } ),
            strain: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "earthdawn.strain"
            } )
        };
    }

    /** @inheritDoc */
    updateSource( changes={}, options={} ) {
        changes.step.total = this.#totalStep;
        return super.updateSource( changes, options );
    }

    static initTotalStep( parent ) {
        return parent.step.base + sum( Object.values( parent.step.modifiers ) );
    }

    get #totalStep() {
        return this.step.base + sum( Object.values( this.step.modifiers ) );
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
        }, {
            required: true,
            nullable: false
        } );
    }
}