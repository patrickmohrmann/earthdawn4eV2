import ClassTemplate from "./templates/class.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import { getSingleGlobalItemByEdid } from "../../utils.mjs";
import ED4E from "../../config.mjs";
const { DialogV2 } = foundry.applications.api;

/**
 * Data model template with information on the questor path items.
 */
export default class QuestorData extends ClassTemplate.mixin(
  ItemDescriptionTemplate
) {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      questorDevotion: new fields.DocumentUUIDField( {
        required: true,
        nullable: true,
        type:     "Item",
        validate: ( value, options ) => {
          const item = fromUuidSync( value, {strict: false} );
          if ( item.system?.edid !== game.settings.get( "ed4e", "edidQuestorDevotion" ) ) return false;
          return undefined;
        },
        validationError: "must be a questor talent with the questor edId.",
        label:           this.labelKey( "questorDevotion" ),
        hint:            this.hintKey( "questorDevotion" ),
      } ),
    } );
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static metadata = Object.freeze( foundry.utils.mergeObject( super.metadata, {
    hasLinkedItems: true,
  }, {inplace: false} ) );


  /* -------------------------------------------- */
  /*  LP Tracking                                 */
  /* -------------------------------------------- */

  /** @inheritDoc */
  get canBeLearned() {
    return true;
  }

  /** @inheritDoc */
  async learn( actor, item ) {
    if ( !this.canBeLearned ) {
      ui.notifications.warn( game.i18n.localize( "ED.Notifications.Warn.cannotLearn" ) );
      return false;
    }

    // get the questor devotion
    const edidQuestorDevotion = game.settings.get( "ed4e", "edidQuestorDevotion" );
    let questorDevotion = await fromUuid( item.system.questorDevotion );
    questorDevotion ??= await getSingleGlobalItemByEdid( edidQuestorDevotion, "devotion" );
    questorDevotion ??= await Item.create( ED4E.documentData.Item.devotion.questor );

    await questorDevotion.update( {
      system: {
        edid: edidQuestorDevotion,
      },
    } );

    // "Do you want to become a questor of <passion>? This will grant you the following devotion automatically:"
    const questorDevotionLink = questorDevotion
      ? `@UUID[${questorDevotion.uuid}]{${questorDevotion.name}}`
      : game.i18n.localize( "ED.Dialogs.Legend.questorDevotionNotFound" );
    const content = ` 
      <p>${game.i18n.format( "ED.Dialogs.Legend.learnQuestorPrompt", {passion: item.name,} ) }</p>
      <p>${ questorDevotionLink }</p>
      `;

    const learn = await DialogV2.confirm( {
      rejectClose: false,
      content:     await TextEditor.enrichHTML( content ),
    } );

    if ( !learn ) return false;

    const questorDevotionData = questorDevotion?.toObject();
    questorDevotionData.name = `${questorDevotion.name} - ${item.name}`;
    questorDevotionData.system.level = 1;
    const learnedDevotion = ( await actor.createEmbeddedDocuments( "Item", [ questorDevotionData ] ) )?.[0];

    const questorItemData = item.toObject();
    questorItemData.system.level = 1;
    questorItemData.system.questorDevotion = learnedDevotion?.uuid;

    const learnedQuestor = ( await actor.createEmbeddedDocuments( "Item", [ questorItemData ] ) )?.[0];
    if ( !learnedDevotion || !learnedQuestor ) throw new Error(
      "Error learning questor item. Could not create embedded Items."
    );

    return learnedQuestor;
  }

  /* -------------------------------------------- */
  /*  Drop Events                                 */
  /* -------------------------------------------- */

  _onDropDevotion( event, data ) {
    // can be ignored since the validation is done in the schema
    /* fromUuid( data.uuid ).then( devotion => {
      if ( devotion.system.edid !== game.settings.get( "ed4e", "edidQuestorDevotion" ) ) {
        ui.notifications.error( "ED.Notifications.Error.dropQuestorEdidOnQuestor" );
        return data;
      }
    } ); */

    const questorItem = this.parent;
    questorItem.update( {
      "system.questorDevotion": data.uuid,
    } );

    return data;
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