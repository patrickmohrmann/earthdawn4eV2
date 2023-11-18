import SystemDataModel from "../../abstract.mjs";

/**
 * A template for all actors that share the common template.
 * @mixin
 */
export default class CommonTemplate extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            globalBonuses: new foundry.data.fields.SchemaField( {
                allAttacks: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allAttacks"
                } ),
                allEffects: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allEffects"
                } ),
                allActions: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allActions"
                } ),
                allRangedAttacks: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allRangedAttacks"
                } ),
                allCloseAttacks: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allCloseAttacks"
                } ),
                allSpellcasting: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allSpellcasting"
                } ),
                allDamage: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allDamage"
                } ),
                allMeleeDamage: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allMeleeDamage"
                } ),
                allRangedDamage: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allRangedDamage"
                } ),
                allSpellEffects: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Actor.GlobalBonus.allSpellEffects"
                } ),
            } ),
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