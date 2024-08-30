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
 * @UseCase                                     UC_EdRoll  
 */
export default class EdRoll extends Roll {

  /* -------------------------------------------- */
  /*  Constructor and Fields                      */
  /* -------------------------------------------- */

  constructor( formula = undefined, data = {}, edRollOptions = {}, options = {} ) {
    // us ternary operator to also check for empty strings, nullish coalescing operator (??) only checks null or undefined
    const baseTerm = formula
      ? formula
      : // : ( `${getDice( step )}[${game.i18n.localize( "ED.General.S.step" )} ${step}]` );
      `(${getDice( edRollOptions.step.total )})[${game.i18n.localize( "ED.Rolls.step" )} ${
        edRollOptions.step.total
      }]`;
    super( baseTerm, data, edRollOptions );

    /// das muss umgebogen werden ich muss hier die rollTypes als subtyes von den test types sehen.
    if( this.options.rollType === "attack") {
      this.flavorTemplate = ED4E.rollTypes.attack.flavorTemplate;
    } else {

    this.flavorTemplate = ED4E.testTypes[this.options.testType]?.flavorTemplate ?? ED4E.testTypes.arbitrary.flavorTemplate;
    }
    if ( !this.options.extraDiceAdded ) this.#addExtraDice();
    if ( !this.options.configured ) this.#configureModifiers();
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  static TOOLTIP_TEMPLATE = "systems/ed4e/templates/chat/tooltip.hbs";

  /* -------------------------------------------- */
  /*  Getter and Setter                           */
  /* -------------------------------------------- */

  /**
   * Return the total result of the Roll expression if it has been evaluated. This
   * always evaluates to at least 1.
   * @type {number}
   * @UserFunction                      UF_Rolls-total
   */
  get total() {
    return this.options.hasOwnProperty( "rollType" )
      ? Math.max( super.total, 1 )
      : super.total;
  }

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
   * @description                       Is this roll an automatic fail? True, if at least 2 dice, no effect test, and all dice are 1.
   * @type { boolean|undefined }
   * @UserFunction                      UF_Rolls-ruleOfOne
   */
  get isRuleOfOne() {
    if ( !this.validEdRoll || !this._evaluated ) return undefined;
    // more than one die required
    if ( this.numDice < 2 ) return false;
    return this.total === this.numDice;
  }

  /* -------------------------------------------- */

  /**
   * @description                       Is this roll a success? True, if at least one success and arbitrary or action test.
   * @type { boolean|undefined }
   * @UserFunction                      UF_Rolls-isSuccess
   */
  get isSuccess() {
    if ( !this.validEdRoll || !this._evaluated || !["arbitrary", "action"].includes( this.options.testType ) ) return undefined;
    if ( this.isRuleOfOne === true ) return false;
    return this.numSuccesses > 0;
  }

  /* -------------------------------------------- */

  /**
   * Is this roll a failure? True, if zero successes and arbitrary or action test.
   * @type { boolean|undefined }
   * @UserFunction                      UF_Rolls-isFailure
   */
  get isFailure() {
    if ( !this.validEdRoll || !this._evaluated || !["arbitrary", "action"].includes( this.options.testType ) ) return undefined;
    if ( this.isRuleOfOne === true ) return true
    return this.numSuccesses <= 0;
  }

  /* -------------------------------------------- */

  /**
   * @description                    The number of dice in this roll.
   * @type { number }
   * @UserFunction                    UF_Rolls-numDice
   */
  get numDice() {
    // must be evaluated since dice can explode and add more dice
    if ( !this.validEdRoll || !this._evaluated ) return undefined;
    return this.dice
      .map( ( diceTerm ) => diceTerm.number )
      .reduce( ( accumulator, currentValue ) => accumulator + currentValue, 0 );
  }

  /* -------------------------------------------- */

  /**
   * @description                     the number of total strain in this roll
   * @type {number}
   * @UserFunction                    UF_Rolls-totalStrain
   */
  get totalStrain() {
    if ( !this.validEdRoll ) return undefined;
    return this.options.strain.total
  }

  /* -------------------------------------------- */

  /**
   * @description                     The number of successes in this roll. Only available if a target number is specified and the roll is evaluated.
   * @type {number}
   * @UserFunction                    UF_Rolls-numSuccesses
   */
  get numSuccesses() {
    if ( !this.validEdRoll || !this._evaluated || !this.options.target || this.options.target.total < 0 ) return undefined;
    return this.total < this.options.target?.total
      ? 0
      : Math.trunc( ( this.total - this.options.target.total ) / 5 ) + 1;
  }

  /* -------------------------------------------- */

  /**
   * @description                     The number of extra successes in this roll. Only available if a target number is specified and the roll is evaluated.
   * @type {number}
   * @UserFunction                    UF_Rolls-numExtraSuccesses
   */
  get numExtraSuccesses() {
    if ( !this.validEdRoll || !this._evaluated || !this.options.target || this.options.target.total < 0 ) return undefined;
    return this.numSuccesses < 1 ? 0 : this.numSuccesses - 1;
  }

  /* -------------------------------------------- */

  /**
   * @description                     The text that is added to this roll's chat message when calling `toMessage`.
   * @type {Promise<string>}
   * @UserFunction                    UF_Rolls-getChatFlavor
   */
  get chatFlavor() {
    return renderTemplate( this.flavorTemplate, this.getFlavorTemplateData() );
  }

  /* -------------------------------------------- */

  /**
   * @description                     Set the text of this roll's chat message.
   * @type {string}
   * @UserFunction                    UF_Rolls-setChatFlavor
   */
  set chatFlavor( flavor ) {
    this.options.updateSource( {
      chatFlavor: flavor,
    } );
  }


  /* -------------------------------------------- */

  /**
   * Add the actors maneuver.
   */
  get actorManeuver() {
    if ( this.options.rollType === "attack" ) {
      const actor = game.actors.get(this.options.actor.id);
      const maneuver = actor.items.filter( ( item ) => item.type === "knackManeuver" );
      return maneuver;
    }
  }

  /* -------------------------------------------- */

  /**
   * Add the target tokens reactions.
   */
  get targetReactions() {
    if ( this.options.rollType === "attack" ) {
      const targetsTokens = this.options.targetTokens; 
      let reactions = [];
      for ( const target of targetsTokens ) {

        const findActor = canvas.scene?.tokens.get(target.id)?.actor
        if ( !findActor ) return;
        const targetReactions = findActor.items.filter( ( item ) => item.system.reaction?.reactionType === "physical" );
        reactions.push( { actor: findActor.id, name: findActor.name, reactions: targetReactions, img: findActor.img} );
      }
      return reactions
    }
    
  }

  /* -------------------------------------------- */

  /**
   * @description                     Returns the formula string based on strings instead of dice.
   * @type {string}
   * @UserFunction                    UF_Rolls-stepsFormula
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

    return formulaParts.filterJoin( " + " );
  }

  /* -------------------------------------------- */
  /*  Modifying                                   */
  /* -------------------------------------------- */

  /**
   * @description           Apply modifiers to make all dice explode.
   * @private
   * @UserFunction          UF_Rolls-explodingDice
   */
  #configureModifiers() {
    this.dice.map( ( diceTerm ) => {
      // Explodify all dice terms
      diceTerm.modifiers.push( 'X' );
      return diceTerm;
    } );

    // Mark configuration as complete
    this.options.configured = true;
  }

