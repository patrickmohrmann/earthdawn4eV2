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
    return knacks.filter((knack) => knack.system.source.knackSource === talent.system.talentIdentifier);
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
   * @description This helper groups Lp spendings by itemUuid or name. 
   * @description It first groups by name to identify items that should be grouped together based on name.
   */
Handlebars.registerHelper('groupSpendingsByItemUuidOrName', (spendings) => {
  // First pass: Group by name to identify items that should be grouped together based on name.
  const nameGroups = spendings.reduce((acc, current) => {
      const nameKey = current.name;
      if (!acc[nameKey]) {
          acc[nameKey] = { spendings: [], itemUuids: new Set() };
      }
      acc[nameKey].spendings.push(current);
      if (current.itemUuid) {
          acc[nameKey].itemUuids.add(current.itemUuid);
      }
      return acc;
  }, {});

  // Second pass: Group by itemUuid or fallback to name, considering name groups for matching names.
  const finalGroups = Object.values(nameGroups).reduce((acc, group) => {
      // If all items in the group have the same itemUuid or none has an itemUuid, use the first item's key for grouping.
      const groupKey = group.itemUuids.size <= 1 ? (Array.from(group.itemUuids)[0] || group.spendings[0].name) : null;

      if (groupKey) {
          if (!acc[groupKey]) {
              acc[groupKey] = { spendings: [], names: new Set() };
          }
          group.spendings.forEach(spending => {
              acc[groupKey].spendings.push(spending);
              acc[groupKey].names.add(spending.name);
          });
      } else {
          // If there are multiple itemUuids for the same name, group each by itemUuid.
          group.spendings.forEach(spending => {
              const key = spending.itemUuid || spending.name;
              if (!acc[key]) {
                  acc[key] = { spendings: [], names: new Set() };
              }
              acc[key].spendings.push(spending);
              acc[key].names.add(spending.name);
          });
      }
      return acc;
  }, {});

  return Object.entries(finalGroups).map(([key, { spendings, names }]) => ({
      key, // This can be itemUuid or name
      spendings,
      names: Array.from(names) // Convert Set to Array for names
  }));
});

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
