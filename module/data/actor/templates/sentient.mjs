import CommonTemplate from "./common.mjs";
import { MappingField } from "../../fields.mjs";

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
            // TODO: write setter functions for condition to account for mutually exclusive conditions, e.g. you can only have partial OR full cover, can't be aggressive while unconscious, etc.
            characteristics: new foundry.data.fields.SchemaField( {
                defenses: new foundry.data.fields.SchemaField( {
                    physical: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.defensePhysical"
                    } ),
                    // TODO: "mystic" or "mystical" -> same everywhere, in all instances in code
                    mystical: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.defenseMystical"
                    } ),
                    social: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.defenseSocial"
                    } ),
                } ),
                armor: new foundry.data.fields.SchemaField( {
                    physical: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.armorPhysical"
                    } ),
                    mystical: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.armorMystical"
                    } ),
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
                    damage: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.damage"
                    } ),
                    damageLethal: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.damageLethal"
                    } ),
                    damageStun: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.damageStun"
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
                    daily: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.recoveryTestsDaily"
                    } ),
                    current: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Actor.Characteristics.recoveryTestsCurrent"
                    } ),
                } ),
                movement: new foundry.data.fields.SchemaField( {
                      walk: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          integer: true,
                          label: "ED.Item.Namegiver.walk"
                      } ),
                      fly: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          integer: true,
                          label: "ED.Item.Namegiver.fly"
                      } ),
                      swim: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          integer: true,
                          label: "ED.Item.Namegiver.swim"
                      } ),
                      burrow: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          integer: true,
                          label: "ED.Item.Namegiver.burrow"
                      } ),
                      climb: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          integer: true,
                          label: "ED.Item.Namegiver.climb"
                      } ),
                  },
                  {
                      label: "ED.Item.Namegiver.movement"
                  } ),
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
                current: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.devotion.current"
                } ),
                maximum: new foundry.data.fields.NumberField( {
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
                // current load / weight carried -> rename
                carriedLoad: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.General.carriedLoad"
                } ),
                // maximum carriable weight
                carryingCapacity: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.carryingCapacity"
                } ),
                // bonus value to strength value for determining max capacity
                carryingCapacityBonus: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.carryingCapacityBonus"
                } )
                // encumbrance / overload status
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
                current: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    integer: true,
                    label: "ED.General.karma.current"
                } ),
                maximum: new foundry.data.fields.NumberField( {
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
            } )
        } );
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
