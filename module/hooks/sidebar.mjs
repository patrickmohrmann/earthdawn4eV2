import RollPrompt from "../applications/global/roll-prompt.mjs";
/**
 *
 */
export default function () {
  Hooks.on( "renderSidebarTab", ( app, html ) => {

    if ( app instanceof Settings ) {
      // Add buttons
      const chlogButton = $( `<button id="ed4eChangelog" class="changelog">
      ${game.i18n.localize( "ED.Settings.SpecificSettingOptions.changelog" )}</button>` );
      const helpButton = $( `<button id="ed4eHelp" class="help">
      ${game.i18n.localize( "ED.Settings.SpecificSettingOptions.help" )}</button>` );
      const createBugButton = $( `<button id="ed4eTroubleshooting" class="troubleshooter">
      ${ game.i18n.localize( "ED.Settings.SpecificSettingOptions.troubleshooting" )}</button>` );
      html
        .find( "#game-details" )
        .after(
          $( "<div id=\"ed4e-sidebar\">" ).append(
            $( `<h2>${game.i18n.localize( "ED.Settings.SpecificSettingOptions.title" )}</h2>` ),
            $( "<div id='ed4e-details'>" ).append( chlogButton, helpButton, createBugButton )
          )
        );
      chlogButton.click( () => {
        window.open( "https://github.com/patrickmohrmann/earthdawn4eV2/wiki/Change-Log", "_blank" );
      } );
      helpButton.click( () => {
        window.open( "https://github.com/patrickmohrmann/earthdawn4eV2/wiki/Functional-Specification", "_blank" );
      } );
      createBugButton.click( () => {
        window.open( "https://github.com/patrickmohrmann/earthdawn4eV2/issues/new/choose", "_blank" );
      } );
    }
  } );



  Hooks.on( "changeSidebarTab", ( app ) => {
    /* -------------------------------------------- */
    /*  Dice Icon Roll                              */
    /* -------------------------------------------- */
    /**
     * @userFunction                UF_Rolls_triggerDiceIconRoll
     */
    $( "#chat-controls i.fa-dice-d20" ).on( "click", RollPrompt.rollArbitraryPrompt.bind( null ) );
  }  );
}
