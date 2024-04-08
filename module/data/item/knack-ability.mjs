import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import { KnackTemplate } from "./_module.mjs";

/**
 * Data model template with information on Knack items.
 * @property {string} sourceTalent          talent the knack is derived from
 * @property {string} restrictions          restrictions of the knack
 * @property {object} requirements          requirement of the knack
 * @property {boolean} standardEffect       standard effect used
 * @property {boolean} maneuver             maneuver knack
 * @property {number} extraSuccesses        extra successes to trigger the maneuver
 */
export default class KnackAbilityData extends KnackTemplate.mixin(
    AbilityTemplate, 
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            // TODO @Chris how do we do this
            // restrictions: [], // there will be several options possible see issue #212
            // requirements: [], // there will be several options possible see issue #212 
            standardEffect: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Knack.standardEffect"
            } ),
            maneuver: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Knack.maneuver"
            } ),
            extraSuccesses: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Knack.extraSuccesses"
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