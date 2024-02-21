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