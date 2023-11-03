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
    // Global Templates
    "systems/ed4e/templates/global-templates/attribute-selector.hbs",
    "systems/ed4e/templates/global-templates/action-selector.hbs",
    "systems/ed4e/templates/global-templates/tier-selector.hbs",
    "systems/ed4e/templates/global-templates/editor.hbs",
    "systems/ed4e/templates/global-templates/denomination-selector.hbs",
    "systems/ed4e/templates/global-templates/availability-selector.hbs",

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
    "systems/ed4e/templates/actor/character-partials/character-details/details-general.hbs",
    "systems/ed4e/templates/actor/character-partials/character-details/details-specials.hbs",

    // Actor partials
    "systems/ed4e/templates/actor/actor-partials/navigator-section.hbs",

    // Item partials
    "systems/ed4e/templates/item/item-partials/top-section.hbs",
    "systems/ed4e/templates/item/item-partials/navigator-section.hbs",
    "systems/ed4e/templates/item/item-partials/main-section.hbs",
    "systems/ed4e/templates/item/item-partials/item-description.hbs",
    "systems/ed4e/templates/item/item-partials/item-details.hbs",
    
    // Item details
    "systems/ed4e/templates/item/item-partials/item-details/item-effects.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-armor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-attack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-cursemark.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-devotion.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-discipline.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-effect.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-equipment.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-knack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-maneuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-mask.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-path.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-poisonDisease.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-power.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-questor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-shield.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-skill.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-specialAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-spell.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-talent.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-thread.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-weapon.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-details-shipWeapon.hbs",

    "systems/ed4e/templates/item/item-partials/item-details/item-description-armor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-attack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-cursemark.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-devotion.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-discipline.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-effect.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-equipment.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-knack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-maneuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-mask.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-path.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-poisonDisease.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-power.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-questor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-shield.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-skill.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-specialAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-spell.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-talent.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-thread.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-weapon.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/item-description-shipWeapon.hbs",

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
