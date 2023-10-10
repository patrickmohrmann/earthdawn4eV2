/* -------------------------------------------- */
/*  Validators                                  */
/* -------------------------------------------- */

/**
 * Ensure the provided string contains only the characters allowed in identifiers.
 * @param {string} identifier
 * @returns {boolean}
 */
function isValidIdentifier( identifier ){
  return /^([a-z0-9_-]+)$/i.test( identifier );
}

export const validators = {
  isValidIdentifier: isValidIdentifier
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
    // Character partials.
    "systems/ed4e/templates/actor/character-partials/header-section.hbs",
    "systems/ed4e/templates/actor/character-partials/image-characteristics-section.hbs",
    "systems/ed4e/templates/actor/character-partials/disciplines-section.hbs",
    "systems/ed4e/templates/actor/character-partials/attribute-section.hbs",
    "systems/ed4e/templates/actor/character-partials/details-section.hbs",
    "systems/ed4e/templates/actor/character-partials/action-button-section.hbs",

    // Character details section partials
    "systems/ed4e/templates/actor/character-partials/character-details/details-talents.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-skills.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-devotions.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-spells.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-equipment.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-notes.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-familiars-mounts.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-reputation.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-specials.hbs",

    // Actor partials
    "systems/ed4e/templates/actor/actor-partials/navigator-section.hbs",
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
