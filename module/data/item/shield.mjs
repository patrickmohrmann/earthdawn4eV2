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
                hint: "ED.Item.Shield.Label.defenseBonusPhysical",
                label: "ED.Item.Shield.Hint.defenseBonusPhysical"
            } ),
            defenseBonusMystical: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                hint: "ED.Item.Shield.Label.defenseBonusMystical",
                label: "ED.Item.Shield.Hint.defenseBonusMystical"
            } ),
            initiativePenalty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                hint: "ED.Item.Shield.Label.initiativePenalty",
                label: "ED.Item.Shield.Hint.initiativePenalty"
            } ),
            shatterThreshold: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                hint: "ED.Item.Shield.Label.shatterThreshold",
                label: "ED.Item.Shield.Hint.shatterThreshold"
            } ),
            broken: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Shield.Hint.broken"
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