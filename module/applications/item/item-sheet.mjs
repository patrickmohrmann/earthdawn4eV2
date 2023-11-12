import ED4E from "../../config.mjs";

/**
 * Extend the basic ActorSheet with modifications
 * @augments {ItemSheet} extends ItemSheet
 */
export default class ItemSheetEd extends ItemSheet {

    /**
     * @override
     */
    static get defaultOptions() {
        return mergeObject( super.defaultOptions, {
            classes: ["earthdawn4e", "sheet", "item", "item-sheet"],
            template: "systems/ed4e/templates/item/talent-sheet.hbs",
            width: 800,
            height: 800,
            tabs: [{
                navSelector: '.item-sheet-tabs',
                contentSelector: '.item-sheet-body',
                initial: 'main',
            }]
        } );
    }

    /** @override */
    get template() {
        return `systems/ed4e/templates/item/${this.item.type}-sheet.hbs`
    }

      // HTML enrichment
  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment["system.description.value"] = await TextEditor.enrichHTML( this.item.system.description.value, {async: true, secrets: this.item.isOwner} );
     return expandObject( enrichment );
  }
 
  async getData() {
    const systemData = super.getData();
    systemData.enrichment =  await this._enableHTMLEnrichment();
    console.log( '[EARTHDAWN] Item data: ', systemData );

    systemData.config = ED4E;
    
    return systemData;
  }
}
