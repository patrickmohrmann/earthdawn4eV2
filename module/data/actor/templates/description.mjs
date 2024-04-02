/**
 * Data model template with Actor description
 * @mixin
 */
export default class ActorDescriptionTemplate extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            // TODO: does chat properties/flavour fit in here?
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