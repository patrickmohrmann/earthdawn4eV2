export default class JournalSheetEd extends JournalSheet {

  activateListeners( html ) {

    super.activateListeners( html );

    // listener click to request roll
    html.find( ".journal--roll" ).click( this._triggerJournalRoll.bind( this ) );
    /*$( 'body' ).on( 'click', '.journal--roll', async ( event ) => {
      console.log("triggerRoll")
      let chatData = {
        content: `${event.target.dataset.step}`,
      };
      this.triggerRollStep( event.target.dataset.step );
      await ChatMessage.create( chatData, {} );
    } );*/

    // All listeners below are only needed if the sheet is editable
    // if ( !this.isEditable ) return;
  }

  async _triggerJournalRoll ( event ) {
    let chatData = {
      content: `${event.target.dataset.step}`,
    };
    this.document.constructor.triggerRollStep( event.target.dataset.step );
    await ChatMessage.create( chatData, {} );
  }
}