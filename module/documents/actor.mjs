

/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @extends {Actor} extends Actor ED    
 */
export default class ActorEd extends Actor {

  
  activateListeners( html ) {
    super.activateListeners( html );

    $( document ).on( 'keydown', 'form', ( ev ) => { return ev.key !== 'Enter'; } );

    html.find( '.item-delete' ).click( async ( ev ) => {
      let li = $( ev.currentTarget ).parents( '.item-name' )
      let itemId = li.attr( 'data-item-id' );
      let confirmationResult = await this.confirmationBox();
      if ( confirmationResult.result === false ) {
        return false;
      } else {
        this.actor.deleteEmbeddedDocuments( 'Item', [itemId] );
      }
    } );

    html.find( '.item-edit' ).click( ( ev ) => {
      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.actor.items.get( li.data( 'itemId' ) );
      item.sheet.render( true );
    } );

    html.find( '.link-checkbox-effect' ).click( async ( ev ) => {
      ev.preventDefault();

      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.actor.effects.get( li.data( 'itemId' ) );
      let visibleState = ev.target.checked;
      let disabledState = !visibleState;

      await item.update( { disabled: disabledState } );
    } );

    html.find( '.effect-delete' ).click( async ( ev ) => {
      let li = $( ev.currentTarget ).parents( '.item-name' )
      let itemId = li.attr( 'data-item-id' );
      let confirmationResult = await this.confirmationBox();
      if ( confirmationResult.result === false ) {
        return false;
      } else {
        this.actor.deleteEmbeddedDocuments( 'ActiveEffect', [itemId] );
      }
    } );

    html.find( '.effect-add' ).click( () => {
      let itemNumber = this.actor.effects.size;
      let itemData = {
        label: `New Effect ` + itemNumber,
        icon: 'systems/earthdawn4e/assets/effect.png',
        duration: { rounds: 1 },
        origin: this.actor.id,
      };

      this.actor.createEmbeddedDocuments( 'ActiveEffect', [itemData] );
    } );

    html.find( '.effect-edit' ).click( ( ev ) => {
      const li = $( ev.currentTarget ).parents( '.item-name' );
      const item = this.actor.effects.get( li.data( 'itemId' ) );
      item.sheet.render( true );
    } );

  }
  prepareData() {
    this.prepareBaseData();
    const baseCharacteristics = [
      "system.attributes.dex.valueModifier",
      "system.attributes.str.valueModifier",
      "system.attributes.tou.valueModifier",
      "system.attributes.per.valueModifier",
      "system.attributes.wil.valueModifier",
      "system.attributes.cha.valueModifier",
      "system.durabilityBonus",
    ];
      const actorData = this;
      this._applyBaseEffects( baseCharacteristics );
      this.derivedData( actorData )
      this.applyDerivedEffects()  
  }

