import LpTransactionData from "./lp-transaction.mjs";
import SystemDataModel from "../abstract.mjs";

export default class LpEarningTransactionData extends LpTransactionData {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return SystemDataModel.mergeSchema( super.defineSchema(), {} );
    }

    /**
     * @description An automated description of this transaction.
     * @type {string}
     */
    get displayString() {
        return game.i18n.format("X.LP-Reward: ", this.amount );
    }
}