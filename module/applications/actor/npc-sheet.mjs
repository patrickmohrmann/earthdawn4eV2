import ActorSheetEd from "./base-sheet.mjs";

/**
 * An Actor sheet for player character type actors.
 */
export default class ActorSheetEdNpc extends ActorSheetEd {
 // Override the getData method


  // Override the activateListeners method
  activateListeners( html ) {
    super.activateListeners( html );

    // Add event listener for input changes
    html.find( "input, textarea, select" ).change( event => {
      const input = event.target;
      const value = input.type === "checkbox" ? input.checked : input.value;
      const name = input.name;

      // Update the actor's data model
      this.actor.update( { [name]: value } );
    } );
  }
}
