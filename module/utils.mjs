/* -------------------------------------------- */
/*  Earthdawn                                   */
/* -------------------------------------------- */

/**
 * Calculate the armor value for the given attribute value.
 * @param { number } attributeValue Willpower value for mystical armor
 * @returns { number } The respective armor value
 */
export function getArmorFromAttribute( attributeValue ) {
  return attributeValue <= 0 ? 0 :  Math.floor( attributeValue / 5 );
}

/**
 * Calculate the attribute step for the given attribute value.
 * @param { number } attributeValue The value of the attribute to look up the step for
 * @returns { number } The step for the given value
 */
export function getAttributeStep( attributeValue ) {
  return attributeValue <= 0 ? 0 : Math.ceil( attributeValue / 3 ) + 1;
}

/**
 * Calculate the defense value for the given attribute value.
 * @param { number } attributeValue Dexterity-, Perception- or Charisma value
 * @returns { number } The respective defense value
 */
export function getDefenseValue( attributeValue ) {
  return attributeValue <= 0 ? 0 : Math.ceil( attributeValue / 2 ) + 1;
}

/* -------------------------------------------- */
/*  Foundry                                     */
/* -------------------------------------------- */

/**
 * Search all documents in the game, including world and packs, according to the
 * given constraints and return them in an array.
 *
 * Example usage:
 * ```
 * await ed4e.utils.getAllDocuments(
 *  "Item",
 *  "spell",
 *  false,
 *  ["system.level", "system.tier"],
 *  x => ( x.system.level > 3 ) && ( x.system.binding === true )
 * )
 * ```
 *
 * @param {string} documentName           The type of document that is searched
 *                                        for. One of `game.documentTypes` keys.
 * @param {string} documentType           The subtype for the chosen document
 *                                        type. One of the appropriate
 *                                        `game.documentTypes` values.
 * @param {boolean} asUuid                If `true`, return the found documents
 *                                        as just their UUIDs. Otherwise, the
 *                                        full documents are returned.
 * @param {[string]} filterFields         An array of document property keys that
 *                                        are used in the `predicate` function.
 *                                        Must contain all used keys.
 * @param {function} predicate            A function that can be used for
 *                                        pre-filtering the searched documents.
 *                                        Must be a function that takes one
 *                                        parameter, either the document (for
 *                                        world documents) or index (for packs).
 *                                        It must return `true` if the item
 *                                        should be kept, or `false` for it to
 *                                        be discarded.
 * @return {Promise<[Document|string]>}   A promise that resolves to an array of
 *                                        either {@link Document}s or UUID
 *                                        strings of the found documents.
 */
export async function getAllDocuments(
  documentName,
  documentType,
  asUuid = true,
  filterFields = [],
  predicate
) {

  // Input checks

  const docTypes = game.documentTypes;

  if (
    !( documentName in docTypes )
    || ( documentType && !docTypes[documentName].includes( documentType ) )
  ) {
    console.error(`ED4E: Invalid documentName or documentType: ${documentName}, ${documentType}`);
    return [];
  }

  predicate ??= () => true;  // no filtering, take all items

  // Search documents

  const worldCollection = game.collections.get( documentName );
  const packs = game.packs.filter( p => p.documentName === documentName );

  const documents = worldCollection.filter( d => !documentType || d.type === documentType );
  const indices = await Promise.all(
    packs.map( async pack  => {
      const idx = await pack.getIndex( { fields: filterFields } );
      return Array.from( idx.values() );
    }),
  ).then( p => p.flat() );

  const allDocuments = [...documents, ...indices].filter( predicate );

  return asUuid
    ? allDocuments.map( doc => doc.uuid )
    : Promise.all( allDocuments.map( doc => fromUuid( doc.uuid ) ) );
}

/* -------------------------------------------- */
/*  Maths                                       */
/* -------------------------------------------- */

/**
 * Computes the sum of the values in array.
 * @param {Array<number>} arr An array of numbers.
 * @returns {number} The sum of the values in the array.
 */
export function sum( arr ) {
  return arr.reduce( ( partialSum, a ) => partialSum + a, 0 );
}

