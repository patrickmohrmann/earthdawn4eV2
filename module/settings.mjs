/**
 * Register all the system's settings.
 */
export default function registerSystemSettings() {
    // Step Table used for step to dice conversion
    game.settings.register("ED4E", "stepTable", {
        name: "Settings.StepTable.stepTable",
        hint: "Settings.StepTable.hint",
        scope: "world",
        config: true,
        default: "fourth",
        type: String,
        choices: {
            classic: "Settings.StepTable.editionClassic",
            first: "Settings.StepTable.editionfirst",
            third: "Settings.StepTable.editionThird",
            fourth: "Settings.StepTable.editionFourth"
          }
    });
}
