import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on weapon items.
 * @property {string} weaponType            type of weapon
 * @property {string} damageAttribute       base attribute used for damage
 * @property {number} damageBaseStep        weapon basic damage step
 * @property {number} size                  weapon size 1-7
 * @property {number} strengthMinimum       strength minimum to use without penalty
 * @property {number} dexterityMinimum      dexterity minimum to use without penalty
 * @property {number} rangeShort            short range
 * @property {number} rangeLong             long range
 * @property {number} ammunition            ammunition amount
 * @property {number} forgeBonus            forged damage bonus
 */
export default class WeaponData extends PhysicalItemTemplate{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            weaponType: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Weapon.Label.weaponType",
                hint: "ED.Item.Weapon.Hint.weaponType"
            } ), 
            // @Chris kann ich hier bei initial auf die Config verweisen?
            damageAttribute: new foundry.data.fields.StringField( {
                required: true,
                nullable: false,
                initial: "strength",
                label: "ED.Item.Weapon.Label.damageAttribute",
                hint: "ED.Item.Weapon.Hint.damageAttribute"
            } ),
            damageBaseStep: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Weapon.Label.damageBaseStep",
                hint: "ED.Item.Weapon.Hint.damageBaseStep"
            } ),
            size: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                max: 7,
                initial: 1,
                label: "ED.Item.Weapon.Label.size",
                hint: "ED.Item.Weapon.Hint.size"
            } ),
            strengthMinimum: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 3,
                initial: 3,
                label: "ED.Item.Weapon.Label.strengthMinimum",
                hint: "ED.Item.Weapon.Hint.strengthMinimum"
            } ),
            dexterityMinimum: new foundry.data.fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                label: "ED.Item.Weapon.Label.dexterityMinimum",
                hint: "ED.Item.Weapon.Hint.dexterityMinimum"
            } ),
            rangeShort: new foundry.data.fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                initial: 0,
                label: "ED.Item.Weapon.Label.rangeShort",
                hint: "ED.Item.Weapon.Hint.rangeShort"
            } ),
            rangeLong: new foundry.data.fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                initial: 0,
                label: "ED.Item.Weapon.Label.rangeLong",
                hint: "ED.Item.Weapon.Hint.rangeLong"
            } ),
            ammunition: new foundry.data.fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                label: "ED.Item.Weapon.Label.ammunition"
            } ),
            forgeBonus: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Weapon.Label.forgeBonus",
                hint: "ED.Item.Weapon.Hint.forgeBonus"
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