

export default class ChatMessageEd extends ChatMessage {

    // static async create(data, options) {

    //     // SHould be moved to _onCreate instead
    //     // Call the original create method
    //     const message = await super.create(data, options);

    //     // Check if rolls[0].options.triggeredMessId is equal to any existing message's id
    //     if ( message.rolls.length > 0 ) {
    //     if (message.rolls && message.rolls[0].options.triggeredMessId) {
    //         const triggeredMessId = message.rolls[0].options.triggeredMessId;
    //         const existingMessage = game.messages.get(triggeredMessId);
    //         if (existingMessage) {
    //             // Call updateChatMessage if the condition is met
    //             message.updateChatMessage(options, existingMessage);
    //         }
    //     }
    // }
    //     return message;
    // }

        static async create(data, options) {
        // Call the original create method
        const message = await super.create(data, options);
    
        // Delegate the additional logic to _onCreate
        await this._onCreate(message, options);
    
        return message;
    }
    
    static async _onCreate(message, options) {
        // Check if rolls[0].options.triggeredMessId is equal to any existing message's id
        if (message.rolls.length > 0 && message.rolls[0].options.triggeredMessId) {
            const triggeredMessId = message.rolls[0].options.triggeredMessId;
            const existingMessage = game.messages.get(triggeredMessId);
            if (existingMessage) {
                // Call updateChatMessage if the condition is met
                message.updateChatMessage(options, existingMessage);
            }
        }
    }

    async getHTML() {
        // trial code for updating the message
        if ( this.rolls[0] ) {
        await this.updateFlavor();
        console.log("this.flavor", this.flavor);
        }
        const html = await super.getHTML();
        // Attach event listeners to buttons
        html.find('.reaction-button').click(this._onReactionButton.bind(this));
        html.find('.maneuver-button').click(this._onManeuverButton.bind(this));
        return html;
    }

    async updateFlavor() {
        const flavorTemplate = this.rolls[0].flavorTemplate;
        const templateData = await this.rolls[0].getFlavorTemplateData();
        console.log("templateData", templateData);
        templateData.success = this.system.isSuccess;
        this.flavor = await renderTemplate(flavorTemplate, templateData);
    }



    async _onReactionButton(event) {
        event.preventDefault();
        const buttonId = event.currentTarget.getAttribute('data-button-id');

        // Get the current user
        const user = game.user;
        if (!user) {
            console.error("No user found");
            return;
        }

        // Get the user's character
        let character = user.character;
        if (!character  && !user.isGM) {
            console.error("No character found for user");
            return;
        } else if (!character && user.isGM) {
            const selectedTokenid = this.rolls[0].options.targetTokens[0].id
            character = canvas.scene.tokens.get(selectedTokenid)?.actor
        }

        // Trigger the ability roll
        if ( buttonId === "take-the-hit" ) {
            ui.notifications.warn("You take the hit");
            return;
        }
        const ability = character.items.filter( item => item.id === buttonId)[0];
        if (!ability) {
            console.error("No ability found for button ID:", buttonId);
            return;
        }

        const difficulty = this.rolls[0].result
        const triggeredMessId = this.id

        // Assuming the roll method is `rollAbility` and it returns a promise
        const reactionResult = await character.rollAbility(ability, { event: event }, difficulty, triggeredMessId);
        if ( !this._evaluated ) await this.evaluate();
        await this.updateChatMessage(this, reactionResult);

}

async updateChatMessage(options, messageInput) {
    // Find the chat message associated with the button
    const message = messageInput;

    if (message) {
        // Update the message content with the roll result
        const newResult = options.data[0].rolls[0]._total
        const difficulty = options.data[0].rolls[0].options.target.total
        const successPath = "rolls[0].isSuccess";
        if (newResult >= difficulty) {
            const newMess = await this.updateMessage( newResult, difficulty, message, successPath);
            if (newMess === true) {
                // Correctly update the message with the successPath
                // const updateData = {};
                // updateData[successPath] = false;
                // //updateData[flavorPath] = 
                // message.update(updateData);
                await message.update({ "rolls[0].options.success": false, "system.setSuccess": true });
                console.log("message context failure", message.failure);
                

                const sourceMessageId = message.id;
                const sourceMessage = game.messages.get(sourceMessageId);

                const chatMessageElement = document.querySelector(`.chat-message[data-message-id="${sourceMessageId}"]`);
                if (chatMessageElement) {
                    const messageContentElement = chatMessageElement.querySelector('.message-content');
                    if (messageContentElement) {
                        console.log('Found message-content element:', messageContentElement);

                        // Find the h4 element with class roll-success
                    const h4Element = messageContentElement.querySelector('h4.roll-success');
                    if (h4Element) {
                        // Replace the class roll-success with roll-failure
                        h4Element.classList.replace('roll-success', 'roll-failure');
                        console.log('Replaced roll-success with roll-failure:', h4Element);
                    } else {
                        console.error('h4 element with class roll-success not found');
                    }
                    
                    // Perform further actions with messageContentElement if needed
                } else {
                    console.error('message-content element not found');
                }
            } else {
                console.error('Chat message element not found');
            }

            }
             // Re-render the message
             await message.render();
        }
    //     if (message.system.isSuccess === true) {
    //        const diceTotalElement = document.querySelector('.dice-total');  
    //        if (diceTotalElement.find(".roll-success").length || diceTotalElement.find(".roll-failure").length) {
    //         return;
    //       } else {
    //       if ( this.isSuccess || this.isFailure ) {
    //         jquery.find( ".dice-total" ).addClass(
    //           this.isSuccess ? "roll-success" : "roll-failure"
    //         );
    //       }
    //     }
    // }
        console.log("Message.isSucess", message.system.isSuccess);

        //socketLib.system.executeAsGM('updateChatMessage', message.id, { content: newContent });

        //message.update({ content: newContent });
    } else {
        console.error('Chat message not found for button');
    }
}

async updateMessage(newResult, difficulty, message, successPath) {
    if (newResult >= difficulty) {
        return true;
        
    } else {
        return false;
    }
}

    _onManeuverButton(event) {
        event.preventDefault();
        const buttonId = event.currentTarget.getAttribute('data-button-id');
    }
}

