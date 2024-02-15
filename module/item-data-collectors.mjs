/* -------------------------------------------- */
/*  Earthdawn Item data Collection              */
/* -------------------------------------------- */

/**
 * @description Namegiver Collection from Packs and World items
 * @returns { object } dataCollectionNamegiver
 */
export function getNamegiverCollection( ) {
    const dataCollectionNamegiver = game.items.filter( i => i.type === "namegiver" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "namegiver" ) continue;
            dataCollectionNamegiver.push( item );
        }
    }
    return dataCollectionNamegiver;
}

/**
 * @description Talent Collection from Packs and World items
 * @returns { object } dataCollectionTalents
 */
export function getTalentCollection(  ) {
    const dataCollectionTalents = game.items.filter( i => i.type === "talent" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "talent" ) continue;
            dataCollectionTalents.push( item );
        }
    }
    return dataCollectionTalents;
}

/**
 * @description Skill Collection from Packs and World items
 * @returns { object } dataCollectionSkills
 */
export function getSkillCollection(  ) {
    const dataCollectionSkills = game.items.filter( i => i.type === "skill" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "skill" ) continue;
            dataCollectionSkills.push( item );
        }
    }
    return dataCollectionSkills;
}

/**
 * @description Devotion Collection from Packs and World items
 * @returns { object } dataCollectionDevotions
 */
export function getDevotionCollection(  ) {
    const dataCollectionDevotions = game.items.filter( i => i.type === "devotion" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "devotion" ) continue;
            dataCollectionDevotions.push( item );
        }
    }
    return dataCollectionDevotions;
}

/**
 * @description Spell Collection from Packs and World items
 * @returns { object } dataCollectionSpells
 */
export function getSpellCollection(  ) {
    const dataCollectionSpells = game.items.filter( i => i.type === "spell" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "spell" ) continue;
            dataCollectionSpells.push( item );
        }
    }
    return dataCollectionSpells;
}

/**
 * @description Discipline Collection from Packs and World items
 * @returns { object } dataCollectionDisciplines
 */
export function getDisciplineCollection(  ) {
    const dataCollectionDisciplines = game.items.filter( i => i.type === "discipline" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "discipline" ) continue;
            dataCollectionDisciplines.push( item );
        }
    }
    return dataCollectionDisciplines;
}

/**
 * @description Questor Collection from Packs and World items
 * @returns { object } dataCollectionQuestors
 */
export function getQuestorCollection(  ) {
    const dataCollectionQuestors = game.items.filter( i => i.type === "questor" );
    for ( const value of game.packs ) {
        if ( value.metadata.type !== "Item" ) continue;
        for ( const item of value.index ) {
            if ( item.type !== "questor" ) continue;
            dataCollectionQuestors.push( item );
        }
    }
    return dataCollectionQuestors;
}