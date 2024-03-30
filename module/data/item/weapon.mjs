import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on weapon items.
 * @property {string} weaponType            type of weapon
 * @property {object} damage                damage object
 * @property {string} damage.attribute       base attribute used for damage
 * @property {number} damage.baseStep        weapon basic damage step
 * @property {number} size                  weapon size 1-7
 * @property {number} strengthMinimum       strength minimum to use without penalty
 * @property {number} dexterityMinimum      dexterity minimum to use without penalty
 * @property {number} rangeShort            short range
 * @property {number} rangeLong             long range
 * @property {number} ammunition            ammunition amount
 * @property {number} forgeBonus            forged damage bonus
 */
export default class WeaponData extends PhysicalItemTemplate.mixin(
    ItemDescriptionTemplate
) {
    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            weaponType: new fields.StringField( {
                required: true,
                nullable: false,
                initial: "melee",
                label: "ED.Item.Weapon.Label.weaponType",
                hint: "ED.Item.Weapon.Hint.weaponType"
            } ), 
            damage: new fields.SchemaField( {
                attribute: new fields.StringField( {
                    required: true,
                    nullable: false,
                    initial: "strength",
                    label: "ED.Item.Weapon.Label.damageAttribute",
                    hint: "ED.Item.Weapon.Hint.damageAttribute"
                } ),
                baseStep: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Weapon.Label.damageBaseStep",
                    hint: "ED.Item.Weapon.Hint.damageBaseStep"
                } ),
            } ),
            size: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                max: 7,
                initial: 1,
                integer: true,
                positive: true,
                label: "ED.Item.Weapon.Label.size",
                hint: "ED.Item.Weapon.Hint.size"
            } ),
            strengthMinimum: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 3,
                initial: 3,
                integer: true,
                label: "ED.Item.Weapon.Label.strengthMinimum",
                hint: "ED.Item.Weapon.Hint.strengthMinimum"
            } ),
            dexterityMinimum: new fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                integer: true,
                label: "ED.Item.Weapon.Label.dexterityMinimum",
                hint: "ED.Item.Weapon.Hint.dexterityMinimum"
            } ),
            range: new fields.SchemaField( {
                short: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.ShipWeapon.rangeShort"
                } ), 
                long: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.ShipWeapon.rangeLong"
                } ), 
            } ),
            ammunition: new fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                integer: true,
                label: "ED.Item.Weapon.Label.ammunition"
            } ),
            forgeBonus: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
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