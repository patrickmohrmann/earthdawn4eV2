import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 * @property {number} level         either circle or rank of the class 
 * @property {string} identifier    type of class
 */
export default class ClassTemplate extends SystemDataModel{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            level: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 1,
                positive: true,
            } ), 
            identifier: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "discipline",
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