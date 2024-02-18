/* -------------------------------------------- */
/*  Earthdawn Item data Collection              */
/* -------------------------------------------- */

/**
 * @description Namegiver Collection from Packs and World items
 * @returns { object } dataCollectionNamegiver
 */
export function getNamegiverCollection() {
    let namegiverCollection = {};
    for ( const item of game.items ) if ( item.type === "namegiver" ) namegiverCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "namegiver" ) namegiverCollection[idx.uuid] = idx.name;
    }
    // add an array with all items including all data
    let fullNamegiverItemCollection = [];
    for ( const item of game.items ) if ( item.type === "namegiver" ) {
             fullNamegiverItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "namegiver" ) {
                fullNamegiverItemCollection.push( idx )
            }
        }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    namegiverCollection = JSON.parse(
        JSON.stringify( namegiverCollection ).replaceAll( '.', ' ' )
    );

    return namegiverCollection;
}

/**
 * @description Talent Collection from Packs and World items
 * @returns { object } dataCollectionTalents
 */
export function getTalentCollection(  ) {
    let talentCollection = {};
    for ( const item of game.items ) if ( item.type === "talent" ) talentCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "talent" ) talentCollection[idx.uuid] = idx.name;
    }
    // add an array with all items including all data
    let fullTalentItemCollection = [];
    for ( const item of game.items ) if ( item.type === "talent" ) {
             fullTalentItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "talent" ) {
                fullTalentItemCollection.push( idx )
            }
        }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    talentCollection = JSON.parse(
        JSON.stringify( talentCollection ).replaceAll( '.', ' ' )
    );

    return talentCollection;
}

/**
 * @description Skill Collection from Packs and World items
 * @returns { object } dataCollectionSkills
 */
export function getSkillCollection(  ) {
    let skillCollection = {};
    for ( const item of game.items ) if ( item.type === "skill" ) skillCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "skill" ) skillCollection[idx.uuid] = idx.name;
    }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    skillCollection = JSON.parse(
        JSON.stringify( skillCollection ).replaceAll( '.', ' ' )
    );
    
    return skillCollection;
}

/**
 * 
 * @returns {object} skillArtisanCollection
 */
export function getSkillArtisanCollection(  ) {
    let skillArtisanCollection = {};
    for ( const item of game.items ) if ( item.type === "skill" ) skillArtisanCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "skill" ) skillArtisanCollection[idx.uuid] = idx.name;
    }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    skillArtisanCollection = JSON.parse(
        JSON.stringify( skillArtisanCollection ).replaceAll( '.', ' ' )
    );
    
    return skillArtisanCollection;
}

/**
 * 
 * @returns {object} fullSkillItemCollection
 */
export function getSkillFullCollection(  ) {
    // add an array with all items including all data
    let fullSkillItemCollection = [];
    for ( const item of game.items ) if ( item.type === "skill" ) {
             fullSkillItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "skill" ) {
                fullSkillItemCollection.push( pack )
            }
        }
    return fullSkillItemCollection;
}


/**
 * @description Devotion Collection from Packs and World items
 * @returns { object } dataCollectionDevotions
 */
export function getDevotionCollection(  ) {
    let devotionCollection = {};
    for ( const item of game.items ) if ( item.type === "devotion" ) devotionCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "devotion" ) devotionCollection[idx.uuid] = idx.name;
    }
    // add an array with all items including all data
    let fullDevotionItemCollection = [];
    for ( const item of game.items ) if ( item.type === "devotion" ) {
             fullDevotionItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "devotion" ) {
                fullDevotionItemCollection.push( idx )
            }
        }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    devotionCollection = JSON.parse(
        JSON.stringify( devotionCollection ).replaceAll( '.', ' ' )
    );
    
    return devotionCollection;
}

/**
 * @description Spell Collection from Packs and World items
 * @returns { object } dataCollectionSpells
 */
export function getSpellCollection(  ) {
    let spellCollection = {};
    for ( const item of game.items ) if ( item.type === "spell" ) spellCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "spell" ) spellCollection[idx.uuid] = idx.name;
    }
    // add an array with all items including all data
    let fullSpellItemCollection = [];
    for ( const item of game.items ) if ( item.type === "spell" ) {
             fullSpellItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "spell" ) {
                fullSpellItemCollection.push( idx )
            }
        }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    spellCollection = JSON.parse(
        JSON.stringify( spellCollection ).replaceAll( '.', ' ' )
    );
    
    return spellCollection;
}

/**
 * @description Discipline Collection from Packs and World items
 * @returns { object } dataCollectionDisciplines
 */
export function getDisciplineCollection(  ) {
    let disciplineCollection = {};
    for ( const item of game.items ) if ( item.type === "discipline" ) disciplineCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "discipline" ) disciplineCollection[idx.uuid] = idx.name;
    }
    // add an array with all items including all data
    let fullDisciplineItemCollection = [];
    for ( const item of game.items ) if ( item.type === "discipline" ) {
             fullDisciplineItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "discipline" ) {
                fullDisciplineItemCollection.push( idx )
            }
        }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    disciplineCollection = JSON.parse(
        JSON.stringify( disciplineCollection ).replaceAll( '.', ' ' )
    );
    
    return disciplineCollection;
}

/**
 * @description Questor Collection from Packs and World items
 * @returns { object } dataCollectionQuestors
 */
export function getQuestorCollection(  ) {
    let questorCollection = {};
    for ( const item of game.items ) if ( item.type === "questor" ) questorCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "questor" ) questorCollection[idx.uuid] = idx.name;
    }
    // add an array with all items including all data
    let fullquestorItemCollection = [];
    for ( const item of game.items ) if ( item.type === "questor" ) {
             fullquestorItemCollection.push( item )
        }
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
            for ( const idx of pack.index ) if ( idx.type === "questor" ) {
                fullquestorItemCollection.push( idx )
            }
        }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    questorCollection = JSON.parse(
        JSON.stringify( questorCollection ).replaceAll( '.', ' ' )
    );
    
    return questorCollection;
}