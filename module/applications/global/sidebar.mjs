import RollPrompt from "./roll-prompt.mjs"
import EdRollOptions from "../../data/other/roll-options.mjs";

// to be moved to sidebar.mjs ... but how???
// Dice symbole roll prompt trigger

/**
 * 
 */
export async function rollArbitrary() {
            const edRollOptions = new EdRollOptions( {
                step: { base: 0, modifier: 0 },
                karma: { pointsUsed: 0, available: 0, step: 4 },
                devotion: { pointsUsed: 0, available: 0, step: 3 },
                strain: 0,
                target: { base: 0, modifier: 0 },
                rollType: "ArbitraryRoll",
                chatFlavor: `${game.i18n.localize( "X-Arbitrary-Step" )}`,
            } );
            const roll = await RollPrompt.waitPrompt( edRollOptions );
            roll.toMessage();
        }