import ED4E from "../../config.mjs";

/**
 * @param {Object} item     The item to be upgraded
 * @param {Object} actor    The actor that owns the item
 * @returns 
 * @UserFunction            UF_LpTracking-validateAbilityUpgrade  
 */
export default async function validateAbilityUpgrade(item, actor) {
    const itemOldLevel = item.system.level;
      // add a system setting to turn the max level increase off #788 - turn off Legendpoint Restrictions with system Settings
      const maxLevels = {
        "skill": 10,
        "talent": 15,
        "devotion": 12
      };
      
      if (maxLevels[item.type] && itemOldLevel >= maxLevels[item.type]) {
        ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.maxIncreaseReached"));
        return;
      }

      const legendPointsCostConfig = ED4E.legendPointsCost;
      const tierMapping = {
        "novice": 0,
        "journeyman": 1,
        "warden": 2,
        "master": 3
      };

      let tier = tierMapping[item.system.tier] || 0;

      let multiDisciplineBonus = 0;
      if (item.type === "talent" && item.system.level === 0 && item.system.sourceClass.levelAdded === 1) {
        const parentDiscipline = await fromUuid(item.system.sourceClass.identifier);
        if (parentDiscipline && parentDiscipline.type === "discipline") {
          const disciplineItems = actor.items.filter(i => i.type === 'discipline' && i.id !== parentDiscipline.id);
          if (disciplineItems.length > 0) {
            const lowestDisciplineLevel = Math.min(...disciplineItems.map(i => i.system.level));
            if (lowestDisciplineLevel <= 4) {
              const bonusMapping = {1: 4, 2: 3, 3: 2, 4: 1};
              multiDisciplineBonus = parentDiscipline.system.disciplineIndex >= 2 ? bonusMapping[lowestDisciplineLevel] : 0;
            }
          }
        }
      }

      const offset = item.type === "skill" ? 2 : 1;
      const requiredLp = legendPointsCostConfig[itemOldLevel + offset + tier + multiDisciplineBonus];

      const validationData = {
        requiredLp: requiredLp,
        interaction: "upgrade",
      }

      return validationData
}