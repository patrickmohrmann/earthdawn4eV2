import SystemDataModel from "../abstract.mjs";

/**
 * Advancement of Disciplines, Paths and Questors
 */

export default class AdvancementData extends SystemDataModel {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            advancementLevel: new foundry.data.fields.ArrayField( 
                new foundry.data.fields.SchemaField( {
                    id: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: false,
                        initial: "",
                    } ),
                    level: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: true,
                        blank: true,
                        initial: "",
                    } ),  
                    tier: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: true,
                        blank: true,
                        initial: "",
                    } ), 
                    ability: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: true,
                        blank: true,
                        initial: "",
                    } ), 
                    specialAbilities: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: true,
                        blank: true,
                        initial: "",
                    } ), 
                    actveEffects: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: true,
                        blank: true,
                        initial: "",
                    } ), 
                    karmaStep: new foundry.data.fields.StringField( {
                        required: true,
                        nullable: true,
                        blank: true,
                        initial: "",
                    } )
                } )
            ),
            abilityOptions: new foundry.data.fields.SchemaField( {
                novice: new foundry.data.fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                } ),
                journeymen: new foundry.data.fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                } ),  
                warden: new foundry.data.fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                } ), 
                master: new foundry.data.fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                } ), 
            } )
            
        } );
    }

    // proably not necessary
    // async _updateObject( event, formData ) {
    //     if ( !this.item.id ) return
    //     // if (!this.item.id || !this.item.id1) return
    
    //     const expandedObject = expandObject( formData )
    //     const extraLevelList = expandedObject.system.extraThreadsList;
        
    //     // Ensure that extraLevelList is an array
    //     if ( extraLevelList && typeof extraLevelList === "object" ) {
    //       expandedObject.system.extraLevelList = Object.values( extraLevelList );
    //     } 
    
    //     await this.item.update( expandedObject )
    //   }
    
}