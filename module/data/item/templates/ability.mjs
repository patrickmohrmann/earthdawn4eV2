import ClassTemplate from './class.mjs';
import TargetTemplate from "./targeting.mjs";
import ActionTemplate from "./action.mjs";
// import ED4E from '../../../config.mjs';

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
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            attribute: new fields.StringField( {
                required: false,
                nullable: true,
                blank: true,
                initial: "",
                label: "ED.Item.Ability.attribute"
            } ),
            source: new fields.SchemaField( {
                    class: new fields.DocumentUUIDField( ClassTemplate, {
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
            // combatAbilityType: new fields.StringField( {
            //     required: false,
            //     nullable: true,
            //     blank: true,
            //     initial: "",
            //     options: ED4E.combatType,
            //     label: "ED.Item.Ability.combatAbilityType"
            // } ),
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