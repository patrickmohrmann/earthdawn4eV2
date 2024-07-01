import LpEarningTransactionData from "./lp-earning-transaction.mjs";
import LpSpendingTransactionData from "./lp-spending-transaction.mjs";
import { sum } from "../../utils.mjs";

export default class LpTrackingData extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            earnings: new fields.ArrayField(
                new fields.EmbeddedDataField( LpEarningTransactionData ),
                {
                    required: true,
                    nullable: false,
                    initial: [],
                    label: "X.Earned Legend Points",
                    hint: "X.All LP this character earned",
                    
                } ),
            spendings: new fields.ArrayField(
                new fields.EmbeddedDataField( LpSpendingTransactionData ),
                {
                    required: true,
                    nullable: false,
                    initial: [],
                    label: "X.Earned Legend Points",
                    hint: "X.All LP this character earned"
                } ),
        }
    }

    /**
     * The legendary status of this actor based on their total earned LP.
     * @type {number} A number from 1 through 4 indicating their status.
     * @UF UF_LpTracking-legendPointsCalculations
     */
    get status() {
        let status = 0;
        if ( this.total <= 10000 ) {
            status = 1
        } else if ( this.total > 10000 && this.total <= 100000 ) {
            status = 2
        } else if ( this.total > 100000 && this.total <= 1000000 ) {
            status = 3
        } else if ( this.total > 1000000 ) {
            status = 4
        }  
        return status;
    }

    /**
     *
     * @type {number}
     * @UF UF_LpTracking-legendPointsCalculations
     */
    get current() {
        return this.total - sum( this.spendings.map( spending => spending.amount ) );
    }

    /**
     *
     * @type {number}
     * @UF UF_LpTracking-legendPointsCalculations
     */
    get total() {
        return sum( this.earnings.map( earning => earning.amount ) );
    }
}