  /* -------------------------------------------- */

  /**
   * @description             Add additional dice in groups, like karma, devotion or elemental damage.
   * @UserFunction            UF_Rolls-addExtraDice
   */
  #addExtraDice() {
    this.#addResourceDice( "karma" );
    this.#addResourceDice( "devotion" );
    this.#addExtraSteps();

    // Mark extra dice as complete
    this.options.extraDiceAdded = true;
  }

  /* -------------------------------------------- */

  /**
   * @description             Add dice from a given resource step. Currently only karma or devotion.
   * @param {"karma"|"devotion"} type
   * @UserFunction            UF_Rolls-addResourceDice
   */
  #addResourceDice( type ) {
    const pointsUsed = this.options[type]?.pointsUsed;
    if ( pointsUsed > 0 ) {
      let diceTerm;
      let newTerms;
      for ( let i = 1; i <= pointsUsed; i++ ) {
        diceTerm = getDice( this.options[type].step );
        newTerms = Roll.parse(
          `(${diceTerm})[${game.i18n.localize( `ED.Rolls.${type}` )} ${i}]`,
          {}
        );
        this.terms.push( new foundry.dice.terms.OperatorTerm( {operator: "+"} ), ...newTerms );
      }
      this.resetFormula();
    }
  }

  /* -------------------------------------------- */

  /**
   * @description                   Add the dice from extra steps (like "Flame Weapon" or "Night's Edge").
   * @UserFunction                  UF_Rolls-addExtraSteps
   */
  #addExtraSteps() {
    if ( !foundry.utils.isEmpty( this.options?.extraDice ) ) {
      Object.entries( this.options.extraDice ).forEach( ( [label, step] ) => {
        const diceTerm = getDice( step );
        const newTerms = Roll.parse(
          `(${diceTerm})[${label}]`,
          {}
        );
        this.terms.push( new foundry.dice.terms.OperatorTerm( {operator: "+"} ), ...newTerms );
      } );
      this.resetFormula();
    }
  }

  

  /* -------------------------------------------- */
  /*  Chat Messages                               */
  /* -------------------------------------------- */

  /**
   * @description                       Prepare the roll data for rendering the flavor template.
   * @returns {object}
   * @UserFunction                      UF_Rolls-getFlavorTemplateData
   */
  getFlavorTemplateData() {
    const templateData = {};

    templateData.roller = game.user.character?.name
      ?? canvas.tokens?.controlled[0]
      ?? game.user.name;
    templateData.customFlavor = this.options.chatFlavor;
    templateData.result = this.total;
    templateData.step = this.options.step;
    templateData.target = this.options.target;
    templateData.testType = ED4E.testTypes[this.options.testType].label;
    templateData.ruleOfOne = this.isRuleOfOne;
    templateData.success = this.isSuccess;
    templateData.failure = this.isFailure;
    templateData.numSuccesses = this.numSuccesses ?? 0;
    templateData.numExtraSuccesses = this.numExtraSuccesses ?? 0;
    templateData.targetReactions = this.targetReactions;
    templateData.actorManeuver = this.actorManeuver;

    return templateData;
  }

  /* -------------------------------------------- */


  /* -------------------------------------------- */

  /**
   * @description                       Add a success or failure class to the dice total.
   * @param {JQuery} jquery
   * @UserFunction                      UF_Rolls-addSuccessClass
   */
  addSuccessClass( jquery, success, setSuccess ) {
    if ( setSuccess === true ) {
      if (success === true) {
        jquery.find( ".dice-total" ).addClass( "roll-success" );
      } else if ( success === false ) {
        jquery.find( ".dice-total" ).addClass( "roll-failure" );
      }
    } else {
      jquery.find( ".dice-total" ).addClass(
        this.isSuccess ? "roll-success" : "roll-failure"
      );
    }
  }

  /* -------------------------------------------- */

