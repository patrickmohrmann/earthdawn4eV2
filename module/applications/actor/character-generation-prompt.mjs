import { getAllDocuments } from "../../utils.mjs";
import ED4E from "../../config.mjs";

/**
 * The application responsible for handling character generation
 *
 * @augments {FormApplication}
 *
 * @param {{}} charGen                              Some object which is the
 *      target data structure to be updated by the form.
 * @param {FormApplicationOptions} [options={}]     Additional options which modify
 *      the rendering of the sheet.
 * @param {{string:[Document]}} documentCollections An object mapping the
 *      document subtypes to arrays of the available documents of that type.
 */
export default class CharacterGenerationPrompt extends FormApplication {
  constructor(charGen = {}, options = {}, documentCollections) {
    super(charGen);

    this.namegivers = documentCollections.namegivers;
    this.disciplines = documentCollections.disciplines;
    this.questors = documentCollections.questors;
    this.skills = documentCollections.skills;

    // initialize the object's default values
    foundry.utils.mergeObject( this.object, {
      isAdept: true,
      namegiver: this.namegivers[0],
      selectedClass: this.disciplines[0],
    }, {
      overwrite: false,
      inplace: true
    } );

    this._steps = ['namegiver-tab', 'class-tab', 'attribute-tab', 'spell-tab', 'skill-tab', 'equipment-tab'];
    this._currentStep = 0;
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   */
  static async waitPrompt(data, options = {}) {
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
    $(this.form.querySelectorAll('.talent-tables .optional-talents-pool td')).on('click', this._onSelectTalentOption.bind(this));
    $(this.form.querySelector('button.next')).on('click', this._nextTab.bind(this));
    $(this.form.querySelector('button.previous')).on('click', this._previousTab.bind(this));
    $(this.form.querySelector('button.cancel')).on('click', this.close.bind(this));
    $(this.form.querySelector('button.ok')).on('click', this._finishGeneration.bind(this));
  }

  getData(options = {}) {
    const context = super.getData(options);

    context.config = ED4E;

    context.namegivers = this.namegivers;
    context.disciplines = this.disciplines;
    context.disciplineRadioChoices = this.disciplines.reduce(
      ( obj, discipline ) => ( { ...obj, [discipline.uuid]: discipline.name} ),
      {} );
    context.questors = this.questors;
    context.questorRadioChoices = this.questors.reduce(
      ( obj, questor ) => ( { ...obj, [questor.uuid]: questor.name} ),
      {} );
    context.skills = this.skills;
    context.hasNextStep = this._hasNextStep();
    context.hasNoNextStep = !context.hasNextStep;
    context.hasPreviousStep = this._hasPreviousStep();
    context.hasNoPreviousStep = !context.hasPreviousStep;

    return context;
  }

  async _updateObject(event, formData) {
    this.object.isAdept = formData.isAdept;
    this.object.namegiver = await fromUuid( formData.namegiver );
    this.object.selectedClass = await fromUuid( formData.selectedClass );
    console.log( "Submitted form data:" );
    console.log( formData );
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

  _onSelectTalentOption( event ) {
    this.object.talentOption = event.currentTarget.dataset.abilityUuid;
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