import ED4E from "./config.mjs";
import getDice from "./dice/step-tables.mjs";
import { linkForUuidSync } from "./utils.mjs";

/**
 * @description handlebar helpers
 */
export default function registerHandlebarHelpers() {

  Handlebars.registerHelper( "hasItems", ( collection ) => {
    return !foundry.utils.isEmpty( collection );
  } );

  Handlebars.registerHelper( "add", ( value1, value2 ) => {
    return value1 + value2;
  } );

  Handlebars.registerHelper( "subtract", ( value1, value2 ) => {
    return value1 - value2;
  } );

  Handlebars.registerHelper( "eq", ( a, b ) => {
    return a === b;
  } );

  Handlebars.registerHelper( "uneq", ( a, b ) => {
    return a !== b;
  } );

  Handlebars.registerHelper( "signedNumber", ( number ) => {
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

  Handlebars.registerHelper( "getProperty", foundry.utils.getProperty );

  Handlebars.registerHelper( "ed-hasOwnProperty", ( obj, prop ) => {
    return obj.hasOwnProperty( prop );
  } );

  Handlebars.registerHelper( "nameFromUuid", ( uuid ) => {
    return fromUuidSync( uuid , {strict: false} )?.name ?? "N/A";
  } );

  Handlebars.registerHelper( "ed-stepFromAttributeValue", ( attributeValue ) => {
    return ED4E.characteristicsTable.step[attributeValue];
  } );

  Handlebars.registerHelper( "ed-linkForUuid", uuid => {
    return linkForUuidSync( uuid );
  } );

  Handlebars.registerHelper( "ed-diceFormulaForStep", getDice );

  Handlebars.registerHelper( "getTalentCategory", ( talents, type ) => {
    return talents.filter( ( talent ) => talent.system.talentCategory === type );
  } );

  Handlebars.registerHelper( "ed-commaList", ( iterable ) => {
    return Array.from( iterable ).join( "," );
  } );

  Handlebars.registerHelper( "ed-includes", ( collection, element ) => {
    return Array.from( collection ).includes( element );
  } );


  /*************************************************** */
  /*            Handlebars for Item sheets             */
  /*************************************************** */



  /*************************************************** */
  /*            Handlebars for Item Cards              */
  /*************************************************** */

  // Handlebars.registerHelper("calculateDamageSum", function(actor, item) {
  //   if (item.type !== "weapon") return 0;
  //   const damageAttributeKey = item.system.damage.attribute;
  //   const damageAttributeValue = actor.system.attributes[damageAttributeKey].step;
  //   const damageStep = item.system.damage.baseStep;
  //   const forgeBonus = item.system.forgeBonus;
  //   const sum = damageAttributeValue + damageStep + forgeBonus;
  //   return sum;
  // });

  // Handlebars.registerHelper('sumMatchingEquipment', function(actor, item) {
  //   // Get the ammunition type of the current item
  //   const currentAmmunitionType = item.system.ammunition.type;
  
  //   // Filter the actor's items to find matching equipment
  //   const matchingItems = actor.items.filter(i => 
  //     i.type === 'equipment' && i.system.ammunition.type === currentAmmunitionType
  //   );
  
  //   // Sum up the values after multiplying system.amount with system.bundleSize
  //   const totalSum = matchingItems.reduce((sum, i) => {
  //     return sum + (i.system.amount * i.system.bundleSize);
  //   }, 0);
  
  //   // Return the total sum
  //   return totalSum;
  // });
}
