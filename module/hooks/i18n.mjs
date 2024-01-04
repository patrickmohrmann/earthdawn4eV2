import {performPreLocalization} from "../utils.mjs";

export default function () {
    Hooks.once('i18nInit', () => {
        // Perform one-time pre-localization and sorting of some configuration objects
        performPreLocalization(CONFIG.ED4E);
    } );
}