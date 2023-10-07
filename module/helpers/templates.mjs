/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
  
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
    ]);
  };
  