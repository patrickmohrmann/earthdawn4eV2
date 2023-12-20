import { ItemCreateDialog } from '../applications/item/item-creation.mjs';

/**
 * Extend the base Item class to implement additional system-specific logic.
 */
export default class ItemEd extends Item {

    static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
        return ItemCreateDialog.waitPrompt( data, { parent, pack, options } );
    }

    prepareData() {
        this.prepareBaseData();
        const itemData = this;
        this.derivedData ( itemData )
    }

    derivedData( itemData ) {
        const systemData = itemData.system;
        // **************************** Weight ******************************* */
        if ( itemData.type === "armor" || itemData.type === "equipment" || itemData.type === "shield" || itemData.type === "weapon" ) {
            systemData.sizeWeight = this.getSizeWeight( systemData.weight )
        }
    }

    // *********************************************************************** */
    // ************************ Weight Calculation *************************** */
    // *********************************************************************** */
    // TODO autocaclculateWeight option has to be checkd for this.
    getSizeWeight( weight ) {
        let originalWeight = weight;
        let sizeWeight1 = weight;
        if ( this.isOwned ) {
            let actor = this.parent
            let weightMultiplier = 1;
            // @chris, wie kann ich "suche mir ddas namegiver item" besser schreiben als einmal alle items druchzugehen.
            for( const item of actor.items ) { 
                if ( item.type === "namegiver" )
                weightMultiplier = item.system.weightMultiplier;
             }
             sizeWeight1 = originalWeight * weightMultiplier
             return sizeWeight1
        } 
        return
    }

}