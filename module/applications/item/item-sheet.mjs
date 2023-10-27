/**
 * Extend the basic ActorSheet with modifications
 * @extends {ItemSheet}
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

      // HTML enrich
  async _enableHTMLEnrichment() {
    let enrichment = {};
    enrichment["system.description"] = await TextEditor.enrichHTML( this.item.system.description, {async: true, secrets: this.item.isOwner} );
     return expandObject( enrichment );
  }
 
  async getData() {
    const systemData = super.getData();
    systemData.enrichment =  await this._enableHTMLEnrichment();
    console.log( '[EARTHDAWN] Item data: ', systemData );
    return systemData;
  }
}
