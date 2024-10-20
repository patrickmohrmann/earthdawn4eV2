import SystemDataModel from "../../abstract.mjs";
import TargetTemplate from "./targeting.mjs";
import LearnableTemplate from "./learnable.mjs";

/**
 * Data model template for Knacks
 * @property {string} knackSource     UUID of Source the knack derives from
 */
export default class KnackTemplate extends SystemDataModel.mixin( 
  LearnableTemplate,
  TargetTemplate,
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
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
        label:           this.labelKey( "knackSourceTalentUuid" ),
        hint:            this.hintKey( "knackSourceTalentUuid" ),
      } ),
      minLevel:      new fields.NumberField( {
        required: false,
        nullable: true,
        positive: true,
        integer:  true,
        min:      1,
        initial:  1,
        label:    this.labelKey( "knackMinLevel" ),
        hint:     this.hintKey( "knackMinLevel" ),
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