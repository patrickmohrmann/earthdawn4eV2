import ED4E from "../../config.mjs";
import { getNamegiverCollection  } from "../../item-data-collectors.mjs";
import { getNamegiverCollectionSelection } from "../../item-data-collectors.mjs";
import { getTalentCollection  } from "../../item-data-collectors.mjs";
import { getSkillCollection } from "../../item-data-collectors.mjs";
import { getDevotionCollection  } from "../../item-data-collectors.mjs";
import { getSpellCollection  } from "../../item-data-collectors.mjs";
import { getSpellCollectionSelection } from "../../item-data-collectors.mjs";
import { getSpellCollectionGeneration } from "../../item-data-collectors.mjs";
import { getDisciplineCollection  } from "../../item-data-collectors.mjs";
import { getQuestorCollection  } from "../../item-data-collectors.mjs";
import { getSkillFullCollection } from "../../item-data-collectors.mjs";
import { getSkillCollectionArtisan } from "../../item-data-collectors.mjs";
import { getskillCollectionArtisanSelection } from "../../item-data-collectors.mjs";
import { getSkillCollectionGeneral } from "../../item-data-collectors.mjs";
import { getskillCollectionGeneralSelection } from "../../item-data-collectors.mjs";
import { getSkillCollectionKnowledge } from "../../item-data-collectors.mjs";
import { getskillCollectionKnowledgeSelection } from "../../item-data-collectors.mjs";


/**
 * Extend the basic ActorSheet with modifications
 * @augments {ActorSheet}
 */
