import ED4E from "../../config.mjs";

// import { ED4E } from "../../config.mjs";
export default async function validateDropItem(actor, item) {
    const legendPointsCostConfig = ED4E.legendPointsCost;
    let validationData = {};
    // Abilities
    if ( item.type === "talent" || item.type === "skill" || item.type === "devotion" ) {
      validationData = {
        requiredLp: 0,
        interaction: "create",
      }
    // spells
    } else if ( item.type === "spell" ) {
      validationData = {
        requiredLp: legendPointsCostConfig[item.system.level],
        interaction: "create",
      }
    // Knacks
    } else if ( item.type === "knackAbility" || item.type === "knackManeuver" || item.type === "knackKarma" ) {
          let maxKnacksOfTalent = 0;
          let knackSourceTalent = "";
          const knackMinLevel = item.system.source.minLevel;
          const actorKnacks = actor.items.filter(item => item.type === "knackAbility" || item.type === "knackManeuver" || item.type === "knackKarma");
          // search for the knack source talent
          const knackTalentIdentifier = item.system.source.knackSource;
          const actorTalents = actor.items.filter(item => item.type === "talent");

          // check the source talent for dupilcate identifiers
          for (const talent of actorTalents) {
            let sourceTalentCount = 0;
            if (talent.type === "talent" && talent.system.talentIdentifier === knackTalentIdentifier) {
              knackSourceTalent = talent;
              sourceTalentCount += 1;
            }
            if (sourceTalentCount > 1) {
              ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.multipleKnackSources"));
              return;
            }
          }

          // check the source talent and compare with knack requirements
          if (knackSourceTalent === "") {
            ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.knackSourceNotFound"));
            return
          } else {
            // check if the source talent holds already to many knacks
            for (const knack of actorKnacks) {
              if (knack.system.source.knackSource === knackSourceTalent.system.talentIdentifier) {
                maxKnacksOfTalent += 1;
                if (maxKnacksOfTalent >= knackSourceTalent.system.level) {
                  ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.maxKnacksReached"));
                  return;
                }
              }
            }
            // check if the source talent is high enough
            if (knackSourceTalent.system.level < knackMinLevel) {
              ui.notifications.warn(game.i18n.localize("ED.Actor.LpTracking.Spendings.knackSourceNotHighEnough"));
              return;
            }
          }
      
      validationData = {
        requiredLp: item.system.lpCost > 0 ? item.system.lpCost : legendPointsCostConfig[knackMinLevel],
        interaction: "create",
      }
    // threads
    } else if ( item.type === "thread" ) {
      validationData = {
        requiredLp: 0,
        interaction: "create",
      }
    } else if ( item.type === "thread" ) {
        validationData = {
          requiredLp: 0,
          interaction: "create",
        }
    } else if ( item.type === "thread" ) {
        validationData = {
          requiredLp: 0,
          interaction: "create",
        }
      } else {
      return true;
    }
    return validationData;
  }