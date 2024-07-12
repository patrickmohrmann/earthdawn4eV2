import { DocumentCreateDialog } from "../applications/global/document-creation.mjs";
import ed4eDropItem from "../applications/global/drop-items.mjs";
import AdvancementLevelData from "../data/advancement/advancement-level.mjs";

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

    async updateKnackSourceForItems( items, actorUuid ) {
        const validTypes = ['knackAbility', 'knackKarma', 'knackManeuver'];
        for (let item of items) {
            if (validTypes.includes(item.type)) {
          // Check if 'Actor' is not part of the item.system.source.knackSource
          if (!item.system.source.knackSource.includes("Actor")) {
            // Prepend this.uuid to the knackSource
            item.system.source.knackSource = actorUuid + item.system.source.knackSource;
            
            // Assuming there's a method to save or update the item after modification
            await item.save();
          }
        }
      }
    }

    async addAdvancementAbilities( abilityUUID, poolType, level ) {
        let changes;
        if ( level ) {
            const levelIndex = level - 1 ;
            const levelModel = new AdvancementLevelData(
              this.system.advancement.levels[levelIndex].toObject()
            );
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
            changes = {
                "system.advancement.levels": newLevels,
            };
        } else {
            const abilitiesPool = this.system.advancement.abilityOptions[poolType];
            changes = {
                [`system.advancement.abilityOptions.${poolType}`]: abilitiesPool.concat( abilityUUID ),
            }
        }
        return this.update( changes );
    }

    async removeAdvancementAbility( abilityUUID, poolType, level ) {
        let changes;
        if ( level ) {
            const levelIndex = level - 1 ;
            const levelModel = new AdvancementLevelData(
              this.system.advancement.levels[levelIndex].toObject()
            );
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
            changes = {
                "system.advancement.levels": newLevels,
            };
        } else {
            const abilitiesPool = this.system.advancement.abilityOptions[poolType];
            const newPool = abilitiesPool.toSpliced(
              abilitiesPool.indexOf( abilityUUID ), 1
            );
            changes = {
                [`system.advancement.abilityOptions.${poolType}`]: newPool,
            }
        }
        return this.update( changes );
    }

    async _preCreate(data, options, user) {
        //const itemData = await fromUuid(data.uuid);
        const dropItemResult = await ed4eDropItem(this.actor, data);
        console.log("dropItem", dropItemResult);
    
        if (dropItemResult.bookingResult === "spend" 
            || dropItemResult.bookingResult === "free" 
            || dropItemResult.bookingResult === "versatility"
            || dropItemResult.bookingResult === "discipline"
            || dropItemResult.bookingResult === "optional") {
          await this.actor.addItemLpTransaction(data, dropItemResult.validationData, dropItemResult.bookingResult);
          if (dropItemResult.bookingResult === "versatility") {
            this.updateSource({"system.talentCategory": "versatility"});
          }
          if (dropItemResult.bookingResult === "discipline") {
            this.updateSource({"system.talentCategory": "discipline"});
          }
          if (dropItemResult.bookingResult === "free") {
            this.updateSource({"system.talentCategory": "free"});
          }
          if (dropItemResult.bookingResult === "optional") {
            this.updateSource({"system.talentCategory": "optional"});
          }
        } else if (dropItemResult.bookingResult === "cancel") {
          return false;
        }
        return super._preCreate(data, options, user);
      }
    
    }