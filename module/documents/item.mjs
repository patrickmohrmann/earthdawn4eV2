/**
 * Extend the base Item class to implement additional system-specific logic.
 */
export default class ItemEd extends Item {

    async weightCalculation( item, namegiver ) {
    if ( item.isOwned && !item.system.weight.weightCalculated && namegiver ) {
        const updateData = {
          "name": `${item.name} (${namegiver.name})`,
          "system.weight.value": namegiver.system.weightMultiplier * item.system.weight.value,
          "system.weight.weightCalculated": true,
          "system.weight.weightMultiplier": namegiver.system.weightMultiplier,
        }
        await item.update( updateData );
        this.render( true );
      } else if ( item.system.weight.weightCalculated ) {
        ui.notifications.warn( game.i18n.localize( "X.cantUpdateItemWeight" ) );
      }
    }
}