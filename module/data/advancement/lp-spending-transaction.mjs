import LpTransactionData from "./lp-transaction.mjs";
import SystemDataModel from "../abstract.mjs";

export default class LpSpendingTransactionData extends LpTransactionData {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return SystemDataModel.mergeSchema( super.defineSchema(), {
            type: new fields.StringField( {
                required: true,
                blank: false,
                label: "X.transactionType",
                hint: "X.transaction Type",
            } ),
            entityType: new fields.StringField( {
                required: true,
                blank: false,
                label: "X.transactionEntityType",
                hint: "X.Type of the changed item",
            } ),
            name: new fields.StringField( {
                required: true,
                blank: false,
                label: "X.transactionEntityName",
                hint: "X.Description of the changed item",
            } ),
            value: new fields.SchemaField( {
                before: new fields.NumberField( {
                    required: true,
                    initial: null,
                    min: 0,
                    integer: true,
                    label: "X.ChangedValueBefore",
                    hint: "X.The value of the corresponding entity before it was changed",
                } ),
                after: new fields.NumberField( {
                    required: true,
                    initial: null,
                    min: 0,
                    integer: true,
                    label: "X.ChangedValueAfter",
                    hint: "X.The value of the corresponding entity after it was changed",
                } ),
            } ),
            itemUuid: new fields.DocumentUUIDField(
                {
                    label: "X.ItemDocumentReference",
                    hint: "X.Reference to the affected item, if applicable (no attributes)",
                }
            ),
        } );
    }
    
    

}