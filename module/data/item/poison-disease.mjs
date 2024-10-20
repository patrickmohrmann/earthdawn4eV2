import ED4E from "../../config.mjs";
import { ItemDataModel } from "../abstract.mjs";
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
export default class PoisonDiseaseData extends ItemDataModel.mixin(
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
          min:      0,
          initial:  0,   
          integer:  true,
          label:    this.labelKey( "PoisonDisease.damageStep" ),
          hint:     this.hintKey( "PoisonDisease.damageStep" )
        } ), 
        paralysisStep: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    this.labelKey( "PoisonDisease.paralysisStep" ),
          hint:     this.hintKey( "PoisonDisease.paralysisStep" )
        } ), 
        debilitationStep: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    this.labelKey( "PoisonDisease.debilitationStep" ),
          hint:     this.hintKey( "PoisonDisease.debilitationStep" )
        } ), 
      },
      {
        label:    this.labelKey( "PoisonDisease.effect" ),
        hint:     this.hintKey( "PoisonDisease.effect" )
      } ),
      interval: new fields.SchemaField( {
        totalEffects: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    this.labelKey( "PoisonDisease.totalEffects" ),
          hint:     this.hintKey( "PoisonDisease.totalEffects" )
        } ), 
        timeInBetween: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    this.labelKey( "PoisonDisease.timeInBetween" ),
          hint:     this.hintKey( "PoisonDisease.timeInBetween" )
        } ), 
      },
      {
        label:    this.labelKey( "PoisonDisease.interval" ),
        hint:     this.hintKey( "PoisonDisease.interval" )
      } ),
      onsetTime: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    this.labelKey( "PoisonDisease.onsetTime" ),
        hint:     this.hintKey( "PoisonDisease.onsetTime" )
      } ), 
      duration: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    this.labelKey( "PoisonDisease.duration" ),
        hint:     this.hintKey( "PoisonDisease.duration" )
      } ), 
      activation: new fields.StringField( {
        required: true,
        blank:    false,
        initial:  "wound",
        choices:  ED4E.activationType,
        label:    this.labelKey( "PoisonDisease.activation" ),
        hint:     this.hintKey( "PoisonDisease.activation" )
      } ),
      death: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    this.labelKey( "PoisonDisease.death" ),
        hint:     this.hintKey( "PoisonDisease.death" )
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