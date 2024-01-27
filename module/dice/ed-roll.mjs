import getDice from "./step-tables.mjs";
import { sum } from "../utils.mjs";
import ED4E from "../config.mjs";

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
 *                               damageRanged (Effect), damageMelee (Effect), attackRanged, attackMelee,
 *                               ability,
 *                               resistances (Effect), reaction, opposed
 *                               spellCasting, threadWeaving, spellCastingEffect (Effect)
 *                               Initiative (effect), Recovery (Effect), effects (Effect)
 *                               poison
 *                               etc. TODO: complete list
 */

/**
 * @param { any } formula TODO
 * @param { object } data TODO
 * @param { EdRollOptions } edRollOptions Collection of data, steps, karma, devotions, target and additional.
 * @property { string } flavorTemplate The template to use ofr rendering additional information in this roll's chat messages.
 */
export default class EdRoll extends Roll {

  /* -------------------------------------------- */
  /*  Constructor and Fields                      */
  /* -------------------------------------------- */

  constructor(formula = undefined, data = {}, edRollOptions = {}) {
    // us ternary operator to also check for empty strings, nullish coalescing operator (??) only checks null or undefined
    const baseTerm = formula
      ? formula
      : // : ( `${getDice( step )}[${game.i18n.localize( "ED.General.S.step" )} ${step}]` );
        `(${getDice(edRollOptions.step.total)})[${game.i18n.localize('ED.General.S.step')} ${
          edRollOptions.step.total
        }]`;
    super(baseTerm, data, edRollOptions);

    this.flavorTemplate = ED4E.rollTypes[this.options.rollType]?.flavorTemplate ?? ED4E.rollTypes.arbitrary.flavorTemplate;

    if (!this.options.extraDiceAdded) this.#addExtraDice();
    if (!this.options.configured) this.#configureModifiers();
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  static TOOLTIP_TEMPLATE = "systems/ed4e/templates/dice/tooltip.hbs";

  /* -------------------------------------------- */
  /*  Getter and Setter                           */
  /* -------------------------------------------- */

  /**
   * Is this roll a valid Earthdawn test?
   * @type {boolean}
   */
  get validEdRoll() {
    // First term must be a Die
    // return this.terms[0] instanceof Die;
    return true;
  }

  /* -------------------------------------------- */

  /**
   * Is this roll an automatic fail? True, if at least 2 dice, no effect test, and all dice are 1.
   * @type { boolean|void }
   */
  get isRuleOfOne() {
    if (!this.validEdRoll || !this._evaluated) return undefined;
    // more than one die required
    if (this.numDice < 2) return false;
    return this.total === this.numDice;
  }

  /* -------------------------------------------- */

  /**
   *  The number of dice in this roll.
   *  @type { number }
   */
  get numDice() {
    // must be evaluated since dice can explode and add more dice
    if (!this.validEdRoll || !this._evaluated) return undefined;
    return this.dice
      .map((diceTerm) => diceTerm.number)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  /* -------------------------------------------- */

  /**
   * The number of successes in this roll. Only available if a target number is specified and the roll is evaluated.
   * @type {number}
   */
  get numSuccesses() {
    if (!this.validEdRoll || !this._evaluated || !this.options.target) return undefined;
    return this.total < this.options.target?.total
      ? 0
      : Math.trunc((this.total - this.options.target.total) / 5) + 1;
  }

  /* -------------------------------------------- */

  get numExtraSuccesses() {
    if (!this.validEdRoll || !this._evaluated || !this.options.target) return undefined;
    return this.numSuccesses < 1 ? 0 : this.numSuccesses - 1;
  }

  /* -------------------------------------------- */

  /**
   * The text that is added to this roll's chat message when calling `toMessage`.
   * @type {Promise<string>}
   */
  get chatFlavor() {
    return renderTemplate( this.flavorTemplate, this.getFlavorTemplateData() );
  }

  /* -------------------------------------------- */

  /**
   * Set the text of this roll's chat message.
   * @type {string}
   */
  set chatFlavor(flavor) {
    this.options.updateSource({
      chatFlavor: flavor,
    });
  }

  /* -------------------------------------------- */

  /**
   * Returns the formula string based on strings instead of dice.
   * @type {string}
   */
  get #stepsFormula() {
    const formulaParts = [
      game.i18n.format(
        "ED.Rolls.formulaStep", {
          step: this.options.step.total
        }
      ),
      this.options.karma.pointsUsed
        ? game.i18n.format(
          "ED.Rolls.formulaKarma", {
            step: this.options.karma.step,
            amount: this.options.karma.pointsUsed
          }
        )
        : undefined,
      this.options.devotion.pointsUsed
        ? game.i18n.format(
          "ED.Rolls.formulaDevotion", {
            step: this.options.devotion.step,
            amount: this.options.devotion.pointsUsed
          }
        )
        : undefined,
    ];

    formulaParts.push( ...Object.entries(
      this.options.extraDice
    ).map(
      ( [label, step] ) => game.i18n.format(
        "ED.Rolls.formulaExtraStep",
        {
          label,
          step
        }
      )
    ) );

    return formulaParts.filterJoin(" + ");
  }

  /* -------------------------------------------- */
  /*  Modifying                                   */
  /* -------------------------------------------- */

  /**
   * Apply modifiers to make all dice explode.
   * @private
   */
  #configureModifiers() {
    this.dice.map((diceTerm) => {
      // Explodify all dice terms
      diceTerm.modifiers.push('X');
      return diceTerm;
    });

    // Mark configuration as complete
    this.options.configured = true;
  }

