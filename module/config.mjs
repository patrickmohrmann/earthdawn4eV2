import { preLocalize } from "./utils.mjs";

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
 * @description The grouping for the document creation dialogues in from the sidebar.
 */
ED4E.typeGroups = {
	Item: {
		Equipment: 	['armor', 'equipment', 'shield', 'weapon'],
		Powers:		['attack', 'maneuver', 'power'],
		Abilities: 	['devotion', 'knackAbility', 'knackManeuver','knackKarma', 'skill', 'specialAbility', 'talent'],
		Conditions: ['cursemark', 'effect', 'poisonDisease'],
		Magic: 		['spell', 'thread', 'spellKnack', 'bindingSecret', 'matrix'],
		Classes: 	['discipline', 'path', 'questor'],
		Other: 		['mask', 'namegiver', 'shipWeapon']
	},
	Actor: {
		Namegivers: ['character', 'npc'],
		Creatures: 	['creature', 'spirit', 'horror', 'dragon'],
		Other: 		['group', 'vehicle', 'trap', 'loot']
	}
}

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
	dex: {
		label: 			"ED.Actor.Attributes.dexterity",
		abbreviation: 	"ED.Actor.Attributes.dexterityAbbr"
	},
	str: {
		label: 			"ED.Actor.Attributes.strength",
		abbreviation: 	"ED.Attribute.strengthAbbr"
	},
	tou: {
		label: 			"ED.Actor.Attributes.toughness",
		abbreviation: 	"ED.Actor.Attributes.toughnessAbbr"
	},
	per: {
		label: 			"ED.Actor.Attributes.perception",
		abbreviation: 	"ED.Actor.Attributes.perceptionAbbr"
	},
	wil: {
		label: 			"ED.Actor.Attributes.willpower",
		abbreviation: 	"ED.Actor.Attributes.willpowerAbbr"
	},
	cha: {
		label: 			"ED.Actor.Attributes.charisma",
		abbreviation: 	"ED.Actor.Attributes.charismaAbbr"
	}
};
preLocalize( "attributes", {keys: ["label", "abbreviation"]} );

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
};
preLocalize( "globalBonuses", {key: "label"} );

/**
 * Denomination options
 * @enum {string}
 */
ED4E.denomination = {
	copper: 			"ED.Denomination.copper",
	silver: 			"ED.Denomination.silver",
	gold: 				"ED.Denomination.gold"
}
preLocalize( "denomination" );

/**
 * Availability
 * @enum {string}
 */
ED4E.availability = {
	everyday: 			"ED.Item.Availability.everyday",
	average: 			"ED.Item.Availability.average",
	unusual: 			"ED.Item.Availability.unusual",
	rare: 				"ED.Item.Availability.rare",
	veryRare: 			"ED.Item.Availability.veryRare",
	unique: 			"ED.Item.Availability.unique"
}
preLocalize( "availability" );

/**
 * Actions
 * @enum {string}
 */
ED4E.action = {
	none: 				"ED.General.none",
	free: 				"ED.Action.free",
	simple: 			"ED.Action.simple",
	standard: 			"ED.Action.standard",
	sustained: 			"ED.Action.sustained"
}
preLocalize( "action" );

/**
 * Target Difficulty
 * @enum {string}
 */
ED4E.targetDifficulty = {
	none: 				"ED.General.none",
	mystical: 			"ED.Defenses.mystical",
	physical: 			"ED.Defenses.physical",
	social: 			"ED.Defenses.social",
}
preLocalize( "targetDifficulty" );

/**
 * Group  Difficulty
 * @enum {string}
 */
ED4E.groupDifficulty = {
	none: 				"ED.General.none",
	highestOfGroup: 	"ED.Defenses.highestOfGroup",
	lowestOfGroup: 		"ED.Defenses.lowestOfGroup",
	hightestX: 			"ED.Defenses.hightestX",
	lowestX:			"ED.Defenses.lowestX"
}
preLocalize( "groupDifficulty" );

/**
 * Armor
 * @enum {string}
 */
ED4E.armor = {
	none: 				"ED.General.none",
	physical:			"ED.Armor.physical",
	mystical: 			"ED.Armor.mystical",
}
preLocalize( "armor" );

/**
 * Damage type
 * @enum {string}
 */
