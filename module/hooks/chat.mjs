import EdRollOptions from "../data/other/roll-options.mjs";
import PcData from "../data/actor/pc.mjs";
import LpTransactionData from "../data/advancement/lp-transaction.mjs";


const cmdMapping = {
  char: triggerCharGen,
  coin: triggerCoinAward,
  group: triggerCrCalc,
  h: triggerHelp,
  help: triggerHelp,
  lp: triggerLPAward,
  s: triggerRollStep,
};

export default function () {
  /**
   * Primary use of this hook is to intercept chat commands.
   * /char Triggers Character Generation
   * /coin Triggers awarding Silver for players
   * /group Triggers Group calculation for Challenging rates
   * /help - Display a help message on all the commands above
   * /lp Triggers awarding legend points for players
   * /s Triggers Step roll
   */
  Hooks.on('chatMessage', (html, content, msg) => {
    if (!Object.keys(CONFIG.ED4E.chatCommands).some((cmd) => content.startsWith(`/${cmd.toLowerCase()}`))) {
      // No ED command, continue Foundry workflow
      return true;
    }

    // Setup new message's visibility
    let rollMode = game.settings.get('core', 'rollMode');
    if (['gmroll', 'blindroll'].includes(rollMode))
      msg['whisper'] = ChatMessage.getWhisperRecipients('GM').map((u) => u.id);
    if (rollMode === 'blindroll') msg['blind'] = true;

    const cmdRegExp = /(?<command>\/\w+)(?<arguments>.*)/;
    const commandMatches = content.match(cmdRegExp);

    return cmdMapping[commandMatches.groups.command.substring( 1 )]( commandMatches.groups.arguments.trim());
  } );

  Hooks.on( "renderChatMessage", ( msg, html, msgData ) => {
    // Add character portrait to message
    addUserPortrait( msg, html );

    // Add class for highlighting success/failure on roll messages
    if ( msg.rolls[0] ) msg.rolls[0].addSuccessClass( html );
  })
}

/* -------------------------------------------- */
/*  Chat Commands                               */
/* -------------------------------------------- */

function triggerCharGen(argString) {
  PcData.characterGeneration();
  return false;
}

/* -------------------------------------------- */

function triggerCoinAward(argString) {
  ui.notifications.warn( game.i18n.localize( 'X.NotImplementedYet' ) );
  return false;
}

/* -------------------------------------------- */

function triggerCrCalc(argString) {
  ui.notifications.warn( game.i18n.localize( 'X.NotImplementedYet' ) );
  return false;
}

/* -------------------------------------------- */

function triggerHelp(argString) {
  const helpText =
    CONFIG.ED4E.chatCommands[argString.toLowerCase()] ??
    `X.localize<br>
    /char Triggers Character Generation<br>
    /coin Triggers awarding Silver for players<br>
    /group Triggers Group calculation for Challenging rates<br>
    /help - Display a help message on all the commands above<br>
    /lp Triggers awarding legend points for players<br>
    /s Triggers Step roll<br>
    `;

  ChatMessage.create({
    content: helpText,
  });

  return false;
}

/* -------------------------------------------- */
/**
 * /char triggers legend point assignment prompt 
 * @param {*} argString 
 * @returns 
 * @UF UF_LpTracking-triggerLPAward
 */
function triggerLPAward(argString) {
  LpTransactionData.assignLpPrompt();
  // ui.notifications.warn( game.i18n.localize( 'X.NotImplementedYet' ) );
  return false;
}

/* -------------------------------------------- */
/**
 * @description             /s triggers a step roll
 * @param {*} argString     The string of arguments passed to the command
 * @returns                 
 * @UserFunction            UF_Rolls-triggerRollStep     
 */
function triggerRollStep(argString) {
  const argRegExp = /(\d+)(?=\s*\+?\s*)/g;
  const steps = argString.match(argRegExp);

  if (!steps) return true;

  steps.forEach((currentStep) =>
    new ed4e.dice.EdRoll(
      undefined,
      {},
      new EdRollOptions( {
        step: {
          total: Number(currentStep)
        }
      } )
    ).toMessage(),
  );
  return false;
}

/* -------------------------------------------- */
/*  Message Styling                             */
/* -------------------------------------------- */

function addUserPortrait( msg, jquery ) {

  const chatAvatarSetting = game.settings.get( "ed4e", "chatAvatar" );
  const isGM = msg.author.isGM;
  const avatar_img = msg.author.avatar;
  const token = canvas.tokens?.controlled[0];
  const token_img =  ( isGM || token?.document.isOwner ) ? token?.document.texture.src : undefined;
  const is_config_setting = chatAvatarSetting === "configuration";

  let avatar = is_config_setting ? avatar_img : undefined;
  avatar ??= token_img;
  avatar ??= isGM ? avatar_img : msg.author.character?.img;

  if ( avatar ) {
    jquery.find( ".message-header" ).prepend(
      `<img src="${avatar}" class="avatar">`
    );
  }
}

