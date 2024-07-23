import ED4E from "../../config.mjs";

/**
 * @param {Object}          actor                Actor object                 
 * @param {Object}          item                 Item object  
 * @returns 
 * @UserFunction                                 UF_ActorItems-validateDropItem
 */
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
    } else if (isKnack(item)) {
      const knackMinLevel = item.system.source.minLevel;
      const actorKnacks = actor.items.filter(isKnack);
      const knackTalentIdentifier = item.system.source.knackSource;
      const knackSourceTalent = findSourceTalent(actor, knackTalentIdentifier);
    
      if (!knackSourceTalent || knackSourceTalent.length === 0) {
        notifyWarning("ED.Item.Knack.Notification.knackSourceNotFound");
        return;
      }

      if (knackSourceTalent.length > 1) {
        notifyWarning("ED.Item.Knack.Notification.knackSourceMultipleTalents");
        return
      }
    
      const maxKnacksOfTalent = countKnacksForTalent(actorKnacks, knackSourceTalent.system.talentIdentifier);
      if (maxKnacksOfTalent >= knackSourceTalent.system.level) {
        notifyWarning("ED.Item.Knack.Notification.maxKnacksReached");
        return;
      }
    
      if (knackSourceTalent.system.level < knackMinLevel) {
        notifyWarning("ED.Item.Knack.Notification.knackSourceNotHighEnough");
        return;
      }
    
      validationData = {
        requiredLp: item.system.lpCost > 0 ? item.system.lpCost : legendPointsCostConfig[knackMinLevel],
        interaction: "create",
      };
    
    // disciplines
    } else if (item.type === "discipline") {
        const disciplineItems = actor.items.filter(item => item.type === 'discipline');
        const disciplineIndex = disciplineItems.length;
        validationData = {
          requiredLp: 0,
          disciplineIndex: disciplineIndex + 1,
          interaction: "create",
        }
    // threads
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

  /**
   * @param {Object}    item                      Item object                      
   * @returns 
   * @UserFunction                                Not Relevant
   */
  function isKnack(item) {
    return ["knackAbility", "knackManeuver", "knackKarma"].includes(item.type);
  }

  /**
   * @param {String}    messageKey                Key of the message to be displayed
   * @UserFunction                                Not Relevant
   */
  function notifyWarning(messageKey) {
    ui.notifications.warn(game.i18n.localize(messageKey));
  }

  /**
   * @param {Object}    actor                     Actor object 
   * @param {String}    knackTalentIdentifier     Identifier of the talent the knacks are associated with
   * @returns 
   * @USserFunction                               UF_ActorItems-findSourceTalent
   */
  function findSourceTalent(actor, knackTalentIdentifier) {
    const matchingItems = actor.items.filter(item => item.type === "talent" && item.system.talentIdentifier === knackTalentIdentifier);
    return matchingItems; // Returns undefined if no items match
}

  /**
   * 
   * @param {Array}     actorKnacks               List of knacks the actor has
   * @param {String}    talentIdentifier          Identifier of the talent the knacks are associated with
   * @UserFunction                                UF_ActorItems-countKnacksForTalent    
   * @returns 
   */
  function countKnacksForTalent(actorKnacks, talentIdentifier) {
    return actorKnacks.filter(knack => knack.system.source.knackSource === talentIdentifier).length;
  }