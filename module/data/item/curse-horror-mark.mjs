import ED4E from "../../config.mjs";
import ActorEd from "../../documents/actor.mjs";
import SystemDataModel, { ItemDataModel } from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";


/**
 * Data model template with information on Curse and Horror Mark items.
 * @property {number} step                  curse step
 * @property {string} curseType             type of the curse
 * @property {boolean} curseActive          is the curse active
 * @property {boolean} curseDetected        is the curse known
 */
export default class CurseHorrorMarkData extends ItemDataModel.mixin(
  ItemDescriptionTemplate
)  {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      step: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    this.labelKey( "Curse.step" ),
        hint:     this.hintKey( "Curse.step" )
      } ), 
      type: new fields.StringField( {
        required: true,
        nullable: true,
        blank:    true,
        trim:     true,
        initial:  "minor",
        choices:  ED4E.curseType,
        label:    this.labelKey( "Curse.curseType" ),
        hint:     this.hintKey( "Curse.curseType" )
      } ),
      active: new fields.BooleanField( {
        required: true,
        label:    this.labelKey( "Curse.curseActive" ),
        hint:     this.hintKey( "Curse.curseActive" )
      } ),
      detected: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    this.labelKey( "Curse.curseDetected" ),
        hint:     this.hintKey( "Curse.curseDetected" )
      } ),
      source: new fields.ForeignDocumentField( SystemDataModel, {
        idOnly: true,
      } ),
      target: new fields.ForeignDocumentField( ActorEd, {
        idOnly: true,
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