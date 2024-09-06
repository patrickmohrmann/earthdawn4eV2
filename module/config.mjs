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
    Equipment:    [ "armor", "equipment", "shield", "weapon" ],
    Powers:       [ "attack", "maneuver", "power" ],
    Abilities:    [ "devotion", "knackAbility", "knackManeuver","knackKarma", "skill", "specialAbility", "talent" ],
    Conditions:   [ "cursemark", "effect", "poisonDisease" ],
    Magic:        [ "spell", "thread", "spellKnack", "bindingSecret", "matrix" ],
    Classes:      [ "discipline", "path", "questor" ],
    Other:        [ "mask", "namegiver", "shipWeapon" ]
  },
  Actor: {
    Namegivers:   [ "character", "npc" ],
    Creatures:    [ "creature", "spirit", "horror", "dragon" ],
    Other:        [ "group", "vehicle", "trap", "loot" ]
  }
};

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
    label:          "ED.Actor.Attributes.dexterity",
    abbreviation:   "ED.Actor.Attributes.dexterityAbbr"
  },
  str: {
    label:          "ED.Actor.Attributes.strength",
    abbreviation:   "ED.Attribute.strengthAbbr"
  },
  tou: {
    label:          "ED.Actor.Attributes.toughness",
    abbreviation:   "ED.Actor.Attributes.toughnessAbbr"
  },
  per: {
    label:          "ED.Actor.Attributes.perception",
    abbreviation:   "ED.Actor.Attributes.perceptionAbbr"
  },
  wil: {
    label:          "ED.Actor.Attributes.willpower",
    abbreviation:   "ED.Actor.Attributes.willpowerAbbr"
  },
  cha: {
    label:          "ED.Actor.Attributes.charisma",
    abbreviation:   "ED.Actor.Attributes.charismaAbbr"
  }
};
preLocalize( "attributes", {keys: [ "label", "abbreviation" ]} );

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
    label:       "ED.Actor.GlobalBonus.allAttacks"
  },
  allEffects: {
    label:       "ED.Actor.GlobalBonus.allEffects"
  },
  allActions: {
    label:       "ED.Actor.GlobalBonus.allActions"
  },
  allRangedAttacks: {
    label:       "ED.Actor.GlobalBonus.allRangedAttacks"
  },
  allCloseAttacks: {
    label:       "ED.Actor.GlobalBonus.allCloseAttacks"
  },
  allSpellcasting: {
    label:       "ED.Actor.GlobalBonus.allSpellcasting"
  },
  allDamage: {
    label:       "ED.Actor.GlobalBonus.allDamage"
  },
  allMeleeDamage: {
    label:       "ED.Actor.GlobalBonus.allMeleeDamage"
  },
  allRangedDamage: {
    label:       "ED.Actor.GlobalBonus.allRangedDamage"
  },
  allRecoveryEffects: {
    label:       "ED.Actor.GlobalBonus.allRecoveryEffects"
  },
  allKnockdownEffects: {
    label:       "ED.Actor.GlobalBonus.allKnockDownEffects"
  },
  allSpellEffects: {
    label:       "ED.Actor.GlobalBonus.allSpellEffects"
  }
};
preLocalize( "globalBonuses", {key: "label"} );

/**
 * Denomination options
 * @enum {string}
 */
ED4E.denomination = {
  copper:       "ED.Denomination.copper",
  silver:       "ED.Denomination.silver",
  gold:         "ED.Denomination.gold"
};
preLocalize( "denomination" );

/**
 * Availability
 * @enum {string}
 */
ED4E.availability = {
  everyday:   "ED.Item.Availability.everyday",
  average:    "ED.Item.Availability.average",
  unusual:    "ED.Item.Availability.unusual",
  rare:       "ED.Item.Availability.rare",
  veryRare:   "ED.Item.Availability.veryRare",
  unique:     "ED.Item.Availability.unique"
};
preLocalize( "availability" );

/**
 * Actions
 * @enum {string}
 */
ED4E.action = {
  none:         "ED.Config.Action.none",
  free:         "ED.Config.Action.free",
  simple:       "ED.Config.Action.simple",
  standard:     "ED.Config.Action.standard",
  sustained:    "ED.Config.Action.sustained",
};
preLocalize( "action" );

/**
 * Target Difficulty
 * @enum {string}
 */
