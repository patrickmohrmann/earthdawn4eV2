import { SparseDataModel } from "../abstract.mjs";
import ItemEd from "../../documents/item.mjs";
import { DocumentUUIDField, MappingField } from "../fields.mjs";
import ED4E from "../../config.mjs";

/**
 * The data used during character generation. Also used as the object of the
 * FormApplication dialogue during character generation.
 */
export default class CharacterGenerationData extends SparseDataModel {

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
          min: -2,
          max: 8,
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
        finalValue: new fields.NumberField( {
          required: true,
          nullable: false,
          initial: 10,
          positive: true,
          integer: true,
          step: 1,
          label: "X.CharGenModel.Attributes.initialValue",
          hint: "X.CharGenModel.The value",
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
}