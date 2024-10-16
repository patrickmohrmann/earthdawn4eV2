import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";
import KnackTemplate from "./templates/knack-item.mjs";
import PromptFactory from "../../applications/global/prompt-factory.mjs";

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
        nullable: true,
        blank:    false,
        initial:  null,
        trim:     true,
        choices:  ED4E.talentCategory,
        label:    this.labelKey( "Ability.talentCategory" ),
        hint:     this.hintKey( "Ability.talentCategory" )
      } ),
      magic: new fields.SchemaField( {
        threadWeaving: new fields.BooleanField( {
          required: true,
          nullable: false,
          initial:  false,
          label:    this.labelKey( "Ability.Magic.threadWeaving" ),
          hint:     this.hintKey( "Ability.Magic.threadWeaving" )
        } ),
        spellcasting: new fields.BooleanField( {
          required: true,
          nullable: false,
          initial:  false,
          label:    this.labelKey( "Ability.Magic.spellcasting" ),
          hint:     this.hintKey( "Ability.Magic.spellcasting" )
        } ),
        magicType: new fields.StringField( {
          required: true,
          nullable: true,
          blank:    true,
          trim:     true,
          choices:  ED4E.spellcastingTypes,
          label:    this.labelKey( "Ability.Magic.magicType" ),
          hint:     this.hintKey( "Ability.Magic.magicType" )
        } ),
      }, {
        required: true,
        nullable: false,
        label:    this.labelKey( "Ability.Magic.magic" ),
        hint:     this.hintKey( "Ability.Magic.magic" )
      } ),
      knacks: new fields.SchemaField( {
        available: new fields.SetField(
          new fields.DocumentUUIDField( {
            required:        true,
            nullable:        false,
            validate:        ( value, options ) => {
              if ( !fromUuidSync( value, {strict: false} )?.system?.hasMixin( KnackTemplate ) ) return false;
              return undefined; // undefined means do further validation
            },
            validationError:  "must be a knack type",
            label:            this.labelKey( "Ability.talentAvailableKnack" ),
            hint:             this.hintKey( "Ability.talentAvailableKnack" )
          } ),
          {
            required: true,
            nullable: false,
            initial:  [],
            label:    this.labelKey( "Ability.talentKnacksAvailable" ),
            hint:     this.hintKey( "Ability.talentKnacksAvailable" )
          }
        ),
        learned:   new fields.SetField(
          new fields.DocumentUUIDField( {
            required:        true,
            nullable:        false,
            validate:        ( value, options ) => {
              if ( !fromUuidSync( value, {strict: false} )?.system?.hasMixin( KnackTemplate ) ) return false;
              return undefined; // undefined means do further validation
            },
            validationError:  "must be a knack type",
            label:            this.labelKey( "Ability.talentLearnedKnack" ),
            hint:             this.hintKey( "Ability.talentLearnedKnack" )
          } ),
          {
            required: true,
            nullable: false,
            initial:  [],
            label:    this.labelKey( "Ability.talentKnacksLearned" ),
            hint:     this.hintKey( "Ability.talentKnacksLearned" )
          }
        ),
      }, {
        required: false,
        nullable: false,
        label:    this.labelKey( "Ability.talentKnacks" ),
        hint:     this.hintKey( "Ability.talentKnacks" )
      } )
    } );
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static metadata = Object.freeze( foundry.utils.mergeObject( super.metadata, {
    hasLinkedItems: true,
  }, {inplace: false} ) );

  /* -------------------------------------------- */

  /** @inheritdoc */
  static _cleanData( source, options ) {
    if ( source?.knacks?.available ) {
      source.knacks.available = source.knacks.available.filter( knackUuid => !!fromUuidSync( knackUuid ) );
      if ( options ) options.source = source;
    }
  }

  /* -------------------------------------------- */
  /*  LP Tracking                                 */
  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  get canBeIncreased() {
    return this.isActorEmbedded
      && Object.values(
        this.increaseValidationData
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
  get increaseValidationData() {
    if ( !this.isActorEmbedded ) return undefined;

    const increaseData = this.increaseData;
    return {
      [ED4E.validationCategories.base]:      [
        {
          name:      "ED.Dialogs.Legend.Validation.maxLevel",
          value:     increaseData.newLevel,
          fulfilled: increaseData.newLevel <= game.settings.get( "ed4e", "lpTrackingMaxRankTalent" ),
        },
      ],
      [ED4E.validationCategories.resources]: [
        {
          name:      "ED.Dialogs.Legend.Validation.availableLp",
          value:     this.requiredLpForIncrease,
          fulfilled: this.requiredLpForIncrease <= this.parent.actor.currentLp,
        },
        {
          name:      "ED.Dialogs.Legend.Validation.availableMoney",
          value:     this.requiredMoneyForIncrease,
          fulfilled: this.requiredMoneyForIncrease <= this.parent.actor.currentSilver,
        },
      ],
      [ED4E.validationCategories.health]:    [
        {
          name:      "ED.Dialogs.Legend.Validation.hasDamage",
          value:     increaseData.hasDamage,
          fulfilled: !increaseData.hasDamage,
        },
        {
          name:      "ED.Dialogs.Legend.Validation.hasWounds",
          value:     increaseData.hasWounds,
          fulfilled: !increaseData.hasWounds,
        },
      ],
    };
  }

  /**
   * @inheritDoc
   */
  async increase() {
    return super.increase();
  }

  /** @inheritDoc */
  static async learn( actor, item, createData = {} ) {
    const learnedItem = await super.learn( actor, item, createData );
    if ( learnedItem ) {
      // assign the talent category
      const promptFactoryItem = PromptFactory.fromDocument( learnedItem );
      let category = await promptFactoryItem.getPrompt( "talentCategory" );

      // assign the level at which the talent was learned

      const promptFactoryActor = PromptFactory.fromDocument( actor );
      const disciplineUuid = await promptFactoryActor.getPrompt( "chooseDiscipline" );
      const discipline = await fromUuid( disciplineUuid );
      const learnedAt = discipline.system.level;

      const updateData = {
        system: {},
      };
      if ( category ) updateData.system.talentCategory = category;
      if ( learnedAt >= 0 ) updateData.system.source = {
        class:   discipline.uuid,
        atLevel: learnedAt,
      };

      await learnedItem.update( updateData );
    }
    return learnedItem;
  }

  /* -------------------------------------------- */
  /*  Socket Events                               */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onCreate( data, options, user ) {
    if ( !await super._preCreate( data, options, user ) ) return false;

    // assign the source talent
  }

  /* -------------------------------------------- */
  /*  Drop Events                                 */
  /* -------------------------------------------- */

  _onDropKnack( event, data ) {
    const item = this.parent;
    item.update( {
      "system.knacks.available": [ ...this.knacks.available, data.uuid ],
    } );
    fromUuid( data.uuid ).then( knack => {
      if ( !knack.system.sourceTalentUuid ) knack.update( {
        "system.sourceTalentUuid": item.uuid,
      } );
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