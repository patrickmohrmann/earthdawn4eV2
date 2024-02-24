/**
 * @description handlebar helpers
 */
export function registerHandlebarHelpers() {

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
    return fromUuid( uuid )?.name ?? "N/A";
  } );
}
