import ActorEd from "../../documents/actor.mjs";
import SystemDataModel from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";


/**
 * Data model template with information on Curse and Horror Mark items.
 * @property {number} step                  curse step
 * @property {string} curseType             type of the curse
 * @property {boolean} curseActive          is the curse active
 * @property {boolean} curseDetected        is the curse known
 */
export default class CurseHorrorMarkData extends SystemDataModel.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            step: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Curse.step"
            } ), 
            type: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "minor",
                label: "ED.Item.Curse.curseType"
            } ),
            active: new foundry.data.fields.BooleanField( {
                required: true,
                label: "ED.Item.Curse.curseActive"
            } ),
            detected: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Curse.curseDetected"
            } ),
            source: new foundry.data.fields.ForeignDocumentField( SystemDataModel, {
                idOnly: true,
            } ),
            target: new foundry.data.fields.ForeignDocumentField( ActorEd, {
                idOnly: true,
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