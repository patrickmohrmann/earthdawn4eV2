/**
 * @description handlebar helpers
 */
export function registerHandlebarHelpers() {
  // Generall Handlebars
  Handlebars.registerHelper( 'hasItems', ( array ) => {
    return array.length > 0;
  } );

  // Handlebars.registerHelper( 'inc', ( value ) => {
  //   return parseInt(value) + 1;
  // } );

  Handlebars.registerHelper( 'add', ( value1, value2 ) => {
    return value1 + value2;
  } );

  Handlebars.registerHelper( 'eq', ( a, b ) => {
    return a === b;
  } );

  Handlebars.registerHelper( 'uneq', ( a, b ) => {
    return a !== b;
  } );
}
