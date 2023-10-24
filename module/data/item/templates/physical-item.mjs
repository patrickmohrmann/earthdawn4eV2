import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on physical items.
 * @property {object} price                                 price group object
 * @property {number} price.value                           item cost 
 * @property {string} price.coinage                         coinage type of the cost
 * @property {number} weight                                item weight
 * @property {number} amount                                amount of the item
 * @property {number} bloodMagicDamage                      number of Bloodmagic damage the actor is receiving
 * @property {object} usableItem                            usable item object
 * @property {boolean} usableItem.usableItemSelector        usable item selector 
 * @property {number} usableItem.arbitraryStep              arbitrary step 
 * @property {string} usableItem.action                     action type of usable item
 * @property {number} usableItem.recoveryPropertyValue      recovery type value
 */
export default class PhysicalItemTemplate extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            price: new foundry.data.fields.SchemaField( {
                value: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    positive: true,
                    label: "ED.Item.General.value"
                } ),
                coinage: foundry.data.fields.StringField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    positive: true,
                    label: "ED.Item.General.coinage"
                } )
            },
            {
                label: "ED.Item.General.price"
            } ),
            weight: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.General.weight"
            } ),
            // availability types are Everyday, Average, Unusual, Rare, Very Rare, Unique
            availability: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "average",
                label:  "ED.Item.General.availability"

            } ),
            amount: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.General.amount"
            } ),
            bloodMagicDamage: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                positive: true,
                label: "ED.Item.General.bloodMagicDamage"
            } ),
            usableItem: new foundry.data.fields.SchemaField( {
                usableItemSelector: new foundry.data.fields.StringField( {
                    required: true,
                    nullable: false,
                    blank: false,
                    initial: "no",
                    label: "ED.Item.General.usableItem"
                } ),
                arbitraryStep: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    positive: true,
                    label: "ED.Item.General.arbitraryStep"
                } ),
                action: new foundry.data.fields.StringField( {
                    required: true,
                    nullable: false,
                    blank: false,
                    initial: "standard",
                    label: "ED.Item.General.action"
                } ),
                // recovery property value shall be a drop down menu with several options discribed in #26
                recoveryPropertyValue: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    max: 5,
                    initial: 0,
                    positive: true,
                    label: "ED.Item.General.recoveryPropertyValue"
                } ),
            },
            {
                label: "ED.Item.General.usableItem"
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
        return [
            this.parent.usableItem.labels.arbitraryStep,
            this.parent.usableItem.labels.action,
            this.parent.usableItem.labels.recoveryPropertyValue
        ];
    }
}