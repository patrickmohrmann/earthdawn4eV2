const cmdMapping = {
  char: triggerCharGen,
  coin: triggerCoinAward,
  group: triggerCRcalc,
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
    if (!Object.keys(CONFIG.ED4E.chatCommands).some((cmd) => content.startsWith(`/${cmd}`))) {
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

    return cmdMapping[commandMatches.groups.command.substring(1)](commandMatches.groups.arguments);
  });
}

function triggerCharGen(argString) {
  ui.warn(game.i18n.localize('X.NotImplementedYet'));
}

function triggerCoinAward(argString) {
  ui.warn(game.i18n.localize('X.NotImplementedYet'));
}

function triggerCRcalc(argString) {
  ui.warn(game.i18n.localize('X.NotImplementedYet'));
}

function triggerHelp(argString) {
  ui.warn(game.i18n.localize('X.NotImplementedYet'));
}

function triggerLPAward(argString) {
  ui.warn(game.i18n.localize('X.NotImplementedYet'));
}

function triggerRollStep(argString) {
  const argRegExp = /(\d+)(?=\s*\+?\s*)/g;
  const steps = argString.match(argRegExp);

  if (!steps) return true;

  steps.forEach((currentStep) =>
    new ed4e.dice.EdRoll(undefined, {}, { step: { total: Number(currentStep) } }).toMessage(),
  );

  return false;
}