import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on shield items.
 * @property {number} defenseBonusPhysical    physical defense bonus
 * @property {number} defenseBonusMystical    mystical defense bonus
 * @property {number} initiativePenalty     initiative penalty
 * @property {number} shatterThreshold      shatter threshold
 * @property {boolean} broken           broken condition
 */
export default class ShieldData extends PhysicalItemTemplate.mixin(
  ItemDescriptionTemplate
) {
  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      defenseBonus: new fields.SchemaField( {
        physical: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Shields.defenseBonusPhysical",
          hint:     "ED.Data.Item.Hints.Shields.defenseBonusPhysical"
        } ),
        mystical: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Shields.defenseBonusMystical",
          hint:     "ED.Data.Item.Hints.Shields.defenseBonusMystical"
        } ),
      } ),
      initiativePenalty: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.Shields.initiativePenalty",
        hint:     "ED.Data.Item.Hints.Shields.initiativePenalty"
      } ),
      shatterThreshold: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.Shields.shatterThreshold",
        hint:     "ED.Data.Item.Hints.Shields.shatterThreshold"
      } ),
      broken: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.Shields.broken",
        hint:     "ED.Data.Item.Hints.Shields.broken"
      } ),
      living: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.Shields.livingArmor",
        hint:     "ED.Data.Item.Hints.Shields.livingArmor"
      } ),
      bowUsage: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.Shields.bowUsage",
        hint:     "ED.Data.Item.Hints.Shields.bowUsage"
      } ),
    } );
  }
  /* -------------------------------------------- */
  /*  Migrations                  */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static migrateData( source ) {
    super.migrateData( source );
    // specific migration functions
  }
}