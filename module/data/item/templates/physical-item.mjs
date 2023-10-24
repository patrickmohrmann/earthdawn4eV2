import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on physical items.
 * @property {object} price 
 * @property {number} price.value item cost 
 * @property {string} price.coinage coinage type of the cost
 * @property {number} weight item weight
 * @property {number} amount amount of the item
 * @property {number} bloodMagicDamage number of Bloodmagic damage the actor is receiving
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
}