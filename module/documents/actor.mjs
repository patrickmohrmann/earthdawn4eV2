

/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @extends {Actor} extends Actor ED    
 */
export default class ActorEd extends Actor {
    prepareData() {
        const actorData = this;
        this.derivedData( actorData )
        console.log( "ACTOR", actorData )
        
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
        systemData.attributes.dex.value = systemData.attributes.dex.baseValue
        systemData.attributes.str.value = systemData.attributes.str.baseValue
        systemData.attributes.tou.value = systemData.attributes.tou.baseValue
        systemData.attributes.per.value = systemData.attributes.per.baseValue
        systemData.attributes.wil.value = systemData.attributes.wil.baseValue
        systemData.attributes.cha.value = systemData.attributes.cha.baseValue
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
    if ( type === "death" ) {
      return Number( value * 2 + toughnessStep );
    } else if ( type === "unconscious" ) {
      return Number( value * 2 );
    } else if ( type === "woundThreshold" ) {
      return Number( [Math.ceil( value / 2 ) + 2 ] );
    } else if ( type === "recoveryTests" ) {
      return Number( [Math.ceil( value / 6 )] );
    } else {
      console.log( "ERROR MESSAGE: Health Calculation broken!" )
    }
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
}