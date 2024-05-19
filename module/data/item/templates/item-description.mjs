import ED4E from "../../../config.mjs";
import { validateEdid } from "../../../utils.mjs";
import { getLocalizeKey } from "../../abstract.mjs";

/**
 * Data model template with item description
 * @mixin
 */
export default class ItemDescriptionTemplate extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.SchemaField( {
                value: new fields.HTMLField( {
                    required: true, 
                    nullable: true, 
                    label: "ED.Description"
                } ), 
            } ),
            edid: new fields.StringField( {
                initial: ED4E.reserved_edid.DEFAULT,
                blank: false,
                required: true,
                validate: ( value, _ ) => validateEdid( value ),
                label: getLocalizeKey( "Item", false, "edid" ),
                hints: getLocalizeKey( "Item", true, "edid" ),
            } ),
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