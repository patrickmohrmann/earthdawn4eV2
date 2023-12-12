// Namespace Configuration Values
const ED4E = {};

ED4E.ASCII = `_______________________________
________  _____       _____ _______
|  _____| |    \     / _  | |  ____|
|  |____  | |\  \   / / | | |  |___
|  _____| | | |  | |  |_| | |   ___|
|  |____  | |/  /  |___   | |  |___
|_______| |___/        |  | |______|
_______________________________`;

/**
 * Configuration data for abilities.
 * @typedef {object} AttributeConfiguration
 * @property {string} label                               Localized label.
 * @property {string} abbreviation                        Localized abbreviation.
 * @property {{[key: string]: number|string}}  [defaults]  Default values for this Attribute based on actor type.
 *                                                        If a string is used, the system will attempt to fetch.
 *                                                        the value of the specified Attribute.
 */

/**
 * The set of Attribute Scores used within the system.
 * @enum {AttributeConfiguration}
 */
ED4E.attributes = {
	str: {
		label: 			"ED.Attributes.strength",
		abbreviation: 	"ED.Attribute.strengthAbbr"
	},
	dex: {
		label: 			"ED.Attributes.dexterity",
		abbreviation: 	"ED.Attributes.dexterityAbbr"
	},
	tou: {
		label: 			"ED.Attributes.toughness",
		abbreviation: 	"ED.Attributes.toughnessAbbr"
	},
	per: {
		label: 			"ED.Attributes.perception",
		abbreviation: 	"ED.Attributes.perceptionAbbr"
	},
	wil: {
		label: 			"ED.Attributes.willpower",
		abbreviation: 	"ED.Attributes.willpowerAbbr"
	},
	cha: {
		label: 			"ED.Attributes.charisma",
		abbreviation: 	"ED.Attributes.charismaAbbr"
	}
}

/**
 * configuration data for Global Bonuses
 * @typedef {object} GlobalBonusConfiguration
 * @property {string} label                               Localized label.
 * @property {{[key: string]: number|string}} [defaults]  Default values for this Attribute based on actor type.
 */

/**
 * @description the global bonus configurations
 * @enum { GlobalBonusConfiguration }
 */
ED4E.globalBonuses = {
	allAttacks: {
		label: 			"ED.Actor.GlobalBonus.allAttacks"
	},
	allEffects: {
		label: 			"ED.Actor.GlobalBonus.allEffects"
	},
	allActions: {
		label: 			"ED.Actor.GlobalBonus.allActions"
	},
	allRangedAttacks: {
		label: 			"ED.Actor.GlobalBonus.allRangedAttacks"
	},
	allCloseAttacks: {
		label: 			"ED.Actor.GlobalBonus.allCloseAttacks"
	},
	allSpellcasting: {
		label: 			"ED.Actor.GlobalBonus.allSpellcasting"
	},
	allDamage: {
		label: 			"ED.Actor.GlobalBonus.allDamage"
	},
	allMeleeDamage: {
		label: 			"ED.Actor.GlobalBonus.allMeleeDamage"
	},
	allRangedDamage: {
		label: 			"ED.Actor.GlobalBonus.allRangedDamage"
	},
	allSpellEffects: {
		label: 			"ED.Actor.GlobalBonus.allSpellEffects"
	}
}

/**
 * ??? Denomination options
 */
ED4E.denomination = {
	copper: 			"ED.Denomination.copper",
	silver: 			"ED.Denomination.silver",
	gold: 				"ED.Denomination.gold"
}

/**
 * Availability
 */
ED4E.availability = {
	everyday: 			"ED.Item.Availability.everyday",
	average: 			"ED.Item.Availability.average",
	unusual: 			"ED.Item.Availability.unusual",
	rare: 				"ED.Item.Availability.rare",
	veryRare: 			"ED.Item.Availability.veryRare",
	unique: 			"ED.Item.Availability.unique"
}

/**
 * Actions
 */
ED4E.action = {
	none: 				"ED.General.none",
    free: 				"ED.Action.free",
    simple: 			"ED.Action.simple",
    standard: 			"ED.Action.standard",
    sustained: 			"ED.Action.sustained"
}

/**
 * Tier
 */
ED4E.tier = {
	none: 				"ED.General.none",
	novice: 			"ED.Tier.novice",
	journeyman: 		"ED.Tier.journeyman",
	warden: 			"ED.Tier.warden",
	master: 			"ED.Tier.master"
}

/* eslint-disable */
// Since Foundry does not support hot reloading object notation templates...
Hooks.on('hotReload', async ({ content, extension, packageId, packageType, path } = {}) => {
	if (extension === 'hbs') {
		const key = Object.entries(flattenObject(templates)).find(([_, tpath]) => tpath == path)?.[0];
		if (!key) throw new Error(`Unrecognized template: ${path}`);
		await new Promise((resolve, reject) => {
			game.socket.emit('template', path, resp => {
				if (resp.error) return reject(new Error(resp.error));
				const compiled = Handlebars.compile(resp.html);
				Handlebars.registerPartial(generateTemplateKey(key), compiled);
				console.log(`Foundry VTT | Retrieved and compiled template ${path} as ${key}`);
				resolve(compiled);
			});
		});
		Object.values(ui.windows).forEach(app => app.render(true));
	}
});
/* eslint-enable */

/* -------------------------------------------- */

export default ED4E;
