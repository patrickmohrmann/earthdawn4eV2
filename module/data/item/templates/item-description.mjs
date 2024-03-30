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