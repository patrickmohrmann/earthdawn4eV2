import ClassTemplate from "./templates/class.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

/**
 * Data model template with information on discipline items.
 * @property {number} durability durability value
 */
export default class DisciplineData extends ClassTemplate.mixin(
  ItemDescriptionTemplate
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      durability: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.durability",
        hint:     "ED.Data.Item.Hints.durability",
      } ),
      // identifier for additional disciplines
      order: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      1,
        initial:  1,
        positive: true,
        integer:  true,
        label:    "ED.Data.Item.Labels.order",
        hint:     "ED.Data.Item.Hints.order",
      } ),
      disciplineIndex: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      1,
        initial:  1,
        positive: true,
        integer:  true,
      } ),
      spellcasting: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Data.Item.Labels.spellcasting",
        hint:     "ED.Data.Item.Hints.spellcasting",
      } ),
    } );
  }

  /* -------------------------------------------- */
  /*  LP Tracking                                 */
  /* -------------------------------------------- */

  /** @inheritDoc */
  get increaseValidationData() {
    if ( !this.isActorEmbedded ) return undefined;

    const nextLevel = this.level + 1;
    const nextLevelData = this.advancement.levels.find( l => l.level === nextLevel );
    const nextTalentLpCost = ED4E.legendPointsCost[ nextLevel + ED4E.lpIndexModForTier[ nextLevelData.tier ] ];
    return {
      [ED4E.validationCategories.base]:               [
        {
          name:      "ED.Legend.Validation.availableLp",
          value:     this.requiredLpForIncrease,
          fulfilled: this.requiredLpForIncrease <= this.parentActor.currentLp,
        },
      ],
      [ED4E.validationCategories.talentsRequirement]: [
        {
          name:      "ED.Legend.Validation.talentsRequirement",
          value:     "X Talents on current level",
          fulfilled: true,
        },
      ],
      [ED4E.validationCategories.newAbilityLp]:       [
        {
          name:      "ED.Legend.Validation.talentOptionLp",
          value:     nextTalentLpCost,
          fulfilled: nextTalentLpCost <= this.parentActor.currentLp,
        },
      ],
    }; // TODO NEXT
  }

  /** @inheritDoc */
  get learnRules() {
    return game.i18n.localize( "ED.Legend.Rules.disciplineLearnShortRequirements" );
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