/**
 * @description                       Check if the roll is a success and set options.isSuccess accordingly.
 */
checkAndSetSuccess() {
  if (this.isSuccess) {
    this.options.success = true;
  }
}



  /* -------------------------------------------- */

  /**
   * @description                         Create the `rolls` part of the tooltip for displaying dice icons with results.
   * @param {DiceTerm[]} diceTerms        An array of dice terms with multiple results to be combined
   * @returns {{}[]}                      The desired classes
   * @UserFunction                        UF_Rolls-getTooltipsRollData
   */
  #getTooltipsRollData( diceTerms ) {
    const rolls = diceTerms.map( diceTerm => {
      return diceTerm.results.map( r => {
        return {
          result: diceTerm.getResultLabel( r ),
          classes: diceTerm.getResultCSS( r ).filterJoin( " " )
        }
      } )
    } );

    return rolls.flat( Infinity );
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   * @UserFunction                    UF_Rolls-getTooltip 
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
   * @description                                   Render a Roll instance to HTML
   * @param {object} [options={}]                   Options which affect how the Roll is rendered
   * @param {string} [options.flavor]               Flavor text to include
   * @param {string} [options.template]             A custom HTML template path
   * @param {boolean} [options.isPrivate=false]     Is the Roll displayed privately?
   * @returns {Promise<string>}                     The rendered HTML template as a string
   * @UserFunction                                  UF_Rolls-render
   */
  async render( {flavor, template=this.constructor.CHAT_TEMPLATE, isPrivate=false}={} ) {
    if ( !this._evaluated ) await this.evaluate();
    const chatData = {
      formula: isPrivate ? "???" : this.#stepsFormula,
      flavor: isPrivate ? null : flavor,
      user: game.user.id,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      total: isPrivate ? "?" : Math.round( this.total * 100 ) / 100
    };
    return renderTemplate( template, chatData );
  }

  /* -------------------------------------------- */

  /** @inheritDoc 
   * @UserFunction                                  UF_Rolls-toMessage
  */
  async toMessage( messageData = {}, options = {} ) {
    if ( !this._evaluated ) await this.evaluate();
    console.log( "ROLLRESULT",this );
    messageData.flavor = await this.chatFlavor;
    // if ( this.isSuccess === true ){
    //   messageData.system.isSuccess = true;
    // }
    this.checkAndSetSuccess();
    return super.toMessage( messageData, options );
  }
}