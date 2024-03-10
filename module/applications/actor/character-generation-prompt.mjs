import { filterObject, getAllDocuments } from "../../utils.mjs";
import ED4E from "../../config.mjs";
import CharacterGenerationData from "../../data/other/character-generation.mjs";
import EdRoll from "../../dice/ed-roll.mjs";

/**
 * The application responsible for handling character generation
 *
 * @augments {FormApplication}
 *
 * @param {CharacterGenerationData} charGen         The data model which is the
 *      target data structure to be updated by the form.
 * @param {FormApplicationOptions} [options={}]     Additional options which
 *      modify the rendering of the sheet.
 * @param {{string:[Document]}} documentCollections An object mapping the
 *      document subtypes to arrays of the available documents of that type.
 */
export default class CharacterGenerationPrompt extends FormApplication {
  constructor(charGen, options = {}, documentCollections) {
    charGen ??= new CharacterGenerationData();
    super(charGen);

    this.resolve = options.resolve;

    this.namegivers = documentCollections.namegivers;
    this.disciplines = documentCollections.disciplines;
    this.questors = documentCollections.questors;
    this.skills = documentCollections.skills;

    this.availableAttributePoints = game.settings.get( 'ed4e', 'charGenAttributePoints' );

    this._steps = [
      'namegiver-tab',
      'class-tab',
      'attribute-tab',
      'spell-tab',
      'skill-tab',
      'equipment-tab'
    ];
    this._currentStep = 0;
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   */
  static async waitPrompt(data, options = {}) {
    data ??= new CharacterGenerationData();
    const docCollections = {
      namegivers: await getAllDocuments('Item', 'namegiver', false, 'OBSERVER'),
      disciplines: await getAllDocuments('Item', 'discipline', false, 'OBSERVER'),
      questors: await getAllDocuments('Item', 'questor', false, 'OBSERVER'),
      skills: await getAllDocuments(
        'Item',
        'skill',
        false,
        'OBSERVER',
        ['system.source.tier'],
        (x) => x.system.source.tier === 'novice',
      ),
    };
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(data, options, docCollections).render(true, { focus: true });
    });
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return {
      ...options,
      closeOnSubmit: false,
      submitOnChange: true,
      submitOnClose: false,
      height: 850,
      width: 1000,
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

  static errorMessages = {
    noNamegiver: "X.You didn't choose a namegiver. Pretty difficult to be a person then, don't you think?",
    noClass: "X.There's no class selected. Don't you wanna be magic?",
    attributes: "X. This is just reminder: there are still some unspent attribute points. They will be converted to extra karma.",
    talentRanksLeft: "X.There's still some ranks left for your class abilities. Use them, they're free.",
    skillRanksLeft: "X.You haven't used all of your skill ranks. Come on, don't be shy.",
  }

  get title() {
    return game.i18n.localize('X-Character Generation');
  }

  get template() {
    return 'systems/ed4e/templates/actor/generation/generation.hbs';
  }

  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);

