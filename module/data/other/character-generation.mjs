import { SparseDataModel } from "../abstract.mjs";
import { DocumentUUIDField, MappingField } from "../fields.mjs";
import ED4E from "../../config.mjs";

/**
 * The data used during character generation. Also used as the object of the
 * FormApplication dialogue during character generation.
 */
export default class CharacterGenerationData extends SparseDataModel {

  static minAttributeModifier = -2;
  static maxAttributeModifier = 8;

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
          initialKeys: ["option", "class", "artisan", "knowledge", "general"],
        } ),
      availableRanks: new fields.SchemaField( {
        talent: new fields.NumberField( {
          required: true,
          initial: ED4E.availableRanks.talent,
          min: 0,
          max: ED4E.availableRanks.talent,
          step: 1,
        } ),
        skill: new fields.SchemaField( {
          knowledge: new fields.NumberField( {
            required: true,
            initial: ED4E.availableRanks.skill.knowledge,
            min: 0,
            max: ED4E.availableRanks.skill.knowledge,
            step: 1,
          } ),
          artisan: new fields.NumberField( {
            required: true,
            initial: ED4E.availableRanks.skill.artisan,
            min: 0,
            max: ED4E.availableRanks.skill.artisan,
            step: 1,
          } ),
          general: new fields.NumberField( {
            required: true,
            initial: ED4E.availableRanks.skill.general,
            min: 0,
            max: ED4E.availableRanks.skill.general,
            step: 1,
          } ),
          language: new fields.SchemaField( {
            speak: new fields.NumberField( {
              required: true,
              initial: ED4E.availableRanks.skill.language.speak,
              min: 0,
              max: ED4E.availableRanks.skill.language.speak,
              step: 1,
            } ),
            readWrite: new fields.NumberField( {
              required: true,
              initial: ED4E.availableRanks.skill.language.speak,
              min: 0,
              max: ED4E.availableRanks.skill.language.speak,
              step: 1,
            } ),
          }, {} ),
        }, {
          required: true,
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
        class: Object.fromEntries(selectedClassDocument.system.advancement.levels[0].abilities.class.map( ability => [ability, 0] ))
      }
    } );
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
    };

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

  resetAttributePoints() {
    const updateData = {};
    for ( const attribute of Object.keys( this.attributes ) ){
      updateData[attribute] = {
        change: 0,
        cost: 0,
      };
    }
    this.updateSource( { attributes: updateData } );
  }
}