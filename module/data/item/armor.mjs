import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 * @property {number} physicalArmor                               Physical Armor
 * @property {number} mysticalArmor                               Mystical Armor
 * @property {number} forgeBonusPhysical                          Forge Bonus for Physical Armor
 * @property {number} forgeBonusMystical                          Forge Bonus for Mystical Armor
 * @property {number} initiativePenalty                           Initiative Penalty
 * @property {object} piecemealArmor                              piecemeal armor Object
 * @property {boolean} piecemealArmor.piecemealArmorSelector       selector if armor is piecemeal or not
 * @property {number} piecemealArmor.piecemealArmorSize           piecemeal Armor size value can be 1, 2 or 3
 */
export default class ArmorData extends PhysicalItemTemplate{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            physicalArmor: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Armor.physicalArmor"
            } ), 
            mysticalArmor: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Armor.mysticalArmor"
            } ),
            forgeBonusPhysical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Armor.forgeBonusPhysical"
            } ),
            forgeBonusMystical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Armor.forgeBonusMystical"
            } ),
            initiativePenalty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Armor.initiativePenalty"
            } ),
            piecemealArmor: new foundry.data.fields.SchemaField( {
                // should be false by default @chris how is that set?
                piecemealArmorSelector: new foundry.data.fields.BooleanField( {
                    required: true,
                    label: "ED.Item.Armor.initiativePenalty"
                } ),
                piecemealArmorSize: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 3,
                    initial: 0,
                    label: "ED.Item.Armor.initiativePenalty"
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