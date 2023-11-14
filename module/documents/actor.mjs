

/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @extends {Actor} extends Actor ED    
 */
export default class ActorEd extends Actor {

  
  activateListeners( html ) {
    super.activateListeners( html );

    $( document ).on( 'keydown', 'form', function ( ev ) { return ev.key !== 'Enter'; } );

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
        console.log( "ACTOR", actorData )

        
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
        systemData.characteristics.health.woundThreshold = this.getWoundThreshold( "woundThreshold", systemData.attributes.tou.value, systemData.attributes.tou.step );
        systemData.characteristics.health.damage = systemData.characteristics.health.damageStun + systemData.characteristics.health.damageLethal;
        // Recovery
        systemData.characteristics.recoveryTests.daily = this.getRecovery( systemData.attributes.tou.value, systemData.attributes.tou.step );

        // ******************************* Initiative **************************** */
        // Initiative
        systemData.initiative = this.getInitiative( systemData.attributes.dex.step );

        // **************************** Karma & Devotion ************************** */
        // Karma
        systemData.karma.maximum = this.getKarma( );
        // Devotion
        // systemData.devotion.maximum = this.getdevotion( );
    }

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
    
  getStep( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      return Number( [Math.ceil( value / 3 ) + 1] );
    }
  }

  getDefense( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      return Number( [Math.ceil( value / 2 ) + 1] );
    } 
  }
  getArmor( type, value ) {
    if ( type === "physical" ) {
      return Number( this.getCalculateArmor( "physical" ) ) ;
    } else if ( type === "mystical" ) {
      return Number( this.getCalculateArmor( "mystical" ) + [Math.floor( value / 5 )] ) ;
    } else {
      console.log( "ERROR MESSAGE: Armor Calculation broken!" )
    }
  }

  getCalculateArmor( type ) {
    // get all items and sum up the armor differenciation by type
    if ( type === "physical" ) {
      return Number( 0 )
    } else if ( type === "mystical" ) {
      return Number( 0 )
    } else {
      console.log( "ERROR MESSAGE: Armor Calculation broken!" )
    }
  }

  getHealth( type, value, toughnessStep ) {
    let durability = this.getDurability()
    let highestLevel = this.getHighestDurabilityItems()
    if ( type === "death" ) {
      return Number( value * 2 + toughnessStep + durability.healthRating + highestLevel.level * ( 1 + this.system.durabilityBonus ) );
    } else if ( type === "unconscious" ) {
      return Number( value * 2  + durability.healthRating + ( highestLevel.level * this.system.durabilityBonus ) );
    } else if ( type === "woundThreshold" ) {
      return Number( [Math.ceil( value / 2 ) + 2 ] );
    } else if ( type === "recoveryTests" ) {
      return Number( [Math.ceil( value / 6 )] );
    } else {
      console.log( "ERROR MESSAGE: Health Calculation broken!" )
    }
  }


  /**
   * TODO
   * @returns 
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

  getHighestDiscipline() {
    let disciplineList = this.items.filter( ( item ) => { return item.type === 'discipline' } );
    disciplineList.sort( ( a, b ) => ( a.system.level > b.system.level ? -1 : 1 ) );
    
    return disciplineList[0].system.level
  }

  getDurability() {
    let durabilityItem = this.getDurabilityItems();
    let highest = this.getHighestDiscipline();

    console.log( "DEBUG: DISCIPLINES", durabilityItem )
    console.log( "DEBUG: HIGHEST", highest )
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
    return { healthRating: runningtotal, highestLevel: highest.level };
  }

  


  getRecovery( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      return Number( [Math.ceil( value / 6 )] );
    }
  }

  getInitiative( value ) {
    if ( !value > 0 ) {
      return 0;
    } else {
      // additional modifiere will be added later during encounter epics
      return Number( value - this.getArmorPenalty() );
    }
  }

  getArmorPenalty() {
    // find all armor items which are worn and summarize the armor penalty value
    let armorPenalty = 0;
    for ( const item of this.items ) {
      if ( item.type === "armor" || item.type === "shield" ) {
        armorPenalty += item.system.initiativePenalty;
      }
    }
    return Number( armorPenalty );
  }

  // getKarma() {
  //   let namegiverKarmaValue = 0;
  //   let highestDiscipline = 0;
  //   for ( const item of this.items ) {
  //     if ( item.type === "namegiver" ) {
  //       namegiverKarmaValue = item.karma
  //     } else if ( item.type === "discipline" ) {
  //       highestDiscipline = Math.max( ...item.map( item => item.system.level ) );
  //     }
  //   }
  //    return namegiverKarmaValue * highestDiscipline
  //   }

  //   getdevotion() {
  //     let highestQuestor = 0;
  //     for ( const item of this.items ) {
  //       if ( item.type === "questor" ) {
  //         highestQuestor = Math.max( ...item.map( item => item.system.level ) );
  //       }
  //     }
  //      return highestQuestor * 10
  //     }

}