
/**
 * Data model template with information on Attack items.
 * @property {string} isSuccess        boolean for success
 */
export default class ChatMessageEdData extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            isSuccess: new fields.StringField( {
                required: true,
                nullable: false,
                initial: false,
                validate: value => typeof value === "boolean",
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
