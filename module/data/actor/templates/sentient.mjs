import CommonTemplate from "./common.mjs";
import { MappingField } from '../../fields.mjs';

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
                        label: "ED.Actor.Characteristics.defensePhysical"
                    } ),
                    // TODO: "mystic" or "mystical" -> same everywhere, in all instances in code
                    mystical: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.defenseMystical"
                    } ),
                    social: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
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
                        label: "ED.Actor.Characteristics.armorPhysical"
                    } ),
                    mystical: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
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
                        label: "ED.Actor.Characteristics.deathRate"
                    } ),
                    unconscious: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.unconsciousRate"
                    } ),
                    woundThreshold: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.woundThreshold"
                    } ),
                    damage: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.damage"
                    } ),
                    damageLethal: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.damageLethal"
                    } ),
                    damageStun: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.damageStun"
                    } ),
                    wounds: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
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
                        label: "ED.Actor.Characteristics.recoveryTestsDaily"
                    } ),
                    current: new foundry.data.fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        label: "ED.Actor.Characteristics.recoveryTestsCurrent"
                    } ),
                } ),
                movement: new foundry.data.fields.SchemaField( {
                      walk: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          label: "ED.Item.Namegiver.walk"
                      } ),
                      fly: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          label: "ED.Item.Namegiver.fly"
                      } ),
                      swim: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          label: "ED.Item.Namegiver.swim"
                      } ),
                      burrow: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          label: "ED.Item.Namegiver.burrow"
                      } ),
                      climb: new foundry.data.fields.NumberField( {
                          required: true,
                          nullable: false,
                          min: 0,
                          initial: 0,
                          label: "ED.Item.Namegiver.climb"
                      } ),
                  },
                  {
                      label: "ED.Item.Namegiver.movement"
                  } ),
            } ),
            // TODO: put in extra field "options", for eventual extension?
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
                    label: "ED.Actor.Condition.overwhelmed"
                } ),
                surprised: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Actor.Condition.surprised"
                } )
            } ),
            devotion: new foundry.data.fields.SchemaField( {
                devotionCurrent: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.devotion.current"
                } ),
                devotionMaximum: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.devotion.maximum"
                } ),
                devotionStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 3,
                    label: "ED.General.devotion.step"
                } ),
            } ),
            durabilityBonus: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                step: 1,
                initial: 0,
                label: "ED.General.durabilityBonus"
            } ),
            encumbrance: new foundry.data.fields.SchemaField( {
                encumbrance: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.encumbrance"
                } ),
                carryingCapacity: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.carryingCapacity"
                } ),
                carryingCapacityBonus: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    step: 1,
                    initial: 0,
                    label: "ED.General.carryingCapacityBonus"
                } )
            } ),
            freeAttributePoints: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                step: 1,
                initial: 0,
                label: "ED.General.freeAttributePoints"
            } ),
            initiative: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                step: 1,
                initial: 0,
                label: "ED.General.Initiative"
            } ),
            karma: new foundry.data.fields.SchemaField( {
                useKarmaAlways: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.General.Karma.karmaAlways"
                } ),
                karmaCurrent: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.karma.current"
                } ),
                karmaMaximum: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 0,
                    label: "ED.General.karma.maximum"
                } ),
                karmaStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    step: 1,
                    initial: 4,
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
