import AbilityTemplate from "./templates/ability.mjs";

/**
 * Data model template with information on talent items.
 */
export default class TalentData extends AbilityTemplate {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            description: new foundry.data.fields.HTMLField( {
                required: true, 
                nullable: true, 
                label: "ED.Description"
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