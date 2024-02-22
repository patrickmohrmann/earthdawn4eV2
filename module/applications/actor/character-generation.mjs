

/**
 * The application responsible for handling Charaktergeneration
 *
 * @augments {FormApplication}
 *
 * @param {edCharakterGeneration} edCharakterGeneration         Charactergeneration
 * @param {FormApplicationOptions} [options={}]                 Additional options which modify the rendering of the sheet.
 */
export default class CharacterGenerationPrompt extends FormApplication {

    constructor( edCharakterGeneration = {}, dataCollection = {} ) {
        super( edCharakterGeneration, dataCollection );

        this.namegiver = dataCollection.namegiverCollection;
        this.talents = dataCollection.talentCollection;
        this.skills = dataCollection.skillCollection;
        this.devotions = dataCollection.devotionCollection;
        this.spells = dataCollection.spellCollection;
        this.spellCollection = dataCollection.spellCollectionSelection
        this.spellCollectionGeneration = dataCollection.spellCollectionGeneration
        this.disciplines = dataCollection.disciplineCollection;
        this.questors = dataCollection.questorCollection;
        this.fullNamegiver = dataCollection.fullNamegiverItemCollection;
        this.fullTalents = dataCollection.fullTalentItemCollection;
        this.skillsFull = dataCollection.fullSkillItemCollection;
        this.artisanSkills = dataCollection.skillCollectionArtisanSelection;
        this.knowledgeSkills = dataCollection.skillCollectionKnowledgeSelection;
        this.generalSkills = dataCollection.skillCollectionGeneralSelection;
        this.fullDevotions = dataCollection.fullDevotionItemCollection;
        this.fullDisciplines = dataCollection.fullDisciplineItemCollection;
        this.fullQuestors = dataCollection.fullQuestorItemCollection;
        // console.log( "DATACOLLECTION - CHARACTER GENERATION", dataCollection )
    }   

    /**
     * Wait for dialog to be resolved.
     * @param {object} [edCharakterGeneration]           Initial data to pass to the constructor.
     * @param {object} [dataCollection]        Options to pass to the constructor.
     */
    static waitPrompt( edCharakterGeneration, dataCollection ) {
        return new Promise( ( resolve ) => {
           //  dataCollection.resolve = resolve;
            new this( edCharakterGeneration, dataCollection, this.namegiver ).render( true, { focus: true } );
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
    edCharacterOptions = {
    };



    // namegiver.forEach( ( (this.namegiver) ) => {
    //     let option = document.createElement( "option" );
    //     option.text = item.name;
    //     option.value = item.name;
    //     let namegiverSelector = document.getElementById( "namegiver__selector" )
    //     namegiverSelector.appendChild(option)
    // } );



    /** @inheritDoc */
    activateListeners( html ) {
        super.activateListeners( html );
        $( this.form.querySelector( "button.cancel" ) ).on( "click" , this.close.bind( this ) );
        $( this.form.querySelector( "button.next" ) ).on( "click" , this._nextTab.bind( this ) );
        $( this.form.querySelector( "button.ok" ) ).on( "click" , this._finishGeneration.bind( this ) );

        // namegiver selection
        $( this.form.querySelector( "#namegiver__selector" ) ).on( "click" , this._selectNamegiver.bind( this ) );
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

    async _selectNamegiver( event ) {
        console.log( "this.value", this )
        return this.value

    }

    async _updateObject( event, formData ) {
        return Promise.resolve();
      }

    _updateCharacterData() {
        return
    }
}