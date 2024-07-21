
import validateDropItem from "./validation-dropped-items.mjs";

/**
 * @description                         Function to handle the drop of an item to actors for special interference based on the actor and item type   
 * @param {object} actor                actor on which the item is dropped
 * @param {object} itemData             item data of the dropped item
 * @returns {Promise <{bookingResult: string, validationData: object}>}   bookingResult: result of the booking process, validationData: data for the validation process
 * @UseCase                             UC_ActorItems-DropItem
 * @UserFunction                        UF_ActorItems-ed4eDropItem
 */
export default async function ed4eDropItem( actor, itemData) {
  if ( !actor || !itemData ) return;
  // define groups of items for easier handling
  const knacks = ["knackAbility", "knackKarma", "knackManeuver"];
  const spells = ["spell", "spellKnack"];
  const abilities = ["talent", "skill", "devotion"];
  const threads = ["thread"];
  const powers = ["power", "attack", "maneuver"];
  const classes = ["discipline", "path", "questor"];
  const mask = ["mask"];
  const bindingSecrets = ["bindingSecrets"];
  const physicalItems = ["armor","equipment","shield","weapon"];
  const specialAbility = ["specialAbility"];
  const conditions = ["curseMark", "effect", "poisonDisease"];
  const shipWeapon = ["shipWeapon"];
  const namegiver = ["namegiver"]

  // bookingResult and ValdiationData are returned to analyze the result of the booking process and to validate the drop
  let validationData, bookingResult;
  // enhance this function with each actor type
  if ( actor.type === "character" ) {
    // Knacks
    if (knacks.includes(itemData.type)) {
      validationData = await validateDropItem(actor, itemData);
      bookingResult = await actor._showOptionsPrompt(actor, itemData, validationData);
      // Spells
    } else if (spells.includes(itemData.type)) {
      validationData = await validateDropItem(actor, itemData);
      bookingResult = await actor._showOptionsPrompt(actor, itemData, validationData);
      // Abilities
    } else if (abilities.includes(itemData.type)) {
      validationData = await validateDropItem(actor, itemData);
      // the option prompt is only relevant for talents, skills and devotions to not have different subcategories
      if ( itemData.type === "talent" ) {
      bookingResult = await actor._showOptionsPrompt(actor, itemData, validationData);
      } else {
        bookingResult = "free";
      }
      // Threads
    } else if (threads.includes(itemData.type)) {
      validationData = await validateDropItem(actor, itemData);
      bookingResult = await actor._showOptionsPrompt(actor, itemData, validationData);
    } else if (classes.includes(itemData.type)) {
      validationData = await validateDropItem(actor, itemData);
      // disciplines, paths and questors might work differently, paths and questors are not yet impletmented.
      if ( itemData.type === "discipline" ) {
        bookingResult = "addDiscipline";
      } 
    }
  } 
  const result = {
    bookingResult: bookingResult,
    validationData: validationData
  }
  return result
}
