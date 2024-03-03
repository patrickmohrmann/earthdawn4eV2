import ED4E from "./config.mjs";
import EdRoll from "./dice/ed-roll.mjs";
import EdRollOptions from "./data/other/roll-options.mjs";
import getDice from "./dice/step-tables.mjs";

/**
 * Set up custom enrichers.
 */
export function registerCustomEnrichers() {
  CONFIG.TextEditor.enrichers.push(
    {
      pattern: /@(?<type>roll)\(\s*(?<rollCmd>\/s\s*\d+(?:\s*\+\s*\d+)?)\s*\)(?:\((?<flavor>(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+\s?)*)\))?(?:\((?<rollType>action|effect|damage)\))?/gi,
      enricher: enrichString,
    },
  );

  document.body.addEventListener( "click", rollAction );
}

/* -------------------------------------------- */

/**
 * Parse the enriched string and provide the appropriate content.
 * @param {RegExpMatchArray} match       The regular expression match result.
 * @param {EnrichmentOptions} options    Options provided to customize text enrichment.
 * @returns {Promise<HTMLElement|null>}  An HTML element to insert in place of the matched text or null to
 *                                       indicate that no replacement should be made.
 */
async function enrichString(match, options) {
  switch ( match.groups.type.toLowerCase() ) {
    case "roll": return enrichRoll( match, options );
  }
  return null;
}

/* -------------------------------------------- */

/**
 * Parse the embedded roll and provide the appropriate content.
 * @param match           The regular expression match result.
 * @param options         Options provided to customize text enrichment.
 * @return {HTMLElement|null}   An HTML link if the check could be built, otherwise null.
 */
async function enrichRoll( match, options ) {

  const rollCmd = match.groups.rollCmd;
  const rollFlavor = match.groups.flavor;
  const rollType = match.groups.rollType ?? 'arbitrary';

  const textRollFormula = rollCmd.replace(
    "/s",
    game.i18n.localize( "ED.General.step"
    ) );
  const textRollType = (rollType === 'arbitrary')
    ? ""
    : `${ED4E.rollTypes[rollType].label}:&nbsp;`;

  const rollElement = `
            <a class="journal--roll strong" data-roll-cmd="${rollCmd}" data-roll-flavor="${rollFlavor}" 
              data-roll-type="${rollType}" title="${game.i18n.localize( "X.Click to roll" )}">
              <i class="fas fa-regular fa-dice"></i>
              ${textRollType}${textRollFormula}&nbsp;${rollFlavor}
            </a>`

  return $( rollElement )[0];
}

/* -------------------------------------------- */

/**
 * Perform the provided roll action.
 * @param {Event} event     The click event triggering the action.
 * @returns {Promise|void}
 */
async function rollAction( event ) {
  const target = event.target.closest('.journal--roll');
  if ( !target ) return;
  event.stopPropagation();

  // replace all whitespace in the roll formula
  const [step, modifier] = target.dataset.rollCmd.replaceAll( /\s*/g, "" ).replace( "/s", "" ).split( "+" );
  const formula = getDice( step ).trim();
  let roll; 
  if ( modifier ) {
    roll = new EdRoll(
    `(${formula} + ${modifier})[${target.dataset.flavor}]`,
    {},
    new EdRollOptions( {
      step: {
        base: step,
      },
      chatFlavor: target.dataset.rollFlavor,
      rollType: target.dataset.rollType,
    } )
  );
  } else {
    roll = new EdRoll(
      `${formula}[${target.dataset.flavor}]`,
      {},
      new EdRollOptions( {
        step: {
          base: step,
        },
        chatFlavor: target.dataset.rollFlavor,
        rollType: target.dataset.rollType,
      } )
    );
  }

  return roll.toMessage();
}