import getDice from './step-tables.mjs';

/**
 * EdRollOptions for creating an EdRoll instance.
 * @property { object } step Ever information related to the step of the action, Mods, Boni, Mali etc.
 * @property { number } step.total The final step that is used to determine the dice that are rolled.
 * @property { object } karma Available Karma, Karma dice and used karma.
 * @property { object } devotion Available Devotions, Devotion die, Devotion die used and used devotion.
 * @property { object } target All information of the targets array. Defenses, number, resistance.
 * @property { object } additional Additional, non-standard, additions like extra steps for a separate dice (like flame weapon).
 * @property { number } strain How much strain this roll will cost
 * @property { string } testType Type of roll, action test or effect test.
 * @property { string } rollType Type of roll, like 
 * damageRanged (Effect), damageMelee (Effect), attackRanged, attackMelee, 
 * ability, 
 * resistances (Effect), reaction, opposed
 * spellCasting, threadWeaving, spellCastingEffect (Effect)
 * Initiative (effect), Recovery (Effect), effects (Effect)
 * poison
 * etc. TODO: complete list
 */

/**
 * @param { any } formula TODO
 * @param { object } data TODO
 * @param { EdRollOptions } edRollOptions Collection of data, steps, karma, devotions, target and additional.
 */
export default class EdRoll extends Roll {
    constructor( formula = undefined, data = {}, edRollOptions = {} ) {
        // us ternary operator to also check for empty strings, nullish coalescing operator (??) only checks null or undefined
        const baseTerm = formula
            ? formula
            // : ( `${getDice( step )}[${game.i18n.localize( "ED.General.S.step" )} ${step}]` );
            : `(${getDice( edRollOptions.step.total )})[${game.i18n.localize( "ED.General.S.step" )} ${edRollOptions.step.total}]`;
        super( baseTerm, data, edRollOptions );

        this.edRollOptions = edRollOptions;

        if ( !this.options.extraDiceAdded ) this.#addExtraDice();
        if ( !this.options.configured ) this.#configureModifiers();
    }

    /**
     * Is this roll a valid Earthdawn test?
     * @type {boolean}
     */
    get validEdRoll() {
        // First term must be a Die
        return this.terms[0] instanceof Die;
    }

    /**
     * Is this roll an automatic fail? True, if at least 2 dice, no effect test, and all dice are 1.
     * @type { boolean|void }
     */
    get isRuleOfOne() {
        if ( !this.validEdRoll || !this._evaluated ) return undefined;
        // more than one die required
        if ( this.numDice < 2 ) return false;
        return this.total === this.numDice;
    }

    /**
     *  The number of dice in this roll.
     *  @type { number }
     */
    get numDice() {
        // must be evaluated since dice can explode and add more dice
        if ( !this.validEdRoll || !this._evaluated ) return undefined;
        return this.dice.map(
            ( diceTerm ) => diceTerm.number
        ).reduce(
            ( accumulator, currentValue ) => accumulator + currentValue,
            0
        );
    }

    /**
     * The number of successes in this roll. Only available if a target number is specified and the roll is evaluated.
     * @type {number}
     */
    get numSuccesses() {
        // TODO
        return 0;
    }

    /**
     * The text that is added to this roll's chat message when calling `toMessage`.
     * @type {string|undefined}
     */
    get chatFlavor() {
        return this.edRollOptions.chatFlavor;
    }

    /**
     * Set the text of this roll's chat message.
     * @type {string}
     */
    set chatFlavor( flavor ) {
        this.edRollOptions.updateSource( {chatFlavor: flavor} );
    }

    /**
     * Apply modifiers to make all dice explode.
     * @private
     */
    #configureModifiers() {
        this.dice.map( ( diceTerm ) => {
            // Explodify all dice terms
            diceTerm.modifiers.push( 'X' );
            return diceTerm;
        } );

        // Mark configuration as complete
        this.options.configured = true;
    }

    /**
     * Add additional dice in groups, like karma, devotion or elemental damage.
     */
    #addExtraDice() {
        this.#addResourceDice( 'karma' );
        this.#addResourceDice( 'devotion' );

        // Mark extra dice as complete
        this.options.extraDiceAdded = true;
    }

    /**
     * Add dice from a given resource step. Currently only karma or devotion.
     * @param {"karma"|"devotion"} type
     */
    #addResourceDice( type ) {
        const pointsUsed = this.edRollOptions[type]?.pointsUsed;
        if ( pointsUsed > 0 ) {
            let diceTerm, newTerms;
            for ( let i = 1; i <= pointsUsed; i++ ) {
                diceTerm = getDice( this.edRollOptions[type].step );
                newTerms = Roll.parse(
                    `+ (${diceTerm})[${game.i18n.localize( `ED.General.${type[0]}.${type}` )} ${i}]`
                );
                this.terms.push( ...newTerms );
            }
            this.resetFormula();
        }
    }

    /**
     * Create a Dialog prompt used to configure evaluation of an existing EdRoll instance.
     */
    configureRollPrompt() {
    }

    /** @inheritDoc */
    async toMessage( messageData = {}, options = {} ){
        messageData.flavor ??= this.edRollOptions.chatFlavor;
        return super.toMessage( messageData, options );
    }
}