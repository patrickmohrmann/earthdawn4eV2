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
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            effect: new fields.SchemaField( {
                damageStep: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,   
                    integer: true,
                    label: "ED.Item.PoisonDisease.damageStep"
                } ), 
                paralysisStep: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.PoisonDisease.paralysisStep"
                } ), 
                debilitationStep: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.PoisonDisease.debilitationStep"
                } ), 
            },
            {
                label: "ED.Item.PoisonDisease.effect"
            } ),
            interval: new fields.SchemaField( {
                totalEffects: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.PoisonDisease.totalEffects"
                } ), 
                timeInBetween: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.PoisonDisease.timeInBetween"
                } ), 
            },
            {
                label: "ED.Item.PoisonDisease.interval"
            } ),
            onsetTime: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.PoisonDisease.onsetTime"
            } ), 
            duration: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.PoisonDisease.duration"
            } ), 
            activation: new fields.StringField( {
                required: true,
                blank: false,
                initial: "wound",
                label: "ED.Item.PoisonDisease.activation"
            } ),
            death: new fields.BooleanField( {
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