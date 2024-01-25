
export default class JournalSheetEd extends JournalSheet {
    triggerRollStep( argString ) {
        const argRegExp = /(\d+)(?=\s*\+?\s*)/g;
        const steps = argString.match( argRegExp );
      
        if ( !steps ) return true;
      
        steps.forEach( ( currentStep ) =>
          new ed4e.dice.EdRoll( undefined, {}, { step: { total: Number( currentStep ) } } ).toMessage() );
      
        return false;
      }
}