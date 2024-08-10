import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

/**
 * Data model template with information on Devotion items.
 */
export default class DevotionData extends AbilityTemplate.mixin(
  ItemDescriptionTemplate
)  {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      devotionRequired: new fields.BooleanField( {
        required: true,
        initial:  false,
        label:    "ED.Item.Devotion.label.devotionRequired",
        hint:     "ED.Item.Devotion.hint.devotionRequired"
      } ),
      durability: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Item.Class.durability"
      } ),
    } );
  }

  /**
   * @inheritDoc
   */
  get canBeIncreased() {
    return this.isActorEmbedded
      && Object.values(
        this.validationData
      ).every( Boolean );
  }

  /**
   * @inheritDoc
   */
  get canBeLearned() {
    return true;
    // return [ "pc", "npc" ].includes( this.parent.actor?.type );
  }

  /**
   * @inheritDoc
   */
  get increaseData() {
    if ( !this.isActorEmbedded ) return undefined;

    return {
      newLevel:   this.level + 1,
      requiredLp: this.requiredLpForIncrease,
    };
  }

  /**
   * @inheritDoc
   */
  get increaseRules() {
    return game.i18n.localize( "ED.Rules.devotionIncreaseShortRequirements" );
  }

  /**
   * @inheritDoc
   */
  get requiredLpForIncrease() {
    // devotion lp costs are equivalent to first discipline talents
    const tierModifier = ED4E.lpIndexModForTier[1][this.tier];

    return ED4E.legendPointsCost[
      this.level
    + 1 // new level
    +  tierModifier
    ];
  }

  /**
   * @inheritDoc
   */
  get requiredMoneyForIncrease() {
    return 0;
  }

  /**
   * @inheritDoc
   */
  get validationData() {
    if ( !this.isActorEmbedded ) return undefined;

    const increaseData = this.increaseData;
    return {
      requiredLp:    this.parent.actor.currentLp >= increaseData.requiredLp,
      maxLevel:      increaseData.newLevel <= game.settings.get( "ed4e", "lpTrackingMaxRankSkill" ),
    };
  }

  /**
   * @inheritDoc
   */
  async increase() {
    return super.increase();
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
