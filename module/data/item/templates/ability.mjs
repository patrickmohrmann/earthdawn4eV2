import SystemDataModel from "../../abstract.mjs";
// import ClassTemplate from './class.mjs';

/**
 * Data model template with information on Ability items.
 * @property {string} action action type
 * @property {string} attribute attribute
 * @property {string} tier talent tier
 * @property {number} strain strain
 * @property {number} level rank
 */
export default class AbilityTemplate extends SystemDataModel {
    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            action: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "standard",
                label: "ED.Item.Ability.action"
            } ),
            attribute: new foundry.data.fields.StringField( {
                required: false,
                nullable: true,
                blank: true,
                label: "ED.Item.Ability.attribute"
            } ),
            source: new foundry.data.fields.SchemaField( {
                    // TODO: figure out how ForeignDocumentFields work
                    /* class: new foundry.data.fields.ForeignDocumentField( ClassTemplate, {
                        initial: null,
                        label: "ED.Item.Class.source"
                    } ), */
                    tier: new foundry.data.fields.StringField( {
                        nullable: false,
                        blank: false,
                        initial: "novice",
                        label: "ED.Item.Ability.tier"
                    } ),
                },
                {
                    required: false
                }
            ),
            level: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Ability.rank"
            } ),
            strain: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Ability.strain"
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