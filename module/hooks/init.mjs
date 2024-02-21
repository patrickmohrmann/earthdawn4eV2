// Import configuration
import ED4E from '../config.mjs';
import  "../tours/tours.mjs";
import {registerHandlebarHelpers} from "../handlebar-helpers.mjs";
import registerSystemSettings from "../settings.mjs";

// Import submodules
import * as applications from "../applications/_module.mjs";
import * as canvas from "../canvas/_module.mjs";
import * as dataModels from "../data/_module.mjs";
import * as dice from "../dice/_module.mjs";
import * as documents from "../documents/_module.mjs";
import * as enrichers from "../enrichers.mjs";
import * as utils from "../utils.mjs";



export default function () {
    Hooks.once( "init", () => {
        globalThis.ed4e = game.ed4e = Object.assign( game.system, globalThis.ed4e );
        console.log( "ED4e | Initializing the ED4e Game System" );

        // record configuration values
        CONFIG.ED4E = ED4E;
        CONFIG.Actor.documentClass = documents.ActorEd;
        CONFIG.Item.documentClass = documents.ItemEd;
        CONFIG.JournalEntry.documentClass = documents.JournalEntryEd;

        // Register Roll Extensions
        CONFIG.Dice.rolls.splice( 0, 0, dice.EdRoll );

        // Register text editor enrichers
        enrichers.registerCustomEnrichers();

        // Register Handlebars Helper
        registerHandlebarHelpers();

        // Hook up system data types
        CONFIG.Actor.dataModels = dataModels.actor.config;
        CONFIG.Item.dataModels = dataModels.item.config;

        // Register sheet application classes
        Actors.unregisterSheet( "core", ActorSheet );
        Actors.registerSheet( "earthdawn4e", applications.actor.ActorSheetEdCharacter, {
            types: ["character"],
            makeDefault: true
        } );
        Items.unregisterSheet( "core", ItemSheet );
        Items.registerSheet( "earthdawn4e", applications.item.ItemSheetEd, {
            makeDefault: true
        } );
        Journal.unregisterSheet( "core", JournalSheet );
        Journal.registerSheet( "earthdawn4e", applications.journal.JournalSheetEd, {
            makeDefault: true
        } );
        /*DocumentSheetConfig.registerSheet( JournalEntryPage, "earthdawn4e", applications.journal.JournalSheetEd, {
            label: "text",
            types: ["text"],
            makeDefault: true
        } );*/

        // Preload Handlebars templates.
        utils.preloadHandlebarsTemplates();

        /* -------------------------------------------- */
        /*  System Setting Initialization               */
        /* -------------------------------------------- */

        registerSystemSettings()

        /* -------------------------------------------- */
        /*  Bundled Module Exports                      */
        /* -------------------------------------------- */

        _registerDarkMode();
    } );
}

/**
 * @summary Enrich Journals to be able to create roll trigger as inline text
 */
function _enrichJournalsToRoll () {
    CONFIG.TextEditor.enrichers.push( {
        pattern: /@Roll\(\s*(?<rollCmd>\/s\s*\d+(?:\s*\+\s*\d+)?)\s*\)(?:\((?<flavor>(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+\s?)*)\))?(?:\((?<rollType>action|effect|damage)\))?/g,
        enricher: ( match ) => {

            const rollCmd = match.groups.rollCmd;
            const rollFlavor = match.groups.flavor;
            const rollType = match.groups.rollType ?? 'arbitrary';

            const textRollFormula = rollCmd.replace(
              "/s",
              game.i18n.localize( "ED.General.step"
              ) );
            const textRollType = (rollType === 'arbitrary')
              ? ""
              : `${ED4E.rollTypes[rollType].label}:&nbsp;`;

            const rollElement = `
            <a class="journal--roll strong" data-roll-cmd="${rollCmd}" data-roll-flavor="${rollFlavor}" 
              title="${game.i18n.localize( "X.Click to roll" )}">
              <i class="fas fa-regular fa-dice"></i>
              ${textRollType}${textRollFormula}&nbsp;${rollFlavor}
            </a>`

            return $( rollElement )[0];
        },
    } );
}

/**
 * @summary Dark theme gradient calculation
 * @description Dark theme slider adds the css class "dark-theme to :root if the slider is above 50%"
 * @description darkValue percentage value in 5% steps
 */
function _registerDarkMode() {
    const darkValue = game.settings.get( "ed4e", "darkMode" ) * 5 + 50;
    const bgValue = 255 - ( darkValue * 2.55 );
    const textValue = darkValue * 2.55;
    document.documentElement.style.setProperty( "--bg-color", `rgb(${bgValue}, ${bgValue}, ${bgValue})` );
    document.documentElement.style.setProperty( "--text-color", `rgb(${textValue}, ${textValue}, ${textValue})` );
    if ( darkValue > 55 ) {
        $( ':root' ).addClass( 'dark-theme' );
    } else {
        $( ':root' ).removeClass( 'dark-theme' );
    }
}