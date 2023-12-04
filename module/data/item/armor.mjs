import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 * @property {number} physicalArmor                               Physical Armor
 * @property {number} mysticalArmor                               Mystical Armor
 * @property {number} forgeBonusPhysical                          Forge Bonus for Physical Armor
 * @property {number} forgeBonusMystical                          Forge Bonus for Mystical Armor
 * @property {number} initiativePenalty                           Initiative Penalty
 * @property {object} piecemealArmor                              piecemeal armor Object
 * @property {boolean} piecemealArmor.piecemealArmorSelector      selector if armor is piecemeal or not
 * @property {number} piecemealArmor.piecemealArmorSize           piecemeal Armor size value can be 1, 2 or 3
 */
export default class ArmorData extends PhysicalItemTemplate.mixin(
    ItemDescriptionTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            physical: new foundry.data.fields.SchemaField( {
                armor: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Armor.physicalArmor"
                } ), 
                forgeBonus: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Armor.forgeBonusPhysical"
                } ),
            } ),
            mystical: new foundry.data.fields.SchemaField( {
                armor: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Armor.mysticalArmor"
                } ),
                forgeBonus: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Armor.forgeBonusMystical"
                } ),
            } ),
            initiativePenalty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Armor.initiativePenalty"
            } ),
            piecemealArmor: new foundry.data.fields.SchemaField( {
                selector: new foundry.data.fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Item.Armor.piecemealArmor"
                } ),
                size: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 3,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Armor.piecemealArmorSize"
                } ),
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