import ClassTemplate from "./templates/class.mjs";

/**
 * Data model template with information on discipline items.
 * @property {number} durability durability value
 */
export default class DisciplineData extends ClassTemplate{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            durability: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Class.durability"
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