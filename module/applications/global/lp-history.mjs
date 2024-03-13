
import ED4E from "../../config.mjs";

/**
 * The application responsible for handling Legend Point History of Earned Points
 *
 * @augments {FormApplication}
 *
 * @param {LegendPointHistoryEarnedPrompt} legendpointHistoryEarned         The data model which is the
 *      target data structure to be updated by the form.
 * @param {FormApplicationOptions} [options={}]     Additional options which
 *      modify the rendering of the sheet.
 */
export default class LegendPointHistoryEarnedPrompt extends FormApplication {
  constructor( legendpointHistoryEarned, options = {} ) {
    super( legendpointHistoryEarned );

    // this.namegivers = documentCollections.namegivers;
    // this.disciplines = documentCollections.disciplines;
    // this.questors = documentCollections.questors;
    // this.skills = documentCollections.skills;

    // this.availableAttributePoints = game.settings.get( 'ed4e', 'charGenAttributePoints' );

    // this._steps = [
    //   'namegiver-tab',
    //   'class-tab',
    //   'attribute-tab',
    //   'spell-tab',
    //   'skill-tab',
    //   'equipment-tab'
    // ];
    // this._currentStep = 0;
  }

  /**
   * Wait for dialog to be resolved.
   * @param {object} [data]           Initial data to pass to the constructor.
   * @param {object} [options]        Options to pass to the constructor.
   */
  static async waitPrompt( data, options = {} ) {
    // data ??= new CharacterGenerationData();
    // const docCollections = {
    //   namegivers: await getAllDocuments('Item', 'namegiver', false, 'OBSERVER'),
    //   disciplines: await getAllDocuments('Item', 'discipline', false, 'OBSERVER'),
    //   questors: await getAllDocuments('Item', 'questor', false, 'OBSERVER'),
    //   skills: await getAllDocuments(
    //     'Item',
    //     'skill',
    //     false,
    //     'OBSERVER',
    //     ['system.source.tier'],
    //     (x) => x.system.source.tier === 'novice',
    //   ),
    // };
    return new Promise( ( resolve ) => {
      options.resolve = resolve;
      new this( options ).render( true, { focus: true } );
    } );
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
      classes: [...options.classes, 'earthdawn4e', 'legend-point__history--earned'],
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
    return game.i18n.localize( "X-Legend Point History - Earned" );
  }

  get template() {
    return 'systems/ed4e/templates/actor/legend-points/history.hbs';
  }

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    // $(this.form.querySelectorAll('.talent-tables .optional-talents-pool td')).on(
    //   'click', this._onSelectTalentOption.bind(this)
    // );
    // $(this.form.querySelectorAll( 'span.attribute-change-icon' )).on(
    //   'click', this._onChangeAttributeModifier.bind(this)
    // );
    // $(this.form.querySelector( 'button#char-gen-clear-attribute-points-button' )).on(
    //   'click', this._resetAttributePoints.bind(this)
    // );
    // $(this.form.querySelector('button.next')).on('click', this._nextTab.bind(this));
    // $(this.form.querySelector('button.previous')).on('click', this._previousTab.bind(this));
    // $(this.form.querySelector('button.cancel')).on('click', this.close.bind(this));
    // $(this.form.querySelector('button.ok')).on('click', this._finishGeneration.bind(this));
  }

  async getData( options = {} ) {
    const context = super.getData( options );

    context.config = ED4E;

    // Namegiver
    // context.namegivers = this.namegivers;
    // context.namegiverDocument = await context.object.namegiverDocument;

    // // Class
    // context.disciplines = this.disciplines;
    // context.disciplineRadioChoices = this.disciplines.reduce(
    //   ( obj, discipline ) => ( { ...obj, [discipline.uuid]: discipline.name} ),
    //   {} );
    // context.questors = this.questors;
    // context.questorRadioChoices = this.questors.reduce(
    //   ( obj, questor ) => ( { ...obj, [questor.uuid]: questor.name} ),
    //   {} );
    // context.classDocument = await context.object.classDocument;

    // // Starting Abilities
    // context.skills = this.skills;

    // // Attributes
    // context.finalAttributeValues = await context.object.getFinalAttributeValues();
    // context.availableAttributePoints = context.object.availableAttributePoints;
    // context.maxAttributePoints = game.settings.get( "ed4e", "charGenAttributePoints" );
    // context.previews = await context.object.getCharacteristicsPreview();

    // // Dialog Config
    // context.hasNextStep = this._hasNextStep();
    // context.hasNoNextStep = !context.hasNextStep;
    // context.hasPreviousStep = this._hasPreviousStep();
    // context.hasNoPreviousStep = !context.hasPreviousStep;

    return context;
  }

  async _updateObject( event, formData ) {
    const data = foundry.utils.expandObject( formData );
    data.namegiver ||= null;

    // Reset selected class if class type changed
    if ( data.isAdept !== this.object.isAdept ) data.selectedClass = null;

    this.object.updateSource( data );

    // Re-render sheet with updated values
    this.render();
  }

  /** @inheritDoc */
  async close( options = {} ) {
    this.resolve?.( null );
    return super.close( options );
  }


  _onChangeTab( event, tabs, active ) {
    super._onChangeTab( event, tabs, active );
    this._currentStep = this._steps.indexOf( active );
    this.render();
  }

  // first check completeness and then proceed
  _nextTab() {
    if ( !this._hasNextStep() ) return;
    this._currentStep++;
    this.activateTab( this._steps[this._currentStep] );
    this.render();
  }

  _previousTab() {
    if ( !this._hasPreviousStep() ) return;
    this._currentStep--;
    this.activateTab( this._steps[this._currentStep] );
    this.render();
  }

  _hasNextStep() {
    return this._currentStep < this._steps.length - 1;
  }

  _hasPreviousStep() {
    return this._currentStep > 0;
  }
}