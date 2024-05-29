import ActorEd from "./actor.mjs";

export default class CharacterEd extends ActorEd {

    async _preCreate( options, userId ) {
        await super._preCreate( options, userId );
        // Configure prototype token settings
        if ( this.type === "character" ) {
            const prototypeToken = {};
        
            Object.assign( prototypeToken,
                { 
                    sight: {enabled: true}, 
                    actorLink: true, 
                    disposition: 1,
                    displayBars: 50,
                    displayName: 30,
                    bar1: {
                        attribute: "healthRate"
                    },
                    bar2: {
                        attribute: "karma"
                    }
                } );
            this.updateSource( { prototypeToken } )
        }
    }
}