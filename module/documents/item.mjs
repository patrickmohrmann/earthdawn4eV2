import { DocumentCreateDialog } from "../applications/global/document-creation.mjs";

/**
 * Extend the base Item class to implement additional system-specific logic.
 */
export default class ItemEd extends Item {

    /** @inheritDoc */
    static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
        return DocumentCreateDialog.waitPrompt( data, { documentCls: Item, parent, pack, options } );
    }

    /**
     * Update this items weight and name based on the given namegiver item. Uses the namegiver weight multiplier to
     * recalculate this item's weight. If successful, set a flag to indicate it's been calculated. Has to be unset
     * manually, otherwise another call of this function will not execute and instead display a warning.
     * @param {ItemEd} namegiver The namegiver whose name and weight multiplier should be used.
     * @returns {Promise<void>}
     */
    async tailorToNamegiver( namegiver ) {
        if ( this.isOwned && !this.system.weight.weightCalculated && namegiver ) {
            const updateData = {
                "name": `${this.name} (${namegiver.name})`,
                "system.weight.value": namegiver.system.weightMultiplier * this.system.weight.value,
                "system.weight.weightCalculated": true,
                "system.weight.weightMultiplier": namegiver.system.weightMultiplier,
            }
            await this.update( updateData );
            this.render( true );
        } else if ( this.system.weight.weightCalculated ) {
            ui.notifications.warn( game.i18n.localize( "X.cantUpdateItemWeight" ) );
        }
    }

    async addAdvancementAbilities( abilityUUIDs, poolType, level ) {
        const abilities = await Promise.all(
          abilityUUIDs.map( uuid => fromUuid( uuid ) )
        );
        const abilityIDs = abilities.map(
          ability => ability.id
        );

        if ( level ) {
            this.system.advancement.levels[level - 1].addAbilities(
              abilities,
              poolType
            );
        } else {
            this.system.advancement.addAbilities(
              abilities,
              poolType
            );
        }
    }

    async removeAdvancementAbility( abilityUUIDs, poolType, level ) {
        if ( level ) {
            this.system.advancement.levels[level - 1].removeAbilities(
              abilityUUIDs,
              poolType
            );
        } else {
            this.system.advancement.removeAbilities(
              abilityUUIDs,
              poolType
            );
        }
    }
}