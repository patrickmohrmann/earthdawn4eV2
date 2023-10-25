import ClassTemplate from "./templates/class.mjs";

/**
 * Data model template with information on path items.
 * @property {string} sourceDiscipline source discipline related to the path
 */
export default class PathData extends ClassTemplate{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            sourceDiscipline: new foundry.data.fields.StringField( {
                required: true,
                blank: true,
                label: "ED.Item.Class.sourceDiscipline"
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