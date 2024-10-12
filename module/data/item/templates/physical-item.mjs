import { ItemDataModel } from "../../abstract.mjs";
import TargetTemplate from "./targeting.mjs";
import ED4E from "../../../config.mjs";

/**
 * Data model template with information on physical items.
 * @property {object} price                                 price group object
 * @property {number} price.value                           item cost
 * @property {string} price.denomination                    denomination type of the cost
 * @property {number} weight                                item weight
 * @property {number} amount                                amount of the item
 * @property {number} bloodMagicDamage                      number of Bloodmagic damage the actor is receiving
 * @property {object} usableItem                            usable item object
 * @property {boolean} usableItem.usableItemSelector        usable item selector
 * @property {number} usableItem.arbitraryStep              arbitrary step
 * @property {string} usableItem.action                     action type of usable item
 * @property {number} usableItem.recoveryPropertyValue      recovery type value
 */
export default class PhysicalItemTemplate extends ItemDataModel.mixin(
  TargetTemplate
) {

  /**
   * The order in which this items status is cycled. Represents the default order.
   * Should be defined in the extending class, if different.
   * @type {[string]}
   * @protected
   */
  static _itemStatusOrder = [ "owned", "carried", "equipped" ];

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return this.mergeSchema( super.defineSchema(), {
      price: new fields.SchemaField( {
        value: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          label:    "ED.Data.Item.Labels.PhysicalItems.Price.value",
          hint:     "ED.Data.Item.Hints.PhysicalItems.Price.value"
        } ),
        // magicType: new fields.StringField( {
        //   required: true,
        //   nullable: true,
        //   blank:    true,
        //   trim:     true,
        //   choices:  ED4E.spellcastingTypes,
        //   label:    this.labelKey( "talentMagicType" ),
        //   hint:     this.hintKey( "talentMagicType" ),
        // } ),
        denomination: new fields.StringField( {
          // required: true,
          // blank:    false,
          // initial:  "silver",
          required: true,
          nullable: true,
          blank:    true,
          trim:     true,
          initial:  "silver",
          choices:  ED4E.denomination,
          label:    "ED.Data.Item.Labels.PhysicalItems.Price.denomination",
          hint:     "ED.Data.Item.Hints.PhysicalItems.Price.denomination"
        } )
      },
      {
        label: "ED.Data.Item.Labels.PhysicalItems.price",
        hint:  "ED.Data.Item.Hints.PhysicalItems.price"
      } ),
      weight: new fields.SchemaField( {
        value: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          label:    "ED.Data.Item.Labels.PhysicalItems.Weight.value",
          hint:     "ED.Data.Item.Hints.PhysicalItems.Weight.value"
        } ),
        weightMultiplier: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      1,
          initial:  1,
          label:    "ED.Data.Item.Labels.PhysicalItems.Weight.Multiplier",
          hint:     "ED.Data.Item.Hints.PhysicalItems.Weight.Multiplier"
        } ),
        weightCalculated: new fields.BooleanField( {
          required: true,
          initial:  false,
          label:    "ED.Data.Item.Labels.PhysicalItems.Weight.Calculated",
          hint:     "ED.Data.Item.Hints.PhysicalItems.Weight.Calculated"
        } ),
      } ),
      // availability types are Everyday, Average, Unusual, Rare, Very Rare, Unique
      availability: new fields.StringField( {
        required: true,
        blank:    false,
        initial:  "average",
        label:    "ED.Data.Item.Labels.PhysicalItems.availability",
        hint:     "ED.Data.Item.Hints.PhysicalItems.availability",

      } ),
      amount: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  1,
        integer:  true,
        label:    "ED.Data.Item.Labels.PhysicalItems.amount",
        hint:     "ED.Data.Item.Hints.PhysicalItems.amount"
      } ),
      bloodMagicDamage: new fields.NumberField( {
        required: true,
        nullable: false,
        min:      0,
        initial:  0,
        integer:  true,
        label:    "ED.Data.Item.Labels.PhysicalItems.bloodMagicDamage",
        hint:     "ED.Data.Item.Hints.PhysicalItems.bloodMagicDamage"
      } ),
      usableItem: new fields.SchemaField( {
        usableItemSelector: new fields.BooleanField( {
          required: true,
          label:    "ED.Data.Item.Labels.PhysicalItems.usableItem",
          hint:     "ED.Data.Item.Hints.PhysicalItems.usableItem"
        } ),
        arbitraryStep: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.PhysicalItems.arbitraryStep",
          hint:     "ED.Data.Item.Hints.PhysicalItems.arbitraryStep"
        } ),
        action: new fields.StringField( {
          initial:  "standard",
          label:    "ED.Data.Item.Labels.PhysicalItems.action",
          hint:     "ED.Data.Item.Hints.PhysicalItems.action",
          choices:  ED4E.action
        } ),
        // recovery property value shall be a drop down menu with several options discribed in #26
        recoveryPropertyValue: new fields.NumberField( {
          required: true,
          nullable: false,
          min:      0,
          max:      5,
          initial:  0,
          integer:  true,
          label:    "ED.Data.Item.Labels.PhysicalItems.recoveryPropertyValue",
          hint:     "ED.Data.Item.Hints.PhysicalItems.recoveryPropertyValue"
        } ),
      },
      {
        label: "ED.Data.Item.Labels.PhysicalItems.usableItem",
        hint:  "ED.Data.Item.Hints.PhysicalItems.usableItem"
      } ),
      // item status is for differentiation of the carried status of each item
      // a toggle shall be show either equipped, carried or owned
      // all equipped and carried items count as owned as well
      // all equipped items count as carried as well
      itemStatus: new fields.StringField( {
        required: true,
        nullable: true,
        blank:    false,
        initial:  "owned",
        choices:  Object.keys( ED4E.itemStatus ),
        label:    "ED.Data.Item.Labels.PhysicalItems.itemStatus",
        hint:     "ED.Data.Item.Labels.PhysicalItems.itemStatusHint",
      } )
    } );
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static migrateData( source ) {
    super.migrateData( source );
    // specific migration functions
  }

  /* -------------------------------------------- */
  /*  Getters                                     */
  /* -------------------------------------------- */

  /**
   * Properties displayed in chat.
   * @type {string[]}
   */
  get chatProperties() {
    // TODO: return object instead of array? to have meaningful keys and you dont have to remember the positions of the values in the array
    return [
      this.parent.usableItem.labels.arbitraryStep,
      this.parent.usableItem.labels.action,
      this.parent.usableItem.labels.recoveryPropertyValue
    ];
  }

  get statusIndex() {
    return this.constructor._itemStatusOrder.indexOf( this.itemStatus );
  }

  /**
   * Returns the next item status in the sequence. If the item status is undefined
   * it will return the first in the sequence.
   * @type {string}
   */
  get nextItemStatus() {
    const statusOrder = this.constructor._itemStatusOrder;
    // if itemStatus is null or undefined `currentStatusIndex + 1` will result in NaN (Not a Number)
    // NaN || 0 will return 0
    return statusOrder[ ( this.statusIndex + 1 || 0 ) % statusOrder.length ];
  }

  /**
   * Returns the previous item status in the sequence. If the item status is undefined
   * it will return the first in the sequence.
   * @type {string}
   */
  get previousItemStatus(){
    const statusOrder = this.constructor._itemStatusOrder;
    const prevIndex = ( this.statusIndex - 1 ) || 0;
    // if itemStatus is null or undefined `currentStatusIndex - 1` will result in NaN (Not a Number)
    // NaN || 0 will return 0
    // if the previous index is negative, it will return the last index of the array
    return statusOrder[ ( prevIndex < 0 ? ( statusOrder.length - 1 ) : prevIndex ) % statusOrder.length ];
  }

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */


  /**
   * Set the item status to "carried".
   * @returns {Promise} The updated Item instance.
   * @userFunction            UF_PhysicalItems-carry
   */
  async carry() {
    return this.parent.update( {
      "system.itemStatus": "carried"
    } );
  }

  /**
   * Set the item status to "owned".
   * @returns {Promise} The updated Item instance.
   * @userFunction            UF_PhysicalItems-deposit
   */
  async deposit() {
    return this.parent.update( {
      "system.itemStatus": "owned"
    } );
  }
}