ED4E.damageType = {
	standard:			"ED.Health.Damage.standard",
	stun:				"ED.Health.Damage.stun",
}
preLocalize( "damageType" );

ED4E.languages = {
	dwarf: "ED.Languages.dwarf",
	elf: "ED.Languages.elf",
	human: "ED.Languages.human",
	obsidiman: "ED.Languages.obsidiman",
	ork: "ED.Languages.ork",
	troll: "ED.Languages.troll",
	tskrang: "ED.Languages.tskrang",
	windling: "ED.Languages.windling",
};
preLocalize( "languages" );

ED4E.spellcastingTypes = {
	elementalism: "X.Elementalism",
	illusionism: "X.Illusionism",
	nethermancy: "X.Nethermancy",
	shamanism: "X.Shamanism",
	wizardry: "X.Wizardry",
};
preLocalize( "spellcastingTypes" );

/* -------------------------------------------- */
/*  Advancement & Char Gen                      */
/* -------------------------------------------- */

/**
 * Tier
 * @enum {string}
 */
ED4E.tier = {
	// none: 				"ED.General.none",
	novice: 			"ED.Tier.novice",
	journeyman: 		"ED.Tier.journeyman",
	warden: 			"ED.Tier.warden",
	master: 			"ED.Tier.master"
}
preLocalize( "tier" );

/**
 * talentCategory
 * @enum {string}
 */
ED4E.talentCategory = {
	discipline: 			"ED.talentCategory.discipline",
	optional: 				"ED.talentCategory.optional",
	free: 					"ED.talentCategory.free",
	versatility: 			"ED.talentCategory.versatility"
}
preLocalize( "talentCategory" );

/**
 * Type of grantable abilities for a class level
 * @enum {string}
 */
ED4E.abilityPools = {
	class:		"ED.Advancement.Pools.class",
	free:			"ED.Advancement.Pools.free",
	special:	"ED.Advancement.Pools.special"
}
preLocalize( "abilityPools" );

/**
 * Types of skills.
 * @enum {string}
 */
ED4E.skillTypes = {
	general:		"ED.Skills.general",
	artisan:		"ED.Skills.artisan",
	knowledge:	"ED.Skills.knowledge",
};
preLocalize( "skillTypes" );

/* -------------------------------------------- */
/*  Character Generation                        */
/* -------------------------------------------- */

/**
 * Lookup table used during character generation based on attribute values.
 * @type {{defenseRating: number[], unconsciousRating: number[], carryingCapacity: number[], armor: number[], deathRating: number[], step: number[], woundThreshold: number[], recovery: number[]}}
 */
ED4E.characteristicsTable = {
	step: [0, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11],
	defenseRating: [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16],
	carryingCapacity: [0, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 95, 110, 125, 140, 155, 175, 195, 215, 235, 255, 280, 305, 330, 355, 380, 410, 440, 470, 500, 530],
	unconsciousRating: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60],
	deathRating: [0, 4, 6, 8, 11, 13, 15, 18, 20, 22, 25, 27, 29, 32, 34, 36, 39, 41, 43, 46, 48, 50, 53, 55, 57, 60, 62, 64, 67, 69, 71],
	woundThreshold: [0, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17],
	recovery: [0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, ],
	armor: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6],
}

ED4E.availableRanks = {
	talent: 8,
	devotion: 1,
	knowledge: 2,
	artisan: 1,
	general: 8,
	speak: 2,
	readWrite: 1,
};

/* -------------------------------------------- */
/*  Encumbrance                                 */
/* -------------------------------------------- */

/**
 * The possible statuses of encumbrance
 * @enum {string}
 */
ED4E.encumbranceStatus = {
	notEncumbered: "ED.Conditions.Encumbrance.notEncumbered",
	light: "ED.Conditions.Encumbrance.light",
	heavy: "ED.Conditions.Encumbrance.heavy",
	tooHeavy: "ED.Conditions.Encumbrance.tooHeavy"
}
preLocalize( "encumbranceStatus" );

/* -------------------------------------------- */
/*  Advancement                                 */
/* -------------------------------------------- */

