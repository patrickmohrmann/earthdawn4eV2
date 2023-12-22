/**
 * Data model template with Actor description
 * @mixin
 */
export default class ActorDescriptionTemplate extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static defineSchema() {
        return {
            // TODO: does chat properties/flavour fit in here?
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