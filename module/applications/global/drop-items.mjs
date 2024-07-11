
//import _lpValidation from "../../documents/actor.mjs";
export default async function ed4eDropItem( actor, itemData) {
    const knacks = ["knackAbility", "knackKarma", "knackManeuver"];
    const spells = ["spell", "spellKnack"];
    const abilities = ["talent", "skills", "devotions"];
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
    if ( actor.type === "character" ) {
      // Knacks
      if ( knacks.includes(itemData.type ) ) {
        bookingResult = await actor._showLpOptionsPrompt(actor, itemData);   
      // Spells
      } else if ( spells.includes(itemData.type ) ) {
        bookingResult = await actor._showLpOptionsPrompt(actor, itemData);  
        // Abilities
        } else if ( abilities.includes(itemData.type ) ) {
          // bookingResult = await _lpValidation(actor, itemData);   
          bookingResult = await actor._showLpOptionsPrompt(actor, itemData);
          // Threads
          } else if ( threads.includes(itemData.type ) ) {
            bookingResult = await actor._showLpOptionsPrompt(actor, itemData);  
            } 
    } 
    return bookingResult
  }