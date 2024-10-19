
/* -------------------------------------------- */
/*  Earthdawn                                   */
/* -------------------------------------------- */

import ED4E from "./config.mjs";

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
 * Taken from the ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}). Takes an input
 * and returns the slugged string of it.
 * From {@link https://itnext.io/whats-a-slug-f7e74b6c23e0}:
 * A slug is a human-readable, unique identifier, used to identify a resource instead of a less human-readable
 * identifier like an id. You use a slug when you want to refer to an item while preserving the ability to
 * see, at a glance, what the item is.
 * @param { * }   input The input that will be converted to a string and slugified.
 * @returns { string }  The sluggified string.
 */
export function slugify( input ) {
  return String( input )
    .normalize( "NFKD" ) // split accented characters into their base characters and diacritical marks
    .replace( /[\u0300-\u036f]/g, "" ) // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .toLowerCase() // convert to lowercase
    .replace( /[^a-z0-9 -]/g, "" ) // remove non-alphanumeric characters
    .replace( /\s+/g, "-" ) // replace spaces with hyphens
    .replace( /-+/g, "-" ) // remove consecutive hyphens
    .replace( /^-+/g, "" ) // remove leading hyphens
    .replace( /-+$/g, "" ) // remove trailing hyphens
    .trim();
}

/**
 * Adapted from ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}).
 * Returns an array of items that match a given EDID and optionally an item type.
 * Searched documents are world and compendium items.
 * @param {string} edid           The SWID of the item(s) which you want to retrieve
 * @param {string} type           Optionally, a type name to restrict the search
 * @returns {Item[]|undefined}    An array containing the found items
 */
export async function getGlobalItemsByEdid( edid, type ) {
  return getAllDocuments(
    "Item",
    type,
    false,
    "OBSERVER",
    [ "system.edid" ],
    ( item ) => item.system.edid === edid,
  );
}

/**
 * Adapted from ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}).
 * Fetch an item that matches a given EDID and optionally an item type.
 * Searched documents are world and compendium items.
 * @param {string} edid         The EDID of the item(s) which you want to retrieve
 * @param {string} type         Optionally, a type name to restrict the search
 * @returns {Item|undefined}    The matching item, or undefined if none was found.
 */
export async function getSingleGlobalItemByEdid( edid, type ) {
  return getGlobalItemsByEdid( edid, type ).then( item => item[0] );
}

/**
 * Search all documents in the game, including world and packs, according to the
 * given constraints and return them in an array.
 *
 * Example usage:
 * ```
 * await ed4e.utils.getAllDocuments(
 * "Item",
 * "spell",
 * false,
 * ["system.level", "system.tier"],
 * x => ( x.system.level > 3 ) && ( x.system.binding === true )
 * )
 * ```
 * @param {string} documentName           The type of document that is searched
 *                                        for. One of `game.documentTypes` keys.
 * @param {string} documentType           The subtype for the chosen document
 *                                        type. One of the appropriate
 *                                        `game.documentTypes` values.
 * @param {boolean} asUuid                If `true`, return the found documents
 *                                        as just their UUIDs. Otherwise, the
 *                                        full documents are returned.
 * @param {DOCUMENT_OWNERSHIP_LEVELS} minOwnerRole The minimal ownership role
 *                                        the current user needs to get any
 *                                        document.
 * @param {[string]} filterFields         An array of document property keys that
 *                                        are used in the `predicate` function.
 *                                        Must contain all used keys.
 * @param {Function} predicateFunction    A function that can be used for
 *                                        pre-filtering the searched documents.
 *                                        Must be a function that takes one
 *                                        parameter, either the document (for
 *                                        world documents) or index (for packs).
 *                                        It must return `true` if the item
 *                                        should be kept, or `false` for it to
 *                                        be discarded.
 * @returns {Promise<[Document|string]>}   A promise that resolves to an array of
 *                                        either {@link Document}s or UUID
 *                                        strings of the found documents. Empty
 *                                        if no documents are found.
 */
export async function getAllDocuments(
  documentName,
  documentType,
  asUuid = true,
  minOwnerRole = "OBSERVER",
  filterFields = [],
  predicateFunction
) {

  // Input checks

  const docTypes = game.documentTypes;

  if (
    !( documentName in docTypes )
    || ( documentType && !docTypes[documentName].includes( documentType ) )
  ) {
    console.error(
      `ED4E: Invalid documentName or documentType: ${documentName}, ${documentType}`
    );
    return [];
  }

  const predicate = predicateFunction ?? ( () => true );  // no filtering, take all items

  // Search documents

  const worldCollection = game.collections.get( documentName );
  const packs = game.packs.filter( p => p.documentName === documentName );

  const documents = worldCollection.filter(
    d =>
      ( !documentType || d.type === documentType )
      && d.testUserPermission( game.user, minOwnerRole )
  );
  const indices = await Promise.all(
    packs.map( async pack  => {
      if ( !pack.testUserPermission( game.user, minOwnerRole ) ) return [];
      const idx = await pack.getIndex( { fields: filterFields } );
      return  Array.from( idx.values() ).filter( i => i.type === documentType );
    } ),
  ).then( p => p.flat() );

  const allDocuments = [ ...documents, ...indices ].filter( predicate );

  return asUuid
    ? allDocuments.map( doc => doc.uuid )
    : Promise.all( allDocuments.map( doc => fromUuid( doc.uuid ) ) );

}

/**
 * Takes an array of documents and returns an object that can be used by Foundry's
 * {@link selectOptions} Handlebar helper as choices. The keys are a document's
 * UUID, the values it's name, which is rendered as representation in the HTML.
 * @param {foundry.abstract.Document[]} documents An array of documents that should
 * be the choices.
 * @returns {{}} An object in the form of the `choices` parameter of the
 * {@link selectOptions} Handlebar helper.
 */
export function documentsToSelectChoices( documents ) {
  return documents.reduce(
    ( obj, doc ) => ( { ...obj, [doc.uuid]: doc.name } ),
    {}
  );
}

/**
 * Creates a content link for a given UUID and description in the form:
 * `@UUID[uuid]{description}`. Can then be enriched by the Foundry API.
 * @param {string} uuid         The UUID of the linked entity.
 * @param {string} description  The description that is shown in the link.
 * @returns {string}            The content link in string representation.
 */
export function createContentLink( uuid, description ) {
  return `@UUID[${uuid}]{${description}}`;
}

/* -------------------------------------------- */
/*  View Helper                                 */
/* -------------------------------------------- */
/**
 * 
 * @param {*} ms miliseconds
 * @returns {*} miliseconds
 */
export async function delay( ms ) {
  return new Promise( resolve => {
    setTimeout( resolve, ms );
  } );

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

/* -------------------------------------------- */

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

/**
 * Checks if a value is within a specified range.
 * @param {number} value - The value to check.
 * @param {number} min - The lower limit of the range.
 * @param {number} max - The upper limit of the range.
 * @param {boolean} [includeLimits] - Whether to include the limits in the range. If true, checks if the value is greater than or equal to min and less than or equal to max. If false, checks if the value is strictly greater or less than the limits.
 * @returns {boolean} Returns true if the value is within the range, and false otherwise.
 */
export function inRange( value, min, max, includeLimits = true ) {
  return includeLimits ? value >= min && value <= max : value > min && value < max;
}

/* -------------------------------------------- */
/*  Formatting                                  */
/* -------------------------------------------- */

/**
 * @description Converts a date object or integer to a string that can be used as value in a datetime input field.
 * @param { Date | integer } date The date to be converted. If integer, it is treated as a timestamp.
 * @returns { string } The date string in the format "YYYY-MM-DDTHH:MM".
 */
export function dateToInputString( date ) {
  return ( new Date( date ) ).toISOString().substring( 0, 16 );
}

/* -------------------------------------------- */
/*  Object Helpers                              */
/* -------------------------------------------- */

/**
 * Safely call a method if it exists on the object.
 * @param {object} obj - The object to check.
 * @param {string} methodName - The name of the method to call.
 * @param {...*} args - Arguments to pass to the method.
 * @returns {*} - The result of the method call, or undefined if the method does not exist.
 */
export function callIfExists( obj, methodName, ...args ) {
  if ( typeof obj[methodName] === "function" ) {
    return obj[methodName]( ...args );
  }
  return undefined;
}

/**
 * Sort the provided object by its values or by an inner sortKey.
 * @param {object} obj        The object to sort.
 * @param {string} [sortKey]  An inner key upon which to sort.
 * @returns {object}          A copy of the original object that has been sorted.
 */
export function sortObjectEntries( obj, sortKey ) {
  let sorted = Object.entries( obj );
  if ( sortKey ) sorted = sorted.sort( ( a, b ) => a[1][sortKey].localeCompare( b[1][sortKey] ) );
  else sorted = sorted.sort( ( a, b ) => a[1].localeCompare( b[1] ) );
  return Object.fromEntries( sorted );
}

/* -------------------------------------------- */

/**
 * Filter an object's entries by the given predicate (filter function). Creates
 * a new object with only entries that satisfy the predicate.
 * @param {object} obj                            The object to filter.
 * @param {function(any, any): boolean} predicate A function that takes a key-value
 *                                                pair of the object and returns
 *                                                a boolean to decide whether the
 *                                                entry should be kept or discarded.
 *                                                Return `true` to keep the entry
 *                                                or `false` to discard it.
 * @returns {object} A new object with only the entries that satisfy the predicate.
 */
export function filterObject( obj, predicate ) {
  return Object.fromEntries(
    Object.entries( obj ).filter(
      ( [ key, value ] ) => predicate( key, value )
    )
  );
}

/* -------------------------------------------- */

/**
 * Map an object's entries by the given function. Creates a new object with the
 * mapped entries according to the function.
 * @param {object} obj                The object to filter.
 * @param {Function} mappingFunction  A function that takes a key-value pair of
 *                                    the object and return the new mapped
 *                                    key-value pair. It takes two parameters
 *                                    `[key, value]` and must return them as
 *                                    `[key, value]`.
 * @returns {object}                  A new object with the mapped entries.
 */
export function mapObject( obj, mappingFunction ) {
  return Object.fromEntries(
    Object.entries( obj ).map(
      ( [ key, value ] ) => mappingFunction( key, value )
    )
  );
}

/* -------------------------------------------- */

/**
 * Renames all keys of an object by prepending a specified prefix to each key.
 * @param {object} obj - The object whose keys are to be renamed.
 * @returns {object} A new object with keys renamed with the specified prefix.
 */
export function renameKeysWithPrefix( obj ) {
  const renamedObj = {};
  for ( let key in obj ) {
    if ( obj.hasOwnProperty( key ) ) {
      renamedObj["-=" + key] = obj[key];
    }
  }
  return renamedObj;
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
export function resolvePath( object, path, defaultValue ){
  return path.split( "." ).reduce( ( o, p ) => o ? o[p] : defaultValue, object );
}

/* -------------------------------------------- */

/**
 * Creates an HTML document link for the provided UUID.
 * @param {string} uuid  UUID for which to produce the link.
 * @returns {string}     Link to the item or empty string if item wasn't found.
 */
export async function linkForUuid( uuid ) {
  return TextEditor._createContentLink( [ "", "UUID", uuid ] );
}

/* -------------------------------------------- */

/**
 * Creates an HTML document link for the provided UUID.
 * @param {string} uuid  UUID for which to produce the link.
 * @returns {string}     Link to the item or empty string if item wasn't found.
 */
export function linkForUuidSync( uuid ) {
  const parsedUuid = foundry.utils.parseUuid( uuid );
  const doc = fromUuidSync( uuid, { strict: false } );
  if ( !doc ) return `<a class="content-link broken" data-icon="fas fa-unlink" data-uuid="${uuid} ">${uuid}</a>`;
  const name = doc?.name ?? "";
  const packId = parsedUuid.collection?.metadata?.id ?? "";
  return `
      <a 
        class="content-link" draggable="true" 
        data-link="" 
        data-uuid="${uuid}"
        data-id="${parsedUuid.id}"
        data-type="${parsedUuid.type}"
        data-tooltip="${doc?.type}"
        data-pack="${packId}"
      >
      <i class="fas fa-suitcase"></i>
      ${name}
    </a>`;
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
  return /^([A-Za-z0-9_-]+)$/i.test( identifier );
}

/** Source for regex: {@link https://ihateregex.io/expr/url-slug/} */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/g;

/**
 * Taken from the ({@link https://gitlab.com/peginc/swade/-/wikis/Savage-Worlds-ID|SWADE system}).
 * Ensure the provided string is a valid earthdawn id (a strictly slugged string).
 * @param { string }  value The string to be checked for validity
 * @returns {void|DataModelValidationFailure} A validation failure in case of an invalid value.
 */
export function validateEdid( value ) {
  // `any` is a reserved word
  if ( value === ED4E.reserved_edid.ANY ) {
    return new foundry.data.validation.DataModelValidationFailure( {
      unresolved:   true,
      invalidValue: value,
      message:      "any is a reserved EDID!",
    } );
  }
  // if the value matches the regex we have likely a valid swid
  if ( !value.match( SLUG_REGEX ) ) {
    return new foundry.data.validation.DataModelValidationFailure( {
      unresolved:   true,
      invalidValue: value,
      message:      value + " is not a valid EDID",
    } );
  }
}

export const validators = {
  isValidIdentifier: isValidIdentifier,
  validateEdid:      validateEdid,
};


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
 * @param {object} [options]              Additional options for pre-localization.
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort]  Sort this config enum, using the key if set.
 */
export function preLocalize( configKeyPath, { key, keys=[], sort=false }={} ) {
  if ( key ) keys.unshift( key );
  _preLocalizationRegistrations[configKeyPath] = { keys, sort };
}

/* -------------------------------------------- */

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param {object} config  The `CONFIG.ED4E` object to localize and sort. *Will be mutated.*
 */
export function performPreLocalization( config ) {
  for ( const [ keyPath, settings ] of Object.entries( _preLocalizationRegistrations ) ) {
    const target = foundry.utils.getProperty( config, keyPath );
    _localizeObject( target, settings.keys );
    if ( settings.sort ) foundry.utils.setProperty( config, keyPath, sortObjectEntries( target, settings.keys[0] ) );
  }
}

/* -------------------------------------------- */

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param {object} obj       The configuration object to localize.
 * @param {string[]} [keys]  List of inner keys that should be localized if this is an object.
 * @private
 */
function _localizeObject( obj, keys ) {
  for ( const [ k, v ] of Object.entries( obj ) ) {
    const type = typeof v;
    if ( type === "string" ) {
      obj[k] = game.i18n.localize( v );
      continue;
    }

    if ( type !== "object" ) {
      console.error( new Error(
        `Pre-localized configuration values must be a string or object, ${type} found for "${k}" instead.`
      ) );
      continue;
    }
    if ( !keys?.length ) {
      console.error( new Error(
        "Localization keys must be provided for pre-localizing when target is an object."
      ) );
      continue;
    }

    for ( const key of keys ) {
      if ( !v[key] ) continue;
      v[key] = game.i18n.localize( v[key] );
    }
  }
}

/* -------------------------------------------- */
/*  Handlebars -  Template - Helpers            */
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
    "systems/ed4e/templates/global/card-options-effect.hbs",
    "systems/ed4e/templates/global/card-options-enhance.hbs",
    "systems/ed4e/templates/global/effect-card.hbs",
    "systems/ed4e/templates/global/card-options-class-upgrade.hbs",

    // Character Generation
    "systems/ed4e/templates/actor/generation/namegiver-selection.hbs",
    "systems/ed4e/templates/actor/generation/class-selection.hbs",
    "systems/ed4e/templates/actor/generation/attribute-assignment.hbs",
    "systems/ed4e/templates/actor/generation/spell-selection.hbs",
    "systems/ed4e/templates/actor/generation/skill-selection.hbs",
    "systems/ed4e/templates/actor/generation/language-selection.hbs",
    "systems/ed4e/templates/actor/generation/equipment.hbs",

    // Character details section partials
    "systems/ed4e/templates/actor/actor-tabs/powers.hbs",
    "systems/ed4e/templates/actor/actor-tabs/talents.hbs",
    "systems/ed4e/templates/actor/actor-tabs/skills.hbs",
    "systems/ed4e/templates/actor/actor-tabs/devotions.hbs",
    "systems/ed4e/templates/actor/actor-tabs/spells.hbs",
    "systems/ed4e/templates/actor/actor-tabs/equipment.hbs",
    "systems/ed4e/templates/actor/actor-tabs/notes.hbs",
    "systems/ed4e/templates/actor/actor-tabs/reputation.hbs",
    "systems/ed4e/templates/actor/actor-tabs/general.hbs",
    "systems/ed4e/templates/actor/actor-tabs/specials.hbs",
    "systems/ed4e/templates/actor/actor-tabs/legend.hbs",
    "systems/ed4e/templates/actor/actor-tabs/classes.hbs",
    "systems/ed4e/templates/actor/actor-tabs/configuration.hbs",

    // Actor partials
    "systems/ed4e/templates/actor/actor-partials/actor-section-navigator.hbs",
    "systems/ed4e/templates/actor/actor-partials/action-button-section.hbs",
    "systems/ed4e/templates/actor/actor-partials/actor-section-name.hbs",
    "systems/ed4e/templates/actor/actor-partials/actor-section-top.hbs",
    "systems/ed4e/templates/actor/actor-partials/actor-section-main.hbs",


    // Actor cards
    "systems/ed4e/templates/actor/cards/ability-card.hbs",
    "systems/ed4e/templates/actor/cards/equipment-card.hbs",
    "systems/ed4e/templates/actor/cards/spell-card.hbs",
    "systems/ed4e/templates/actor/cards/class-card.hbs",
    "systems/ed4e/templates/actor/cards/legend-point-history-earned.hbs",
    "systems/ed4e/templates/actor/cards/attribute-card.hbs",
    "systems/ed4e/templates/actor/cards/attributes-none-pc-card.hbs",
    "systems/ed4e/templates/actor/cards/effect-card-link.hbs",
    "systems/ed4e/templates/actor/cards/power-card.hbs",
    "systems/ed4e/templates/actor/cards/maneuver-card.hbs",
    "systems/ed4e/templates/actor/cards/health-character-card.hbs",
    "systems/ed4e/templates/actor/cards/health-none-character-card.hbs",
    "systems/ed4e/templates/actor/cards/damage-character-card.hbs",
    "systems/ed4e/templates/actor/cards/damage-none-character-card.hbs",

    // Item partials
    "systems/ed4e/templates/item/item-partials/item-section-name.hbs",
    "systems/ed4e/templates/item/item-partials/item-section-navigator.hbs",
    "systems/ed4e/templates/item/item-partials/item-section-main.hbs",
    "systems/ed4e/templates/item/item-partials/item-description.hbs",
    "systems/ed4e/templates/item/item-partials/item-details.hbs",
    "systems/ed4e/templates/item/item-partials/item-section-top.hbs",


    "systems/ed4e/templates/item/item-partials/item-details/partials/physical-items.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/partials/usable-items.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/partials/tailor-to-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/partials/targeting.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/partials/abilities.hbs",

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
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-abilities.hbs",

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

    // ################################################
    //                      CHAT
    // ################################################
    "systems/ed4e/templates/chat/tooltip.hbs",

    // chat buttons
    "systems/ed4e/templates/chat/chat-buttons/apply-damage.hbs",
    "systems/ed4e/templates/chat/chat-buttons/assign-effect.hbs",
    "systems/ed4e/templates/chat/chat-buttons/roll-damage.hbs",
    "systems/ed4e/templates/chat/chat-buttons/roll-effect.hbs",
    "systems/ed4e/templates/chat/chat-buttons/take-damage.hbs",

    // chat Flavor
    "systems/ed4e/templates/chat/chat-flavor/ability-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/arbitrary-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/attribute-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/damage-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/effect-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/halfmagic-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/initiative-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/recovery-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/spellcasting-roll-flavor.hbs",
    "systems/ed4e/templates/chat/chat-flavor/thread-weaving-roll-flavor.hbs",

    // Dice partials
    "systems/ed4e/templates/chat/dice-partials/roll-step-modifier.hbs",
    "systems/ed4e/templates/chat/dice-partials/roll-successes.hbs",
    "systems/ed4e/templates/chat/dice-partials/roll-target-modifier.hbs",

    // other tabs
    "systems/ed4e/templates/item/item-partials/item-details/other-tabs/discipline-advancement.hbs",

    // Build your own Legend
    "systems/ed4e/templates/actor/legend-points/history.hbs",
    "systems/ed4e/templates/actor/legend-points/history-earned.hbs",
    "systems/ed4e/templates/actor/legend-points/history-spend.hbs",

    // prompts
  ];

  const paths = {};
  for ( const path of partials ) {
    paths[path.replace( ".hbs", ".html" )] = path;
    paths[`ed4e.${path.split( "/" ).pop().replace( ".hbs", "" )}`] = path;
    paths[path] = path;
  }

  return loadTemplates( paths );
}
