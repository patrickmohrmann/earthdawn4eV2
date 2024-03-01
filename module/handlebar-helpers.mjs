import ED4E from "./config.mjs";
import getDice from "./dice/step-tables.mjs";
import { linkForUuid } from "./utils.mjs";

/**
 * @description handlebar helpers
 */
export default function registerHandlebarHelpers() {

  // General Handlebars

  Handlebars.registerHelper( 'hasItems', ( array ) => {
    return array.length > 0;
  } );

  Handlebars.registerHelper( 'add', ( value1, value2 ) => {
    return value1 + value2;
  } );

  Handlebars.registerHelper( 'eq', ( a, b ) => {
    return a === b;
  } );

  Handlebars.registerHelper( 'uneq', ( a, b ) => {
    return a !== b;
  } );

  Handlebars.registerHelper( 'nameFromUuid', ( uuid ) => {
    return fromUuidSync( uuid , {strict: false})?.name ?? "N/A";
  } );

  Handlebars.registerHelper( 'stepFromAttributeValue', ( attributeValue ) => {
    return ED4E.characteristicsTable.step[attributeValue];
  } );

  Handlebars.registerHelper( 'getProperty', foundry.utils.getProperty );

  Handlebars.registerHelper( 'ed-linkForUuid', linkForUuid );

  Handlebars.registerHelper( 'ed-diceFormulaForStep', getDice );
}
