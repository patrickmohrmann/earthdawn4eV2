import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

/**
 * Data model template with information on Skill items.
 * @mixes ItemDescriptionTemplate
 */
export default class SkillData extends AbilityTemplate.mixin(
  ItemDescriptionTemplate
)  {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      skillType: new fields.StringField( {
        required: true,
        initial:  "general",
        choices:  ED4E.skillTypes,
        label:    "ED.Data.Item.Labels.skillType",
        hint:     "ED.Data.Item.Hints.skillType",
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
    const actor = this.parent.actor;

    return {
      newLevel:   this.level + 1,
      requiredLp: this.requiredLpForIncrease,
      hasDamage:  actor.hasDamage( "standard" ),
      hasWounds:  actor.hasWounds( "standard" ),
    };
  }

  /**
   * @inheritDoc
   */
  get increaseRules() {
    return game.i18n.localize( "ED.Rules.skillIncreaseShortRequirements" );
  }

  /**
   * @inheritDoc
   */
  get requiredLpForIncrease() {
    // skill lp costs are equivalent to second discipline talents
    const tierModifier = ED4E.lpIndexModForTier[2][this.tier];

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
    return ( this.level + 1 ) * 10;
  }

  /**
   * @inheritDoc
   */
  get validationData() {
    if ( !this.isActorEmbedded ) return undefined;

    const increaseData = this.increaseData;
    return {
      requiredLp:    this.parent.actor.currentLp >= increaseData.requiredLp,
      requiredMoney: this.parent.actor.currentSilver >= this.requiredMoneyForIncrease,
      maxLevel:      increaseData.newLevel <= game.settings.get( "ed4e", "lpTrackingMaxRankSkill" ),
      hasDamage:     increaseData.hasDamage,
      hasWounds:     increaseData.hasWounds,
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