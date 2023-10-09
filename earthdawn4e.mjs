/**
 * The Earthdawn 4e game system for Foundry Virtual Tabletop
 * A system for playing the fourth edition of the Earthdawn role-playing game.
 * Author: Patrick Mohrmann, Chris
 * Software License: MIT
 * Content License: ??
 * Repository: https://github.com/patrickmohrmann/earthdawn4eV2
 * Issue Tracker: https://github.com/patrickmohrmann/earthdawn4eV2/issues
 */

// Import submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as utils from "./module/utils.mjs";
import * as registerSystemSettings from "./module/settings.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.ed4e = {
    applications,
    canvas,
    dataModels,
    dice,
    documents,
    utils,
    registerSystemSettings
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */


Hooks.once("init", () => {
    globalThis.ed4e = game.ed4e = Object.assign(game.system, globalThis.ed4e);
    console.log("ED4e | Initializing the ED4e Game System");

    // record configuration values
    CONFIG.Actor.documentClass = documents.ActorEd;
    CONFIG.Item.documentClass = documents.ItemEd;

    // Hook up system data types
    CONFIG.Actor.dataModels = dataModels.actor.config;
    CONFIG.Item.dataModels = dataModels.item.config;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("earthdawn4e", applications.actor.ActorSheetEdCharacter, {
        types: ["character"],
        makeDefault: true
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("earthdawn4e", applications.item.ItemSheetEd, {
        makeDefault: true
    });

    // Preload Handlebars templates.
  utils.preloadHandlebarsTemplates();

  registerSystemSettings.registerSystemSettings()

});


