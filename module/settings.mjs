/**
 * Register all the system's settings.
 */
export async function registerSystemSettings() {
    // Step Table used for step to dice conversion
    game.settings.register("ed4e", "stepTable", {
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
    });
    // dark mode. Css adjustements are located in the dark-theme.less file.
    game.settings.register("ed4e", "darkMode", {
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
        onChange: async(val) => {
            if (val > 1) {
                $(':root').addClass('dark-theme');
            } else {
                $(':root').removeClass('dark-theme');
            }
        } 
    });   
        // Legend point settings
        game.settings.register("ed4e", "lpTrackingHeader", {
            name: "ED.Settings.LpTracking.lpTrackingHeader",
            config: true,
        });
    // Legend point settings
    game.settings.register("ed4e", "lpTrackingAttributes", {
        name: "ED.Settings.LpTracking.lpTrackingAttributesOptions",
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
    });
    game.settings.register("ed4e", "lpTrackingAllTalents", {
        name: "ED.Settings.LpTracking.lpTrackingAllTalentsOption",
        hint: "ED.Settings.LpTracking.hintAllTalentsOption",
        scope: "world",
        config: true,
        default: "disciplineTalents",
        type: String,
        choices: {
            disciplineTalents: "ED.Settings.LpTracking.disciplineTalents",
            allTalents: "ED.Settings.LpTracking.allTalents"
          }
    });
    game.settings.register("ed4e", "lpTrackingRemoveSilver", {
        name: "ED.Settings.LpTracking.lpTrackingRemoveSilverOption",
        hint: "ED.Settings.LpTracking.hintAutomaticSilverOption",
        scope: "world",
        config: true,
        default: "automatic",
        type: String,
        choices: {
            automatic: "ED.Settings.LpTracking.automaticSilverReduction",
            notAutomatic: "ED.Settings.LpTracking.notAutomaticSilverReduction",
          }
    });
}



