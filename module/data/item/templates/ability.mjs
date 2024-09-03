import ClassTemplate from "./class.mjs";
import TargetTemplate from "./targeting.mjs";
import ActionTemplate from "./action.mjs";
import ED4E from "../../../config.mjs";
import LpIncreaseTemplate from "./lp-increase.mjs";
import LearnableTemplate from "./learnable.mjs";
import PromptFactory from "../../../applications/global/prompt-factory.mjs";
import LpSpendingTransactionData from "../../advancement/lp-spending-transaction.mjs";
const isEmpty = foundry.utils.isEmpty;

/**
 * Data model template with information on Ability items.
 * @property {string} attribute attribute
 * @property {object} source Class Source
 * @property {string} source.class class
 * @property {string} source.tier talent tier
 * @property {number} level rank
 * @mixes LearnableTemplate
 * @mixes LpIncreaseTemplate
 * @mixes TargetTemplate
 */
export default class AbilityTemplate extends ActionTemplate.mixin(
  LearnableTemplate,
  LpIncreaseTemplate,
  TargetTemplate
) {
  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      attribute: new fields.StringField( {
        required: false,
        nullable: true,
        blank:    true,
        initial:  "",
        label:    "ED.Item.Ability.attribute"
      } ),
      tier: new fields.StringField( {
        nullable: false,
        blank:    false,
        choices:  ED4E.tier,
        initial:  "novice",
        label:    "ED.Item.Ability.tier"
      } ),
      source: new fields.SchemaField( {
        class: new fields.DocumentUUIDField( ClassTemplate, {
          label: "ED.Item.Class.source",
          hint:  "X.the uuid of the class this ability is learned through"
        } ),
        atLevel: new fields.NumberField( {
          required: false,
          nullable: true,
          min:      0,
          integer:  true,
          label:    "ED.Item.Source.atLevel"
        } ),
      },
      {
        required: false
      } ),
      level: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Item.Ability.rank"
      } ),
      rollType: new fields.StringField( {
        required: false,
        nullable: true,
        blank:    true,
        initial:  "",
        choices:  ED4E.rollTypes,
        label:    "ED.Item.Ability.type"
      } ),
      damageAbilities: new fields.SchemaField( {
        damage: new fields.BooleanField( {
          required: false,
          nullable: false,
          initial:  false,
          label:    "ED.Item.Ability.damage"
        } ),
        substitute: new fields.BooleanField( {
          required: false,
          nullable: false,
          initial:  false,
          label:    "ED.Item.Ability.substitute"
        } ),
        relatedRollType: new fields.StringField( {
          required: false,
          nullable: true,
          blank:    true,
          initial:  "",
          choices:  ED4E.rollTypes,
          label:    "ED.Item.Ability.relatedRollType"
        } ),
      } ),
    } );
  }

  /** @inheritDoc */
  get canBeLearned() {
    return true;
  }

  async adjustLevel( amount ) {
    const currentLevel = this.level;
    const updatedItem = await this.parent.update( {
      "system.level": currentLevel + amount,
    } );

    if ( isEmpty( updatedItem ) ) {
      ui.notifications.warn(
        game.i18n.localize( "ED.Notifications.Warn.abilityIncreaseProblems" )
      );
      return;
    }

    return updatedItem;
  }

  /**
   * @inheritDoc
   */
  async increase() {
    if ( !this.isActorEmbedded ) return;

    const promptFactory = PromptFactory.fromDocument( this.parent );
    const spendLp = await promptFactory.getPrompt( "lpIncrease" );

    if ( !spendLp
      || spendLp === "cancel"
      || spendLp === "close" ) return;

    const currentLevel = this.level;

    const updatedItem = await this.parent.update( {
      "system.level": currentLevel + 1,
    } );

    if ( foundry.utils.isEmpty( updatedItem ) ) {
      ui.notifications.warn(
        game.i18n.localize( "ED.Notifications.Warn.abilityIncreaseProblems" )
      );
      return;
    }

    const updatedActor = await this.parent.actor.addLpTransaction(
      "spendings",
      LpSpendingTransactionData.dataFromLevelItem(
        this.parent,
        spendLp === "spendLp" ? this.requiredLpForIncrease : 0,
        this.lpSpendingDescription,
      ),
    );

    if ( foundry.utils.isEmpty( updatedActor ) )
      ui.notifications.warn(
        game.i18n.localize( "ED.Notifications.Warn.abilityIncreaseProblems" )
      );

    return this.parent;
  }

  /** @inheritDoc */
  static async learn( actor, item, createData ) {
    if ( !item.system.canBeLearned ) {
      ui.notifications.warn( game.i18n.localize( "ED.Notifications.Warn.cannotLearn" ) );
      return;
    }

    let learn = "learn";
    if ( item.system.increasable ) {
      const promptFactory = PromptFactory.fromDocument( item );
      learn = await promptFactory.getPrompt( "learnAbility" );
    }

    if ( !learn || learn === "cancel" || learn === "close" ) return;

    const itemData = foundry.utils.mergeObject(
      item.toObject(),
      foundry.utils.expandObject( createData ),
    );
    if ( !createData.system.level ) itemData.system.level = 0;
    const learnedItem = ( await actor.createEmbeddedDocuments( "Item", [ itemData ] ) )?.[0];

    if ( learnedItem && learn === "learn" && item.system.increasable ) await learnedItem.system.increase();

    return learnedItem;
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