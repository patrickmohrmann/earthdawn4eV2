import SystemDataModel from '../../abstract.mjs';
import { MappingField } from '../../fields.mjs';

/**
 * Data model template with information on Ability items.
 * @property {string} attribute attribute
 * @property {object} source Class Source
 * @property {string} source.class class
 * @property {string} source.tier talent tier
 * @property {number} level rank
 */
export default class MatrixTemplate extends SystemDataModel {
    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            spellLevel: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Matrix."
            } ),
            isMatrix: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Matrix."
            } ),
            holdThread: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Matrix."
            } ),
            matrixType: new fields.StringField( {
                required: true,
                blank: false,
                initial: "standard",
                label: "ED.Item.Matrix."
            } ),
            matrixTier: new fields.StringField( {
                required: true,
                blank: false,
                initial: "novice",
                label: "ED.Item.Matrix."
            } ),
            spellsAttuned: new foundry.data.fields.ArrayField(
                new foundry.data.fields.SchemaField( {
                    name: new foundry.data.fields.StringField( {
                        required: true,
                        blank: false,
                        nullable: false,
                        initial: ""
                    } ),
                    id: new foundry.data.fields.StringField( {
                        required: true,
                        blank: true,
                        nullable: false,
                        initial: ""
                    } ),
                } )
              ),
            wovenThreads: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Matrix."
            } ),
            requiredThreads: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Matrix."
            } ),
            characteristics: new fields.SchemaField( {
                armor: new MappingField( new fields.SchemaField( {
                    baseValue: new fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                    } ),
                    value: new fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                    } ) ,
                } ), {
                    initialKeys: ['mystical'],
                    initialKeysOnly: true,
                    label: "ED.Item.Matrix."
                } ),
                health: new fields.SchemaField( {
                    death: new fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Item.Matrix."
                    } ),
                } ),
                damage: new fields.SchemaField( {
                    standard: new fields.NumberField( {
                        required: true,
                        nullable: false,
                        min: 0,
                        step: 1,
                        initial: 0,
                        integer: true,
                        label: "ED.Item.Matrix."
                    } ),
                } ),
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