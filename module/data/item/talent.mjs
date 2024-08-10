import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";

/**
 * Data model template with information on talent items.
 * @mixes ItemDescriptionTemplate
 */
export default class TalentData extends AbilityTemplate.mixin(
  ItemDescriptionTemplate
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      talentCategory: new fields.StringField( {
        required: true,
        nullable: false,
        blank:    false,
        initial:  "discipline",
        label:    "ED.Data.Item.Labels.talentCategory",
        hint:     "ED.Data.Item.Hints.talentCategory",
      } ),
      talentIdentifier: new fields.StringField( {
        required: true,
        nullable: true,
        blank:    true,
        // prefill with the uuid of the talent on creation+talentname??? or just talentname will see
        label:    "ED.Data.Item.Labels.talentIdentifier",
        hint:     "ED.Data.Item.Hints.talentIdentifier",
      } ),
      magic: new fields.SchemaField( {
        threadWeaving: new fields.BooleanField( {
          required: true,
          nullable: false,
          initial:  false,
          label:    "ED.Data.Item.Labels.talentThreadWeaving",
          hint:     "X.does this talent represent a thread weaving talent"
        } ),
        spellcasting: new fields.BooleanField( {
          required: true,
          nullable: false,
          initial:  false,
          label:    "ED.Data.Item.Labels.talentSpellcasting",
          hint:     "X.does this talent represent the spellcasting talent"
        } ),
        magicType: new fields.StringField( {
          required: true,
          nullable: true,
          blank:    true,
          trim:     true,
          choices:  ED4E.spellcastingTypes,
          label:    "ED.Data.Item.Labels.talentMagicType",
          hint:     "X.the type of thread weaving this talent belongs to",
        } ),
      }, {
        required: true,
        nullable: false,
        label:    "ED.Item.Header.magicTalent",
        hint:     "X.Talent information for spellcasting",
      } ),
      sourceClass: new fields.SchemaField( {
        identifier: new fields.StringField( {
          required: true,
          nullable: true,
          blank:    true,
          label:    "ED.Data.Item.Labels.talentSourceClass",
          hint:     "ED.Data.Item.Hints.talentSourceClass",
        } ),
        levelAdded: new fields.NumberField( {
          required: true,
          nullable: true,
          integer:  true,
          label:    "ED.Item.Class.levelAdded",
          hint:     "X. the class level the talent is added to the Actor",
        } ),
      }, {
        label: "ED.Data.Item.Labels.talentSourceClass",
        hint:  "ED.Data.Item.Hints.talentSourceClass",
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
    // return !foundry.utils.isEmpty( this.parent?.actor?.classes );
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
    return game.i18n.localize( "ED.Rules.talentIncreaseShortRequirements" );
  }

  /**
   * @inheritDoc
   */
  get requiredLpForIncrease() {
    if ( !this.isActorEmbedded ) return undefined;

    const actor = this.parent.actor;
    const sourceClass = fromUuidSync( this.source.class );
    if ( !sourceClass ) return undefined;

    // each tier starts at the next value in the fibonacci sequence
    let tierModifier = ED4E.lpIndexModForTier[sourceClass.system.order][this.tier];

    if ( actor.isMultiDiscipline && this.level === 0 )
      return ED4E.multiDisciplineNewTalentLpCost[sourceClass.system.order][actor.minCircle];

    return ED4E.legendPointsCost[
    this.level
    + 1 // new level
    + ( tierModifier || 0 )
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
      requiredLp:  this.parent.actor.currentLp >= increaseData.requiredLp,
      maxLevel:    increaseData.newLevel <= game.settings.get( "ed4e", "lpTrackingMaxRankTalent" ),
      hasDamage:   increaseData.hasDamage,
      hasWounds:   increaseData.hasWounds,
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