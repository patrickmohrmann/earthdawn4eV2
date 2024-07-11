export default async function() {
    ed4eDropItem( actor, data)
    const itemData = await fromUuid(data.uuid);
    // Items which cost LP once added to the actor
    const knacks = ["knackAbility", "knackKarma", "knackManeuver"];
    const spells = ["spell", "spellKnack"];
    const abilities = ["talent", "skills", "devotions"];
    const threads = ["thread"];
    const powers = ["power", "attack", "maneuver"];
    const classes = ["discipline", "path", "questor"];
    const mask = ["mask"];
    const bindingSecrets = ["bindingSecrets"];
    const physicalItems = ["armor","equipment","shield","weapon"];
    const specialAbility = ["specialAbility"];
    const conditions = ["curseMark", "effect", "poisonDisease"];
    const shipWeapon = ["shipWeapon"];
    const namegiver = ["namegiver"]
    
    let bookingResult = "";
    if ( this.actor.type === "character" ) {
      // Knacks
      if ( knacks.includes(itemData.type ) ) {
        bookingResult = await this.actor._showLpOptionsPrompt(this.actor, itemData);    
      // Spells
      } else if ( spells.includes(itemData.type ) ) {
        bookingResult = await this.actor._showLpOptionsPrompt(this.actor, itemData);    
        // Abilities
        } else if ( abilities.includes(itemData.type ) ) {
          bookingResult = await this.actor._showLpOptionsPrompt(this.actor, itemData);    
          // Threads
          } else if ( threads.includes(itemData.type ) ) {
            bookingResult = await this.actor._showLpOptionsPrompt(this.actor, itemData);      
            } else if ( powers.includes( itemData.type ) || mask.includes( itemData.type ) || shipWeapon.includes( itemData.type ) ) {
              return ui.notifications.warn( game.i18n.format("ED.Notifications.Info.notAddedforTheActor") );
            } else if ( namegiver.includes (itemData.type ) ) {
             const namegiver = this.actor.items.filter( i => i.type ==="namegiver" )
             if ( namegiver.length > 0 ) {
              return ui.notifications.warn( game.i18n.format("ED.Notifications.Info.noMoreItemsOfThisType") );
             }
              } else {
                return super._onDropItem(event, data);
              }
      if ( bookingResult === "free" ) {
        await this.actor.addAbility( itemData, true)
        return super._onDropItem(event, data);
      } else  if ( bookingResult === "spend" ) {
        await this.actor.addAbility(itemData, false);
        return super._onDropItem(event, data);
      } else {
        return false;
      }
    } else if ( this.actor.type === "npc" ) {
      if ( knacks.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( knacks.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( spells.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( abilities.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( threads.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( powers.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( classes.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( mask.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( bindingSecrets.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( physicalItems.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( specialAbility.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( conditions.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( shipWeapon.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      } else if ( namegiver.includes(itemData.type ) ) {
        return super._onDropItem(event, data);
      }
    } else if ( this.actor.type === "creature" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "dragon" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "spirit" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "horror" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "group" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "trap" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "loot" ) {
      // see npc
      return super._onDropItem(event, data);
    } else if ( this.actor.type === "vehicle" ) {
      // see npc
      return super._onDropItem(event, data);
    } else return super._onDropItem(event, data);
  }
