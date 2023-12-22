import { DocumentCreateDialog } from '../applications/document-creation.mjs';

/**
 * Extend the base Item class to implement additional system-specific logic.
 */
export default class ItemEd extends Item {
    /** @inheritDoc */
    static async createDialog( data = {}, { parent = null, pack = null, ...options } = {} ) {
        return DocumentCreateDialog.waitPrompt( data, { documentCls: Item, parent, pack, options } );
    }
}