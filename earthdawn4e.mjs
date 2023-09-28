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
import * as dataModels from "./module/data/_module.mjs";
import * as documents from "./module/documents/_module.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.ed4e = {
    dataModels,
    documents
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */


Hooks.once("init", function () {
    globalThis.ed4e = game.ed4e = Object.assign(game.system, globalThis.ed4e);
    console.log("ED4e | Initializing the ED4e Game System");

    // record configuration values
    CONFIG.Actor.documentClass = documents.ActorEd;
    CONFIG.Item.documentClass = documents.ItemEd;

    // Hook up system data types
    CONFIG.Actor.dataModels = dataModels.actor.config;
    CONFIG.Item.dataModels = dataModels.item.config;
});