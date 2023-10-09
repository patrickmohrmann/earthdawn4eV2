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

    // dark mode for sheets
    game.settings.register("ed4e", "darkMode", {
        name: "ED.Settings.DarkMode.darkMode",
        hint: "ED.Settings.DarkMode.hint",
        scope: "client",
        config: true,
        default: 50,
        type: Number,
        range: {
            min: 0,
            max: 100,
            step: 5
        },
        onChange: async(val) => {
            // change the darkness level to = val
        }
    });
}
