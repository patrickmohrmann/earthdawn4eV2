import AbilityTemplate from "./templates/ability.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ED4E from "../../config.mjs";
import KnackTemplate from "./templates/knack-item.mjs";

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
        label:    this.labelKey( "talentCategory" ),
        hint:     this.hintKey( "talentCategory" ),
      } ),
      magic: new fields.SchemaField( {
        threadWeaving: new fields.BooleanField( {
          required: true,
          nullable: false,
          initial:  false,
          label:    this.labelKey( "talentThreadWeaving" ),
          hint:     this.hintKey( "talentThreadWeaving" ),
        } ),
        spellcasting: new fields.BooleanField( {
          required: true,
          nullable: false,
          initial:  false,
          label:    this.labelKey( "talentSpellcasting" ),
          hint:     this.hintKey( "talentSpellcasting" ),
        } ),
        magicType: new fields.StringField( {
          required: true,
          nullable: true,
          blank:    true,
          trim:     true,
          choices:  ED4E.spellcastingTypes,
          label:    this.labelKey( "talentMagicType" ),
          hint:     this.hintKey( "talentMagicType" ),
        } ),
      }, {
        required: true,
        nullable: false,
        label:    this.labelKey( "talentMagic" ),
        hint:     this.hintKey( "talentMagic" ),
      } ),
      sourceClass: new fields.SchemaField( {
        identifier: new fields.StringField( {
          required: true,
          nullable: true,
          blank:    true,
          label:    this.labelKey( "talentSourceClassId" ),
          hint:     this.hintKey( "talentSourceClassId" ),
        } ),
        levelAdded: new fields.NumberField( {
          required: true,
          nullable: true,
          integer:  true,
          label:    this.labelKey( "talentSourceClassLevel" ),
          hint:     this.hintKey( "talentSourceClassLevel" ),
        } ),
      }, {
        label: this.labelKey( "talentSourceClass" ),
        hint:  this.hintKey( "talentSourceClass" ),
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
            validationError: "must be a knack type",
            label:           this.labelKey( "talentAvailableKnack" ),
            hint:            this.hintKey( "talentAvailableKnack" ),
          } ),
          {
            required: true,
            nullable: false,
            initial:  [],
            label:    this.labelKey( "talentKnacksAvailable" ),
            hint:     this.hintKey( "talentKnacksAvailable" ),
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
            validationError: "must be a knack type",
            label:           this.labelKey( "talentLearnedKnack" ),
            hint:            this.hintKey( "talentLearnedKnack" ),
          } ),
          {
            required: true,
            nullable: false,
            initial:  [],
            label:    this.labelKey( "talentKnacksLearned" ),
            hint:     this.hintKey( "talentKnacksLearned" ),
          }
        ),
      }, {
        required: false,
        nullable: false,
        label:    this.labelKey( "talentKnacks" ),
        hint:     this.hintKey( "talentKnacks" ),
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
          name:      "ED.Legend.Validation.maxLevel",
          value:     increaseData.newLevel,
          fulfilled: increaseData.newLevel <= game.settings.get( "ed4e", "lpTrackingMaxRankTalent" ),
        },
      ],
      [ED4E.validationCategories.resources]: [
        {
          name:      "ED.Legend.Validation.availableLp",
          value:     this.requiredLpForIncrease,
          fulfilled: this.requiredLpForIncrease <= this.parent.actor.currentLp,
        },
        {
          name:      "ED.Legend.Validation.availableMoney",
          value:     this.requiredMoneyForIncrease,
          fulfilled: this.requiredMoneyForIncrease <= this.parent.actor.currentSilver,
        },
      ],
      [ED4E.validationCategories.health]:    [
        {
          name:      "ED.Legend.Validation.hasDamage",
          value:     increaseData.hasDamage,
          fulfilled: !increaseData.hasDamage,
        },
        {
          name:      "ED.Legend.Validation.hasWounds",
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