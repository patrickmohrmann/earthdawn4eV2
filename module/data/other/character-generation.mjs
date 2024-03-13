import { SparseDataModel } from "../abstract.mjs";
import { DocumentUUIDField, MappingField } from "../fields.mjs";
import ED4E from "../../config.mjs";
import { filterObject, mapObject, renameKeysWithPrefix } from "../../utils.mjs";

/**
 * The data used during character generation. Also used as the object of the
 * FormApplication dialogue during character generation.
 */
export default class CharacterGenerationData extends SparseDataModel {

  static minAttributeModifier = -2;
  static maxAttributeModifier = 8;

  static minAbilityRank = 0;

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {

      // Namegiver
      namegiver: new DocumentUUIDField( {
        required: true,
        nullable: true,
        initial: null,
        label: "X.CharGenModel.namegiver",
        hint: "X.CharGenModel.The chosen namegiver.",
      } ),

      // Class
      isAdept: new fields.BooleanField( {
        required: true,
        nullable: false,
        initial: true,
        label: "X.CharGenModel.isAdept",
        hint: "X.CharGenModel.Choose discipline if true, questor otherwise.",
      } ),
      selectedClass: new DocumentUUIDField( {
        required: true,
        nullable: true,
        initial: null,
        label: "X.CharGenModel.selectedClass",
        hint: "X.CharGenModel.The chosen class.",
      } ),

      // Attributes
      attributes: new MappingField( new fields.SchemaField( {
        change: new fields.NumberField( {
          required: true,
          nullable: false,
          initial: 0,
          min: this.minAttributeModifier,
          max: this.maxAttributeModifier,
          step: 1,
          integer: true,
          label: "X.CharGenModel.Attributes.change",
          hint: "X.CharGenModel.The de-/increase of a given attribute value.",
        } ),
        cost: new fields.NumberField( {
          required: true,
          nullable: false,
          initial: 0,
          min: -2,
          max: 15,
          integer: true,
          label: "X.CharGenModel.Attributes.cost",
          hint: "X.CharGenModel.The cost for the given attribute change.",
        } ),
      } ), {
        initialKeys: ED4E.attributes,
        initialKeysOnly: true,
        label: "ED.Attributes.attributes"
      } ),

      // Abilities
      abilities: new MappingField(
        new MappingField(
          new fields.NumberField( {
            required: true,
            initial: 0,
            min: 0,
            max: game.settings.get("ed4e", "charGenHeader" ),
            integer: true,
            label: "X.CharGenModel.abilityLevel",
            hint: "X.CharGenModel.The assigned level of the ability"
          } ),
          {
            required: true,
            initialKeys: [],
            initialKeysOnly: false,
            label: "X.CharGenModel.Selected Skills",
            hint: "X.CharGenModel.Which skills where taken on char gen.",
          }
        ), {
          required: true,
          initialKeysOnly: true,
          initialKeys: ["option", "class", "free", "special", "artisan", "knowledge", "general"],
        } ),
      availableRanks: new fields.SchemaField( {
        talent: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.talent,
          min: 0,
          max: ED4E.availableRanks.talent,
          step: 1,
        } ),
        devotion: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.devotion,
          min: 0,
          max: ED4E.availableRanks.devotion,
          step: 1,
        } ),
        knowledge: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.knowledge,
          min: 0,
          max: ED4E.availableRanks.knowledge,
          step: 1,
        } ),
        artisan: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.artisan,
          min: 0,
          max: ED4E.availableRanks.artisan,
          step: 1,
        } ),
        general: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.general,
          min: 0,
          max: ED4E.availableRanks.general,
          step: 1,
        } ),
        speak: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.speak,
          min: 0,
          max: ED4E.availableRanks.speak,
          step: 1,
        } ),
        readWrite: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.speak,
          min: 0,
          max: ED4E.availableRanks.speak,
          step: 1,
        } ),
      }, {
        required: true,
        label: "X.CharGenModel.AssignableRanks",
        hint: "X.CharGenModel.How ranks are left to assign to abilities",
      } ),
    };
  }

  get namegiverDocument() {
    return fromUuid( this.namegiver );
  }

  get classDocument() {
    return fromUuid( this.selectedClass );
  }

  get availableAttributePoints() {
    const startingPoints = game.settings.get( 'ed4e', 'charGenAttributePoints');
    return Object.values( this.attributes ).reduce(
      ( points, attributeProperties ) => {
        return points - attributeProperties.cost;
      },
      startingPoints
    )
  }

  set abilityOption( abilityUuid ) {
    this.updateSource( {
      abilities: {
        option: {
          [abilityUuid]: 0,
          [`-=${Object.keys(this.abilities.option)[0]}`]: null,
        },
      },
    } );
  }

  set classAbilities( selectedClassDocument ) {
    // Only update data if namegiver changes
    if ( !selectedClassDocument || ( this.selectedClass === selectedClassDocument.uuid ) ) return;

    this.updateSource( {
      abilities: {
        class: Object.fromEntries(selectedClassDocument.system.advancement.levels[0].abilities.class.map( ability => [ability, 0] )),
        free: Object.fromEntries(selectedClassDocument.system.advancement.levels[0].abilities.free.map( ability => [ability, 0] )),
        special: Object.fromEntries(selectedClassDocument.system.advancement.levels[0].abilities.special.map( ability => [ability, 0] )),
      }
    } );
  }

  /**
   * Get all documents and adapt their level according to `this.abilities`.
   * @return {Promise<Awaited<Document|null>[]>}  A Promise that resolves to an
   *                                              array of ability documents.
   */
  get abilityDocuments() {
    const allAbilityEntries = Object.assign( {}, ...Object.values( this.abilities ) );
    const allAbilities = Object.entries( allAbilityEntries ).map(
      async ( [uuid, level] ) => {
        const itemDocument = (await fromUuid( uuid )).toObject();
        itemDocument.system.level = level;
        return itemDocument;
      }
    );
    return Promise.all( allAbilities );
  }

  async getCharacteristicsPreview() {
    const lookup = ED4E.characteristicsTable;
    const finalValues = await this.getFinalAttributeValues();
    return {
      health: {
        unconsciousness: this._getPreviewValues( lookup, "unconsciousRating", finalValues.tou ),
        death: this._getPreviewValues( lookup, "deathRating", finalValues.tou),
        woundThreshold: this._getPreviewValues( lookup, "woundThreshold", finalValues.tou ),
        recoveryPerDay: this._getPreviewValues( lookup, "recovery", finalValues.tou ),
        recoveryStep: this._getPreviewValues( lookup, "step", finalValues.tou ),
      },
      characteristics: {
        defenses: {
          physical: this._getPreviewValues( lookup, "defenseRating", finalValues.dex ),
          mystic: this._getPreviewValues( lookup, "defenseRating", finalValues.per ),
          social: this._getPreviewValues( lookup, "defenseRating", finalValues.cha ),
        },
        armor: {
          physical: {
            previous: 0,
            current: 0,
            next: 0,
          },
          mystic: this._getPreviewValues( lookup, "armor", finalValues.wil ),
        },
        other: {
          carryingCapacity: this._getPreviewValues( lookup, "carryingCapacity", finalValues.str ),
          initiativeStep: this._getPreviewValues( lookup, "step", finalValues.dex ),
        },
      },
    };
  }

  _getPreviewValues( lookup, key, index ) {
    lookup ??= ED4E.characteristicsTable;
    return {
      previous: lookup[key][index-1],
      current: lookup[key][index],
      next: lookup[key][index+1],
    };
  }

  async getFinalAttributeValues() {
    const updateData = {};
    for ( const attribute of Object.keys( this.attributes ) ){
      const baseValue = await this.getBaseAttributeValue( attribute );
      updateData[attribute] = baseValue + this.attributes[attribute].change;
    }
    return updateData;
  }

  async getBaseAttributeValue( attribute ) {
    const document = await this.namegiverDocument;
    return document?.system?.attributeValues[attribute] ?? 10;
  }

  async addAbility( abilityUuid, abilityType ) {
    const abilityData = this.abilities[abilityType];
    abilityData[abilityUuid] = 0;
    return this.updateSource( { abilities: { [abilityType]: abilityData } } );
  }

  async removeRankZeroSkills() {
    const greaterZeroPredicate = function ( key, value ) {
      return value <= 0;
    }.bind( this );
    const artisanData = renameKeysWithPrefix( filterObject(
      this.abilities.artisan, greaterZeroPredicate
    ) );
    const knowledgeData = renameKeysWithPrefix( filterObject(
      this.abilities.knowledge, greaterZeroPredicate
    ) );
    const generalData = renameKeysWithPrefix( filterObject(
      this.abilities.general, greaterZeroPredicate
    ) );

    return this.updateSource( {
      abilities: {
        artisan: artisanData,
        knowledge: knowledgeData,
        general: generalData,
      }
    } );
  }

  async changeAbilityRank( abilityUuid, abilityType, changeType ) {
    const isSkill = ["artisan", "knowledge", "general"].includes( abilityType );

    if (
      isSkill && !this.abilities[abilityType].hasOwnProperty( abilityUuid )
    ) await this.addAbility( abilityUuid, abilityType );

    const oldRank = this.abilities[abilityType][abilityUuid];
    let newRank = this.abilities[abilityType][abilityUuid];
    switch ( changeType ) {
      case 'increase':
        newRank++;
        break;
      case 'decrease':
        newRank--;
        break;
    }
    const isRankValid = (
      newRank >= CharacterGenerationData.minAbilityRank
      && newRank <= game.settings.get( "ed4e", "charGenMaxRank" )
    );

    const costDifference = newRank - oldRank;
    const availabilityType = this._getAvailabilityType( abilityType, costDifference );
    if ( !( ( this.availableRanks[availabilityType] - costDifference ) >= 0 ) || !isRankValid ) {
      ui.notifications.warn( game.i18n.localize(
        "X.No more points available. You can only change the rank of an ability in the range from 0 through 3."
      ) );
      return ;
    }

    const updateDiff = await this.updateSource( {
      abilities: {
        [abilityType]: {
          [abilityUuid]: newRank
        }
      },
      availableRanks: {
        [availabilityType]: this.availableRanks[availabilityType] - costDifference
      }
    } );
    await this.removeRankZeroSkills();
    return updateDiff;
  }

  //Increase or decrease the value of an attribute modifier by 1 and update all associated values.
  async changeAttributeModifier( attribute, changeType ) {
    let newModifier = this.attributes[attribute].change;
    switch ( changeType ) {
      case 'increase':
        newModifier++;
        break;
      case 'decrease':
        newModifier--;
        break;
    }
    const isModifierValid = (
      newModifier >= CharacterGenerationData.minAttributeModifier
      && newModifier <= CharacterGenerationData.maxAttributeModifier
    );

    const oldCost = this.attributes[attribute].cost;
    const newCost = ED4E.attributePointsCost[newModifier];
    // Add old cost, otherwise they're included in the calculation of available points
    if ( ( newCost > ( this.availableAttributePoints + oldCost ) ) || !isModifierValid ) {
      ui.notifications.warn( game.i18n.localize(
        "X.No more points available. You can only modify an attribute in the range from -2 through +8."
      ) );
      return ;
    }

    const baseValue = await this.getBaseAttributeValue(attribute);
    const finalValue = baseValue + newModifier;

    return this.updateSource( {
      attributes: {
        [attribute]: {
          change: newModifier,
          cost: newCost,
          finalValue: finalValue,
        }
      }
    } );
  }

  async resetPoints( type ) {
    const updateData = this.getResetData( type );
    this.updateSource( updateData );
    return this.removeRankZeroSkills();
  }

  getResetData( type ) {
    let updateData = {};

    switch ( type ) {

      case "attributes":
        const updatePayload = {};
        for ( const attribute of Object.keys( this.attributes ) ){
          updatePayload[attribute] = {
            change: 0,
            cost: 0,
          };
        }
        updateData = { attributes: updatePayload}
        break;

      case "classAbilities":
        const classOptions = Object.fromEntries(
          Object.entries(this.abilities.option).map(
            ( [uuid, level] ) => [uuid, 0]
          )
        );
        const classAbilities = Object.fromEntries(
          Object.entries(this.abilities.class).map(
            ( [uuid, level] ) => [uuid, 0]
          )
        );

        const abilitiesPayload = {
          option: classOptions,
          class: classAbilities,
        };
        const availableRanksPayload = {
          talent: ED4E.availableRanks.talent,
          devotion: ED4E.availableRanks.devotion,
        };

        updateData = {
          abilities: abilitiesPayload,
          availableRanks: availableRanksPayload,
        };
        break;

      case "skills":
        const skillsPayload = {};
        for ( const abilityType of ["artisan", "knowledge", "general", "readWrite", "speak"] ) {
          skillsPayload[abilityType] = mapObject(
            this.abilities[abilityType] ?? {},
            ( uuid, level ) => [uuid, 0]
          );
        }

        const availableSkillRanksPayload = {
          artisan: ED4E.availableRanks.artisan,
          knowledge: ED4E.availableRanks.knowledge,
          general: ED4E.availableRanks.general,
          readWrite: ED4E.availableRanks.readWrite,
          speak: ED4E.availableRanks.speak,
        };

        updateData = {
          abilities: skillsPayload,
          availableRanks: availableSkillRanksPayload,
        };
        break;
    }

    return updateData;
  }

  _getAbilityClassType( abilityType ) {
    const isClass = ["class", "option", "free"].includes( abilityType );
    // const isSkill = ["artisan", "knowledge", "general"].includes( abilityType );
    if ( isClass && this.isAdept ) return "talent";
    if ( isClass && !this.isAdept ) return "devotion";
    // if ( isSkill ) return "skill";
    return abilityType;
  }

  _getAvailabilityType( abilityType ) {
    if (
      ["artisan", "knowledge", "speak", "readWrite"].includes( abilityType )
    ) return this.availableRanks[abilityType] > 0 ? abilityType : "general";
    return this._getAbilityClassType( abilityType ) ;
  }
}