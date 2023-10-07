/**
 * Extend the basic ActorSheet with modifications
 * @extends {ActorSheet}
 */
export class ActorSheetED extends ActorSheet {

    /** 
     * @override 
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["earthdawn4e", "sheet", "actor", "character-sheet"],
            template: "systems/ed4e/templates/actor/namegiver-sheet.hbs",
            width: 800,
            height: 800,
            tabs: [{
                navSelector: '.actor-sheet-tabs',
                contentSelector: '.actor-sheet-body',
                initial: 'main',
              },]
        });
    }

    /** @override */
    get template() {
        return `systems/ed4e/templates/actor/${this.actor.type}-sheet.hbs`
    }
}