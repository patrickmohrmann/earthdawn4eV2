import ED4E from "./config.mjs";
import getDice from "./dice/step-tables.mjs";
import { linkForUuid } from "./utils.mjs";

/**
 * @description handlebar helpers
 */
export default function registerHandlebarHelpers() {

  // General Handlebars

  Handlebars.registerHelper( 'hasItems', ( collection ) => {
    if (!collection || typeof collection[Symbol.iterator] !== 'function' ) {
      // Check if collection is iterable
      return false;
    }

    for (const _ of collection) {
      return true; // Only returns if at least on element exists
    }

    return false; // If no elements found, return false
  } );

  Handlebars.registerHelper( 'add', ( value1, value2 ) => {
    return value1 + value2;
  } );

  Handlebars.registerHelper( 'subtract', ( value1, value2 ) => {
    return value1 - value2;
  } );

  Handlebars.registerHelper( 'eq', ( a, b ) => {
    return a === b;
  } );

  Handlebars.registerHelper( 'uneq', ( a, b ) => {
    return a !== b;
  } );

  Handlebars.registerHelper( 'signedNumber', ( number ) => {
    if ( number ) {
      return new Intl.NumberFormat(
        game.i18n.lang, { signDisplay: "exceptZero" }
      ).format( number ) ;
    } else {
      return undefined;
    }
  } );

  /**
   * For use in option elements. If the supplied value is truthy, add the "selected" property, otherwise add nothing.
   * @returns {string}
   *
   * @example
   * ```hbs
   * <option value="something" {{selected myValue}}>Option 1</button>
   * ```
   */
  Handlebars.registerHelper( 'ed-selected', value => {
    return value ? "selected" : "";
  } );

  Handlebars.registerHelper( 'getProperty', foundry.utils.getProperty );

  Handlebars.registerHelper( 'ed-hasOwnProperty', ( obj, prop ) => {
    return obj.hasOwnProperty( prop );
  } );

  Handlebars.registerHelper( 'nameFromUuid', ( uuid ) => {
    return fromUuidSync( uuid , {strict: false} )?.name ?? "N/A";
  } );

  Handlebars.registerHelper( 'ed-stepFromAttributeValue', ( attributeValue ) => {
    return ED4E.characteristicsTable.step[attributeValue];
  } );

  Handlebars.registerHelper( 'ed-linkForUuid', linkForUuid );

  Handlebars.registerHelper( 'ed-diceFormulaForStep', getDice );

  Handlebars.registerHelper( "gettalentCategory", ( talents, type ) => {
    return talents.filter( ( talent ) => talent.system.talentCategory === type );
  } );

  Handlebars.registerHelper( "ed-commaList", ( iterable ) => {
    return Array.from( iterable ).join( "," );
  } );
}