export default class ActorSheetEd extends ActorSheet {

  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      classes: ['earthdawn4e', 'sheet', 'actor', 'character-sheet'],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: '.actor-sheet-tabs',
          contentSelector: '.actor-sheet-body',
          initial: 'main',
        },
      ],
    } );
  }

  /** @override */
  get template() {
    return `systems/ed4e/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */
  /*  Get Data            */
  /* -------------------------------------------- */
  async getData() {
    const systemData = super.getData();
    systemData.enrichment = await this.actor._enableHTMLEnrichment();
    await this.actor._enableHTMLEnrichmentEmbeddedItems();
    systemData.config = ED4E;
    return systemData;
  }


  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    // View Item Sheets
    html.find( ".item-edit" ).click( this._onItemEdit.bind( this ) );

    // All listeners below are only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute tests
    html.find( "table.table__attribute .rollable" ).click( this._onRollAttribute.bind( this ) );

    // Owned Item management
    html.find( ".item-delete" ).click( this._onItemDelete.bind( this ) );

    // Effect Management
    html.find( ".effect-add" ).click( this._onEffectAdd.bind( this ) );
    html.find( ".effect-edit" ).click( this._onEffectEdit.bind( this ) );
    html.find( ".effect-delete" ).click( this._onEffectDelete.bind( this ) );

    // Karma refresh button --> karma ritual
    html.find( ".button__Karma-refresh" ).click( this._onKarmaRefresh.bind( this ) );

    // item card description shown on item click
    html.find( ".card__name" ).click( event => this._onCardExpand( event ) );

    // Character Generation
    html.find( ".character-generation" ).click( this._onCharacterGeneration.bind( this ) );
  }

  // eslint-disable-next-line complexity
  async _onCharacterGeneration( event ) {
    let artisanSkillPromise = getSkillCollectionArtisan();
    let artisanSkillSelectionPromise = getskillCollectionArtisanSelection();
    const artisanSkillCollection = await artisanSkillPromise.then( result => result )
    const artisanSkillSelectionCollection = await artisanSkillSelectionPromise.then( result => result )

    let generalSkillPromise = getSkillCollectionGeneral();
    let genearlSkillSelectionPromise = getskillCollectionGeneralSelection();
    const generalSkillCollection = await generalSkillPromise.then( result => result )
    const genearlSkillSelectionCollection = await genearlSkillSelectionPromise.then( result => result )

    let knowledgeSkillPromise = getSkillCollectionKnowledge();
    let knowledgeSkillSelectionPromise = getskillCollectionKnowledgeSelection();
    const knowledgeSkillCollection = await knowledgeSkillPromise.then( result => result )
    const knowledgeSkillSelectionCollection = await knowledgeSkillSelectionPromise.then( result => result )

    let namegiverPromise = getNamegiverCollection();
    const namegiverCollection = await namegiverPromise.then( result => result )

    let spellPromise = getSpellCollection();
    let spellPromiseGeneration = getSpellCollectionGeneration();
    const spellCollection = await spellPromise.then( result => result )
    const spellCollectionGeneration = await spellPromiseGeneration.then( result => result )

    
    event.preventDefault();
    let dataCollection = {
        namegiverCollection: namegiverCollection,
        // namegiverCollectionSelection: namegiverSelectionCollection,
        namegiverCollectionSelection: getNamegiverCollectionSelection(),
        talentCollection: getTalentCollection(),
        skillCollection: getSkillCollection(),
        devotionCollection: getDevotionCollection(),
        spellCollection: spellCollection,
        spellCollectionGeneration: spellCollectionGeneration,
        spellCollectionSelection: getSpellCollectionSelection(),        
        disciplineCollection: getDisciplineCollection(),
        questorCollection: getQuestorCollection(),
        skillFullCollection: getSkillFullCollection(),
        skillCollectionArtisan: artisanSkillCollection,
        skillCollectionArtisanSelection: artisanSkillSelectionCollection,
        skillCollectionGeneral: generalSkillCollection,
        skillCollectionGeneralSelection: genearlSkillSelectionCollection,
        skillCollectionKnowledge: knowledgeSkillCollection,
        skillCollectionKnowledgeSelection: knowledgeSkillSelectionCollection
      }
      console.log( "EARTHDAWN-DATACOLLECTION", dataCollection )

    this.actor.characterGeneration( dataCollection );
  }

  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollAttribute( event ) {
    event.preventDefault();
    const attribute = event.currentTarget.dataset.attribute;
    this.actor.rollAttribute( attribute, {event: event} );
  }

  /**
   * Handle creating an owned ActiveEffect for the Actor.
   * @param {Event} event     The originating click event.
   * @returns {Promise|null}  Promise that resolves when the changes are complete.
   * @private
   */
  _onEffectAdd( event ) {
    event.preventDefault();
    return this.actor.createEmbeddedDocuments( 'ActiveEffect', [{
      label: `New Effect`,
      icon: 'systems/earthdawn4e/assets/effect.png',
      duration: { rounds: 1 },
      origin: this.actor.uuid
    }] );
  }

  /**
   * Handle deleting an existing Owned ActiveEffect for the Actor.
   * @param {Event} event                       The originating click event.
   * @returns {Promise<ActiveEffect>|undefined} The deleted item if something was deleted.
   * @private
   */
  _onEffectDelete( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-name" );
    const effect = this.actor.effects.get( li.dataset.itemId );
    if ( !effect ) return;
    return effect.deleteDialog();
  }

  /**
   * Handle editing an existing Owned ActiveEffect for the Actor.
   * @param {Event}event    The originating click event.
   * @returns {any}         The rendered item sheet.
   * @private
   */

  _onEffectEdit( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-name" );
    const effect = this.actor.effects.get( li.dataset.itemId );
    return effect.sheet?.render( true );
  }

  /**
   * Handle deleting an existing Owned Item for the Actor.
   * @param {Event} event                 The originating click event.
   * @returns {Promise<ItemEd>|undefined} The deleted item if something was deleted.
   * @private
   */
  async _onItemDelete( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-name" );
    const item = this.actor.items.get( li.dataset.itemId );
    if ( !item ) return;
    return item.deleteDialog();
  }

  /**
   * Handle editing an existing Owned Item for the Actor.
   * @param {Event}event    The originating click event.
   * @returns {ItemSheetEd} The rendered item sheet.
   * @private
   */
  _onItemEdit( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-name" );
    const item = this.actor.items.get( li.dataset.itemId );
    return item.sheet?.render( true );
  }

  _onKarmaRefresh ( ) {
    this.actor.karmaRitual();
  }


  _onCardExpand( event ) {
    event.preventDefault();

    const itemDescription = $( event.currentTarget )
    .parent( ".card__ability" )
    .parent( ".item-name" )
    .children( ".card__description" );

    itemDescription.toggleClass( "card__description--toggle" );
  }

}
