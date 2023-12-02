import NamegiverTemplate from "./templates/namegiver.mjs";
import { getArmorFromAttribute, getAttributeStep, getDefenseValue } from '../../utils.mjs';

/**
 * System data definition for PCs.
 * @mixin
 * @property {number} initialValue      initial Value will only be affected by charactergeneration
 * @property {number} baseValue         unmodified value calculated from times increased and initial value
 * @property {number} value             value is the one shown. baseValue + modifications
 * @property {number} timesIncreased    attribute increases
 */
export default class PcData extends NamegiverTemplate {

    /** @inheritDoc */
    static _systemType = "character";

    /* -------------------------------------------- */

    /** @inheritDoc */
    static defineSchema() {
        const superSchema = super.defineSchema();
        this.mergeSchema( superSchema.attributes.model.fields,  {
            initialValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                step: 1,
                initial: 10,
                integer: true,
                positive: true
            } ),
            baseValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                step: 1,
                initial: 10,
                integer: true,
                positive: true
            } ),
            valueModifier: new foundry.data.fields.NumberField( {
                required: true,
                step: 1,
                initial: 0,
            } ),
            value: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                step: 1,
                initial: 1,
                integer: true,
                positive: true
            } ),
            timesIncreased: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                max: 3,
                step: 1,
                initial: 0,
                integer: true
            } ),
        } );
        this.mergeSchema( superSchema, {
            durabilityBonus: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                step: 1,
                initial: 0,
                integer: true,
                label: "ED.General.durabilityBonus"
            } )
        } );
        return superSchema;
    }

    /* -------------------------------------------- */
    /*  Data Preparation                            */
    /* -------------------------------------------- */

    /** @inheritDoc */
    prepareBaseData() {
        super.prepareBaseData();
        this.#prepareAttributes();
        this.#prepareCharacteristics();
        super._prepareInitiative();     // Call again, since PC's attribute steps are calculated here
        this.#prepareCarryingCapacity();
    }

    /** @inheritDoc */
    prepareDerivedData() {
        console.log( "ED4E | In PC data model's prepareDerivedData" );
    }

    /**
     * Prepare calculated attribute values and corresponding steps.
     * @private
     */
    #prepareAttributes() {
        for ( const attributeData of Object.values( this.attributes ) ) {
            attributeData.baseValue = attributeData.initialValue + attributeData.timesIncreased;
            attributeData.value = attributeData.baseValue + attributeData.valueModifier;
            attributeData.baseStep = getAttributeStep( attributeData.value );
            attributeData.step = attributeData.baseStep;
        }
    }

    /**
     * Prepare characteristic values based on attributes: defenses, armor, health ratings, recovery tests.
     * @private
     */
    #prepareCharacteristics() {
        this.#prepareDefenses();
        this.#prepareBaseArmor();
        this.#prepareBaseHealth();
        this.#prepareRecoveryTests();
        // this.#prepareMovement(); TODO: only relevant in derivedData since all based on namegiver/creature/etc items
    }

    /**
     * Prepare the defense values based on attribute values.
     * @private
     */
    #prepareDefenses() {
        // TODO: not nice, it's a bit overkill, but also there is for sure an elegant way for this
        const defenseAttributeMapping = {
            physical: "dex",
            mystical: "per",
            social: "cha"
        }
        for ( const defenseType of Object.keys( this.characteristics.defenses ) ) {
            this.characteristics.defenses[defenseType] = getDefenseValue(
              this.attributes[defenseAttributeMapping[defenseType]].value
            );
        }
    }

    /**
     * Prepare the base armor values based on attributes values.
     * @private
     */
    #prepareBaseArmor() {
        this.characteristics.armor.physical.baseValue = 0;
        this.characteristics.armor.mystical.baseValue = getArmorFromAttribute( this.attributes.wil.value );
    }

    /**
     * Prepare the base health ratings based on attribute values.
     * @private
     */
    #prepareBaseHealth() {
        this.characteristics.health.unconscious = this.attributes.tou.value * 2;
        this.characteristics.health.death = this.characteristics.health.unconscious + this.attributes.tou.step;
        this.characteristics.health.woundThreshold = Math.ceil( this.attributes.tou.value / 2 ) + 2;
    }

    /**
     * Prepare the available recovery tests based on attribute values.
     * @private
     */
    #prepareRecoveryTests() {
        this.characteristics.recoveryTests.max = Math.ceil( this.attributes.tou.value / 6 );
    }

    /**
     * Prepare the base carrying capacity based on attribute values.
     */
    #prepareCarryingCapacity() {
        // TODO: add bonus to strength value
        const strengthValue = this.attributes.str.value + this.encumbrance.bonus;
        const strengthFifth = Math.ceil( strengthValue / 5 );

        this.encumbrance.max = -12.5 * strengthFifth ** 2
          + 5 * strengthFifth * strengthValue
          + 12.5 * strengthFifth
          + 5;
    }

    /* -------------------------------------------- */
    /*  Migrations                                  */
    /* -------------------------------------------- */

    /** @inheritDoc */
    static migrateData( source ) {
        super.migrateData( source );
        // specific migration functions
    }

}
