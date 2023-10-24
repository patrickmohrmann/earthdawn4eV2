import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
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
                positive: true,
                label: "ED.Item.Armor.physicalArmor"
            } ), 
            mysticalArmor: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.Armor.mysticalArmor"
            } ),
            forgeBonusPhysical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.Armor.forgeBonusPhysical"
            } ),
            forgeBonusMystical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.Armor.forgeBonusMystical"
            } ),
            initiativePenalty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.Armor.initiativePenalty"
            } ),
            piecemealArmor: new foundry.data.fields.SchemaField( {
                // should be false by default @chris how is that set?
                piecemealArmor: new foundry.data.fields.BooleanField( {
                    required: true,
                    label: "ED.Item.Armor.initiativePenalty"
                } ),
                piecemealArmorSize: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 3,
                    initial: 0,
                    positive: true,
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