import CommonTemplate from "./common.mjs";
import { MappingField } from "../../fields.mjs";
import MovementFields from './movement.mjs';

/**
 * A template for all actors that represent sentient beings and have such stats.
 * @mixin
 */
export default class SentientTemplate extends CommonTemplate {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            attributes: new MappingField( new foundry.data.fields.SchemaField( {
                baseStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 1,
                    step: 1,
                    initial: 1,
                    integer: true,
                    positive: true
                } ),
                step: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 1,
                    step: 1,
                    initial: 1,
                    integer: true,
                    positive: true
                } )
            } ), {
                initialKeys: CONFIG.ED4E.attributes,
                initialKeysOnly: true,
                label: "ED.Attributes.attributes"
            } ),
            characteristics: new foundry.data.fields.SchemaField( {
                defenses: new MappingField( new foundry.data.fields.SchemaField( {
                    baseValue: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                    } ),
                    value: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                    } ),
                } ), {
                    initialKeys: ['physical', 'mystical', 'social'],
                    initialKeysOnly: true,
                    label: "ED.Actor.Characteristics.defenses"
                } ),
                armor: new MappingField( new foundry.data.fields.SchemaField( {
                    baseValue: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                    } ),
                    value: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                    } ) ,
                } ), {
                    initialKeys: ['physical', 'mystical'],
                    initialKeysOnly: true,
                    label: "ED.Actor.Characteristics.armor"
                  } ),
                health: new foundry.data.fields.SchemaField( {
                    death: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.deathRate"
                    } ),
                    unconscious: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.unconsciousRate"
                    } ),
                    woundThreshold: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.woundThreshold"
                    } ),
                    bloodMagic: new foundry.data.fields.SchemaField( {
                        damage: new foundry.data.fields.NumberField( {
                            required: true,
                            nullable: false,
                            min: 0,
                            step: 1,
                            initial: 0,
                            integer: true,
                            label: "ED.Actor.Characteristics.unconsciousRate"
                        } ),
                        wounds: new foundry.data.fields.NumberField( {
                            required: true,
                            nullable: false,
                            min: 0,
                            step: 1,
                            initial: 0,
                            integer: true,
                            label: "ED.Actor.Characteristics.unconsciousRate"
                        } ),
                    } ),
                    damage: new foundry.data.fields.SchemaField( {
                        standard: new foundry.data.fields.NumberField( {
                            required: true,
                            nullable: false,
                            min: 0,
                            step: 1,
                            initial: 0,
                            integer: true,
                            label: "ED.Actor.Characteristics.damageLethal"
                        } ),
                        stun: new foundry.data.fields.NumberField( {
                            required: true,
                            nullable: false,
                            min: 0,
                            step: 1,
                            initial: 0,
                            integer: true,
                            label: "ED.Actor.Characteristics.damageStun"
                        } ),
                        total: new foundry.data.fields.NumberField( {
                            required: true,
                            nullable: false,
                            min: 0,
                            step: 1,
                            initial: 0,
                            integer: true,
                            label: "ED.Actor.Characteristics.damage"
                        } )
                      }, {
                        required: true,
                        nullable: false,
                        label: "ED.Actor.Characteristics.damage"
                    } ),
                    wounds: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.wounds"
                    } ),
                } ),
                recoveryTests: new foundry.data.fields.SchemaField( {
                    max: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.recoveryTestsDaily"
                    } ),
                    value: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.recoveryTestsCurrent"
                    } ),
                } ),
                ...MovementFields.movement
            } ),
            condition: new foundry.data.fields.SchemaField( {
                aggressiveAttack: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.aggressiveAttack"
                } ),
                blindsided: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.blindsided"
                } ),
                cover: new foundry.data.fields.SchemaField( {
                    partial: new foundry.data.fields.BooleanField( {
                        required: true,
                        initial: false,
                        label: "ED.Actor.Condition.coverPartial"
                    } ),
                    full: new foundry.data.fields.BooleanField( {
                        required: true,
                        initial: false,
                        label: "ED.Actor.Condition.coverFull"
                    } ),
                } ),
                darkness: new foundry.data.fields.SchemaField( {
                    partial: new foundry.data.fields.BooleanField( {
                        required: true,
                        initial: false,
                        label: "ED.Actor.Condition.darknessPartial"
                    } ),
                    full: new foundry.data.fields.BooleanField( {
                        required: true,
                        initial: false,
                        label: "ED.Actor.Condition.darknessFull"
                    } ),
                } ),
                defensiveStance: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.defensiveStance"
                } ),
                fury: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.fury"
                } ),
                harried: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.harried"
                } ),
                impairedMovement: new foundry.data.fields.SchemaField( {
                    partial: new foundry.data.fields.BooleanField( {
                        required: true,
                        initial: false,
                        label: "ED.Actor.Condition.impairedMovementPartial"
                    } ),
                    full: new foundry.data.fields.BooleanField( {
                        required: true,
                        initial: false,
                        label: "ED.Actor.Condition.impairedMovementFull"
                    } ),
                } ),
                knockedDown: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.knockedDown"
                } ),
                overwhelmed: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.Actor.Condition.overwhelmed"
                } ),
                surprised: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.surprised"
                } )
            } ),
            devotion: new foundry.data.fields.SchemaField( {
                value: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.devotion.current"
                } ),
                max: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.devotion.maximum"
                } ),
                step: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 3,
                    integer: true,
                    label: "ED.General.devotion.step"
                } ),
            } ),
            encumbrance: new foundry.data.fields.SchemaField( {
                // current load / weight carried
                value: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.General.carriedLoad"
                } ),
                // maximum carriable weight
                max: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.carryingCapacity"
                } ),
                // bonus value to strength value for determining max capacity
                bonus: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.carryingCapacityBonus"
                } ),
                // encumbrance / overload status
                status: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    nullable: false,
                    initial: "notEncumbered"
                } )
            } ),
            initiative: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                step: 1,
                initial: 0,
                integer: true,
                label: "ED.General.Initiative"
            } ),
            karma: new foundry.data.fields.SchemaField( {
                useAlways: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.General.Karma.karmaAlways"
                } ),
                value: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.karma.current"
                } ),
                max: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.karma.maximum"
                } ),
                step: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 4,
                    integer: true,
                    label: "ED.General.karma.step"
                } ),
                freeAttributePoints: new foundry.data.fields.NumberField( {
                    required: false,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.freeAttributePoints"
                } ),
            } ),
            relations: new MappingField( new foundry.data.fields.SchemaField( {
                attitude: new foundry.data.fields.StringField( {
                    choices: ['config stuff']
                } ),
                favors:
                  new MappingField( new foundry.data.fields.SchemaField( {
                      owingThem: new foundry.data.fields.NumberField( {
                          min: 0,
                          step: 1,
                          integer: true,
                          initial: 0
                      } ),
                      owingMe: new foundry.data.fields.NumberField( {
                          min: 0,
                          step: 1,
                          integer: true,
                          initial: 0
                      } )
                  } ), {
                      initialKeys: ['small', 'large'],
                      initialKeysOnly: true
                  } )
            } ), {
                initialKeysOnly: false,
                label: "ED.Relations.relations"
            } )
        } );
    }

    /* -------------------------------------------- */
    /*  Data Preparation                            */
    /* -------------------------------------------- */

    /** @inheritDoc */
    prepareBaseData() {
        super.prepareBaseData();
        this._prepareDamage();
    }

    /** @inheritDoc */
    prepareDerivedData() {
    }

    /**
     * Prepare the current total damage.
     * @protected
     */
    _prepareDamage() {
        this.characteristics.health.damage.total =
          this.characteristics.health.damage.stun + this.characteristics.health.damage.standard;
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
