import SystemDataModel from "../../abstract.mjs";
import { DocumentUUIDField } from "../../fields.mjs";
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
        return this.mergeSchema( super.defineSchema(), {
            knackSource: new DocumentUUIDField( {
                required: true,
                nullable: true,
                label: "ED.Item.Knack.source"
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