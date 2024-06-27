import SystemDataModel from "../../abstract.mjs";
import TargetTemplate from "./targeting.mjs";

/**
 * Data model template for Knacks
 * @property {string} knackSource     UUID of Source the knack derives from
 */
export default class KnackTemplate extends SystemDataModel.mixin( 
    TargetTemplate 
) {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            source: new fields.SchemaField( {
                knackSource: new fields.DocumentUUIDField( {
                    required: true,
                    nullable: true,
                    label: "ED.Item.Knack.source"
                } ),
                minLevel:  new fields.NumberField( {
                    required: false,
                    nullable: true,
                    positive: true,
                    integer: true,
                    min: 1,
                    initial: 1,
                } ),
            },
            {
                required: false
            }),
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