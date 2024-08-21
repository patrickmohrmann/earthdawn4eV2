import SystemDataModel from "../../abstract.mjs";
import TargetTemplate from "./targeting.mjs";

/**
 * Data model template for Knacks
 * @property {string} knackSource     UUID of Source the knack derives from
 */
export default class KnackTemplate extends SystemDataModel.mixin( 
  TargetTemplate 
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const labelKey = SystemDataModel.getLocalizeKey.bind( this, "Item", false );
    const hintKey = SystemDataModel.getLocalizeKey.bind( this, "Item", true );
    return this.mergeSchema( super.defineSchema(), {
      sourceTalentUuid: new fields.DocumentUUIDField( {
        required: false,
        nullable: true,
        trim:     true,
        blank:    false,
        validate: ( value, options ) => {
          if ( fromUuidSync( value, {strict: false} )?.type !== "talent" ) return false;
          return undefined; // undefined means do further validation
        },
        validationError: "must be of type 'talent'",
        label:           labelKey( "knackSourceTalentUuid" ),
        hint:            hintKey( "knackSourceTalentUuid" ),
      } ),
      minLevel:      new fields.NumberField( {
        required: false,
        nullable: true,
        positive: true,
        integer:  true,
        min:      1,
        initial:  1,
        label:    labelKey( "knackMinLevel" ),
        hint:     hintKey( "knackMinLevel" ),
      } ),
      restrictions: new fields.NumberField(),
      requirements: new fields.NumberField(),
    } );
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get increasable() {
    return false;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static _cleanData( source, options ) {
    if ( source?.sourceTalentUuid ) {
      source.sourceTalentUuid = fromUuidSync( source.sourceTalentUuid ) ? source.sourceTalentUuid : null;
      if ( options ) options.source = source;
    }
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