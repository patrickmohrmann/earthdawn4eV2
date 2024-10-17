/**
 * @param {string} message  The message to display.
 * @param {Array} options  The options to display.
 * @param {string} type The type of the notification.
 * @returns {Promise<Notification>}   The rendered notification.
 * @UserFunction    UF_Notification-notify
 */
export async function notify( message, options, type ) {
  if ( !message ) {
    return;
  }

  const messageFlavor = game.i18n.format( `ED.Notifications.${type}.${message}`, {
    options: options ? options : "",
  } );

  switch ( type ) {
    case "warn":
      ui.notifications.warn( game.i18n.localize( messageFlavor ) );
      break;
    case "info":
      ui.notifications.info( game.i18n.localize( messageFlavor ) );
      break;
    case "error":
      ui.notifications.error( game.i18n.localize( messageFlavor ) );
      break;
    default:
      ui.notifications.info( game.i18n.localize( messageFlavor ) );
      break;
  }
}