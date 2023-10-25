import SystemDataModel from "../abstract.mjs";

/**
 * Data model template with information on mask items.
 * @property {number} dexterityStep             dexterity step modifications
 * @property {number} strengthStep              strenght step modifications
 * @property {number} toughnessStep             toughness step modifications
 * @property {number} perceptionStep            perception step modifications
 * @property {number} willpowerStep             willpower step modifications
 * @property {number} charismaStep              charisma step modifications
 * @property {number} initiativeStep            initiative step modifications
 * @property {object} movement                  movement group object
 * @property {number} movement.walk             movement type walk modifications
 * @property {number} movement.fly              movement type fly modifications
 * @property {number} movement.swim             movement type swim modifications
 * @property {number} movement.burrow           movement type burrow modifications
 * @property {number} movement.climb            movement type climb modifications
 * @property {number} physicaldefense           physical defense modifications
 * @property {number} mysticdefense             mystical defense modifications
 * @property {number} socialdefense             social defense modifications
 * @property {number} physicalarmor             physical armor modifications
 * @property {number} mysticarmor               mystic armor modifications
 * @property {number} knockDownStep             knock down step modifications
 * @property {number} recoverytests             recovery tests modifications
 * @property {number} deathThreshold            death threshold modifications
 * @property {number} unconsciousThreshold      unconcious threshold modifications
 * @property {number} woundThreshold            wound threshold modifications
 * @property {number} attackStepsBonus          attack steps modifications
 * @property {number} damageStepsBonus          damage steps modification
 * @property {number} challengingRate           changes to the challengingrate
 * @property {object} powers                    array of powers
 */
export default class MaskData extends SystemDataModel{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            dexterityStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.dexterityStep"
            } ), 
            strengthStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.strengthStep"
            } ),
            toughnessStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.toughnessStep"
            } ),
            perceptionStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.perceptionStep"
            } ),
            willpowerStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.willpowerStep"
            } ),
            charismaStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.charismaStep"
            } ),
            initiativeStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.initiativeStep"
            } ),
            movement: new foundry.data.fields.SchemaField( {
                walk: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    label: "ED.Item.Masks.walk"
                } ),
                fly: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    label: "ED.Item.Masks.fly"
                } ),
                swim: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    label: "ED.Item.Masks.swim"
                } ),
                burrow: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    label: "ED.Item.Masks.burrow"
                } ),
                climb: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    label: "ED.Item.Masks.climb"
                } ),
            },
            {
                label: "ED.Item.Masks.movement"
            } ),
            physicaldefense: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.physicaldefense"
            } ),
            mysticdefense: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.mysticdefense"
            } ),
            socialdefense: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.socialdefense"
            } ),
            physicalarmor: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.physicalarmor"
            } ),
            mysticarmor: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.mysticarmor"
            } ),
            knockDownStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.knockDownStep"
            } ),
            recoverytests: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.recoverytests"
            } ),
            deathThreshold: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.deathThreshold"
            } ),
            unconsciousThreshold: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.unconsciousThreshold"
            } ),
            woundThreshold: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.woundThreshold"
            } ),
            attacks: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.attacks"
            } ),
            attackStepsBonus: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.attackStepsBonus"
            } ),
            damageStepsBonus: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.damageStepsBonus"
            } ),
            challengingRate: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Masks.challengingRate"
            } ),
            // @chris das ist eher ein Array oder machen wir das ganz anders?
            powers: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "",
                label: "ED.Item.Masks.powers"
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