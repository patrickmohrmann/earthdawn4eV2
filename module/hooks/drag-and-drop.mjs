
export default function () {
Hooks.on("renderActorSheet", (app, html, data) => {
    html.find(".item-list").on("drop", async (event) => {
      // Parse the drop event to get the item data
      let itemData;
      try {
        itemData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));
      } catch (err) {
        return; // Exit if the data can't be parsed
      }
  
      // Check if the item type is talent, skill, or devotion
      if (["talent", "skill", "devotion"].includes(itemData.type)) {
        // Create a confirmation dialog
        let dialog = new Dialog({
          title: "Confirm Item Addition",
          content: `<p>Do you want to add this ${itemData.type} to the actor?</p>`,
          buttons: {
            yes: {
              icon: '<i class="fas fa-check"></i>',
              label: "Yes",
              callback: () => {
                // Code to add the item to the actor
                console.log("Item added to the actor.");
              }
            },
            no: {
              icon: '<i class="fas fa-times"></i>',
              label: "No",
              callback: () => console.log("Operation cancelled.")
            }
          },
          default: "no"
        });
        dialog.render(true);
      }
    });
  });
}