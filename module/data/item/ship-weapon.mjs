import { ItemDataModel } from "../abstract.mjs";
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
export default class ShipWeaponData extends ItemDataModel.mixin(
  ItemDescriptionTemplate
) {
  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      firePowerPoints: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Item.ShipWeapon.firePowerPoints"
      } ), 
      crewWeapon: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Item.ShipWeapon.crewWeapon"
      } ), 
      range: new fields.SchemaField( {
        short: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Item.ShipWeapon.rangeShort"
        } ), 
        long: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Item.ShipWeapon.rangeLong"
        } ), 
      } ),
      salvoCost: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Item.ShipWeapon.salvoCost"
      } ), 
      characterDamage: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Item.ShipWeapon.characterDamage"
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