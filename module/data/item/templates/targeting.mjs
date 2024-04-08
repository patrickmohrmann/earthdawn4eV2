import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on Ability items.
 * @property {string} action action type
 * @property {string} attribute attribute
 * @property {string} tier talent tier
 * @property {number} strain strain
 * @property {number} level rank
 */
export default class TargetTemplate extends SystemDataModel {
    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            difficulty: new foundry.data.fields.SchemaField( {
                target: new foundry.data.fields.StringField( {
                    nullable: false,
                    blank: false,
                    initial: "none",
                    label: "X.TargetDifficulty"
                } ),
                group: new foundry.data.fields.StringField( {
                    nullable: false,
                    blank: false,
                    initial: "none",
                    label: "X.GroupDifficulty"
                } ),
                fixed: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "X.FixedDifficulty"
                } ),
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