import EdRoll from "../../dice/ed-roll.mjs";
import RollData from "../../data/other/roll-data.mjs";

export default class RollPrompt extends FormApplication {

    /** @inheritDoc */
    constructor( data = {},  { resolve, rollOptions = {}, options = {} } = {} ) {
        if ( !( data instanceof RollData) ) {
            throw new TypeError("ED4E | Cannot construct RollPrompt from data. Must be of type `RollData`.");
        }
        super( data, options );

        this.resolve = resolve;
        this.rollData = data;
        this.rollData.step.modifiers.manual ??= 0;
        this.rollOptions = rollOptions;
    }

    /**
     * Wait for dialog to the resolved.
     * @param {object} [data] Initial data to pass to the constructor.
     * @param {object} [options] Options to pass to the constructor.
     * @returns {Promise<EdRoll|null>} Created roll instance or `null`.
     */
    static waitPrompt( data, options = {} ) {
        return new Promise( ( resolve ) => {
            options.resolve = resolve;
            new this( data, options ).render( true, { focus: true } );
        } );
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
    rollData = {};

    /** @inheritDoc */
    activateListeners( html ) {
        super.activateListeners( html );
        $( this.form.querySelector( "button.cancel" ) ).on( "click" , this.close.bind( this ) );
        $( this.form.querySelector( "button.ok" ) ).on( "click" , this._createRoll.bind( this ) );
    }

    /** @inheritDoc */
    async close( options = {} ) {
        this.resolve?.( null );
        return super.close( options );
    }

    /** @inheritDoc */
    getData( options = {} ) {
        return this.rollData;
    }

    /** @inheritDoc */
    async _updateObject( event, formData ) {
        return Promise.resolve( this._updateRollData( formData ) );
    }

    _updateRollData( data = {} ) {
        console.debug( "ED4E | _updateRollData: ", data );
        this.rollData.updateSource( data );
        return this.rollData;
    }

    async _createRoll( event ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        await this.submit( {preventRender: true} );

        const roll = new EdRoll( undefined, this.rollOptions, this.rollData );
        this.resolve?.( roll );
        this.close();
    }
}