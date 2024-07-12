import ED4E from "../../config.mjs";

// import { ED4E } from "../../config.mjs";
export default async function validateAbilityUpgrade(item) {
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

      const versatility = item.type === "talent" && item.system.talentCategory === "versatility" && item.system.edid !== "versatility" ? 1 : 0;

      if (item.type === "skill" ) {
      requiredLp = legendPointsCostConfig[itemOldLevel + 2 + tier];
      } else {
      requiredLp = legendPointsCostConfig[itemOldLevel + 1 + tier + versatility];
      }

      const validationData = {
        requiredLp: requiredLp,
        interaction: "upgrade",
      }

      return validationData
}