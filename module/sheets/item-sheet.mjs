/**
 * Extend the basic ActorSheet with modifications
 * @extends {ItemSheet}
 */
export class ItemSheetED extends ItemSheet {

    /**@override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["earthdawn4e", "sheet", "item", "item-sheet"],
            template: "systems/ed4e/templates/item/talent-sheet.hbs",
            width: 800,
            height: 800,
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body"}]
        });
    }

    /** @override */
    get template() {
        return `systems/ed4e/templates/item/${this.item.type}-sheet.hbs`
    }
}