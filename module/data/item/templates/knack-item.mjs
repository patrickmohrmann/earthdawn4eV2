import AbilityTemplate from "./ability.mjs";
import TargetTemplate from "./targeting.mjs";

/**
 * Data model template for Knacks
 * @property {string} knackSource     UUID of Source the knack derives from
 */
export default class KnackTemplate extends AbilityTemplate {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            knackSource: new fields.DocumentUUIDField( {
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