/**
 * Register all the system's settings.
 */
export default function registerSystemSettings() {
// export async function registerSystemSettings() {
    /* -------------------------------------------------------------------------------- */
    /*                                  STEP TABLES                                     */
    /* -------------------------------------------------------------------------------- */

    // Step Table settings Header
    game.settings.register( "ed4e", "stepTableHeader", {
        name: "ED.Settings.StepTable.stepTableHeader",
        config: true,
    } );

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
    
    /* -------------------------------------------------------------------------------- */
    /*                                  DARK MODE                                       */
    /* -------------------------------------------------------------------------------- */

    // Dark Mode settings Header
    game.settings.register( "ed4e", "darkModeHeader", {
        name: "ED.Settings.DarkMode.darkModeHeader",
        config: true,
    } );

    /**
     * dark mode. Css adjustements are located in the dark-theme.less file.
     */
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

    /* -------------------------------------------------------------------------------- */
    /*                              CHARACTER GENERATION                                */
    /* -------------------------------------------------------------------------------- */

    // Legend point settings Header
    game.settings.register( "ed4e", "charGenHeader", {
        name: "ED.Settings.CharGen.charGenHeader",
        config: true,
    } );

    // Starting attribute points to spend
    game.settings.register( "ed4e", "charGenAttributePoints", {
        name: "ED.Settings.CharGen.attributePoints",
        hint: "ED.Settings.CharGen.hintAttributePoints",
        scope: "world",
        config: true,
        type: Number,
        default: 25,
    } )

    // Maximum rank that can be assigned to a talent or skill on character generation
    game.settings.register( "ed4e", "charGenMaxRank", {
        name: "ED.Settings.CharGen.maxRanks",
        hint: "ED.Settings.CharGen.hintMaxRanks",
        scope: "world",
        config: true,
        type: Number,
        default: 3,
    } );

    /* -------------------------------------------------------------------------------- */
    /*                                  LP TRACKING                                     */
    /* -------------------------------------------------------------------------------- */

    // Legend point settings Header
    game.settings.register( "ed4e", "lpTrackingHeader", {
        name: "ED.Settings.LpTracking.lpTrackingHeader",
        config: true,
    } );
  
    // LP Tracking On/Off
    game.settings.register( "ed4e", "lpTrackingUsed", {
        name: "ED.Settings.LpTracking.lpTrackingUsed",
        hint: "ED.Settings.LpTracking.hintUsed",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    } );
    // LP Tracking Option Attributes
    game.settings.register( "ed4e", "lpTrackingAttributes", {
        name: "ED.Settings.LpTracking.lpTrackingAttributeOptions",
        hint: "ED.Settings.LpTracking.hintAttributesOption",
        scope: "world",
        config: true,
        default: "spendLp",
        type: String,
        choices: {
            spendLp: "ED.Settings.LpTracking.spendLp",
            spendLpPerCircle: "ED.Settings.LpTracking.spendLpPerCircle",
            freePerCircle: "ED.Settings.LpTracking.freePerCircle"
          }
    } );

    // LP Tracking Option Talents
    game.settings.register( "ed4e", "lpTrackingAllTalents", {
        name: "ED.Settings.LpTracking.lpTalentsRequirement",
        hint: "ED.Settings.LpTracking.hintTalents",
        scope: "world",
        config: true,
        default: "disciplineTalents",
        type: String,
        choices: {
            disciplineTalents: "ED.Settings.LpTracking.disciplineTalents",
            allTalents: "ED.Settings.LpTracking.allTalents",
            allTalentsHouseRule: "ED.Settings.LpTracking.allTalentsHouseRule"
          }
    } );

    // LP Tracking Option Skill Training
    game.settings.register( "ed4e", "lpTrackingRemoveSilver", {
        name: "ED.Settings.LpTracking.lpTrackingRemoveSilverOption",
        hint: "ED.Settings.LpTracking.hintAutomaticSilverOption",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    } );

    /* -------------------------------------------------------------------------------- */
    /*                                  ENCUMBRANCE                                     */
    /* -------------------------------------------------------------------------------- */

    // Encumbrance settings Header
    game.settings.register( "ed4e", "encumberedHeader", {
        name: "ED.Settings.Encumbrance.encumberedHeader",
        config: true,
    } );

    // Encumbrance options
    game.settings.register( "ed4e", "encumbrance", {
        name: "ED.Settings.Encumbrance.encumbrance",
        hint: "ED.Settings.Encumbrance.encumbranceHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    } );

     /* -------------------------------------------------------------------------------- */
    /*                                  GM Chat Avatar                                     */
    /* -------------------------------------------------------------------------------- */

    // Chat Avatar settings Header
    game.settings.register( "ed4e", "chatAvatarHeader", {
        name: "ED.Settings.Chat.chatAvatarHeader",
        config: true,
    } );

    // Chat Avater Options
    game.settings.register( "ed4e", "chatAvatar", {
        name: "ED.Settings.Chat.chatAvatar",
        hint: "ED.Settings.Chat.chatAvatarHint",
        scope: "world",
        config: true,
        default: "configuration",
        type: String,
        choices: {
            configuration: "ED.Settings.Chat.chatAvatarConfiguration",
            selectedToken: "ED.Settings.Chat.chatAvatarToken"
          }
    } );
}




