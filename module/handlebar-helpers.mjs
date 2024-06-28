import ED4E from "./config.mjs";
import getDice from "./dice/step-tables.mjs";
import { linkForUuid } from "./utils.mjs";

/**
 * @description handlebar helpers
 */
export default function registerHandlebarHelpers() {

  // General Handlebars

  Handlebars.registerHelper('getSourceAbility', (talent, knacks) => {
    if (talent === undefined || knacks === undefined) {
      return;
    }
    //return knacks.filter((knack) => knack.data.sourceTalentName === talent.name);
    // V10 changes
    return knacks.filter((knack) => knack.system.source.knackSource === talent.system.talentIdentifier);
		// change End
  });

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
   * @description Reduce and Map: The function uses reduce to group the spendings by itemUuid, 
   * and then map to transform the grouped object into an array suitable for iteration in Handlebars templates.
   * @description Return Value: The helper returns an array where each element is an object with itemUuid and spendings properties.
   */
  Handlebars.registerHelper('groupSpendingsByItemUuid', (spendings) => {
    const grouped = spendings.reduce((accumulator, current) => {
      const { itemUuid, name } = current;
      if (!accumulator[itemUuid]) {
        accumulator[itemUuid] = { spendings: [], names: new Set() };
      }
      accumulator[itemUuid].spendings.push(current);
      accumulator[itemUuid].names.add(name);
      return accumulator;
    }, {});
  
    return Object.entries(grouped).map(([itemUuid, { spendings, names }]) => ({
      itemUuid,
      spendings,
      names: Array.from(names) // Convert Set to Array for names
    }));
  });

  Handlebars.registerHelper('formatDate', function(date, options) {
    const locale = options.hash.locale || 'default'; // Use provided locale or default
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date(date));
  });

  // Handlebars.registerHelper( 'edGetAttributeValue', ( attribute, attributes ) => {
  //   if ( attribute === undefined || attribute === '' || attribute === "" ) {
  //     return 0;
  //   }
  //   return attributes[attribute].step;
  // } );

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

  Handlebars.registerHelper( "ed-includes", ( collection, element ) => {
    return Array.from( collection ).includes( element );
  } );
}