ED4E.lpSpendingTypes = {
	attribute: "X.Attribute",
	devotion: "X.devotion",
	knack: "X.knack",
	knackManeuver: "X.knackManeuver",
	skill: "X.skill",
	spell: "X.spell",
	spellKnack: "X.spellKnack",
	talent: "X.talent",
	thread: "thread",
};
preLocalize( "lpSpendingTypes" );

/* -------------------------------------------- */
/*  Rolls and Tests                             */
/* -------------------------------------------- */

/**
 * The available types of (roll) tests for {@link EdRollOptions}.
 * @enum {string}
 */
ED4E.testTypes = {
	arbitrary: {
		label: "ED.Rolls.Labels.arbitraryTestRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/arbitrary-roll-flavor.hbs",
	},
	action: {
		label: "ED.Rolls.Labels.actionTestRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/ability-roll-flavor.hbs",
	},
	effect: {
		label: "ED.Rolls.Labels.effectTestRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/effect-roll-flavor.hbs",
	},
	damage: {
		label: "ED.Rolls.Labels.damageRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/damage-roll-flavor.hbs",
	},
}
preLocalize( "testTypes", { key: "label" } );


/**
 * The available sub-types of (roll) tests for {@link EdRollOptions}.
 * @enum {string}
 */
ED4E.rollTypes = {
	ability: {
		label: "ED.Rolls.Labels.abilityRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/ability-roll-flavor.hbs",
	},
	arbitrary: {
		label: "ED.Rolls.Labels.arbitraryRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/arbitrary-roll-flavor.hbs",
	},
	attack: {
		label: "ED.Rolls.Labels.attackRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
	},
	attribute: {
		label: "ED.Rolls.Labels.attributeRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/attribute-roll-flavor.hbs",
	},
	damage: {
		label: "ED.Rolls.Labels.damageRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/damage-roll-flavor.hbs",
	},
	effect: {
		label: "ED.Rolls.Labels.effectRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/effect-roll-flavor.hbs",
	},
	halfmagic: {
		label: "ED.Rolls.Labels.halfmagicRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/halfmagic-roll-flavor.hbs",
	},
	initiative: {
		label: "ED.Rolls.Labels.initiativeRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/initiative-roll-flavor.hbs",
	},
	recovery: {
		label: "ED.Rolls.Labels.recoveryRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/recovery-roll-flavor.hbs",
	},
	spellcasting: {
		label: "ED.Rolls.Labels.spellcastingRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/spellcasting-roll-flavor.hbs",
	},
	threadWeaving: {
		label: "ED.Rolls.Labels.threadWeavingRoll",
		flavorTemplate: "systems/ed4e/templates/chat/chat-flavor/threadWeaving-roll-flavor.hbs",
	},
}
preLocalize( "testTypes", { key: "label" } );


/* -------------------------------------------- */
/*  System			                                */
/* -------------------------------------------- */

/**
 * Reserved earthdawn ids.
 * @enum {string}
 */
ED4E.reserved_edid = {
	DEFAULT: 'none',
	ANY: 'any',
}

/* -------------------------------------------- */
/*  Chat Commands                               */
/* -------------------------------------------- */

/**
 * The available chat commands with their corresponding help text.
 * @enum {string}
 */
ED4E.chatCommands = {
	char: 'X.chatCommandCharHelp no parameters, trigger char gen',
	coin: 'X.chatCommandCoinHelp number plus coinage, pass out coins',
	group: 'X.chatCommandGroupHelp no parameters?, calc CR for group',
	h: "X.chatCommandHelp optional param 'chatCommand', show general help or for given command",
	help: "X.chatCommandHelp optional param 'chatCommand', show general help or for given command",
	lp: 'X.chatCommandLpHelp number, award LP points',
	s: 'X.chatCommandSHelp any number of steps separated by whitespace or +, roll the given steps',
};
preLocalize( "chatCommands" );

/* -------------------------------------------- */
/*  Costs                                       */
/* -------------------------------------------- */

ED4E.attributePointsCost = [0, 1, 2, 3, 5, 7, 9, 12, 15];
ED4E.attributePointsCost[-1] = -1;
ED4E.attributePointsCost[-2] = -2;

/* -------------------------------------------- */
/*  Enable .hbs Hot Reload                      */
/* -------------------------------------------- */

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
/*  Export Config                               */
/* -------------------------------------------- */

export default ED4E;
