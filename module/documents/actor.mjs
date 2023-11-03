

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
        const systemData = actorData.system.attributes;
        // Attribute Base values = InitialValue + Increases
        systemData.dex.baseValue = systemData.dex.initialValue + systemData.dex.timesIncreased;
        systemData.str.baseValue = systemData.str.initialValue + systemData.str.timesIncreased;
        systemData.tou.baseValue = systemData.tou.initialValue + systemData.tou.timesIncreased;
        systemData.per.baseValue = systemData.per.initialValue + systemData.per.timesIncreased;
        systemData.wil.baseValue = systemData.wil.initialValue + systemData.wil.timesIncreased;
        systemData.cha.baseValue = systemData.cha.initialValue + systemData.cha.timesIncreased;
        // Attribute Values = BaseValue + Modifications
        systemData.dex.value = systemData.dex.baseValue
        systemData.str.value = systemData.str.baseValue
        systemData.tou.value = systemData.tou.baseValue
        systemData.per.value = systemData.per.baseValue
        systemData.wil.value = systemData.wil.baseValue
        systemData.cha.value = systemData.cha.baseValue
        // Attribute Steps
        systemData.dex.baseStep = this.getStep( systemData.dex.value );
        systemData.str.baseStep = this.getStep( systemData.str.value );
        systemData.tou.baseStep = this.getStep( systemData.tou.value );
        systemData.per.baseStep = this.getStep( systemData.per.value );
        systemData.wil.baseStep = this.getStep( systemData.wil.value );
        systemData.cha.baseStep = this.getStep( systemData.cha.value );
        
    }
    
    getStep( value ) {
        if ( !value > 0 ) {
            return 0;
          } else {
            return Number( [Math.ceil( value / 3 ) + 1] );
          }
        }
}