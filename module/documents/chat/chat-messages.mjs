

export default class ChatMessageEd extends ChatMessage {

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
        // Update the flavor if rolls are present
        if (this.rolls[0]) {
            await this.updateFlavor();
        }
    
        // Get the HTML from the superclass
        const html = await super.getHTML();
    
        // Attach event listeners to buttons
        this._attachEventListeners(html);
    
        return html;
    }
    
    _attachEventListeners(html) {
        html.find('.reaction-button').click(this._onReactionButton.bind(this));
        html.find('.maneuver-button').click(this._onManeuverButton.bind(this));
    }

    async updateFlavor() {
        const flavorTemplate = this._getFlavorTemplate();
        const templateData = await this._getTemplateData();
        templateData.success = this.system.isSuccess;
        this.flavor = await renderTemplate(flavorTemplate, templateData);
    }
    
    _getFlavorTemplate() {
        return this.rolls[0].flavorTemplate;
    }
    
    async _getTemplateData() {
        const templateData = await this.rolls[0].getFlavorTemplateData();
        return templateData;
    }



    async _onReactionButton(event) {
        event.preventDefault();
        const buttonId = event.currentTarget.getAttribute('data-button-id');
    
        const user = this._getCurrentUser();
        if (!user) return;
    
        const character = await this._getCharacter(user);
        if (!character) return;
    
        if (buttonId === "take-the-hit") {
            ui.notifications.warn("You take the hit");
            return;
        }
    
        const ability = this._getAbility(character, buttonId);
        if (!ability) return;
    
        const difficulty = this.rolls[0].result;
        const triggeredMessId = this.id;
    
        const reactionResult = await character.rollAbility(ability, { event: event }, difficulty, triggeredMessId);
        if (!this._evaluated) await this.evaluate();
        await this.updateChatMessage(this, reactionResult);
    }
    
    _getCurrentUser() {
        const user = game.user;
        if (!user) {
            console.error("No user found");
        }
        return user;
    }
    
    async _getCharacter(user) {
        let character = user.character;
        if (!character && !user.isGM) {
            console.error("No character found for user");
            return null;
        } else if (!character && user.isGM) {
            const selectedTokenId = this.rolls[0].options.targetTokens[0].id;
            character = canvas.scene.tokens.get(selectedTokenId)?.actor;
            if (!character) {
                console.error("No character found for selected token");
                return null;
            }
        }
        return character;
    }
    
    _getAbility(character, buttonId) {
        const ability = character.items.find(item => item.id === buttonId);
        if (!ability) {
            console.error("No ability found for button ID:", buttonId);
        }
        return ability;
    }

async updateChatMessage(options, messageInput) {
    const message = messageInput;

    if (!message) {
        console.error('Chat message not found for button');
        return;
    }

    const newResult = options.data[0].rolls[0]._total;
    const difficulty = options.data[0].rolls[0].options.target.total;
    const successPath = "rolls[0].isSuccess";

    if (newResult >= difficulty) {
            await this._updateMessageSuccess(message);
            await this._updateChatMessageElement(message.id);
            await message.render();
        }
    }

async _updateMessageSuccess(message) {
    await message.update({ "rolls[0].options.success": false, "system.setSuccess": true });
}

async _updateChatMessageElement(messageId) {
    const chatMessageElement = document.querySelector(`.chat-message[data-message-id="${messageId}"]`);
    if (!chatMessageElement) {
        console.error('Chat message element not found');
        return;
    }

    const messageContentElement = chatMessageElement.querySelector('.message-content');
    if (!messageContentElement) {
        console.error('message-content element not found');
        return;
    }

    const h4Element = messageContentElement.querySelector('h4.roll-success');
    if (h4Element) {
        h4Element.classList.replace('roll-success', 'roll-failure');
    } else {
        console.error('h4 element with class roll-success not found');
    }
}

async updateMessage(newResult, difficulty) {
    return newResult >= difficulty;
}

    _onManeuverButton(event) {
        event.preventDefault();
        const buttonId = event.currentTarget.getAttribute('data-button-id');
    }
}

