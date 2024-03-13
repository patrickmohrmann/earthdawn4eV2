import LpEarningTransactionData from "./lp-earning-transaction.mjs";
import LpSpendingTransactionData from "./lp-spending-transaction.mjs";
import { sum } from "../../utils.mjs";

export default class LpTrackingData extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            earnings: new fields.ArrayField(
                LpEarningTransactionData,
                {
                    required: true,
                    nullable: false,
                    label: "X.Earned Legend Points",
                    hint: "X.All LP this character earned",
                    
                } ),
            spendings: new fields.ArrayField(
                LpSpendingTransactionData,
                {
                    required: true,
                    nullable: false,
                    label: "X.Earned Legend Points",
                    hint: "X.All LP this character earned"
                } ),
        }
    }

    /**
     * The legendary status of this actor based on their total earned LP.
     * @type {number} A number from 1 through 4 indicating their status.
     */
    get status() {
        return 4;
    }

    /**
     *
     * @type {number}
     */
    get current() {
        return this.total - sum( this.spendings.map( spending => spending.amount ) );
    }

    /**
     *
     * @type {number}
     */
    get total() {
        return sum( this.earnings.map( earning => earning.amount ) );
    }
}



