import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data model template with information on shield items.
 */
export default class ShieldData extends PhysicalItemTemplate{

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            defenseBonusPhysical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                hint: "ED.Item.Shield.Label.defenseBonusPhysical",
                label: "ED.Item.Shield.Hint.defenseBonusPhysical"
            } ),
            defenseBonusMystical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                hint: "ED.Item.Shield.Label.defenseBonusMystical",
                label: "ED.Item.Shield.Hint.defenseBonusMystical"
            } ),
            initiativePenalty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                hint: "ED.Item.Shield.Label.initiativePenalty",
                label: "ED.Item.Shield.Hint.initiativePenalty"
            } ),
            shatterThreshold: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                hint: "ED.Item.Shield.Label.shatterThreshold",
                label: "ED.Item.Shield.Hint.shatterThreshold"
            } ),
    } );
    }

    // "templatesItem": [
    //     "itemBasics",
    //     "equipmentBasics",
    //     "detailsEquipment",
    //     "detailsGeneral"
    // ],
    // "defenseBonusPhysical": 0,
    // "defenseBonusMystical": 0,
    // "initiativePenalty": 0,
    // "shatterThreshold": 0

    /* -------------------------------------------- */
    /*  Migrations                                  */
    /* -------------------------------------------- */

    /** @inheritDoc */
    static migrateData( source ) {
        super.migrateData( source );
        // specific migration functions
    }
}