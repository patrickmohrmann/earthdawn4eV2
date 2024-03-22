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

    // eslint-disable-next-line max-params
    async addPoolAbilities( abilityUUID, poolType, itemType, level ) {
        if ( itemType === "discipline" || itemType === "questor" || itemType === "path" ) {
            if ( level ) {
                const levelIndex = level - 1 ;
                const levelModel = this.system.advancement.levels[levelIndex];
                const abilities = levelModel.abilities;
                const abilitiesPool = abilities[poolType];
                levelModel.updateSource( {
                    abilities: {
                        ...abilities,
                        [poolType]: abilitiesPool.concat( abilityUUID ),
                    },
                } )

                const newLevels = this.system.advancement.levels.toSpliced(
                levelIndex, 1, levelModel
                );
                const changes = {
                    "system.advancement.levels": newLevels,
                };

                return this.update( changes );
            } else {
                const abilitiesPool = this.system.advancement.abilityOptions[poolType];
                const changes = {
                    [`system.advancement.abilityOptions.${poolType}`]: abilitiesPool.concat( abilityUUID ),
                }

                return this.update( changes );
            }
        } else if ( itemType === "namegiver" ) {
            const abilitiesPool = this.system.abilities[poolType];
                const changes = {
                    [`system.abilities.${poolType}`]: abilitiesPool.concat( abilityUUID ),
                }

                return this.update( changes );
        }
    }

    // eslint-disable-next-line max-params
    async removePoolAbility( abilityUUID, poolType, itemType, level ) {
        if ( level ) {
            const levelIndex = level - 1 ;
            const levelModel = this.system.advancement.levels[levelIndex];
            const abilities = levelModel.abilities;
            const abilitiesPool = abilities[poolType];
            const newPool = abilitiesPool.toSpliced(
              abilitiesPool.indexOf( abilityUUID ),1
            );
            levelModel.updateSource( {
                abilities: {
                    ...abilities,
                    [poolType]: newPool,
                },
            } )

            const newLevels = this.system.advancement.levels.toSpliced(
              levelIndex, 1, levelModel
            );
            const changes = {
                "system.advancement.levels": newLevels,
            };

            return this.update( changes );
        } else {
            const abilitiesPool = this.system.advancement.abilityOptions[poolType];
            const newPool = abilitiesPool.toSpliced(
              abilitiesPool.indexOf( abilityUUID ), 1
            );
            const changes = {
                [`system.advancement.abilityOptions.${poolType}`]: newPool,
            }

            return this.update( changes );
        }
    }
}