/**
 * Computes the sum of a specific property's  values in an array of objects. The sum for only one property can be
 * calculated, and its name must be consistent across all objects in the array.
 * @param {Array<object>} arr   An array of numbers.
 * @param {string|symbol} prop  The name of the property that should be summed. Its values must be numerical.
 * @returns {number|undefined}  The sum of the property values in the array, or undefined if the values are not numeric.
 */
export function sumProperty( arr, prop ) {
  return arr.reduce( ( partialSum, obj ) => partialSum + resolvePath( obj, prop ), 0 );
}

/* -------------------------------------------- */
/*  Object Helpers                              */
/* -------------------------------------------- */

/**
 * Sort the provided object by its values or by an inner sortKey.
 * @param {object} obj        The object to sort.
 * @param {string} [sortKey]  An inner key upon which to sort.
 * @returns {object}          A copy of the original object that has been sorted.
 */
export function sortObjectEntries(obj, sortKey) {
  let sorted = Object.entries(obj);
  if ( sortKey ) sorted = sorted.sort((a, b) => a[1][sortKey].localeCompare(b[1][sortKey]));
  else sorted = sorted.sort((a, b) => a[1].localeCompare(b[1]));
  return Object.fromEntries(sorted);
}

/* -------------------------------------------- */

/**
 * Retrieves the value of a given string property of an object which works for nested property names.
 * Taken from {@link https://stackoverflow.com/a/43849204 this answer on StackOverflow}.
 * @example
 * const myVar = {
 *  a: { b: [ { c:1 } ] }
 * }
 * resolvePath(myVar,'a.b[0].c') => 1
 * resolvePath(myVar,'a["b"][\'0\'].c') => 1
 * @param {object} object     The object to access.
 * @param {string} path       The path of the property to be accessed. If nested, must be separated by `.` a period. If
 *                            an array, must use bracket notation.
 * @param {any} defaultValue  The value to return if the given key does not exist in the `object`.
 * @returns {any}             The value of the given key in the object.
 */
function resolvePath( object, path, defaultValue ){
  return path.split( '.' ).reduce( ( o, p ) => o ? o[p] : defaultValue, object );
}

/* -------------------------------------------- */
/*  Validators                                  */
/* -------------------------------------------- */

/**
 * Ensure the provided string contains only the characters allowed in identifiers.
 * @param {string} identifier The string to be checked for validity
 * @returns {boolean} True, if the input string is a valid Foundry identifier, false otherwise.
 */
function isValidIdentifier( identifier ){
  return /^([a-z0-9_-]+)$/i.test( identifier );
}

export const validators = {
  isValidIdentifier: isValidIdentifier
}


/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/* -------------------------------------------- */

/**
 * Storage for pre-localization configuration.
 * @type {object}
 * @private
 */
const _preLocalizationRegistrations = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param {string} configKeyPath          Key path within `CONFIG.ED4E` to localize.
 * @param {object} [options={}]
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys=[]]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort=false]  Sort this config enum, using the key if set.
 */
export function preLocalize(configKeyPath, { key, keys=[], sort=false }={}) {
  if ( key ) keys.unshift(key);
  _preLocalizationRegistrations[configKeyPath] = { keys, sort };
}

/* -------------------------------------------- */

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param {object} config  The `CONFIG.ED4E` object to localize and sort. *Will be mutated.*
 */
export function performPreLocalization(config) {
  for ( const [keyPath, settings] of Object.entries(_preLocalizationRegistrations) ) {
    const target = foundry.utils.getProperty(config, keyPath);
    _localizeObject(target, settings.keys);
    if ( settings.sort ) foundry.utils.setProperty(config, keyPath, sortObjectEntries(target, settings.keys[0]));
  }
}

/* -------------------------------------------- */

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param {object} obj       The configuration object to localize.
 * @param {string[]} [keys]  List of inner keys that should be localized if this is an object.
 * @private
 */
