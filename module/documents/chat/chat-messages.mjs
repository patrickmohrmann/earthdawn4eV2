import socketUpdateChatMessage from "../../hooks/ready.mjs";     
/**
 * @description             This class extends the ChatMessage class and adds additional functionality to it
 */
export default class ChatMessageEd extends ChatMessage {

    /**
     * @description             This method is called when a new message is created. It will call the original create method and then delegate additional logic to _onCreate
     * @param {*} data          The data that was passed to the create method
     * @param {*} options       The options that were passed to the create method
     * @returns                 The created message
     * @UserFunction            UF_ChatMessage-create
     */
    static async create( data, options ) {
        // Call the original create method
        const message = await super.create( data, options );

        // Delegate the additional logic to _onCreate
        await this._onCreate( message, options );

        return message;
    }

    /**
     * @description             This method is called on a creation or refresh of a message. it will trigger an update on refreshed messages if necessary   
     * @param {*} message       The message that was created or refreshed
     * @param {*} options       The options that were passed to the create method
     * @UserFunction            UF_ChatMessage-onCreate 
     */
    static async _onCreate( message, options ) {
        // Check if rolls[0].options.triggeredMessId is equal to any existing message's id
        if ( message.rolls.length > 0 && message.rolls[0].options.triggeredMessId ) {
            const triggeredMessId = message.rolls[0].options.triggeredMessId;
            const existingMessage = game.messages.get( triggeredMessId );
            if ( existingMessage ) {
                // Call updateChatMessage if the condition is met
                message.updateChatMessage( options, existingMessage );
            }
        }
    }

    /**
     * @description             Render the HTML for the ChatMessage which should be added to the log    
     * @returns                 The HTML that should be added to the log
     * @UserFunction            UF_ChatMessage-getHTML
     */
    async getHTML(  ) {
        // Get the HTML from the superclass
        const html = await super.getHTML(  );

        // Attach event listeners to buttons
        this._attachEventListeners( html );

        return html;
    }

    /**
     * @description             Attach event listeners to the buttons in the message
     * @param {*} html          The HTML of the message
     * @UserFunction            NA
    */
    _attachEventListeners( html ) {
        html.find( '.reaction-button' ).click( this._onReactionButton.bind( this ) );
        html.find( '.maneuver-button' ).click( this._onManeuverButton.bind( this ) );
    }

    /**
     * @description             Handle the click event on a reaction button
     * @param {*} event         The event that was triggered
     * @UserFunction            UF_ChatMessage-onReaction
     */
    async _onReactionButton( event ) {
        event.preventDefault(  );
        const buttonId = event.currentTarget.getAttribute( 'data-button-id' );

        const user = this._getCurrentUser(  );
        if ( !user ) return;

        const character = await this._getCharacter( user );
        if ( !character ) return;

        const ability = this._getAbility( character, buttonId );
        if ( !ability ) return;

        const difficulty = this.rolls[0].result;
        const triggeredMessId = this.id;

        const reactionResult = await character.rollAbility( ability, { event: event }, difficulty, triggeredMessId );
        // if ( !this._evaluated ) await this.evaluate(  );
        await this.updateChatMessage( this, reactionResult );
    }

    /**
     * @description             Get the current user
     * @returns                 The current user
     * @UserFunction            see UF_ChatMessage-onReactionButton
     */
    _getCurrentUser(  ) {
        const user = game.user;
        if ( !user ) {
            console.error( "No user found" );
        }
        return user;
    }

    /**
     * @description             Get the character of the user
     * @param {*} user          The user
     * @returns                 The character of the user
     * @UserFunction            see UF_ChatMessage-onReactionButton
     */
    async _getCharacter( user ) {
        let character = user.character;
        if ( !character && !user.isGM ) {
            console.error( "No character found for user" );
            return null;
        } else if ( !character && user.isGM ) {
            const selectedTokenId = this.rolls[0].options.targetTokens[0].id;
            character = canvas.scene.tokens.get( selectedTokenId )?.actor;
            if ( !character ) {
                console.error( "No character found for selected token" );
                return null;
            }
        }
        return character;
    }

    /**
     * @description             Get the ability of the character
     * @param {*} character     The character
     * @param {*} buttonId      The ID of the button
     * @returns                 The ability of the character
     * @UserFunction            see UF_ChatMessage-onReactionButton
    */
    _getAbility( character, buttonId ) {
        const ability = character.items.find( item => item.id === buttonId );
        if ( !ability ) {
            console.error( "No ability found for button ID:", buttonId );
        }
        return ability;
    }

    /**
     * @description                 Update the chat message based on the reaction result
     * @param {*} options           The options that were passed to the create method
     * @param {*} reactionResult    The result of the reaction
     * @UserFunction                UF_ChatMessage-updateChatMessage
     */
    async updateChatMessage( options, messageInput ) {
        const message = messageInput;

        if ( !message ) {
            console.error( 'Chat message not found for button' );
            return;
        }

        const newResult = options.data[0].rolls[0]._total;
        const difficulty = options.data[0].rolls[0].options.target.total;

        if ( newResult >= difficulty ) {
            socketlib.system.executeAsGM( "socketUpdateChatMessage", message );
        }
    }

    // /**
    //  * @description                 Update the chat message to show that the success indicator was set by code after the message was created
    //  * @param {*} message           The message to update
    //  * @UserFunction                see UF_ChatMessage-updateChatMessage
    //  */
    // async _updateMessageSuccess( message ) {
    //     await message.update( { "system.setSuccess": true } );
    // }

    /**
     * @description                 Update the chat message element to show the success or failure indicator
     * @param {*} messageId         The ID of the message to update
     * @UserFunction                see UF_ChatMessage-updateChatMessage
     */
    // async _updateChatMessageElement( messageId ) {
    //     const h4Element = document.querySelector( `.chat-message[data-message-id="${messageId}"] .message-content h4.roll-success` );
    //     if ( h4Element ) {
    //         h4Element.classList.replace( 'roll-success', 'roll-failure' );
    //     } else {
    //         console.error( 'h4 element with class roll-success not found' );
    //     }
    // }

    // done later
    _onManeuverButton( event ) {
        event.preventDefault(  );
        const buttonId = event.currentTarget.getAttribute( 'data-button-id' );
    }
}

