import LpTransactionData from "./lp-transaction.mjs";
import SystemDataModel from "../abstract.mjs";
import { dateToInputString } from "../../utils.mjs";

export default class LpEarningTransactionData extends LpTransactionData {

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return SystemDataModel.mergeSchema( super.defineSchema(), {
      type: new fields.StringField( {
        required: true,
        initial:  "earnings",
      } ),
    } );
  }

  /**
   * @inheritDoc
   */
  get displayString() {
    return game.i18n.format( "X.LP-Reward: ", this.amount );
  }


  getHtmlRow( index, classes, dataGroup ) {
    return `
        <tr class="${ classes?.join( " " ) ?? "" }" data-group="${ dataGroup ?? "" }" data-id="${ this.id }">
          <td>
            <input name="earnings.${index}.date" type="datetime-local" value="${ dateToInputString( this.date ) }" data-dtype="String" />
          </td>
          <td>
            ${ this.schema.fields.description.toInput( {
    name:  `earnings.${index}.description`,
    value: this.description,
  } ).outerHTML }
          </td>
          <td>
            ${ this.schema.fields.amount.toInput( {
    name:  `earnings.${index}.amount`,
    value: this.amount,
  } ).outerHTML }
          </td>
        </tr>
      `;
  }
}