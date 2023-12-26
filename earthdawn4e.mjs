/**
 * The Earthdawn 4e game system for Foundry Virtual Tabletop
 * A system for playing the fourth edition of the Earthdawn role-playing game.
 * Author: Patrick Mohrmann, Chris
 * Software License: MIT
 * Content License: ??
 * Repository: https://github.com/patrickmohrmann/earthdawn4eV2
 * Issue Tracker: https://github.com/patrickmohrmann/earthdawn4eV2/issues
 */

// Import configuration
import ED4E from './module/config.mjs';
import registerSystemSettings from './module/settings.mjs';
import { registerHandlebarHelpers } from './module/handlebar-helpers.mjs'
import  "./module/tours/tours.mjs";


// Import submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as utils from "./module/utils.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.ed4e = {
  applications,
  canvas,
  config: ED4E,
  dataModels,
  dice,
  documents,
  utils
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */


Hooks.once( "init", () => {
  globalThis.ed4e = game.ed4e = Object.assign( game.system, globalThis.ed4e );
  console.log( "ED4e | Initializing the ED4e Game System" );

  // record configuration values
  CONFIG.ED4E = ED4E;
  CONFIG.Actor.documentClass = documents.ActorEd;
  CONFIG.Item.documentClass = documents.ItemEd;

  // Register System Settings
  // registerSystemSettings();

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
  /*  Foundry VTT System Setting Initialization   */
  /* -------------------------------------------- */

  registerSystemSettings()

  /**
   * @summary Dark theme gradient calculation
   * @description Dark theme slider adds the css class "dark-theme to :root if the slider is above 50%"
   * @param {number} darkValue percentage value in 5% steps
   */

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
} );

Hooks.once( 'ready', async () => {

  /* -------------------------------------------- */
  /*  Debug Documents                             */
  /* -------------------------------------------- */

  // Create on document for each type

  game.folders.forEach( ( value, key, map ) => {
    if ( value.flags.deleteOnStartup ) value.delete();
  } );
  game.items.forEach( ( value, key, map ) => {
    if ( value.flags.deleteOnStartup ) value.delete();
  } );
  game.actors.forEach( ( value, key, map ) => {
    if ( value.flags.deleteOnStartup ) value.delete();
  } );

  const actorFolder = await Folder.create(
    {
      "name": "DebugActors",
      "type": "Actor",
      "description": "<p>Contains data created for debugging purposes</p>",
      "color": "#efdaca",
      "flags": { deleteOnStartup: true }
    } );
  const itemFolder = await Folder.create(
    {
      "name": "DebugItems",
      "type": "Item",
      "description": "<p>Contains data created for debugging purposes</p>",
      "color": "#efdaca",
      "flags": { deleteOnStartup: true }
    } );


  const createdActors = {};
  const createdItems = {};
  for ( const actorType of Object.keys( CONFIG.Actor.dataModels ) ) {
    createdActors[actorType] = await
      ed4e.documents.ActorEd.create( {
          name: actorType,
          type: actorType,
          folder: actorFolder.id,
          flags: { deleteOnStartup: true }
        }
      );
  }
  for ( const itemType of Object.keys( CONFIG.Item.dataModels ) ) {
    createdItems[itemType] = await
      ed4e.documents.ItemEd.create( {
          name: itemType,
          type: itemType,
          folder: itemFolder.id,
          flags: { deleteOnStartup: true }
        }
      );
  }

  // Prepare documents

  const character = createdActors["character"];
  await character.createEmbeddedDocuments(
    "Item",
    [
      createdItems.armor.toObject(),
      createdItems.devotion.toObject(),
      createdItems.discipline.toObject(),
      createdItems.equipment.toObject(),
      createdItems.namegiver.toObject(),
      createdItems.questor.toObject(),
      createdItems.shield.toObject(),
      createdItems.skill.toObject(),
      createdItems.talent.toObject(),
      createdItems.weapon.toObject(),
    ]
  )
} );

/* -------------------------------------------- */
/*      Foundry VTT Sidebar Rendering           */
/* -------------------------------------------- */
Hooks.on( "renderSidebarTab", ( app, html ) => {
  if ( app instanceof Settings ) {
    // Add buttons
    const chlogButton = $( `<button id="ed4eChangelog" class="changelog">
      ${game.i18n.localize( "ED.Settings.SpecificSettingOptions.changelog" )}</button>` );
    const helpButton = $( `<button id="ed4eHelp" class="help">
      ${game.i18n.localize( "ED.Settings.SpecificSettingOptions.help" )}</button>` );
    const createBugButton = $( `<button id="ed4eTroubleshooting" class="troubleshooter">
      ${ game.i18n.localize( "ED.Settings.SpecificSettingOptions.troubleshooting" )}</button>` );
    html
      .find( "#game-details" )
      .after(
        $( `<div id="ed4e-sidebar">` ).append(
          $( `<h2>${game.i18n.localize( "ED.Settings.SpecificSettingOptions.title" )}</h2>` ),
          $( "<div id='ed4e-details'>" ).append( chlogButton, helpButton, createBugButton )
        )
      );
      chlogButton.click( () => {
        window.open( "https://github.com/patrickmohrmann/earthdawn4eV2/wiki/Change-Log", "_blank" );
      } );
      helpButton.click( () => {
        window.open( "https://github.com/patrickmohrmann/earthdawn4eV2/wiki/Functional-Specification", "_blank" );
      } );
      createBugButton.click( () => {
        window.open( "https://github.com/patrickmohrmann/earthdawn4eV2/issues/new/choose", "_blank" );
      } );
    
    }
  } );
