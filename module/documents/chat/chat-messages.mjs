

export default class ChatMessageEd extends ChatMessage {

    static async create(data, options) {
        // Call the original create method
        const message = await super.create(data, options);

        // Check if rolls[0].options.triggeredMessId is equal to any existing message's id
        if (message.rolls && message.rolls[0].options.triggeredMessId) {
            const triggeredMessId = message.rolls[0].options.triggeredMessId;
            const existingMessage = game.messages.get(triggeredMessId);
            if (existingMessage) {
                // Call updateChatMessage if the condition is met
                message.updateChatMessage(options, existingMessage);
            }
        }
        return message;
    }

    async getHTML() {
        const html = await super.getHTML();
        console.log("DRIN");

        // Attach event listeners to buttons
        html.find('.reaction-button').click(this._onReactionButton.bind(this));
        html.find('.maneuver-button').click(this._onManeuverButton.bind(this));

        return html;
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

}

async updateChatMessage(options, messageInput) {
    // Find the chat message associated with the button
    const message = messageInput;
    console.log("MESSAGE", message);

    if (message) {
        // Update the message content with the roll result
        const newResult = options.data[0].rolls[0]._total
        const difficulty = options.data[0].rolls[0].options.target.total
        const successPath = "rolls[0].isSuccess";
        
        if (newResult >= difficulty) {
            const newMess = await this.updateMessage( newResult, difficulty, message, successPath);
            console.log("MESSAGE-success", message.rolls[0].isSuccess);
        }

        //socketLib.system.executeAsGM('updateChatMessage', message.id, { content: newContent });

        //message.update({ content: newContent });
    } else {
        console.error('Chat message not found for button');
    }
}

async updateMessage(newResult, difficulty, message, successPath) {
    if (newResult >= difficulty) {
        await message.update({ [successPath]: false });
    }
}

    _onManeuverButton(event) {
        event.preventDefault();
        const buttonId = event.currentTarget.getAttribute('data-button-id');
    }
}

