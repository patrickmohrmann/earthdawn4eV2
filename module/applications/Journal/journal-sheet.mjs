import triggerRollStep from "../../documents/journal.mjs";
export default class JournalSheetEd extends JournalSheet {

    

    activateListeners( html ) {
        super.activateListeners( html );
    
        // All listeners below are only needed if the sheet is editable
        // if ( !this.isEditable ) return;

        // listener click to request roll
        html.find( ".journal--roll" ).click( this._triggerJournalRoll.bind( this ) );
        console.log("triggerRoll")
        $( 'body' ).on( 'click', '.journal--roll', async ( event ) => {
            console.log("triggerRoll")
            let chatData = {
                content: `${event.target.dataset.step}`,
                };
                 triggerRollStep( event.target.dataset.step );
                await ChatMessage.create( chatData, {} );
            } );
      }

      async _triggerJournalRoll ( event ) {
        let chatData = {
        content: `${event.target.dataset.step}`,
        };
         triggerRollStep( event.target.dataset.step );
        await ChatMessage.create( chatData, {} );
    }
}