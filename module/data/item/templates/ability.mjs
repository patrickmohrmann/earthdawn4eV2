import SystemDataModel from "../../abstract.mjs";
import ClassTemplate from './class.mjs';
import { DocumentUUIDField } from "../../fields.mjs";

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
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            action: new fields.StringField( {
                required: true,
                nullable: false,
                blank: false,
                initial: "standard",
                label: "ED.Item.Ability.action"
            } ),
            attribute: new fields.StringField( {
                required: false,
                nullable: true,
                blank: true,
                initial: "",
                label: "ED.Item.Ability.attribute"
            } ),
            source: new fields.SchemaField( {
                    class: new DocumentUUIDField( ClassTemplate, {
                        label: "ED.Item.Class.source"
                    } ),
                    tier: new fields.StringField( {
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
            level: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Ability.rank"
            } ),
            strain: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
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