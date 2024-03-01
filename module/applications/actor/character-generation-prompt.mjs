import { getAllDocuments } from "../../utils.mjs";
import ED4E from "../../config.mjs";
import CharacterGenerationData from "../../data/other/character-generation.mjs";

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

    this.namegivers = documentCollections.namegivers;
    this.disciplines = documentCollections.disciplines;
    this.questors = documentCollections.questors;
    this.skills = documentCollections.skills;

    this.availableAttributePoints = game.settings.get( 'ed4e', 'charGenAttributePoints' );

    // initialize the object's default values
    this.object.updateSource( {
      namegiver: this.object.namegiver ?? this.namegivers[0]?.uuid,
    } );
    /*this._updateObject( undefined, {
      isAdept: true,
      namegiver: this.namegivers[0]?.uuid,
      selectedClass: this.disciplines[0]?.uuid,
    } );*/

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
    return game.i18n.localize('X-Character Generation');
  }

  get template() {
    return 'systems/ed4e/templates/actor/generation/generation.hbs';
  }

  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);

    /*$(this.form.querySelectorAll('.talent-tables .optional-talents-pool td')).on(
      'click', this._onSelectTalentOption.bind(this)
    );*/
    $(this.form.querySelector( 'td.attribute-change .attribute-increase' )).on(
      'click', this._onChangeAttributeModifier.bind(this)
    );
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

    // Starting Abilities
    context.skills = this.skills;

    // Attributes

    // Dialog Config
    context.hasNextStep = this._hasNextStep();
    context.hasNoNextStep = !context.hasNextStep;
    context.hasPreviousStep = this._hasPreviousStep();
    context.hasNoPreviousStep = !context.hasPreviousStep;

    return context;
  }

  async _updateObject(event, formData) {
    const data = foundry.utils.expandObject( formData );

    // Reset selected class if class type changed
    if ( data.isAdept !== this.object.isAdept ) data.selectedClass = null;

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
    return this.close();
  }

  _onChangeAttributeModifier( event ) {
    const attribute = event.currentTarget.parentElement.parentElement.dataset.attribute;
    const changeType = event.currentTarget.dataset.changeType;
    this.object.attributes[attribute].change
  }

  _onSelectTalentOption( event ) {
    this.object.abilities.option = event.currentTarget.dataset.abilityUuid;
    const currentSelected = $(event.currentTarget).parent().parent().find('td.selected')[0];
    currentSelected?.classList.toggle('selected');
    event.currentTarget.classList.toggle('selected');
  }
  
  _onChangeTab( event, tabs, active ) {
    super._onChangeTab( event, tabs, active );
    this._currentStep = this._steps.indexOf( active );
    this.render();
  }

  // first check completeness and then proceed
  _nextTab() {
    if (!this._hasNextStep()) return;
    this._currentStep++;
    this.activateTab(this._steps[this._currentStep]);
    this.render();
  }

  _previousTab() {
    if (!this._hasPreviousStep()) return;
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
}