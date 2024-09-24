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
          hint:     "ED.Item.Shield.Label.defenseBonusPhysical",
          label:    "ED.Item.Shield.Hint.defenseBonusPhysical"
        } ),
        mystical: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          hint:     "ED.Item.Shield.Label.defenseBonusMystical",
          label:    "ED.Item.Shield.Hint.defenseBonusMystical"
        } ),
      } ),
      initiativePenalty: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        hint:     "ED.Item.Shield.Label.initiativePenalty",
        label:    "ED.Item.Shield.Hint.initiativePenalty"
      } ),
      shatterThreshold: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        hint:     "ED.Item.Shield.Label.shatterThreshold",
        label:    "ED.Item.Shield.Hint.shatterThreshold"
      } ),
      broken: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Item.Shield.Label.broken"
      } ),
      isLivingArmor: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.livingArmor",
        hint:     "ED.Data.Item.Hints.livingArmor"
      } ),
      bowUsage: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Item.Shield.Label.bowUsage"
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