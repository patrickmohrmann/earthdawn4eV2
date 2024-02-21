/* -------------------------------------------- */
/*  Earthdawn Item data Collection              */
/* -------------------------------------------- */

/**
 * @description Namegiver Collection from Packs and World items
 * @returns { object } dataCollectionNamegiver
 */
export async function getNamegiverCollection() {
    // add an array with all items including all data
    let namegiverItemCollection = [];
    for ( const item of game.items ) if ( item.type === "namegiver" ) {
        namegiverItemCollection.push( item )
        }
    for ( const collection of game.packs ) if ( collection.metadata.type === "Item" ) {
            for ( const i of collection.index ) if ( i.type === "namegiver" ) {
                await collection.getIndex( {fields: ["system"] } )
                namegiverItemCollection.push( i )
            }
        }

    return namegiverItemCollection;
}

/**
 * @description Namegiver Collection from Packs and World items will System data
 * @returns { object } dataCollectionNamegiverSelection
 */
export function getNamegiverCollectionSelection() {
    let namegiverCollection = {};
    for ( const item of game.items ) if ( item.type === "namegiver" ) namegiverCollection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "namegiver" ) namegiverCollection[idx.uuid] = idx.name;
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
export async function getSkillCollectionArtisan(  ) {
    let skillCollectionArtisan = [];
    // collect world items
    for ( const item of game.items ) if ( item.type === "skill" ) {
        if ( item.system.skillType === "artisan" ) {
            skillCollectionArtisan.push ( item );
        }
    }
    // collect pack items
    for ( const collection of game.packs.filter( p => p.metadata.type === "Item" ) ) {
        for ( const i of collection.index.contents ) if ( i.type === "skill" ) {
          await collection.getIndex( {fields: ["system"]} )
          if ( i.system.skillType === "artisan" ) {
            skillCollectionArtisan.push ( i );
          }
        }
      }
    // console.log( "skillCollectionArtisan", typeof( skillCollectionArtisan ) )
    return skillCollectionArtisan;
}
/**
 * 
 * @returns {object} skillArtisanCollection
 */
export async function getskillCollectionArtisanSelection() {
    let skillCollectionArtisanSelection = [];
    // collect world items
    for ( const item of game.items ) if ( item.type === "skill" ) {
        if ( item.system.skillType === "artisan" ) {
            skillCollectionArtisanSelection.push ( item );
        }
    }
    // collect pack items
    for ( const collection of game.packs.filter( p => p.metadata.type === "Item" ) ) {
        for ( const i of collection.index.contents ) if ( i.type === "skill" ) {
          await collection.getIndex( {fields: ["system"]} )
          if ( i.system.skillType === "artisan" ) {
            skillCollectionArtisanSelection.push ( i );
          }
        }
      }
      let artisanCollection = {};
      for ( const item of skillCollectionArtisanSelection ) {
        artisanCollection[item.uuid] = item.name;
      } 
      // this JSON.parse is necessary, because the key will otherwise handled as a data path.
      artisanCollection = JSON.parse(
            JSON.stringify( artisanCollection ).replaceAll( '.', ' ' )
        );
    
    return artisanCollection;
}




/**
 * 
 * @returns {object} skillArtisanCollection
 */
export async function getSkillCollectionGeneral(  ) {
    let skillCollectionGeneral = [];
    // collect world items
    for ( const item of game.items ) if ( item.type === "skill" ) {
        if ( item.system.skillType === "general" ) {
            skillCollectionGeneral.push ( item );
        }
    }
    // collect pack items
    for ( const collection of game.packs.filter( p => p.metadata.type === "Item" ) ) {
        for ( const i of collection.index.contents ) if ( i.type === "skill" ) {
          await collection.getIndex( {fields: ["system"]} )
          if ( i.system.skillType === "general" ) {
            skillCollectionGeneral.push ( i );
          }
        }
      }
      // console.log( "skillCollectionGeneral", typeof( skillCollectionGeneral ) )
    return skillCollectionGeneral;
}
/**
 * 
 * @returns {object} skillGeneralCollection
 */
export async function getskillCollectionGeneralSelection() {
    let skillCollectionGeneralSelection = [];
    // collect world items
    for ( const item of game.items ) if ( item.type === "skill" ) {
        if ( item.system.skillType === "general" ) {
            skillCollectionGeneralSelection.push ( item );
        }
    }
    // collect pack items
    for ( const collection of game.packs.filter( p => p.metadata.type === "Item" ) ) {
        for ( const i of collection.index.contents ) if ( i.type === "skill" ) {
          await collection.getIndex( {fields: ["system"]} )
          if ( i.system.skillType === "general" ) {
            skillCollectionGeneralSelection.push ( i );
          }
        }
      }
      let generalCollection = {};
      for ( const item of skillCollectionGeneralSelection ) {
        generalCollection[item.uuid] = item.name;
      } 
      // this JSON.parse is necessary, because the key will otherwise handled as a data path.
      generalCollection = JSON.parse(
            JSON.stringify( generalCollection ).replaceAll( '.', ' ' )
        );
    
    return generalCollection;
}


