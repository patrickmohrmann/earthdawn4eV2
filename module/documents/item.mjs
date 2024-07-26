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

    /**
     * @param {Object} data         The data of the item to be created.
     * @param {Object} options      The options of the item to be created.
     * @param {Object} user         The user creating the item.
     * @returns                     The created item.
     * @UserFunction                UF_ActorItems-preCreate
     */
    async _preCreate(data, options, user) {
      if (!this.actor || !data) return;
    
      // Set talent identifier for talent type items.
      if (data.type === "talent") {
        if (data.name && data.system) {
          const { name, system: { strain, attribute, action } } = data;
          const globalTalentidentifier = `${name}-${strain}-${attribute}-${action}`;
          this.updateSource({ "system.talentIdentifier": globalTalentidentifier });
        }
    
        // Handle noPrompt option or versatility directly.
        if (options.noPrompt === true) {
          this.updateSource({
            "system.talentCategory": options.talentCategory,
            "system.tier": options.tier,
            "system.sourceClass.identifier": options.classIdentifier,
            "system.sourceClass.levelAdded": options.classLevel,
          });
        } else if (data.system.edid === "versatility") {
          this.updateSource({ "system.talentCategory": "versatility" });
        }
        } else {
          const dropItemResult = await ed4eDropItem(this.actor, data);
          await this.handleDropItemResult(dropItemResult, data);
        }
      
    
      return super._preCreate(data, options, user);
    }
    
    /**
     * 
     * @param {Object} dropItemResult   The result of the drop item dialog.
     * @param {Object} data             The data of the item to be created.
     * @returns 
     * @UserFunction                    UF_ActorItems-handleDropItemResult
     */
    async handleDropItemResult(dropItemResult, data) {
      if (["spend", "free", "versatility", "discipline", "optional"].includes(dropItemResult.bookingResult)) {
        await this.actor.addItemLpTransaction(data, dropItemResult.validationData, dropItemResult.bookingResult);
        await this.updateCategoryAndTier(dropItemResult, data);
      } else if (dropItemResult.bookingResult === "addDiscipline") {
        this.updateSource({
          "system.talentCategory": "discipline",
          "system.disciplineIndex": dropItemResult.validationData.disciplineIndex,
          "system.level": 0
        });
      } else if (dropItemResult.bookingResult === "cancel") {
        return false;
      }
    }
    
    /**
     * @param {Object} dropItemResult   The result of the drop item dialog.
     * @param {Object} data             The data of the item to be created.
     * @returns 
     * @UserFunction                    UF_ActorItems-updateTalentCategoryAndTier
     */
    async updateCategoryAndTier(dropItemResult, data) {
      const category = dropItemResult.bookingResult;
      if (category === "versatility" && data.system.edid !== "versatility") {
        const tierSelection = await this.promptForTierSelection();
        if (tierSelection) {
          this.updateSource({ "system.tier": tierSelection, "system.talentCategory": "versatility" });
        } else {
          return false; // User cancelled tier selection.
        }
      } else {
        this.updateSource({ "system.talentCategory": category });
      }
    }
    
    /**
     * @returns {Promise<string>} The selected tier.
     * @UserFunction              UF_ActorItems-promptForTierSelection
     */
    async promptForTierSelection() {
      return new Promise((resolve) => {
        new Dialog({
          title: "Select Tier",
          content: `<form>
                      <div class="form-group">
                        <label for="tier">Tier:</label>
                        <select id="tier" name="tier">
                          <option value="journeyman">${game.i18n.localize('ED.Config.Tier.journeyman')}</option>
                          <option value="warden">${game.i18n.localize('ED.Config.Tier.warden')}</option>
                          <option value="master">${game.i18n.localize('ED.Config.Tier.master')}</option>
                        </select>
                      </div>
                    </form>`,
          buttons: {
            ok: {
              label: "Confirm",
              callback: (html) => resolve(html.find("#tier").val())
            }
          },
          default: "ok",
          close: () => resolve(null)
        }).render(true);
      });
    }
  }