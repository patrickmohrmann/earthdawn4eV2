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
      abilities: new fields.SchemaField( {
        option: new DocumentUUIDField(),
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

    const newCost = ED4E.attributePointsCost[newModifier];
    if ( ( newCost > this.availableAttributePoints ) || !isModifierValid ) return {};

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