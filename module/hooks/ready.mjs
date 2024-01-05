/**
 * TODO Chris 
 */
export default function () {
    Hooks.once( "ready", async () => {
      /* -------------------------------------------- */
      /*  Debug Documents                             */
      /* -------------------------------------------- */
      await _createDebugDocuments();
    } );
}

/**
 * Creation of actors and items for debugging purposes
 */
async function _createDebugDocuments() {
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
}