function _localizeObject(obj, keys) {
  for ( const [k, v] of Object.entries(obj) ) {
    const type = typeof v;
    if ( type === "string" ) {
      obj[k] = game.i18n.localize(v);
      continue;
    }

    if ( type !== "object" ) {
      console.error(new Error(
        `Pre-localized configuration values must be a string or object, ${type} found for "${k}" instead.`
      ));
      continue;
    }
    if ( !keys?.length ) {
      console.error(new Error(
        "Localization keys must be provided for pre-localizing when target is an object."
      ));
      continue;
    }

    for ( const key of keys ) {
      if ( !v[key] ) continue;
      v[key] = game.i18n.localize(v[key]);
    }
  }
}

/* -------------------------------------------- */
/*  Handlebars Template Helpers                 */
/* -------------------------------------------- */

/**
 * Define a set of template paths to preload.
 * Preloaded templates are compiled and cached for fast access when rendering
 * @returns {Promise} The promise returned by the Foundry API's `loadTemplates`.
 */
export async function preloadHandlebarsTemplates() {
  const partials = [
    // Global Templates
    "systems/ed4e/templates/global/editor.hbs",
    "systems/ed4e/templates/global/card-options-chat.hbs",
    "systems/ed4e/templates/global/card-options-enhance.hbs",

    // Character details section partials
    "systems/ed4e/templates/actor/character-details/details-talents.hbs",
    "systems/ed4e/templates/actor/character-details/details-skills.hbs",
    "systems/ed4e/templates/actor/character-details/details-devotions.hbs",
    "systems/ed4e/templates/actor/character-details/details-spells.hbs",
    "systems/ed4e/templates/actor/character-details/details-equipment.hbs",
    "systems/ed4e/templates/actor/character-details/details-notes.hbs",
    "systems/ed4e/templates/actor/character-details/details-familiars-reputation.hbs",
    "systems/ed4e/templates/actor/character-details/details-general.hbs",
    "systems/ed4e/templates/actor/character-details/details-specials.hbs",
    "systems/ed4e/templates/actor/character-details/details-legend.hbs",
    "systems/ed4e/templates/actor/character-details/details-disciplines.hbs",

    // Actor partials
    "systems/ed4e/templates/actor/actor-partials/navigator-section.hbs",
    "systems/ed4e/templates/actor/actor-partials/action-button-section.hbs",
    "systems/ed4e/templates/actor/actor-partials/header-section.hbs",
    "systems/ed4e/templates/actor/actor-partials/image-characteristics-section.hbs",
    "systems/ed4e/templates/actor/actor-partials/details-section.hbs",

    // Item partials
    "systems/ed4e/templates/item/item-partials/top-section.hbs",
    "systems/ed4e/templates/item/item-partials/navigator-section.hbs",
    "systems/ed4e/templates/item/item-partials/main-section.hbs",
    "systems/ed4e/templates/item/item-partials/item-description.hbs",
    "systems/ed4e/templates/item/item-partials/item-details.hbs",

    // Item details
    "systems/ed4e/templates/item/item-partials/item-details/item-effects.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-armor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-attack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-bindingSecret.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-cursemark.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-devotion.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-discipline.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-effect.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-equipment.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-knackAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-knackKarma.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-knackManeuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-maneuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-mask.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-matrix.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-path.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-poisonDisease.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-power.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-questor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-shield.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-skill.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-specialAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-spell.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-spellKnack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-talent.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-thread.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-weapon.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-shipWeapon.hbs",

    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-armor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-attack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-bindingSecret.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-cursemark.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-devotion.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-discipline.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-effect.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-equipment.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-knackAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-knackManeuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-knackKarma.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-maneuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-mask.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-matrix.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-path.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-poisonDisease.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-power.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-questor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-shield.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-skill.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-specialAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-spell.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-spellKnack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-talent.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-thread.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-weapon.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-shipWeapon.hbs",

    // cards
    "systems/ed4e/templates/item/cards/effect-card.hbs",

  ];

  const paths = {};
  for ( const path of partials ) {
    paths[path.replace( ".hbs", ".html" )] = path;
    paths[`ed4e.${path.split( "/" ).pop().replace( ".hbs", "" )}`] = path;
    paths[path] = path;
  }

  return loadTemplates( paths );
}

/**
 * Register custom Handlebars helpers used by the ed4e system.
 */
export function registerHandlebarHelpers() {

}
