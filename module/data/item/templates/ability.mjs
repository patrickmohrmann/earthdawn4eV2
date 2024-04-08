import ClassTemplate from './class.mjs';
import { DocumentUUIDField } from "../../fields.mjs";
import TargetTemplate from "./targeting.mjs";
import ActionTemplate from "./action.mjs";

/**
 * Data model template with information on Ability items.
 * @property {string} attribute attribute
 * @property {object} source Class Source
 * @property {string} source.class class
 * @property {string} source.tier talent tier
 * @property {number} level rank
 */
export default class AbilityTemplate extends ActionTemplate.mixin( 
    TargetTemplate 
) {
    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            attribute: new foundry.data.fields.StringField( {
                required: false,
                nullable: true,
                blank: true,
                label: "ED.Item.Ability.attribute"
            } ),
            source: new foundry.data.fields.SchemaField( {
                    class: new DocumentUUIDField( ClassTemplate, {
                        label: "ED.Item.Class.source"
                    } ),
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
                integer: true,
                label: "ED.Item.Ability.rank"
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