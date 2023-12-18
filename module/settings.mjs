/**
 * Register all the system's settings.
 */
export async function registerSystemSettings() {
    // Step Table used for step to dice conversion
    game.settings.register( "ed4e", "stepTable", {
        name: "ED.Settings.StepTable.stepTable",
        hint: "ED.Settings.StepTable.hint",
        scope: "world",
        config: true,
        default: "fourth",
        type: String,
        choices: {
            classic: "ED.Settings.StepTable.editionClassic",
            first: "ED.Settings.StepTable.editionfirst",
            third: "ED.Settings.StepTable.editionThird",
            fourth: "ED.Settings.StepTable.editionFourth"
          }
    } );
    // dark mode. Css adjustements are located in the dark-theme.less file.
    game.settings.register( "ed4e", "darkMode", {
        name: "ED.Settings.DarkMode.darkMode",
        hint: "ED.Settings.DarkMode.hint",
        scope: "client",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 1,
            max: 10,
            step: 1
        },
        onChange: async( val ) => {
            if ( val > 1 ) {
                $( ':root' ).addClass( 'dark-theme' );
            } else {
                $( ':root' ).removeClass( 'dark-theme' );
            }
        } 
    } );   
}