  /* -------------------------------------------- */

  /**
   * Add additional dice in groups, like karma, devotion or elemental damage.
   */
  #addExtraDice() {
    this.#addResourceDice('karma');
    this.#addResourceDice('devotion');
    this.#addExtraSteps();

    // Mark extra dice as complete
    this.options.extraDiceAdded = true;
  }

  /* -------------------------------------------- */

  /**
   * Add dice from a given resource step. Currently only karma or devotion.
   * @param {"karma"|"devotion"} type
   */
  #addResourceDice(type) {
    const pointsUsed = this.options[type]?.pointsUsed;
    if (pointsUsed > 0) {
      let diceTerm, newTerms;
      for (let i = 1; i <= pointsUsed; i++) {
        diceTerm = getDice(this.options[type].step);
        newTerms = Roll.parse(
          `+ (${diceTerm})[${game.i18n.localize(`ED.General.${type[0]}.${type}`)} ${i}]`,
          {}
        );
        this.terms.push( ...newTerms );
      }
      this.resetFormula();
    }
  }

  /* -------------------------------------------- */

  /**
   * Add the dice from extra steps (like "Flame Weapon" or "Night's Edge").
   */
  #addExtraSteps() {
    if ( !isEmpty( this.options?.extraDice ) ) {
      Object.entries( this.options.extraDice ).forEach( ( [label, step] ) => {
        const diceTerm = getDice( step );
        const newTerms = Roll.parse(
          `+ (${diceTerm})[${label}]`,
          {}
        );
        this.terms.push( ...newTerms );
      } );
      this.resetFormula();
    }
  }

  /* -------------------------------------------- */
  /*  Chat Messages                               */
  /* -------------------------------------------- */

  /**
   * Prepare the roll data for rendering the flavor template.
   * @returns {object}
   */
  getFlavorTemplateData() {
    const templateData = {};

    templateData.customFlavor = this.options.chatFlavor;
    templateData.step = this.options.step;
    templateData.target = this.options.target;
    templateData.rollType = ED4E.rollTypes[this.options.rollType].label;
    templateData.difficulty = this.options.target?.total ?? 1;
    templateData.numSuccesses = this.numSuccesses ?? 0;
    templateData.numExtraSuccesses = this.numExtraSuccesses ?? 0;
    templateData.ruleOfOne = this.isRuleOfOne;

    return templateData;
  }

  /* -------------------------------------------- */

  /**
   * Create the `rolls` part of the tooltip for displaying dice icons with results.
   * @param {DiceTerm[]} diceTerms An array of dice terms with multiple results to be combined
   * @returns {{}[]} The desired classes
   */
  #getTooltipsRollData( diceTerms ) {
    const rolls = diceTerms.map( diceTerm => {
      return diceTerm.results.map( r => {
        return {
          result: diceTerm.getResultLabel( r ),
          classes: diceTerm.getResultCSS( r ).filterJoin(" ")
        }
      } )
    } );

    return rolls.flat( Infinity );
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  async getTooltip() {
    const partsByFlavor = this.dice.reduce( ( acc, diceTerm ) => {
      const key = diceTerm.flavor;
      acc[key] = acc[key] ?? [];
      acc[key].push( diceTerm );
      return acc;
    }, {} );

    // Sort the dice terms of each part by size of the dice
    Object.values( partsByFlavor ).forEach(
      diceList => diceList.sort(
        ( a, b ) => a.faces - b.faces
      )
    );

    const parts = Object.keys( partsByFlavor ).map( part => {
      return {
        formula: partsByFlavor[part].map( d => d.expression ).join( " + " ),
        total: sum( partsByFlavor[part].map( d => d.total ) ),
        faces: undefined,
        flavor: part,
        rolls: this.#getTooltipsRollData( partsByFlavor[part] )
      }
    } );

    return renderTemplate( this.constructor.TOOLTIP_TEMPLATE, { parts } );
  }

  /* -------------------------------------------- */

  /**
   * Render a Roll instance to HTML
   * @param {object} [options={}]                  Options which affect how the Roll is rendered
   * @param {string} [options.flavor]              Flavor text to include
   * @param {string} [options.template]            A custom HTML template path
   * @param {boolean} [options.isPrivate=false]    Is the Roll displayed privately?
   * @returns {Promise<string>}                    The rendered HTML template as a string
   */
  async render({flavor, template=this.constructor.CHAT_TEMPLATE, isPrivate=false}={}) {
    if ( !this._evaluated ) await this.evaluate({async: true});
    const chatData = {
      formula: isPrivate ? "???" : this.#stepsFormula,
      flavor: isPrivate ? null : flavor,
      user: game.user.id,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      total: isPrivate ? "?" : Math.round(this.total * 100) / 100
    };
    return renderTemplate(template, chatData);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async toMessage(messageData = {}, options = {}) {
    if (!this._evaluated) await this.evaluate({ async: true });

    messageData.flavor = await this.chatFlavor;

    return super.toMessage(messageData, options);
  }
}