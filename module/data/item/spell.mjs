import ItemDescriptionTemplate from "./templates/item-description.mjs";
import MagicTemplate from "./templates/magic-item.mjs";
import LearnableTemplate from "./templates/learnable.mjs";
import ED4E from "../../config.mjs";
import LearnSpellPrompt from "../../applications/advancement/learn-spell.mjs";

/**
 * Data model template with information on Spell items.
 * @mixes LearnableTemplate
 */
export default class SpellData extends MagicTemplate.mixin(
  ItemDescriptionTemplate,
  LearnableTemplate
)  {

  /** @inheritDoc */
  static defineSchema() {
    return this.mergeSchema( super.defineSchema(), {
            
    } );
  }

  /** @inheritDoc */
  get canBeLearned() {
    return true;
  }

  /**
   * @description The difficulty number to learn this spells. Equals the level of the spell plus 5.
   * @type {number}
   */
  get learningDifficulty() {
    return this.level + 5;
  }

  /** @inheritDoc */
  get requiredLpToLearn() {
    switch ( game.settings.get( "ed4e", "lpTrackingSpellCost" ) ) {
      case "noviceTalent": return ED4E.legendPointsCost[ this.level ];
      case "circleX100": return this.level * 100;
      case "free":
      default: return 0;
    }
  }

  /** @inheritDoc */
  async learn( actor, item ) {
    if ( !this.canBeLearned ) {
      ui.notifications.warn( game.i18n.localize( "ED.Notifications.Warn.cannotLearn" ) );
      return false;
    }

    const learn = await LearnSpellPrompt.waitPrompt( {
      actor: actor,
      spell: item,
    } );

    if ( !learn || learn === "cancel" || learn === "close" ) return false;

    const learnedItem = ( await actor.createEmbeddedDocuments(
      "Item", [ item.toObject() ]
    ) )?.[0];

    const updatedActor = await actor.addLpTransaction(
      "spendings",
      {
        amount:      learn === "spendLp" ? this.requiredLpToLearn : 0,
        description: game.i18n.format(
          "ED.Actor.LpTracking.Spendings",
        ),
        entityType:  this.parent.type,
        name:       this.parent.name,
        itemUuid:   this.parent.uuid,
      },
    );

    if ( foundry.utils.isEmpty( updatedActor ) )
      ui.notifications.warn(
        game.i18n.localize( "ED.Notifications.Warn.addLpTransactionProblems" )
      );

    return learnedItem ?? false;
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