    $(this.form.querySelectorAll('.talent-tables .optional-talents-pool td.ability-name')).on(
      'click', this._onSelectTalentOption.bind(this)
    );
    $(this.form.querySelectorAll( 'span.rank-change-icon' )).on(
      'click', this._onChangeRank.bind(this)
    );
    $(this.form.querySelectorAll( 'span.attribute-change-icon' )).on(
      'click', this._onChangeAttributeModifier.bind(this)
    );
    $(this.form.querySelectorAll( 'button.reset-points' )).on('click', this._onReset.bind(this));
    $(this.form.querySelector('button.next')).on('click', this._nextTab.bind(this));
    $(this.form.querySelector('button.previous')).on('click', this._previousTab.bind(this));
    $(this.form.querySelector('button.cancel')).on('click', this.close.bind(this));
    $(this.form.querySelector('button.ok')).on('click', this._finishGeneration.bind(this));
  }

  async getData(options = {}) {
    const context = super.getData(options);

    context.config = ED4E;

    // Namegiver
    context.namegivers = this.namegivers;
    context.namegiverDocument = await context.object.namegiverDocument;

    // Class
    context.disciplines = this.disciplines;
    context.disciplineRadioChoices = this.disciplines.reduce(
      ( obj, discipline ) => ( { ...obj, [discipline.uuid]: discipline.name} ),
      {} );
    context.questors = this.questors;
    context.questorRadioChoices = this.questors.reduce(
      ( obj, questor ) => ( { ...obj, [questor.uuid]: questor.name} ),
      {} );
    context.classDocument = await context.object.classDocument;

    // Talents & Devotions
    context.maxAssignableRanks = game.settings.get("ed4e", "charGenMaxRank" );

    // Abilities
    context.skills = {
      general: this.skills.filter( skill => skill.system.skillType === 'general' ),
      artisan: this.skills.filter( skill => skill.system.skillType === 'artisan' ),
      knowledge: this.skills.filter( skill => skill.system.skillType === 'knowledge' ),
    };

    // Attributes
    context.finalAttributeValues = await context.object.getFinalAttributeValues();
    context.availableAttributePoints = context.object.availableAttributePoints;
    context.maxAttributePoints = game.settings.get( "ed4e", "charGenAttributePoints" );
    context.previews = await context.object.getCharacteristicsPreview();

    // Dialog Config
    context.hasNextStep = this._hasNextStep();
    context.hasNoNextStep = !context.hasNextStep;
    context.hasPreviousStep = this._hasPreviousStep();
    context.hasNoPreviousStep = !context.hasPreviousStep;

    return context;
  }

  async _updateObject(event, formData) {
    const data = foundry.utils.expandObject( formData );

    data.namegiver ??= null;

    // Reset selected class if class type changed
    if ( data.isAdept !== this.object.isAdept ) data.selectedClass = null;
    if ( data.selectedClass ) this.object.classAbilities = await fromUuid( data.selectedClass );

    // process selected class option ability
    if ( data.abilityOption ) this.object.abilityOption = data.abilityOption;

    this.object.updateSource( data );

    // Re-render sheet with updated values
    this.render();
  }

  /** @inheritDoc */
  async close(options = {}) {
    this.resolve?.(null);
    return super.close(options);
  }

  async _finishGeneration(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    await this.submit( {preventRender: true} );

    if ( !this._validateCompletion() ) {
      ui.notifications.error( game.i18n.localize( "X.No no no, You're not finished yet." ) );
      return;
    }

    this.resolve?.( this.object );
    return this.close();
  }

  _onChangeRank( event ) {
    const abilityUuid = event.currentTarget.dataset.abilityUuid;
    const abilityType = event.currentTarget.dataset.abilityType;
    const changeType = event.currentTarget.dataset.changeType;
    this.object.changeAbilityRank( abilityUuid, abilityType, changeType ).then( _ => this.render() );
  }

  _onChangeAttributeModifier( event ) {
    const attribute = event.currentTarget.dataset.attribute;
    const changeType = event.currentTarget.dataset.changeType;
    this.object.changeAttributeModifier( attribute, changeType ).then( _ => this.render() );
  }

  _onReset( event ) {
    const resetType = event.currentTarget.dataset.resetType;
    this.object.resetPoints( resetType ).then( _ => this.render() );
  }

  _onSelectTalentOption( event ) {
    event.currentTarget.querySelector( 'input[type="radio"]' ).click();
  }

  _onChangeTab( event, tabs, active ) {
    super._onChangeTab( event, tabs, active );
    this._currentStep = this._steps.indexOf( active );
    this.render();
  }

  // first check completeness and then proceed
  _nextTab() {
    if (!this._hasNextStep()) return;
    // if ( !this._validateOnChangeTab() ) return;
    this._currentStep++;
    this.activateTab(this._steps[this._currentStep]);
    this.render();
  }

  _previousTab() {
    if (!this._hasPreviousStep()) return;
    // if ( !this._validateOnChangeTab() ) return;
    this._currentStep--;
    this.activateTab(this._steps[this._currentStep]);
    this.render();
  }

  _hasNextStep() {
    return this._currentStep < this._steps.length - 1;
  }

  _hasPreviousStep() {
    return this._currentStep > 0;
  }

  _validateOnChangeTab() {
    let hasValidationError = false;
    let errorMessage = "";
    switch ( this._steps[this._currentStep] ) {
      case 'namegiver-tab':
        hasValidationError = this._validateNamegiver();
        errorMessage = this.constructor.errorMessages["noNamegiver"];
        break;
      case 'class-tab':
         hasValidationError = this._validateClass();
        errorMessage = ``;
        break;
      case 'attribute-tab':
        break;
      case 'spell-tab':
        break;
      case 'skill-tab':
        break;
      case 'equipment-tab':
        break;
    }
  }

  _validateCompletion() {
    const errorLevel = "error";
    return this._validateNamegiver( errorLevel, true )
      && this._validateClass( errorLevel, true )
      && this._validateClassRanks( errorLevel, true )
      // this._validateAttributes( "warn", true );
      && this._validateSkills( errorLevel, true );
  }

  _validateNamegiver( errorLevel = "warn", displayNotification = false ) {
    const hasNamegiver = !!this.object.namegiver;
    if ( displayNotification ) {
      if ( !hasNamegiver ) this._displayValidationError( errorLevel, "noNamegiver" );
    }
    return hasNamegiver;
  }

  _validateClass( errorLevel = "warn", displayNotification = false ) {
    const hasClass = !!this.object.selectedClass;
    if ( displayNotification ) {
      if ( !hasClass ) this._displayValidationError( errorLevel, "noClass" );
    }
    return hasClass;
  }

  _validateClassRanks( errorLevel = "warn", displayNotification = false ) {
    const hasRanks = this.object.availableRanks[this.object.isAdept ? "talent" : "devotion"] > 0;
    if ( displayNotification ) {
      if ( hasRanks ) this._displayValidationError( errorLevel, "talentRanksLeft" );
    }
    return !hasRanks;
  }

  _validateAttributes( errorLevel = "info", displayNotification = false ) {
    const hasAttributePoints = this.object.availableAttributePoints > 0;
    if ( displayNotification ) {
      if ( hasAttributePoints ) this._displayValidationError( errorLevel, "attributes" );
    }
    return !hasAttributePoints;
  }

  _validateSkills( errorLevel = "warn", displayNotification = false ) {
    const availableRanks = filterObject(
      this.object.availableRanks,
      ( [key, value] ) => !["talent", "devotion"].includes( key )
    );
    availableRanks[this.object.isAdept ? "devotion" : "talent"] = 0
    availableRanks["readWrite"] = 0;
    availableRanks["speak"] = 0;
    const hasRanks = Object.values( availableRanks ).some( value => value > 0);
    if ( displayNotification ) {
      if ( hasRanks ) this._displayValidationError( errorLevel, "skillRanksLeft" );
    }
    return !hasRanks;
  }

  _displayValidationError( level, type ) {
    ui.notifications[level]( game.i18n.format( this.constructor.errorMessages[type] ) );
  }
}