import AssignLpPrompt from "../../applications/global/assign-legend.mjs";

export default class LpTransactionData extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return  {
            amount: new fields.NumberField( {
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                label: "X.LP Transaction Amount",
                hint: "X.The amount of LP handled in this transaction",
            } ),
            date: new fields.NumberField( {
                required: true,
                initial: Date.now,
                label: "X.Datetime of transaction",
                hint: "X.The date and time of this transaction",
            } ),
            lpBefore: new fields.NumberField( {
                required: true,
                initial: null,
                min: 0,
                integer: true,
                label: "X.LpBeforeTransaction",
                hint: "X.The current LP before this transaction",
            } ),
            lpAfter: new fields.NumberField( {
                required: true,
                initial: null,
                min: 0,
                integer: true,
                label: "X.LpAfterTransaction",
                hint: "X.The current LP after this transaction.",
            } ),
            description: new fields.StringField( {
                required: true,
                blank: true,
                initial: "",
                label: "X.transactionDescription",
                hint: "X. Description of the transaction."
            } ),
        };
    }

    get displayString() {
        throw new Error( `The ${this["name"]} subclass of LpTransactionData must define its displayString` );
    }

    static async assignLpPrompt () {
        const generation = await AssignLpPrompt.waitPrompt();
        if ( !generation ) return;
    }
}