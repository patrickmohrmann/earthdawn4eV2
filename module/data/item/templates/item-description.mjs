import { EdIdField } from "../../fields.mjs";
import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with item description
 * @mixin
 */
export default class ItemDescriptionTemplate extends SystemDataModel {

  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const labelKey = SystemDataModel.getLocalizeKey.bind( this, "Item", false );
    const hintKey = SystemDataModel.getLocalizeKey.bind( this, "Item", true );
    return {
      description: new fields.SchemaField( {
        value: new fields.HTMLField( {
          required: true, 
          nullable: true, 
          label:    labelKey( "description" ),
          hint:     hintKey( "description" ),
        } ), 
      } ),
      edid: new EdIdField(),
    };
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