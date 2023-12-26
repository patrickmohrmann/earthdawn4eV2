/**
 * @description handlebar helpers
 */
export function registerHandlebarHelpers() {
  // Generall Handlebars
  Handlebars.registerHelper( "hasItems", ( array ) => {
    return array.length > 0;
  } );

  // Handlebars.registerHelper( 'inc', ( value ) => {
  //   return parseInt(value) + 1;
  // } );

  Handlebars.registerHelper( "add", ( value1, value2 ) => {
    return value1 + value2;
  } );

  Handlebars.registerHelper( "eq", ( a, b ) => {
    return a === b;
  } );

  Handlebars.registerHelper( "uneq", ( a, b ) => {
    return a !== b;
  } );

  // Handlebars.registerHelper( "attributeName", (attributeAbbreviation) => {
  //   const stepMap = new Map();
  //   stepMap.set('dexterity', 'attributes.dexterityStep');
  //   stepMap.set('strength', 'attributes.strengthStep');
  //   stepMap.set('toughness', 'attributes.toughnessStep');
  //   stepMap.set('perception', 'attributes.perceptionStep');
  //   stepMap.set('willpower', 'attributes.willpowerStep');
  //   stepMap.set('charisma', 'attributes.charismaStep');
  //   stepMap.set('', 0);
  //   return stepMap.get(attributeNameStep);
  // });
}
