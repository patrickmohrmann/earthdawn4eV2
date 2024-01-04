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
import  "./module/tours/tours.mjs";


// Import submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as hooks from "./module/hooks/_module.mjs";
import * as system from "./module/system/_module.mjs";
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
    hooks,
    system,
    utils
};

/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

system.registerHooks();

/* -------------------------------------------- */
/*  Bundled Module Exports                      */
/* -------------------------------------------- */

export {
    applications,
    canvas,
    dataModels,
    dice,
    documents,
    hooks,
    // migrations,
    system,
    utils,
    ED4E
};