ED4E.targetDifficulty = {
  none:       "ED.Config.Defenses.none",
  mystical:   "ED.Config.Defenses.mystical",
  physical:   "ED.Config.Defenses.physical",
  social:     "ED.Config.Defenses.social",
};
preLocalize( "targetDifficulty" );

/**
 * Group  Difficulty
 * @enum {string}
 */
ED4E.groupDifficulty = {
  none:             "ED.Config.Defenses.none",
  highestOfGroup:   "ED.Config.Defenses.highestOfGroup",
  lowestOfGroup:    "ED.Config.Defenses.lowestOfGroup",
  highestX:         "ED.Config.Defenses.highestX",
  lowestX:          "ED.Config.Defenses.lowestX"
};
preLocalize( "groupDifficulty" );

/**
 * Armor
 * @enum {string}
 */
ED4E.armor = {
  none:       "ED.General.none",
  physical:   "ED.Armor.physical",
  mystical:   "ED.Armor.mystical",
};
preLocalize( "armor" );

/**
 * WeaponType
 * @enum {string}
 */
ED4E.weaponType = {
  bow:        "ED.Config.bow",
  crossbow:   "ED.Config.crossbow",
  melee:      "ED.Config.melee",
  unarmed:    "ED.Config.unarmed"
};
preLocalize( "weaponType" );

/**
 * Damage type
 * @enum {string}
 */
ED4E.damageType = {
  standard:   "ED.Health.Damage.standard",
  stun:       "ED.Health.Damage.stun",
};
preLocalize( "damageType" );

/**
 * The possible states for a physical item that describe in which way they connect to an actor.
 * @enum {string}
 */
ED4E.itemStatus = {
  owned:      "ED.Config.ItemStatus.owned",
  carried:    "ED.Config.ItemStatus.carried",
  equipped:   "ED.Config.ItemStatus.equipped",
  mainHand:   "ED.Config.ItemStatus.mainHand",
  offHand:    "ED.Config.ItemStatus.offHand",
  twoHands:   "ED.Config.ItemStatus.twoHands",
  tail:       "ED.Config.ItemStatus.tail",
};
preLocalize( "itemStatus" );

ED4E.languages = {
  dwarf:        "ED.Languages.dwarf",
  elf:          "ED.Languages.elf",
  human:        "ED.Languages.human",
  obsidiman:    "ED.Languages.obsidiman",
  ork:          "ED.Languages.ork",
  troll:        "ED.Languages.troll",
  tskrang:      "ED.Languages.tskrang",
  windling:     "ED.Languages.windling",
};
preLocalize( "languages" );

ED4E.spellcastingTypes = {
  elementalism:   "ED.Config.spellcastingTypes.elementalism",
  illusionism:    "ED.Config.spellcastingTypes.illusionism",
  nethermancy:    "ED.Config.spellcastingTypes.nethermancy",
  shamanism:      "ED.Config.spellcastingTypes.shamanism",
  wizardry:       "ED.Config.spellcastingTypes.wizardry",
};
preLocalize( "spellcastingTypes" );


/* -------------------------------------------- */
/*  Active Effects Shortcuts                    */
/* -------------------------------------------- */
ED4E.singleBonuses = {
  knockdownEffects: "ED.Config.Eae.allKnockDownEffects",
};
preLocalize( "singleBonuses" );


/* -------------------------------------------- */
/*  Advancement & Char Gen                      */
/* -------------------------------------------- */

ED4E.attributePointsCost = [ 0, 1, 2, 3, 5, 7, 9, 12, 15 ];
ED4E.attributePointsCost[-1] = -1;
ED4E.attributePointsCost[-2] = -2;
ED4E.legendPointsCost = [ 0, 100, 200, 300, 500, 800, 1300, 2100, 3400, 5500, 8900, 14400, 23300, 37700, 61000, 98700, 159700, 258400, 418100 ];

/**
 * The cost of learning a new talent for additional disciplines. The first index is the order of the corresponding
 * discipline (with 0 and 1 undefined). The second index is the lowest circle attained between all disciplines.
 * @type {number[][]}
 */
ED4E.multiDisciplineNewTalentLpCost = [
  [],
  [],
  [ 0, 1300, 800, 500, 300, 200 ], // Second Discipline
  [ 0, 2100, 1300, 800, 500, 300 ], // Third Discipline
  [ 0, 3400, 2100, 1300, 800, 500 ], // Fourth+ Discipline
];

