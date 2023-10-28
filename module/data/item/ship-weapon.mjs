import SystemDataModel from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on namegiver items.
 * @property {number} firePowerPoints   Fire power of the weapon
 * @property {number} crewWeapon        required crew to handle the weapon
 * @property {number} rangeShort        short range
 * @property {number} rangeLong         long range
 * @property {number} salvoCost         cost per salvo
 * @property {number} charakterDamage   weapon damage on a sentient being
 */
export default class ShipWeaponData extends SystemDataModel.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            firePowerPoints: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ShipWeapon.firePowerPoints"
            } ), 
            crewWeapon: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ShipWeapon.crewWeapon"
            } ), 
            rangeShort: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ShipWeapon.rangeShort"
            } ), 
            rangeLong: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ShipWeapon.rangeLong"
            } ), 
            salvoCost: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ShipWeapon.salvoCost"
            } ), 
            charakterDamage: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.ShipWeapon.charakterDamage"
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