import NamegiverTemplate from "./templates/namegiver.mjs";
import { getArmorFromAttribute, getAttributeStep, getDefenseValue, sum } from '../../utils.mjs';
import ActorDescriptionTemplate from "./templates/description.mjs";

/**
 * System data definition for PCs.
 * @mixin
 * @property {number} initialValue      initial Value will only be affected by charactergeneration
 * @property {number} baseValue         unmodified value calculated from times increased and initial value
 * @property {number} value             value is the one shown. baseValue + modifications
 * @property {number} timesIncreased    attribute increases
 */
export default class PcData extends NamegiverTemplate.mixin(
    ActorDescriptionTemplate ) {

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
        this.#prepareBaseAttributes();
        this.#prepareBaseCharacteristics();
        this.#prepareBaseInitiative();
        this.#prepareBaseCarryingCapacity();
    }

    /** @inheritDoc */
    prepareDerivedData() {
        super.prepareDerivedData();
        this.#prepareDerivedCharacteristics();
        this.#prepareDerivedInitiative();
        this.#prepareDerivedCarryingCapacity();
        this.#prepareDerivedKarma();
        this.#prepareDerivedDevotion();
    }

    /* -------------------------------------------- */

    /**
     * Prepare calculated attribute values and corresponding steps.
     * @private
     */
    #prepareBaseAttributes() {
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
    #prepareBaseCharacteristics() {
        this.#prepareBaseDefenses();
        this.#prepareBaseArmor();
        this.#prepareBaseHealth();
        this.#prepareBaseRecoveryTests();
    }

    /**
     * Prepare the defense values based on attribute values.
     * @private
     */
    #prepareBaseDefenses() {
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
     * Prepare the base initiative value based on attribute values.
     * @private
     */
    #prepareBaseInitiative() {
        this.initiative = this.attributes.dex.step;
    }

    /**
     * Prepare the available recovery tests based on attribute values.
     * @private
     */
    #prepareBaseRecoveryTests() {
        this.characteristics.recoveryTests.max = Math.ceil( this.attributes.tou.value / 6 );
    }

    /**
     * Prepare the base carrying capacity based on attribute values.
     * @private
     */
    #prepareBaseCarryingCapacity() {
        const strengthValue = this.attributes.str.value + this.encumbrance.bonus;
        const strengthFifth = Math.ceil( strengthValue / 5 );

        this.encumbrance.max = -12.5 * strengthFifth ** 2
          + 5 * strengthFifth * strengthValue
          + 12.5 * strengthFifth
          + 5;
    }

    /* -------------------------------------------- */

    /**
     * Prepare characteristic values based on items: defenses, armor, health ratings, recovery tests.
     * @private
     */
    #prepareDerivedCharacteristics() {
        this.#prepareDerivedArmor();
        this.#prepareDerivedHealth();
        this.#prepareDerivedMovement();
    }

    /**
     * Prepare the derived armor values based on items.
     * @private
     */
    #prepareDerivedArmor() {
        const armorItems = this.parent.items.filter( item => item.type === 'armor' && item.system.itemStatus.equipped );
        this.characteristics.armor.physical.value = this.characteristics.armor.physical.baseValue;
        this.characteristics.armor.mystical.value = this.characteristics.armor.mystical.baseValue;
        if ( armorItems ) {
            for ( const armor of armorItems ) {
                this.characteristics.armor.physical.value += armor.system.physicalArmor + armor.system.forgeBonusPhysical;
                this.characteristics.armor.mystical.value += armor.system.mysticalArmor + armor.system.forgeBonusMystical;
            }
        }
    }

    /**
     * Prepare the base health ratings based on items.
     * @private
     */
    #prepareDerivedHealth() {
        const durabilityItems = this.parent.items.filter(
          item => ["discipline", "devotion"].includes( item.type ) && item.system.durability > 0
        );
        if ( !durabilityItems?.length ) return;

        // TODO: only takes the highest, e.g., when only one discipline only on entry with highest circle
        // TODO: it's the ability "devotion" not the class "questor"
        const durabilityByCircle = durabilityItems.reduce( ( accumulator, currentValue ) => (
            {
                ...accumulator,
                [currentValue.system.level]: [...( accumulator[currentValue.system.level] ?? [] ), currentValue]
            }
          ),
          {}
        )
        for ( const [circle, items] of Object.entries( durabilityByCircle ) ) {
            durabilityByCircle[circle] = Math.max( ...items.map( item => item.system.durability ) )
        }
          
        const maxDurability = sum( Object.values( durabilityByCircle ) );

        const maxCircle = Math.max(
          ...durabilityItems.filter(
            item => item.type === "discipline"
          ).map(
            item => item.system.level
          )
        );

        this.characteristics.health.unconscious += maxDurability;
        this.characteristics.health.death += maxDurability + maxCircle;
    }

    /**
     * Prepare the derived initiative value based on items.
     * @private
     */
    #prepareDerivedInitiative() {
        const armors = this.parent.items.filter( item =>
          ["armor", "shield"].includes( item.type ) && item.system.itemStatus.equipped
        );
        this.initiative -= sum( armors.map( item => item.system.initiativePenalty ) );
    }

    /**
     * Prepare the derived load carried based on items.
     * @private
     */
    #prepareDerivedCarryingCapacity() {
        // TODO
    }

    /**
     * Prepare the derived movement values based on namegiver items.
     */
    #prepareDerivedMovement() {
        const namegiver = this.parent.items.filter( item => item.type === "namegiver" )[0];
        if ( namegiver ) {
            for ( const movementType of Object.keys( namegiver.system.movement ) ) {
                this.characteristics.movement[movementType] = namegiver.system.movement[movementType];
            }
        }
    }

    /**
     * Prepare the derived karma values based on namegiver items and free attribute points.
     * @private
     */
    #prepareDerivedKarma() {
        const highestCircle = this.#getHighestClass( "discipline" )?.system.level ?? 0;
        const karmaModifier = this.parent.items.filter( item => item.type === "namegiver" )[0]?.system.karmamodifier ?? 0;

        this.karma.maximum = karmaModifier * highestCircle + this.karma.freeAttributePoints;
    }

    /**
     * Prepare the derived devotion values based on questor items.
     * @private
     */
    #prepareDerivedDevotion() {
        const questor = this.parent.items.filter( item => item.type === "questor" )[0];
        if ( questor ) {
            this.devotion.maximum = questor.system.level * 10;
        }
    }

    /* -------------------------------------------- */

    /**
     * Finds and returns this PC's class of the given type with the highest circle.
     * If multiple, only the first found will be returned.
     * @param {string} type The type of class to be searched for. One of discipline, path, questor.
     * @returns {Item} A discipline item with the highest circle.
     * @private
     */
    #getHighestClass( type ) {
        return this.parent.items.filter(
          item => item.type === type
        ).sort(     // sort descending by circle/rank
          ( a, b ) => a.system.level > b.system.level ? -1 : 1
        )[0];
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
