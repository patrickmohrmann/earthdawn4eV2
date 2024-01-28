import RollPrompt from '../applications/global/roll-prompt.mjs';

export default function () {
  Hooks.once( "ready", async () => {
    /* -------------------------------------------- */
    /*  Dice Icon Roll                              */
    /* -------------------------------------------- */

    $( "#chat-controls i.fas.fa-dice-d20" ).on( "click", RollPrompt.rollArbitraryPrompt.bind( null ) );

    /* -------------------------------------------- */
    /*  Debug Documents                             */
    /* -------------------------------------------- */

      if ( game.user.isGM ) await _createDebugDocuments();
  });
}

/**
 * Creation of actors and items for debugging purposes
 */
async function _createDebugDocuments() {

    /* -------------------------------------------- */
    /*  Documents                                   */
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

    const actorFolder = await Folder.create( {
        name: "DebugActors",
        type: "Actor",
        description: "<p>Contains data created for debugging purposes</p>",
        color: "#efdaca",
        flags: { deleteOnStartup: true },
    } );
    const itemFolder = await Folder.create( {
        name: "DebugItems",
        type: "Item",
        description: "<p>Contains data created for debugging purposes</p>",
        color: "#efdaca",
        flags: { deleteOnStartup: true },
    } );

    const createdActors = {};
    const createdItems = {};
    for ( const actorType of Object.keys( CONFIG.Actor.dataModels ) ) {
        createdActors[actorType] = await ed4e.documents.ActorEd.create( {
            name: actorType,
            type: actorType,
            folder: actorFolder.id,
            flags: { deleteOnStartup: true },
        } );
    }
    for ( const itemType of Object.keys( CONFIG.Item.dataModels ) ) {
        createdItems[itemType] = await ed4e.documents.ItemEd.create( {
            name: itemType,
            type: itemType,
            folder: itemFolder.id,
            flags: { deleteOnStartup: true },
        } );
    }

    // Prepare documents

    const character = createdActors["character"];
    await character.createEmbeddedDocuments( "Item", [
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
    ] );

    /* -------------------------------------------- */
    /*  Dice                                        */
    /* -------------------------------------------- */
    // Create a dice roll for each roll type with all possible options and evaluate it to chat

    game.messages.forEach( ( value, key, map ) => {
        if ( value.getFlag( "world", "deleteOnStartup" ) ) value.delete();
    } );

    const rollParameters = {
        arbitrary: {
            step: 38,
            karma: 4,
            devotion: 2,
        },
        action: {
            step: 38,
            karma: 1,
            devotion: 0,
        },
        damage: {
            step: 12,
            karma: 0,
            devotion: 0,
        },
        effect: {
            step: 8,
            karma: 0,
            devotion: 1,
        },
    }

    for( const rollType of Object.keys( CONFIG.ED4E.rollTypes ) ) {
        const rollOptions = new ed4e.dataModels.other.RollData( {
            rollType: rollType,
            chatFlavor: "This is debug custom flavor text for this roll. Great, he?",
            step: {
                base: rollParameters[rollType].step,
                modifiers: {
                    manual: 1
                }
            },
            karma: {
                pointsUsed: rollParameters[rollType].karma,
                available: 0,
                step: 9
            },
            devotion: {
                pointsUsed: rollParameters[rollType].devotion,
                available: 0,
                step: 4
            },
            extraDice: {
                "Flame Weapon": 4,
                "Night's Edge": 2
            },
            target: {
                base: 14,
                modifiers: {
                    "Earth Armor": 2
                }
            }
        } );
        const roll = ed4e.dice.EdRoll.create(
          undefined,
          {},
          rollOptions
        );

        const rollMsg = await roll.toMessage();
        await rollMsg.setFlag( "world", "deleteOnStartup", true );
    }
}