import { ItemCreateDialog } from '../applications/item/item-creation.mjs';

/**
 * Extend the base Item class to implement additional system-specific logic.
 */
export default class ItemEd extends Item {
    static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
        return ItemCreateDialog.waitPrompt( data, { parent, pack, options } );
    }
}