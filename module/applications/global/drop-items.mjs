
import validateDropItem from "./validation-dropped-items.mjs";

/**
 * 
 * @param {object} actor                actor on which the item is dropped
 * @param {object} itemData             item data of the dropped item
 * @returns {Promise 
 *          <{bookingResult: string,  
 *            validationData: object}>} 
 *                                      bookingResult: spend, free, cancel
 *                                      validationData: date for the validation
 */
export default async function ed4eDropItem( actor, itemData) {
  if ( !actor || !itemData ) return;
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

    let bookingResult = "";
    let validationData = {};
    if ( actor.type === "character" ) {
      // Knacks
      if (knacks.includes(itemData.type)) {
        validationData = await validateDropItem(actor, itemData);
        bookingResult = await actor._showLpOptionsPrompt(actor, itemData, validationData);
        // Spells
      } else if (spells.includes(itemData.type)) {
        validationData = await validateDropItem(actor, itemData);
        bookingResult = await actor._showLpOptionsPrompt(actor, itemData, validationData);
        // Abilities
      } else if (abilities.includes(itemData.type)) {
        validationData = await validateDropItem(actor, itemData);
        if ( itemData.type === "talent" ) {
        bookingResult = await actor._showLpOptionsPrompt(actor, itemData, validationData);
        } else {
          bookingResult = "free";
        }
        // Threads
      } else if (threads.includes(itemData.type)) {
        validationData = await validateDropItem(actor, itemData);
        bookingResult = await actor._showLpOptionsPrompt(actor, itemData, validationData);
      }
      if (classes.includes(itemData.type)) {
        if ( itemData.type === "discipline" ) {
          validationData = await validateDropItem(actor, itemData);
          // bookingResult = await actor._showLpOptionsPrompt(actor, itemData, validationData);
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
