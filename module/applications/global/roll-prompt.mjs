import EdRoll from "../../dice/ed-roll.mjs";
import EdRollOptions from "../../data/other/roll-options.mjs";

/**
 * The application responsible for handling additional data for rolling dice in Earthdawn.
 *
 * @augments {FormApplication}
 *
 * @param {EdRollOptions} edRollOptions         Some object which is the target data structure to be updated by the form.
 * @param {object} [rollData={}]                The data object that will be passed to {@link Roll}'s `data` argument.
 * @param {FormApplicationOptions} [options={}] Additional options which modify the rendering of the sheet.
 */
export default class RollPrompt extends FormApplication {

    constructor( edRollOptions = {},  { resolve, rollData = {}, options = {} } = {} ) {
        if ( !( edRollOptions instanceof EdRollOptions) ) {
            throw new TypeError("ED4E | Cannot construct RollPrompt from data. Must be of type `RollOptions`.");
        }
        super( edRollOptions, options );

        this.resolve = resolve;
        this.edRollOptions = edRollOptions;
        this.edRollOptions.step.modifiers.manual ??= 0;
        this.rollData = rollData;
    }

    /**
     * Wait for dialog to be resolved.
     * @param {object} [data]           Initial data to pass to the constructor.
     * @param {object} [options]        Options to pass to the constructor.
     * @returns {Promise<EdRoll|null>}  Created roll instance or `null`.
     */
    static waitPrompt( data, options = {} ) {
        return new Promise( ( resolve ) => {
            options.resolve = resolve;
            new this( data, options ).render( true, { focus: true } );
        } );
    }

    static rollArbitraryPrompt() {
        RollPrompt.waitPrompt(
            new EdRollOptions( {
                rollType: CONFIG.ED4E.rollTypes.arbitrary,
                chatFlavor: game.i18n.localize( "X-Arbitrary-Step" ),
            } )
        ).then(
            ( roll ) => roll?.toMessage()
        );
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        return {
            ...options,
            closeOnSubmit: false,
            submitOnChange: true,
            submitOnClose: false,
            height: 'auto',
            width: 'auto',
            resizable: true,
            classes: [...options.classes, 'earthdawn4e', 'roll-prompt'],
            tabs: [
                {
                    navSelector: '.prompt-tabs',
                    contentSelector: '.tab-body',
                    initial: 'base-input',
                },
            ],
        };
    }

    get title() {
        return game.i18n.localize( "TODO: LOCALIZE: Roll Prompt Title" );
    }

    get template() {
        return 'systems/ed4e/templates/global/roll-prompt.hbs';
    }

    /** @type {EdRollOptions} */
    edRollOptions = {};

    /** @inheritDoc */
    activateListeners( html ) {
        super.activateListeners( html );
        $( this.form.querySelector( "button.cancel" ) ).on( "click" , this.close.bind( this ) );
        $( this.form.querySelector( "button.ok" ) ).on( "click" , this._createRoll.bind( this ) );
        $( this.form.querySelectorAll("#karma-input,#devotion-input") ).on(
            "change", this._validateAvailableRessource.bind( this )
        );
    }

    /** @inheritDoc */
    async close( options = {} ) {
        this.resolve?.( null );
        return super.close( options );
    }

    /** @inheritDoc */
    getData( options = {} ) {
        return {
            ...this.edRollOptions,
            CONFIG
        };
    }

    /** @inheritDoc */
    async _updateObject( event, formData ) {
        return Promise.resolve( this._updateRollData( formData ) );
    }

    _validateAvailableRessource( event ) {
        const newValue = event.currentTarget.value;
        const resource = event.currentTarget.dataset.resource;
        if (
            this.edRollOptions.rollType !== CONFIG.ED4E.rollTypes.arbitrary
            && newValue > this.edRollOptions[resource].available
        ) {
            ui.notifications.warn(`Localize: Not enough ${resource}. You can use it, but only max available will be deducted from current.`);
        }
    }

    _updateRollData( data = {} ) {
        this.edRollOptions.updateSource( data );
        return this.edRollOptions;
    }

    async _createRoll( event ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        await this.submit( {preventRender: true} );

        const roll = new EdRoll( undefined, this.rollData, this.edRollOptions );
        this.resolve?.( roll );
        return this.close();
    }
}