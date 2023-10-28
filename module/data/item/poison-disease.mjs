import SystemDataModel from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on Poison and Disease items.
 * @property {object} effect                      effect type
 * @property {number} effect.damageStep           damage step
 * @property {number} effect.paralysisStep        paralysis step
 * @property {number} effect.debilitationStep     debilitation step
 * @property {object} interval                    interval 
 * @property {number} interval.totalEffects       total number of effects
 * @property {number} interval.timeInBetween      time between effects
 * @property {number} onsetTime                   after which time will the poison become effective
 * @property {number} duration                    duration
 * @property {string} activation            how the poison will be activated
 * @property {boolean} death                deadly poison
 */
export default class PoisonDiseaseData extends SystemDataModel.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            effect: new foundry.data.fields.SchemaField( {
                damageStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.PoisonDisease.damageStep"
                } ), 
                paralysisStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.PoisonDisease.paralysisStep"
                } ), 
                debilitationStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.PoisonDisease.debilitationStep"
                } ), 
            },
            {
                label: "ED.Item.PoisonDisease.effect"
            } ),
            interval: new foundry.data.fields.SchemaField( {
                totalEffects: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.PoisonDisease.totalEffects"
                } ), 
                timeInBetween: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.PoisonDisease.timeInBetween"
                } ), 
            },
            {
                label: "ED.Item.PoisonDisease.interval"
            } ),
            onsetTime: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.PoisonDisease.onsetTime"
            } ), 
            duration: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.PoisonDisease.duration"
            } ), 
            activation: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "wound",
                label: "ED.Item.PoisonDisease.activation"
            } ),
            death: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.PoisonDisease.death"
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