/**
 * The modifier for the lookup table {@link ED4E.legendPointsCost} based on the tier. Each tier starts at the next value
 * in the fibonacci (lp cost) sequence. The first index is the order of the corresponding discipline (with 0
 * being undefined). The key is the tier.
 * @type {[{}|{ novice: number, journeyman: number, warden: number, master: number }]}
 */
ED4E.lpIndexModForTier = [
  {},
  { novice: 0, journeyman: 1, warden: 2, master: 3, },  // First Discipline
  { novice: 1, journeyman: 2, warden: 3, master: 3, }, // Second Discipline
  { novice: 2,  journeyman: 3, warden: 3, master: 3, }, // Third Discipline
  { novice: 3, journeyman: 3, warden: 3, master: 3, }, // Fourth+ Discipline
];

ED4E.lpSpendingTypes = {
  attribute:        "X.Attribute",
  devotion:         "X.devotion",
  knack:            "X.knack",
  knackManeuver:    "X.knackManeuver",
  skill:            "X.skill",
  spell:            "X.spell",
  spellKnack:       "X.spellKnack",
  talent:           "X.talent",
  thread:           "X.thread",
};
preLocalize( "lpSpendingTypes" );

/**
 * Tier
 * @enum {string}
 */
ED4E.tier = {
  novice:       "ED.Config.Tier.novice",
  journeyman:   "ED.Config.Tier.journeyman",
  warden:       "ED.Config.Tier.warden",
  master:       "ED.Config.Tier.master"
};
preLocalize( "tier" );

ED4E.levelTierMapping = {
  discipline: {
    1:  "novice",
    2:  "novice",
    3:  "novice",
    4:  "novice",
    5:  "journeyman",
    6:  "journeyman",
    7:  "journeyman",
    8:  "journeyman",
    9:  "warden",
    10: "warden",
    11: "warden",
    12: "warden",
    13: "master",
    14: "master",
    15: "master",
  },
  path:       {
    1:  "journeyman",
    2:  "journeyman",
    3:  "journeyman",
    4:  "journeyman",
    5:  "warden",
    6:  "warden",
    7:  "warden",
    8:  "warden",
    9:  "master",
    10: "master",
    11: "master",
    12: "master",
  },
  questor:    {
    1:  "follower",
    2:  "follower",
    3:  "follower",
    4:  "follower",
    5:  "adherent",
    6:  "adherent",
    7:  "adherent",
    8:  "adherent",
    9:  "exemplar",
    10: "exemplar",
    11: "exemplar",
    12: "exemplar",
  },
};

/**
 * talentCategory
 * @enum {string}
 */
ED4E.talentCategory = {
  class:          "ED.Config.talentCategory.class",
  discipline:     "ED.Config.talentCategory.discipline",
  optional:       "ED.Config.talentCategory.optional",
  free:           "ED.Config.talentCategory.free",
  versatility:    "ED.Config.talentCategory.versatility"
};
preLocalize( "talentCategory" );

/**
 * Type of grantable abilities for a class level
 * @enum {string}
 */
ED4E.abilityPools = {
  class:      "ED.Advancement.Pools.class",
  free:       "ED.Advancement.Pools.free",
  special:    "ED.Advancement.Pools.special"
};
preLocalize( "abilityPools" );

/**
 * Types of skills.
 * @enum {string}
 */
ED4E.skillTypes = {
  general:      "ED.Skills.general",
  artisan:      "ED.Skills.artisan",
  knowledge:    "ED.Skills.knowledge",
};
preLocalize( "skillTypes" );

/**
 * Lookup table used during character generation based on attribute values.
 * @type {{defenseRating: number[], unconsciousRating: number[], carryingCapacity: number[], armor: number[], deathRating: number[], step: number[], woundThreshold: number[], recovery: number[]}}
 */
ED4E.characteristicsTable = {
  step:              [ 0, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11 ],
  defenseRating:     [ 0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16 ],
  carryingCapacity:  [ 0, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 95, 110, 125, 140, 155, 175, 195, 215, 235, 255, 280, 305, 330, 355, 380, 410, 440, 470, 500, 530 ],
  unconsciousRating: [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60 ],
  deathRating:       [ 0, 4, 6, 8, 11, 13, 15, 18, 20, 22, 25, 27, 29, 32, 34, 36, 39, 41, 43, 46, 48, 50, 53, 55, 57, 60, 62, 64, 67, 69, 71 ],
  woundThreshold:    [ 0, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17 ],
  recovery:          [ 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, ],
  armor:             [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6 ],
};