/**
 * 
 * @returns {object} skillKnowledgeCollection
 */
export async function getSkillCollectionKnowledge(  ) {
    let skillCollectionKnowledge = [];
    // collect world items
    for ( const item of game.items ) if ( item.type === "skill" ) {
        if ( item.system.skillType === "knowledge" ) {
            skillCollectionKnowledge.push ( item );
        }
    }
    // collect pack items
    for ( const collection of game.packs.filter( p => p.metadata.type === "Item" ) ) {
        for ( const i of collection.index.contents ) if ( i.type === "skill" ) {
          await collection.getIndex( {fields: ["system"]} )
          if ( i.system.skillType === "knowledge" ) {
            skillCollectionKnowledge.push ( i );
          }
        }
      }
      // console.log( "skillCollectionKnowledge", typeof( skillCollectionKnowledge ) )
    return skillCollectionKnowledge;
}
/**
 * 
 * @returns {object} skillKnowledgeCollection
 */
export async function getskillCollectionKnowledgeSelection() {
    let skillCollectionKnowledgeSelection = [];
    // collect world items
    for ( const item of game.items ) if ( item.type === "skill" ) {
        if ( item.system.skillType === "knowledge" ) {
            skillCollectionKnowledgeSelection.push ( item );
        }
    }
    // collect pack items
    for ( const collection of game.packs.filter( p => p.metadata.type === "Item" ) ) {
        for ( const i of collection.index.contents ) if ( i.type === "skill" ) {
          await collection.getIndex( {fields: ["system"]} )
          if ( i.system.skillType === "knowledge" ) {
            skillCollectionKnowledgeSelection.push ( i );
          }
        }
      }
      let KnowledgeCollection = {};
      for ( const item of skillCollectionKnowledgeSelection ) {
        KnowledgeCollection[item.uuid] = item.name;
      } 
      // this JSON.parse is necessary, because the key will otherwise handled as a data path.
      KnowledgeCollection = JSON.parse(
            JSON.stringify( KnowledgeCollection ).replaceAll( '.', ' ' )
        );
    
    return KnowledgeCollection;
}



/**
 * 
 * @returns {object} fullSkillItemCollection
 */
export async function getSkillFullCollection(  ) {
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
export async function getSpellCollection(  ) {
    // add an array with all items including all data
    let spellItemCollection = [];
    for ( const item of game.items ) if ( item.type === "spell" ) {
        spellItemCollection.push( item )
        }
    for ( const collection of game.packs ) if ( collection.metadata.type === "Item" ) {
            for ( const spell of collection.index ) if ( spell.type === "spell" ) {
                await collection.getIndex( {fields: ["system"] } )
                spellItemCollection.push( spell )
            }
        }    
    return spellItemCollection;
}

/**
 * @description Spell Collection from Packs and World items
 * @returns { object } dataCollectionSpells
 */
export async function getSpellCollectionGeneration(  ) {
    // add an array with all items including all data
    let spellCollectionSelection = [];
    for ( const item of game.items ) if ( item.type === "spell" ) {
        spellCollectionSelection.push( item )
        }
    for ( const collection of game.packs ) if ( collection.metadata.type === "Item" ) {
            for ( const spell of collection.index ) if ( spell.type === "spell" ) {
                await collection.getIndex( {fields: ["system"] } )
                if ( spell.system.level <= 2 ) {
                    spellCollectionSelection.push( spell )
                }
            }
        }   
    let spellItemCollectionGeneration = {};
        for ( const spell of spellCollectionSelection ) if ( spell.system.level < 3 ) spellItemCollectionGeneration[spell.uuid] = spell.name;
    
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    spellItemCollectionGeneration = JSON.parse(
        JSON.stringify( spellItemCollectionGeneration ).replaceAll( '.', ' ' )
    ); 
    return spellItemCollectionGeneration;
}

/**
 * @description Spell Collection from Packs and World items will system data
 * @returns { object } dataCollectionSpellsSelection
 */
export function getSpellCollectionSelection(  ) {
    let spellCollectionSelection = {};
    for ( const item of game.items ) if ( item.type === "spell" ) spellCollectionSelection[item.uuid] = item.name;
    for ( const pack of game.packs ) if ( pack.metadata.type === "Item" ) {
        for ( const idx of pack.index ) if ( idx.type === "spell" ) spellCollectionSelection[idx.uuid] = idx.name;
    }
    // this JSON.parse is necessary, because the key will otherwise handled as a data path.
    spellCollectionSelection = JSON.parse(
        JSON.stringify( spellCollectionSelection ).replaceAll( '.', ' ' )
    );
    
    return spellCollectionSelection;
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