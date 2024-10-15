import ED4E from "./config.mjs";
import getDice from "./dice/step-tables.mjs";
import { linkForUuidSync } from "./utils.mjs";

/**
 * @description Registers custom Handlebars helpers for the application.
 */
export default function registerHandlebarHelpers() {

  Handlebars.registerHelper( "ed-hasItems", ( collection ) => {
    return !foundry.utils.isEmpty( collection );
  } );

  Handlebars.registerHelper( "ed-add", ( value1, value2 ) => {
    return value1 + value2;
  } );

  Handlebars.registerHelper( "ed-subtract", ( value1, value2 ) => {
    return value1 - value2;
  } );

  Handlebars.registerHelper( "ed-signedNumber", ( number ) => {
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
   * @example
   * ```hbs
   * <option value="something" {{selected myValue}}>Option 1</button>
   * ```
   */
  Handlebars.registerHelper( "ed-selected", value => {
    return value ? "selected" : "";
  } );

  Handlebars.registerHelper( "ed-getProperty", foundry.utils.getProperty );

  Handlebars.registerHelper( "ed-hasOwnProperty", ( obj, prop ) => {
    return obj.hasOwnProperty( prop );
  } );

  Handlebars.registerHelper( "ed-nameFromUuid", ( uuid ) => {
    return fromUuidSync( uuid , {strict: false} )?.name ?? "N/A";
  } );

  Handlebars.registerHelper( "ed-stepFromAttributeValue", ( attributeValue ) => {
    return ED4E.characteristicsTable.step[attributeValue];
  } );

  Handlebars.registerHelper( "ed-linkForUuid", uuid => {
    return linkForUuidSync( uuid );
  } );

  Handlebars.registerHelper( "ed-diceFormulaForStep", getDice );

  Handlebars.registerHelper( "ed-getTalentCategory", ( talents, type ) => {
    return talents.filter( ( talent ) => talent.system.talentCategory === type );
  } );

  Handlebars.registerHelper( "ed-commaList", ( iterable ) => {
    return Array.from( iterable ).join( "," );
  } );

  Handlebars.registerHelper( "ed-includes", ( collection, element ) => {
    return Array.from( collection ).includes( element );
  } );
}
