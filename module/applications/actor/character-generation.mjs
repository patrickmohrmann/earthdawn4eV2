import ItemSheetEd from "../item/item-sheet.mjs";

/**
 * The application responsible for handling Charaktergeneration
 *
 * @augments {FormApplication}
 *
 * @param {edCharakterGeneration} edCharakterGeneration         Charactergeneration
 * @param {FormApplicationOptions} [options={}]                 Additional options which modify the rendering of the sheet.
 */
export default class CharacterGenerationPrompt extends FormApplication {

    constructor( edCharakterGeneration = {},  ) {
        const namegiverData = ItemSheetEd.getNamegiverData()
        console.log( "namegiverData", namegiverData )
        super( edCharakterGeneration );
    }

    /**
     * Wait for dialog to be resolved.
     * @param {object} [data]           Initial data to pass to the constructor.
     * @param {object} [options]        Options to pass to the constructor.
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
            height: 600,
            width: 600,
            resizable: true,
            classes: [...options.classes, 'earthdawn4e', 'character-generation'],
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
        return game.i18n.localize( "X-Character Generation" );
    }

    get template() {
        return 'systems/ed4e/templates/actor/generation/generation.hbs';
    }

    /** @type {edCharakterGeneration} */
    edCharacterOptions = {};

    /* -------------------------------------------- */
    /*             get Namegiver Data               */
    /* -------------------------------------------- */

    async getNamegiverData() {
        const namegiverData = {};

        const items = game.items;
        for ( let i = 0; i< items.length; i++ ) {
        if ( items[i].type === "namegiver" ) {
            namegiverData.push( items[i].key )
        }
        }
        return namegiverData;
    } 

    /** @inheritDoc */
    activateListeners( html ) {
        super.activateListeners( html );
        $( this.form.querySelector( "button.cancel" ) ).on( "click" , this.close.bind( this ) );
        $( this.form.querySelector( "button.next" ) ).on( "click" , this._nextTab.bind( this ) );
        $( this.form.querySelector( "button.ok" ) ).on( "click" , this._finishGeneration.bind( this ) );
    }

    /** @inheritDoc */
    async close( options = {} ) {
        this.resolve?.( null );
        return super.close( options );
    }

    // first check completeness and then proceed
    _nextTab( data = {} ) {
        return 
    }

    // finish Character Generation and Create Actor with collected data.
    async _finishGeneration( event ) {
        return this.close();
    }
}