    _applyBaseEffects( baseCharacteristics ) {
      let overrides = {};
      // Organize non-disabled effects by their application priority
      // baseCharacteristics is list of attributes that need to have Effects applied before Derived Characteristics are calculated
      const changes = this.effects.reduce( ( changes, e ) => {
        if ( e.changes.length < 1 ) {
          return changes;
        }
        if ( e.disabled || e.isSuppressed || !baseCharacteristics.includes( e.changes[0].key ) ) {
          return changes;
        }
        
        return changes.concat(
          
          e.changes.map( ( c ) => {
            c = foundry.utils.duplicate( c );
            c.effect = e;
            c.priority = c.priority ?? c.mode * 10;
            return c;
          } ),
        );
      }, [] );
  
      changes.sort( ( a, b ) => a.priority - b.priority );
  
      // Apply all changes
      for ( let change of changes ) {
        const result = change.effect.apply( this, change );
        if ( result !== null ) overrides[change.key] = result[change.key];
      }
  
      // Expand the set of final overrides
      this.overrides = foundry.utils.expandObject( { ...foundry.utils.flattenObject( this.overrides ), ...overrides } );
    }

    
    derivedData( actorData ) {
        const systemData = actorData.system;
        // **************************** Attributes ******************************* */
        // Attribute Base values = InitialValue + Increases
        systemData.attributes.dex.baseValue = systemData.attributes.dex.initialValue + systemData.attributes.dex.timesIncreased;
        systemData.attributes.str.baseValue = systemData.attributes.str.initialValue + systemData.attributes.str.timesIncreased;
        systemData.attributes.tou.baseValue = systemData.attributes.tou.initialValue + systemData.attributes.tou.timesIncreased;
        systemData.attributes.per.baseValue = systemData.attributes.per.initialValue + systemData.attributes.per.timesIncreased;
        systemData.attributes.wil.baseValue = systemData.attributes.wil.initialValue + systemData.attributes.wil.timesIncreased;
        systemData.attributes.cha.baseValue = systemData.attributes.cha.initialValue + systemData.attributes.cha.timesIncreased;
        // Attribute Values = BaseValue + Modifications
        systemData.attributes.dex.value = systemData.attributes.dex.baseValue + systemData.attributes.dex.valueModifier;
        systemData.attributes.str.value = systemData.attributes.str.baseValue + systemData.attributes.str.valueModifier;
        systemData.attributes.tou.value = systemData.attributes.tou.baseValue + systemData.attributes.tou.valueModifier;
        systemData.attributes.per.value = systemData.attributes.per.baseValue + systemData.attributes.per.valueModifier;
        systemData.attributes.wil.value = systemData.attributes.wil.baseValue + systemData.attributes.wil.valueModifier;
        systemData.attributes.cha.value = systemData.attributes.cha.baseValue + systemData.attributes.cha.valueModifier;
        // Attribute Base Steps
        systemData.attributes.dex.baseStep = this.getStep( systemData.attributes.dex.value );
        systemData.attributes.str.baseStep = this.getStep( systemData.attributes.str.value );
        systemData.attributes.tou.baseStep = this.getStep( systemData.attributes.tou.value );
        systemData.attributes.per.baseStep = this.getStep( systemData.attributes.per.value );
        systemData.attributes.wil.baseStep = this.getStep( systemData.attributes.wil.value );
        systemData.attributes.cha.baseStep = this.getStep( systemData.attributes.cha.value );
        // Attribute Steps
        systemData.attributes.dex.step = systemData.attributes.dex.baseStep;
        systemData.attributes.str.step = systemData.attributes.str.baseStep;
        systemData.attributes.tou.step = systemData.attributes.tou.baseStep;
        systemData.attributes.per.step = systemData.attributes.per.baseStep;
        systemData.attributes.wil.step = systemData.attributes.wil.baseStep;
        systemData.attributes.cha.step = systemData.attributes.cha.baseStep;

        // ******************************* Characteristics **************************** */
        // Defenses
        systemData.characteristics.defenses.physical = this.getDefense( systemData.attributes.dex.value );
        systemData.characteristics.defenses.mystical = this.getDefense( systemData.attributes.per.value );
        systemData.characteristics.defenses.social = this.getDefense( systemData.attributes.cha.value );
        // Armor
        systemData.characteristics.armor.physical = this.getArmor( "physical" );
        systemData.characteristics.armor.mystical = this.getArmor( "mystical", systemData.attributes.wil.value );
        // Health
        systemData.characteristics.health.death = this.getHealth( "death", systemData.attributes.tou.value, systemData.attributes.tou.step );
        systemData.characteristics.health.unconscious = this.getHealth( "unconscious", systemData.attributes.tou.value,systemData.attributes.tou.step );
        systemData.characteristics.health.woundThreshold = this.getHealth( "woundThreshold", systemData.attributes.tou.value, systemData.attributes.tou.step );
        systemData.characteristics.health.damage = systemData.characteristics.health.damageStun + systemData.characteristics.health.damageLethal;
        // Recovery
        systemData.characteristics.recoveryTests.daily = this.getRecovery( systemData.attributes.tou.value, systemData.attributes.tou.step );

        // ******************************* Initiative **************************** */
        // Initiative
        systemData.initiative = this.getInitiative( systemData.attributes.dex.step );

        // **************************** Karma & Devotion ************************** */
        // Karma
        systemData.karma.maximum = this.getKarma( systemData.karma.freeAttributePoints );
        // Devotion
        systemData.devotion.maximum = this.getDevotion( );

        // ********************* Carrying Capacity & Encumbrance ******************* */
        // Carrying Capacity
        systemData.encumbrance.carryingCapacity = this.getCarryingCapacity( systemData.attributes.tou.value )
        // Encumbrance
        systemData.encumbrance.carriedLoad = this.getEncumbrance( systemData.attributes.tou.value )
        // overloaded
        // systemData.initiative = this.getOverloaded( systemData.encumbrance.carriedLoad, systemData.encumbrance.carryingCapacity );

        // ********************************* Movement ****************************** */
        // Movement
        systemData.characteristics.movement.walk = this.getMovement( "walk" );
        systemData.characteristics.movement.climb = this.getMovement( "climb" );
        systemData.characteristics.movement.swim = this.getMovement( "swim" );
        systemData.characteristics.movement.burrow = this.getMovement( "burrow" );
        systemData.characteristics.movement.fly = this.getMovement( "fly" );
    }

