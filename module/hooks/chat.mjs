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

    return cmdMapping[commandMatches.groups.command.substring(1)](commandMatches.groups.arguments.trim());
  });
}

function triggerCharGen(argString) {
  ui.notifications.warn(game.i18n.localize('X.NotImplementedYet'));
  return false;
}

function triggerCoinAward(argString) {
  ui.notifications.warn(game.i18n.localize('X.NotImplementedYet'));
  return false;
}

function triggerCrCalc(argString) {
  ui.notifications.warn(game.i18n.localize('X.NotImplementedYet'));
  return false;
}

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

function triggerLPAward(argString) {
  ui.notifications.warn( game.i18n.localize( "X.NotImplementedYet" ) );
  return false;
}

/**
 * this triggers the chat command to roll steps using /s 
 * @param {*} argString roll Options 
 * @returns { number } step
 */
function triggerRollStep(argString) {
  const argRegExp = /(\d+)(?=\s*\+?\s*)/g;
  const steps = argString.match( argRegExp );

  if ( !steps ) return true;

  steps.forEach( ( currentStep ) =>
    new ed4e.dice.EdRoll( undefined, {}, { step: { total: Number( currentStep ) }, rollType: "arbitraryChat", chatFlavor: game.i18n.localize( "X.arbitraryChatRoll" ) } ).toMessage(  ),
   );

  return false;
}