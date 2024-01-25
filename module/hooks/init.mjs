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
import * as utils from "../utils.mjs";



export default function () {
    Hooks.once( "init", () => {
        globalThis.ed4e = game.ed4e = Object.assign( game.system, globalThis.ed4e );
        console.log( "ED4e | Initializing the ED4e Game System" );

        // record configuration values
        CONFIG.ED4E = ED4E;
        CONFIG.Actor.documentClass = documents.ActorEd;
        CONFIG.Item.documentClass = documents.ItemEd;

        // Register Roll Extensions
        CONFIG.Dice.rolls.splice( 0, 0, dice.EdRoll );

        // Register journal entry text transformation into a roll trigger
        _enrichJournalsToRoll();


          // in application @Patrick
          // listener click to request roll
            $( 'body' ).on( 'click', '.journal--roll', async ( event ) => {
                let step = event.target.dataset.step
                let chatFlavor= event.target.dataset.flavor
                 triggerRollStep( step, chatFlavor );
            } );

            // in Journal document @Patrick
            /**
             * @description creating the roll
             * @param {string} argString step
             * @param {string} chatFlavor chatflavor
             * @returns 
             */
            function triggerRollStep( argString, chatFlavor ) {
                const argRegExp = /(\d+)(?=\s*\+?\s*)/g;
                const steps = argString.match( argRegExp );
                if ( !steps ) return true;
                steps.forEach( ( currentStep ) =>
                  new ed4e.dice.EdRoll( undefined, {}, { step: { total: Number( currentStep ) }, chatFlavor: chatFlavor } ).toMessage(),
                );
                return false;
              }

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

// /**
//  * @summary Enrich Journals to be able to create roll triger as inline text
//  */
// function _enrichJournalsToRoll () {
//     CONFIG.TextEditor.enrichers.push( {
//         pattern: /@Roll\((\/s \d+(( )?\+( )?\d+)*)\)(\(([A-z]*)\))/g,
//         // in eine extra Function @Patrick
//         enricher: ( match ) => {
//             let returnRoll = document.createElement( "a" );
//             returnRoll.innerHTML = " " + match[1].replace( "/s", game.i18n.localize( "X.Stufe" ) ) + " " + match[6];
//             returnRoll.dataset.step = match[1]
//             returnRoll.dataset.flavor = " " + match[1].replace( "/s", game.i18n.localize( "X.Stufe" ) ) + " " + match[6];
//             returnRoll.title = "click to roll";
//             returnRoll.classList.add( "journal--roll", "fa-regular", "fa-dice" );
//             return returnRoll;
//         },
//       } );
// }



function _enrichJournalsToRoll () {
    CONFIG.TextEditor.enrichers.push( {
        pattern: /@Roll\((\/s \d+(( )?\+( )?\d+)*)\)(\(([A-z]*)\))/g,
        // in eine extra Function @Patrick
        enricher: ( match ) => {
            let returnRoll = document.createElement( "a" );
            // returnRoll.innerHTML = " " + match[1].replace( "/s", game.i18n.localize( "X.Stufe" ) ) + " " + match[6];
            let textNode = document.createTextNode ( returnRoll.innerHTML )
            textNode = document.createElement( "a" )
            textNode.dataset.step = match[1];
            textNode.dataset.flavor = " " + match[1].replace( "/s", game.i18n.localize( "X.Stufe" ) ) + " " + match[6];
            returnRoll.appendChild( textNode );
            textNode.classList.add( "journal--roll" );
            textNode.innerHTML = " " + match[1].replace( "/s", game.i18n.localize( "X.Stufe" ) ) + " " + match[6];
            
            returnRoll.classList.add( "journal--roll", "fa-regular", "fa-dice" );

            returnRoll.dataset.step = match[1]
            returnRoll.dataset.flavor = " " + match[1].replace( "/s", game.i18n.localize( "X.Stufe" ) ) + " " + match[6];
            returnRoll.title = "click to roll";
            returnRoll.classList.add( "journal--roll" );
            return returnRoll;
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