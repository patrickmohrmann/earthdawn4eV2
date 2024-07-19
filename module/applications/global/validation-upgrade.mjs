import ED4E from "../../config.mjs";

// import { ED4E } from "../../config.mjs";
export default async function validateAbilityUpgrade(item, actor) {
    const itemOldLevel = item.system.level;
      // add a system setting to turn the max level increase off #788 - turn off Legendpoint Restrictions with system Settings
      if ( item.type === "skill" && itemOldLevel >= 10 ) {
        ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.maxIncreaseReached"));
        return
      } else if ( item.type === "talent" && itemOldLevel >= 15 ) {
        ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.maxIncreaseReached"));
        return
      } else if ( item.type === "devotion" && itemOldLevel >= 12 ) {
        ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.maxIncreaseReached"));
        return
      }
      const legendPointsCostConfig = ED4E.legendPointsCost;
      let requiredLp = 0;
      let tier = 0;
      if ( item.system.tier === "novice" ) {
        tier = 0;
      } else if ( item.system.tier === "journeyman" ) {
        tier = 1;
      } else if ( item.system.tier === "warden" ) {
        tier = 2;
      } else if ( item.system.tier === "master" ) {
        tier = 3;
      }

      // find necessary bonus required for talent rank 1 of multi disciplines
      let multiDisciplineBonus = 0;
      if ( item.type === "talent" && item.system.level === 0 && item.system.sourceClass.levelAdded === 1) {
        const parentDiscipline = await fromUuid(item.system.sourceClass.identifier);
        const parentDisciplineIndex = parentDiscipline.system.disciplineIndex;
        const disciplineItems = actor.items.filter(item => item.type === 'discipline'&& item.id !== parentDiscipline.id);

        // Sort discipline items by level in ascending order
        const sortedDisciplineItems = disciplineItems.sort((a, b) => a.system.level - b.system.level);
        // The item with the lowest level
        const lowestDisciplineItem = sortedDisciplineItems[0];
        const lowestDisciplineLevel = lowestDisciplineItem.system.level;
        if ( lowestDisciplineLevel === 1 ) {
          if ( parentDisciplineIndex === 2 ) {
            multiDisciplineBonus = 4;
          } else if ( parentDisciplineIndex === 3 ) {
            multiDisciplineBonus = 4;
          } else if ( parentDisciplineIndex >= 4 ) {
            multiDisciplineBonus = 4;
          }
        } else if ( lowestDisciplineLevel === 2 ) {
          if ( parentDisciplineIndex === 2 ) {
            multiDisciplineBonus = 3;
          } else if ( parentDisciplineIndex === 3 ) {
            multiDisciplineBonus = 3;
          } else if ( parentDisciplineIndex >= 4 ) {
            multiDisciplineBonus = 3;
          }
        } else if ( lowestDisciplineLevel === 3 ) {
          if ( parentDisciplineIndex === 2 ) {
            multiDisciplineBonus = 2;
          } else if ( parentDisciplineIndex === 3 ) {
            multiDisciplineBonus = 2;
          } else if ( parentDisciplineIndex >= 4 ) {
            multiDisciplineBonus = 2;
          }
        } else if ( lowestDisciplineLevel >= 4 ) {
          if ( parentDisciplineIndex === 2 ) {
            multiDisciplineBonus = 1;
          } else if ( parentDisciplineIndex === 3 ) {
            multiDisciplineBonus = 1;
          } else if ( parentDisciplineIndex >= 4 ) {
            multiDisciplineBonus = 1;
          }
        } 
        // else if ( lowestDisciplineLevel >= 5 ) {
        //   if ( parentDisciplineIndex === 2 ) {
        //     multiDisciplineBonus = 1;
        //   } else if ( parentDisciplineIndex === 3 ) {
        //     multiDisciplineBonus = 2;
        //   } else if ( parentDisciplineIndex >= 4 ) {
        //     multiDisciplineBonus = 3;
        //   }
        // } 
      }

      if (item.type === "skill" ) {
      requiredLp = legendPointsCostConfig[itemOldLevel + 2 + tier];
      } else {
      // requiredLp = legendPointsCostConfig[itemOldLevel + 1 + tier + versatility];
      requiredLp = legendPointsCostConfig[itemOldLevel + 1 + tier + multiDisciplineBonus];
      }

      const validationData = {
        requiredLp: requiredLp,
        interaction: "upgrade",
      }

      return validationData
}