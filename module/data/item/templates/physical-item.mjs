// import ED4E from "../../../config.mjs";
import SystemDataModel from "../../abstract.mjs";
// import { MappingField } from "../../fields.mjs";
import TargetTemplate from "./targeting.mjs";

/**
 * Data model template with information on physical items.
 * @property {object} price                                 price group object
 * @property {number} price.value                           item cost 
 * @property {string} price.denomination                         denomination type of the cost
 * @property {number} weight                                item weight
 * @property {number} amount                                amount of the item
 * @property {number} bloodMagicDamage                      number of Bloodmagic damage the actor is receiving
 * @property {object} usableItem                            usable item object
 * @property {boolean} usableItem.usableItemSelector        usable item selector 
 * @property {number} usableItem.arbitraryStep              arbitrary step 
 * @property {string} usableItem.action                     action type of usable item
 * @property {number} usableItem.recoveryPropertyValue      recovery type value
 */
export default class PhysicalItemTemplate extends SystemDataModel.mixin( 
    TargetTemplate
) {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            price: new fields.SchemaField( {
                value: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.General.value"
                } ),
                denomination: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "silver",
                    // choices: game.i18n.localize( [ED4E.denomination] ),
                    label: "ED.Item.General.denomination"
                } )
            },
            {
                label: "ED.Item.General.price"
            } ),
            weight: new fields.SchemaField( {
                value: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    label: "ED.Item.General.weight"
                } ),
                weightMultiplier: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 1,
                    initial: 1,
                    label: "ED.Item.General.weightMultiplier"
                } ),
                weightCalculated: new fields.BooleanField( {
                    required: true,
                    initial: false,
                    label: "ED.Item.General.weightCalculated"
                } ),
            } ),
            // availability types are Everyday, Average, Unusual, Rare, Very Rare, Unique
            availability: new fields.StringField( {
                required: true,
                blank: false,
                initial: "average",
                label:  "ED.Item.General.availability"

            } ),
            amount: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 1,
                integer: true,
                label: "ED.Item.General.amount"
            } ),
            bloodMagicDamage: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.General.bloodMagicDamage"
            } ),
            usableItem: new fields.SchemaField( {
                usableItemSelector: new fields.BooleanField( {
                    required: true,
                    label: "ED.Item.General.usableItem"
                } ),
                arbitraryStep: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.General.arbitraryStep"
                } ),
                // recovery property value shall be a drop down menu with several options discribed in #26
                recoveryPropertyValue: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.General.recoveryPropertyValue"
                } ),
            },
            {
                label: "ED.Item.General.usableItem"
            } ),
            // item status is for differentiation each item. 
            // a toggle shall be show either equipped, carried or owned.
            // all equipped and carried items count as owned as well
            // all equipped items count as carried as well
            // itemStaus: new MappingField( new fields.SchemaField( {
            //     name: new fields.StringField( {
            //         required: true,
            //         blank: false,
            //         // initial: "silver",
            //         label: "ED.Item.General.denomination"
            //     } ),
            //     value: new fields.NumberField( {
            //         required: true,
            //         nullable: false,
            //         min: 1,
            //         step: 1,
            //         initial: 1,
            //         integer: true,
            //         positive: true
            //     } )
            // } ), {
            //     initialKeys: ED4E.itemStatus,
            //     initialKeysOnly: true,
            //     label: "ED.itemStatus.itemStatus"
            // } ),
            itemStatus: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 1,
                integer: true,
                label: "ED.Item.General.recoveryPropertyValue"
            } ),
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
}