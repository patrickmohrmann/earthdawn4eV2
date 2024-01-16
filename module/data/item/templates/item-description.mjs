/**
 * Data model template with item description
 * @mixin
 */
export default class ItemDescriptionTemplate extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static defineSchema() {
        return {
            description: new foundry.data.fields.SchemaField( {
                value: new foundry.data.fields.HTMLField( {
                    required: true, 
                    nullable: true, 
                    label: "ED.Description"
                } ), 
            } )
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