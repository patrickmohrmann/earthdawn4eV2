import NamegiverTemplate from "./templates/namegiver.mjs";

/**
 * System data definition for PCs.
 * @mixin
 */
export default class PcData extends NamegiverTemplate {

    /** @inheritDoc */
    static _systemType = "character";

    /* -------------------------------------------- */

    /** @inheritDoc */
    static defineSchema() {
        const superSchema = super.defineSchema();
        this.mergeSchema( superSchema.attributes.model.fields,  {
            initialValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                step: 1,
                initial: 1,
                integer: true,
                positive: true
            } ),
            baseValue: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                step: 1,
                initial: 1,
                integer: true,
                positive: true
            } ),
            value: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                step: 1,
                initial: 1,
                integer: true,
                positive: true
            } ),
            timesIncreased: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                max: 3,
                step: 1,
                initial: 0,
                integer: true
            } ),
        } );
        return superSchema;
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