ED4E.availableRanks = {
  talent:    8,
  devotion:  1,
  knowledge: 2,
  artisan:   1,
  general:   8,
  speak:     2,
  readWrite: 1,
};

ED4E.lpTrackingSpellCosts = {
  noviceTalent: "ED.Settings.LpTracking.noviceTalent",
  circleX100:   "ED.Settings.LpTracking.circleX100",
  free:         "ED.Settings.LpTracking.free",
};
preLocalize( "lpTrackingSpellCosts" );

ED4E.circleTalentRequirements = {
  disciplineTalents:   "ED.Settings.LpTracking.disciplineTalents",
  allTalents:          "ED.Settings.LpTracking.allTalents",
  allTalentsHouseRule: "ED.Settings.LpTracking.allTalentsHouseRule"
};
preLocalize( "circleTalentRequirements" );

ED4E.validationCategories = {
  base:               "ED.Legend.Validation.titleBase",
  health:             "ED.Legend.Validation.titleHealth",
  resources:          "ED.Legend.Validation.titleResources",
  talentsRequirement: "ED.Legend.Validation.titleTalentsRequirement",
  newAbilityLp:       "ED.Legend.Validation.titleNewAbilityLp",
};
preLocalize( "validationCategories" );

/* -------------------------------------------- */
/*  Encumbrance                                 */
/* -------------------------------------------- */

/**
 * The possible statuses of encumbrance
 * @enum {string}
 */
ED4E.encumbranceStatus = {
  notEncumbered:    "ED.Conditions.Encumbrance.notEncumbered",
  light:            "ED.Conditions.Encumbrance.light",
  heavy:            "ED.Conditions.Encumbrance.heavy",
  tooHeavy:         "ED.Conditions.Encumbrance.tooHeavy"
};
preLocalize( "encumbranceStatus" );


/* -------------------------------------------- */
/*  Rolls and Tests                             */
/* -------------------------------------------- */

/**
 * The available types of (roll) tests for {@link EdRollOptions}.
 * @enum {string}
 */
ED4E.testTypes = {
  arbitrary: {
    label:            "ED.Rolls.Labels.arbitraryTestRoll",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/arbitrary-roll-flavor.hbs",
  },
  action: {
    label:            "ED.Rolls.Labels.actionTestRoll",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/ability-roll-flavor.hbs",
  },
  effect: {
    label:            "ED.Rolls.Labels.effectTestRoll",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/effect-roll-flavor.hbs",
  },
};
preLocalize( "testTypes", { key: "label" } );


/**
 * The available sub-types of (roll) tests for {@link EdRollOptions}.
 * @enum {string}
 */
