import SystemDataModel from "../../abstract.mjs";
import { MappingField } from "../../fields.mjs";

/**
 * A template for all actors that share the common template.
 * @mixin
 */
export default class CommonTemplate extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            globalBonuses: new MappingField( new foundry.data.fields.SchemaField( {
                value: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    step: 1,
                    initial: 0,
                    integer: true,
                } )
            } ), {
                initialKeys: CONFIG.ED4E.globalBonuses,
                initialKeysOnly: true,
                label: "ED.Attributes.globalBonuses"
            } )
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