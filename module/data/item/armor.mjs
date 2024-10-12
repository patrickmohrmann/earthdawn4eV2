import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on "class"-like items: paths, disciplines, and questors.
 * @property {number} physicalArmor                     Physical Armor
 * @property {number} mysticalArmor                     Mystical Armor
 * @property {number} forgeBonusPhysical                  Forge Bonus for Physical Armor
 * @property {number} forgeBonusMystical                  Forge Bonus for Mystical Armor
 * @property {number} initiativePenalty                   Initiative Penalty
 * @property {object} piecemealArmor                    piecemeal armor Object
 * @property {boolean} piecemealArmor.piecemealArmorSelector    selector if armor is piecemeal or not
 * @property {number} piecemealArmor.piecemealArmorSize         piecemeal Armor size value can be 1, 2 or 3
 */
export default class ArmorData extends PhysicalItemTemplate.mixin(
  ItemDescriptionTemplate
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      physical: new fields.SchemaField( {
        armor: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Armor.physicalArmor",
          hint:     "ED.Data.Item.Hints.Armor.physicalArmor",
        } ), 
        forgeBonus: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Armor.forgeBonusPhysical",
          hint:     "ED.Data.Item.Hints.Armor.forgeBonusPhysical",
        } ),
      } ),
      mystical: new fields.SchemaField( {
        armor: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Armor.mysticalArmor",
          hint:     "ED.Data.Item.Hints.Armor.mysticalArmor",
        } ),
        forgeBonus: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Armor.forgeBonusMystical",
          hint:     "ED.Data.Item.Hints.Armor.forgeBonusMystical",
        } ),
      } ),
      initiativePenalty: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.Armor.initiativePenalty",
        hint:     "ED.Data.Item.Hints.Armor.initiativePenalty",
      } ),
      living: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.Armor.living",
        hint:     "ED.Data.Item.Hints.Armor.living"
      } ),
      piecemealArmor: new fields.SchemaField( {
        selector: new fields.BooleanField( {
          required: true,
          initial:  false,
          label:    "ED.Data.Item.Labels.Armor.piecemealArmor",
          hint:     "ED.Data.Item.Hints.Armor.piecemealArmor",
        } ),
        size: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          max:      3,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.Armor.piecemealArmorSize",
          hint:     "ED.Data.Item.Hints.Armor.piecemealArmorSize",
        } ),
      }, {
        required: true,
        nullable: false,
        label:    "ED.Data.Item.Labels.Armor.piecemealArmor",
        hint:     "ED.Data.Item.Hints.Armor.piecemealArmor",
      } ),
    } );
  }

  /* -------------------------------------------- */
  /*  Getters                       */
  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Migrations                        */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static migrateData( source ) {
    super.migrateData( source );
    // specific migration functions
  }
}