    /**
     * TODO Code from old system
     */
    applyDerivedEffects() {
      const overrides = {};
      // Organize non-disabled effects by their application priority
      const changes = this.effects.reduce( ( changes, e ) => {
        if ( e.changes.length < 1 ) {
          return changes;
        }
  
        return changes.concat(
          e.changes.map( ( c ) => {
            c = foundry.utils.duplicate( c );
            c.effect = e;
            c.priority = c.priority ?? c.mode * 10;
            return c;
          } ),
        );
      }, [] );
  
      changes.sort( ( a, b ) => a.priority - b.priority );
  
      // Apply all changes
      for ( let change of changes ) {
        const result = change.effect.apply( this, change );
        if ( result !== null ) overrides[change.key] = result[change.key];
      }
  
      // Expand the set of final overrides
      this.overrides = foundry.utils.expandObject( { ...foundry.utils.flattenObject( this.overrides ), ...overrides } );
    }
    
    // *********************************************************************** */
    // ************************* Attributes Step ***************************** */
    // *********************************************************************** */
    /**
     * @param { number } value attribute value 
     * @returns { number } reutrns step
     */
    getStep( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      return Number( [Math.ceil( value / 3 ) + 1] );
    }
  }

  // *********************************************************************** */
  // ***************************** Defenses ******************************** */
  // *********************************************************************** */
  /**
   * @param { number } value dexterity-, perception- or charisma value
   * @returns { number } returns the respective defense value
   */
  getDefense( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      return Number( [Math.ceil( value / 2 ) + 1] );
    } 
  }

  // *********************************************************************** */
  // ******************************* Armor ********************************* */
  // *********************************************************************** */
  /**
   * @param { string } type for differentiation of pyhsical or mystical armor
   * @param { number } value for mystic armor bonus
   * @returns { number } returns either mystical or physical armor
   */
  getArmor( type, value ) {
    let armorItemList = this.items.filter( ( item ) => { return item.type === 'armor' } );
    let mystical = 0;
    let physical = 0;
    let armor = 0;
    for ( const element of armorItemList ) {
      if ( element.system.physicalArmor > 0 ) {
        physical += element.system.physicalArmor + element.system.forgeBonusPhysical
      } 
      if ( element.system.mysticalArmor > 0 ) {
        mystical += element.system.mysticalArmor + element.system.forgeBonusMystical
      }
    }
    if ( type === "physical" ) {
      armor = physical;
    } else if ( type === "mystical" ) {
      armor = Number( mystical ) + Number( [Math.floor( value / 5 ) ] );
    }
    return armor
  }

  // *********************************************************************** */
  // ****************************** Healt ********************************** */
  // *********************************************************************** */

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * 
   * @param { string } type healt characteristic type
   * @param { number } value attribute value (toughness)
   * @param { number } toughnessStep attribute Step
   * @returns { number } returns a characteristic value
   */
  getHealth( type, value, toughnessStep ) {
    let durability = this.getDurability()
    let highestLevel = this.getHighestDurabilityItems()
    if ( type === "death" ) {
      return Number( value * 2 + toughnessStep + durability.healthRating + highestLevel.level + ( this.system.durabilityBonus * highestLevel.durability ) );
    } else if ( type === "unconscious" ) {
      return Number( value * 2  + durability.healthRating + ( highestLevel.durability * this.system.durabilityBonus ) );
    } else if ( type === "woundThreshold" ) {
      return Number( [Math.ceil( value / 2 ) + 2 ] );
    } else if ( type === "recoveryTests" ) {
      return Number( [Math.ceil( value / 6 )] );
    } else {
      console.log( "ERROR MESSAGE: Health Calculation broken!" )
    }
  }
  
  /**
   * @description this function searches all items of the actor to find the ones with a durabilty value
   * @returns { Array } returns an array containing all items with a durability value
   */
  getDurabilityItems() {
    let durabilityItem = [];
    for ( const item of this.items ) {
      if ( item.type === "discipline" ) {
        durabilityItem.push( item )
      } else if ( item.type === "devotion" && item.system.durability > 0 ) {
        durabilityItem.push( item )
      }
    }
    return durabilityItem;
  }

  /**
   * @description this function helps to determine the highest item level with durabilty 
   * @returns { object } returns the highest Durability item, containing id, level and durability value
   */
  getHighestDurabilityItems() {
    let durabilityItem = this.getDurabilityItems()
    let highest = { id: '', level: 0, durability: 0 };
          for ( let i = 0; i < durabilityItem.length ; i++ ) {
            let level = Number( durabilityItem[i].system.level );
            let durability = Number( durabilityItem[i].system.durability );
            if ( level > highest.level ) {
              highest.id = durabilityItem[i]._id;
              highest.level = level;
              highest.durability = durability;
            } else if ( level === highest.level && durability > highest.durability ) {
              highest.id = durabilityItem[i]._id;
              highest.durability = durability;
            }
          } 
    return highest;
  }

  /**
   * @description this function checks for the highest discipline
   * @returns { number } Returns the highest Discipline Circle of all Disciplines
   */
  getHighestDiscipline() {
    let disciplineList = this.items.filter( ( item ) => { return item.type === 'discipline' } );
    let circle = 0;
    if ( disciplineList.length > 0 ) {
      disciplineList.sort( ( a, b ) => ( a.system.level > b.system.level ? -1 : 1 ) );
      circle = disciplineList[0].system.level
    }
    return circle
  }

  /**
   * @description calculation of health ratings (death and unconsciousness)
   * @returns { object } returns the calculated bonus of all durability items multiplied with the according circles/ranks and the highest level/rank
   */
  getDurability() {
    let durabilityItem = this.getDurabilityItems();
    let highest; 
    let highestLevel = 0
    if ( durabilityItem.length > 0 ) {
      
      highest = this.getHighestDiscipline();
      highestLevel = highest.level
    } 
    durabilityItem.sort( ( a, b ) => ( a.system.durability > b.system.durability ? -1 : 1 ) );
  
    let runningtotal = 0;
    let runningDiscLevel = 0;
    let discLevel = 0;
    let discDura = 0;
    for ( const element of durabilityItem ) {
      let level = Number( element.system.level );
      if ( level - runningDiscLevel > 0 ) {
        discLevel = level - runningDiscLevel;
        discDura = Number( element.system.durability );
        runningDiscLevel += discLevel;
      } else {
        discDura = 0;
      }
      let total = discDura * discLevel;
      runningtotal += total;
    }


    return { healthRating: runningtotal, highestLevel: highestLevel };
    
  }

  /**
   * @description calculation of recovery tests per day
   * @param { number } value toughness value
   * @returns { number } returns the number of recovery tests per day
   */
  getRecovery( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      return Number( [Math.ceil( value / 6 )] );
    }
  }

  // *********************************************************************** */
  // **************************** Initiative ******************************* */
  // *********************************************************************** */
  /**
   * @param { number } value dexterity value
   * @returns { number } returns the current inititative step
   */
  getInitiative( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      // additional modifiere will be added later during encounter epics
      return Number( value - this.getArmorPenalty() );
    }
  }

  /**
   * @description calculates all Armor Penalties of equipped items
   * @returns { number } returns the combined initiative penalty of all shields and armor items.
   */
  getArmorPenalty() {
    // find all armor items which are worn and summarize the armor penalty value
    let armorPenalty = 0;
    for ( const item of this.items ) {
      if ( item.type === "armor" || item.type === "shield" ) {
        if ( item.system.itemStatus.equipped ) {
        armorPenalty += item.system.initiativePenalty;
        }
      }
    }
    return Number( armorPenalty );
  }

  // *********************************************************************** */
  // ******************************* Karma ********************************* */
  // *********************************************************************** */
  /**
   * @param { number } karmaBonus karmabonus comming e.g from char generation
   * @returns { number } returns the maximum karma number
   */
  getKarma( karmaBonus ) {
    // karmaBonus from char generation is still missing
    let HighestDisciplineCircle = this.getHighestDiscipline();
    let namegiverItem = this.items.filter( ( item ) => { return item.type === 'namegiver' } );
    let karma = 0;
    if ( namegiverItem.length === 1 && HighestDisciplineCircle > 0 ) {
      karma = namegiverItem[0].system.karmamodifier * HighestDisciplineCircle + karmaBonus;
    }
    return karma
  }

  // *********************************************************************** */
  // ****************************** Devotion ******************************* */
  // *********************************************************************** */
  /**
   * @description calculation of maximum devotion points. Questor Rank * 10
   * @returns { number } maximum devotion
   */
  getDevotion() {
    let questor = this.items.filter( ( item ) => { return item.type === 'questor' } );
    let devotion = 0;
    if ( questor.length === 1 ) {
      devotion = questor[0].system.level * 10;
    }
    return devotion;
  }

  // *********************************************************************** */
  // ***************** Encumbrance & Carrying Capacity ********************* */
  // *********************************************************************** */
  /**
   * @param { number } value strenght value
   * @returns { number } carrying capacity
   */
  getCarryingCapacity( value ) {
    let carryingCapacityBonus = this.system.encumbrance.carryingCapacityBonus;
    let strengthValue = value + carryingCapacityBonus;
    let StrengthFifthValue  = Math.ceil( value/5 );

    let carryingCapacity = -12.5 * StrengthFifthValue ** 2 + 5 * StrengthFifthValue * strengthValue + 12.5 * StrengthFifthValue + 5;

    return carryingCapacity;
  }

  /**
   * @description the item weight will be calculated based on the equipped / worn status and based on the Namegiver Size input
   * @description the weight will be influenced by the amount of items. in case of Ammunition, the bundle size will devide the amount 
   * @returns { number } current encumbrance
   */
  getEncumbrance( ) { 
    let encumbrance = 0;
    let namegiver = this.items.filter( ( item ) => { return item.type === 'namegiver' } );
    // check every item for one of the following types
    for ( const item of this.items ) {
      if ( item.type === "weapon" || item.type === "armor" || item.type === "shield" || item.type === "equipment" ) {
        let amount = 1;
        // weapons and equipments can have an amount
        if ( item.type === "weapon" || item.type === "equpiment" ) {
          amount = item.system.amount;
        } 
        // check for worn or equipped state to factor Namegiver Weight Multiplier
        if ( item.system.itemStatus.equipped || item.system.worn ) {
          if ( item.system.autoCalculateWeight ) {
            let sizeWeight = item.system.weight * namegiver[0].system.weightMultiplier
            // check for ammunition and Bundle size
            if ( item.type === "equipment" && item.system.ammoType !== "none" ) {
              encumbrance += sizeWeight * ( amount / item.system.bundleSize )
            } else {
            encumbrance += sizeWeight * amount
            }
          } else {
            // check for ammunition and Bundle size
            if ( item.type === "equipment" && item.system.ammoType !== "none" ) {
              encumbrance += item.system.weight * ( amount / item.system.bundleSize )
            } else {
            encumbrance += item.system.weight * amount
            }
          }  
        }
      }
    }
    return Number( encumbrance );
  } 

  getOverloaded( encumbrance, carryingCapacity ) {
    if ( encumbrance > carryingCapacity ) {
      let percentageOverload = encumbrance / carryingCapacity *100 
      if ( percentageOverload < 150 ) {
        // create effect -2 auf Movement, -2 auf P-def und M-def
        console.error( "work in progress. An effect shall be created with -2 to movement & -2 to Physical and Mystical defense" )
      } else if ( percentageOverload > 150 ) {
        console.error( game.i18n.localize( "ED.Notifications.Warnings.Overloaded" ) )
      }
    } else if ( encumbrance < carryingCapacity ) {
      return 
    }
  }

  getMovement( type ) {
    let namegiver = this.items.filter( ( item ) => { return item.type === 'namegiver' } );
    let movement = 0;
    if ( namegiver.length > 0 ) {
      if ( type === "walk" ) {
        movement = namegiver[0].system.movement.walk
      } else if ( type === "swim" ) {
        movement = namegiver[0].system.movement.swim
      } else if ( type === "burrow" ) {
        movement = namegiver[0].system.movement.burrow
      } else if ( type === "fly" ) {
        movement = namegiver[0].system.movement.fly
      } else if ( type === "climb" ) {
        movement = namegiver[0].system.movement.climb
      } 
    }
    return Number( movement )
  }

}