ED4E.rollTypes = {
  ability: {
    label:            "ED.Config.rollTypes.ability",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/ability-roll-flavor.hbs",
  },
  attack: {
    label:            "ED.Config.rollTypes.attack",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  attribute: {
    label:            "ED.Config.rollTypes.attribute",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attribute-roll-flavor.hbs",
  },
  damage: {
    label:            "ED.Rolls.Labels.damageRoll",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/damage-roll-flavor.hbs",
  },
  effect: {
    label:            "ED.Config.rollTypes.effect",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/effect-roll-flavor.hbs",
  },
  halfmagic: {
    label:            "ED.Config.rollTypes.halfmagic",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/halfmagic-roll-flavor.hbs",
  },
  initiative: {
    label:            "ED.Config.rollTypes.initiative",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/initiative-roll-flavor.hbs",
  },
  recovery: {
    label:            "ED.Config.rollTypes.recovery",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/recovery-roll-flavor.hbs",
  },
  spellcasting: {
    label:            "ED.Config.rollTypes.spellcasting",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/spellcasting-roll-flavor.hbs",
  },
  threadWeaving: {
    label:            "ED.Config.rollTypes.threadWeaving",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/threadWeaving-roll-flavor.hbs",
  },
};
preLocalize( "testTypes", { key: "label" } );

/**
 * The available sub-types of (combatTypes) tests
 * @enum {string}
 */
ED4E.combatTypes = {
  Aerial: {
    label:            "ED.Config.combatTypes.Aerial",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  Close: {
    label:            "ED.Config.combatTypes.Close",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  melee: {
    label:            "ED.Config.combatTypes.melee",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  Mounted: {
    label:            "ED.Config.combatTypes.Mounted",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  projectile: {
    label:            "ED.Config.combatTypes.projectile",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  ranged: {
    label:            "ED.Config.combatTypes.ranged",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  throwing: {
    label:            "ED.Config.combatTypes.throwing",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
  unarmed: {
    label:            "ED.Config.combatTypes.unarmed",
    flavorTemplate:   "systems/ed4e/templates/chat/chat-flavor/attack-roll-flavor.hbs",
  },
};
preLocalize( "testTypes", { key: "label" } );


/* -------------------------------------------- */
/*  System                                      */
/* -------------------------------------------- */

/**
 * Reserved earthdawn ids.
 * @enum {string}
 */
ED4E.reserved_edid = {
  DEFAULT:    "none",
  ANY:        "any",
};


/* -------------------------------------------- */
/*  Chat Commands                               */
/* -------------------------------------------- */

/**
 * The available chat commands with their corresponding help text.
 * @enum {string}
 */
ED4E.chatCommands = {
  char:     "X.chatCommandCharHelp no parameters, trigger char gen",
  coin:     "X.chatCommandCoinHelp number plus coinage, pass out coins",
  group:    "X.chatCommandGroupHelp no parameters?, calc CR for group",
  h:        "X.chatCommandHelp optional param 'chatCommand', show general help or for given command",
  help:     "X.chatCommandHelp optional param 'chatCommand', show general help or for given command",
  lp:       "X.chatCommandLpHelp number, award LP points",
  s:        "X.chatCommandSHelp any number of steps separated by whitespace or +, roll the given steps",
};
preLocalize( "chatCommands" );


/* -------------------------------------------- */
/*           Document Data                      */
/* -------------------------------------------- */

ED4E.documentData = {
  Item: {
    skill: {
      languageSpeak: {
        name:   "ED.SpeakLanguage",
        type:   "skill",
        system: {
          description: { value: "ED.SpeakLanguage Skill Description" },
          // edid needs to be set on creation since settings are not ready on init
          // edid: game.settings.get( "ed4e", "edidLanguageSpeak" ),
          attribute:   "per",
        },
      },
      languageRW: {
        name:   "ED.ReadWriteLanguage",
        type:   "skill",
        system: {
          description: { value: "ED.ReadWriteLanguage Skill Description" },
          // edid needs to be set on creation since settings are not ready on init
          // edid: game.settings.get( "ed4e", "edidLanguageRW" ),
          attribute:   "per",
        },
      },
    },
    devotion: {
      questor: {
        name:   "ED.Devotion.Questor",
        type:   "devotion",
        system: {
          description: { value: "ED.Devotion.Questor Description" },
          // edid needs to be set on creation since settings are not ready on init
          // edid: game.settings.get( "ed4e", "edidQuestorDevotion" ),
          attribute:   "cha",
          action:      "sustained",
          difficulty:  {fixed: 10},
          tier:        "journeyman",
        },
      },
    },
  },
};
preLocalize( "documentData.Item.skill.languageSpeak", { key: "name" } );
preLocalize( "documentData.Item.skill.languageSpeak.system.description", { key: "value" } );
preLocalize( "documentData.Item.skill.languageRW", { key: "name" } );
preLocalize( "documentData.Item.skill.languageRW.system.description", { key: "value" } );
preLocalize( "documentData.Item.devotion.questor", { key: "name" } );
preLocalize( "documentData.Item.devotion.questor.system.description", { key: "value" } );


/* -------------------------------------------- */
/*           Font Awesome Icons                 */
/* -------------------------------------------- */

ED4E.icons = {
  ability:          "fa-bolt",
  attack:           "fa-crosshairs",
  attribute:        "fa-dice-d20",
  classAdvancement: "fa-arrow-trend-up",
  damage:           "fa-skull-crossbones",
  effect:           "fa-biohazard",
  halfmagic:        "fa-hat-wizard",
  initiative:       "fa-running",
  patterncraft:     "fa-thin fa-group-arrows-rotate",
  recovery:         "fa-heartbeat",
  spellcasting:     "fa-thin fa-sparkles",
  threadWeaving:    "fa-thin fa-chart-network",
};


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
