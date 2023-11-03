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
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-armor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-attack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-cursemark.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-devotion.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-discipline.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-effect.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-equipment.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-knack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-maneuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-mask.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-path.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-poisonDisease.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-power.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-questor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-shield.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-skill.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-specialAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-spell.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-talent.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-thread.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-weapon.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/details/item-details-shipWeapon.hbs",

    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-armor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-attack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-cursemark.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-devotion.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-discipline.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-effect.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-equipment.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-knack.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-maneuver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-mask.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-namegiver.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-path.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-poisonDisease.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-power.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-questor.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-shield.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-skill.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-specialAbility.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-spell.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-talent.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-thread.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-weapon.hbs",
    "systems/ed4e/templates/item/item-partials/item-details/descriptions/item-description-shipWeapon.hbs",

    // cards
    "systems/ed4e/templates/item/cards/armor-card.hbs",
    "systems/ed4e/templates/item/cards/attack-card.hbs",
    "systems/ed4e/templates/item/cards/curse-card.hbs",
    "systems/ed4e/templates/item/cards/devotion-card.hbs",
    "systems/ed4e/templates/item/cards/discipline-card.hbs",
    "systems/ed4e/templates/item/cards/effect-card.hbs",
    "systems/ed4e/templates/item/cards/equipment-card.hbs",
    "systems/ed4e/templates/item/cards/knack-card.hbs",
    "systems/ed4e/templates/item/cards/maneuver-card.hbs",
    "systems/ed4e/templates/item/cards/poison-card.hbs",
    "systems/ed4e/templates/item/cards/power-card.hbs",
    "systems/ed4e/templates/item/cards/shield-card.hbs",
    "systems/ed4e/templates/item/cards/ship-weapon-card.hbs",
    "systems/ed4e/templates/item/cards/skill-card.hbs",
    "systems/ed4e/templates/item/cards/special-ability-card.hbs",
    "systems/ed4e/templates/item/cards/spell-card.hbs",
    "systems/ed4e/templates/item/cards/talent-card.hbs",
    "systems/ed4e/templates/item/cards/weapon-card.hbs",

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
