export default class LpValidationPrompt extends FormApplication {

    constructor(actor, item, resolve) {
        super({
            title: game.i18n.localize('earthdawn.s.spendLP'),
        });

        this.resolve = resolve;

        this.actor = actor;
        this.item = item;
        this.isItem = item instanceof Item;
        this.isString = typeof item === 'string';
        this.isAttribute = this.isString ? item.toUpperCase() in ED4E.attributeAbbreviations : false;
        this.attribute = this.isAttribute ? item.toUpperCase() : '';

        if (!(this.isItem || this.isString || this.isAttribute)) {
            throw TypeError("Parameter 'item' must be of type Item or String. If String, allowed values are character attribute abbreviations.");
        }
    }
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['upgradeDialog', 'dialog'],
            template: `systems/earthdawn4e/templates/popups/lp-spending.hbs`,
        });
    }

    get template() {
        return `systems/earthdawn4e/templates/popups/lp-spending.hbs`;
    }

    /** @override */
    getData() {
        let context = super.getData();

        context = {
            ...context,
            ...getSpendingDataForType(this.item, this.actor),
        };

        /*if (!context.newRank) {
          ui.notifications.error(
            game.i18n.format('earthdawn.errors.errorRankOfItemNotParsable', {
              itemType: game.i18n.localize('earthdawn.t.talent'),
              itemName: talentItem.name,
            }),
          );
          this._onCancel();
        }*/

        context.okButtonLabel = game.i18n.localize(context.anyProblems ? 'earthdawn.u.upgradeAnyways' : 'earthdawn.s.spendLP');
        context.localizedOK = game.i18n.localize('earthdawn.o.ok');

        return context;
    }

    submit() {
        this.render(true);
    }

    _onCancel() {
        this.resolve({ cancel: true });
        this.close();
    }

    _getItemType() {
        return this.isItem ? this.item.type : this.isAttribute ? this.attribute : 'unknown type';
    }

    _getItemName() {
        return this.isItem ? this.item.name : this.isAttribute ? ED4E.attributeAbbreviations[this.attribute] : this.item;
    }

    _onOK() {
        // get dynamic data
        //user inputs
        // get <h3> as attribute 'changeDescription'
        this.resolve({
            cancel: false,
            data: this.getData(),
            lpCost: parseInt(this.element.find('#lpCost').val()),
            silverCost: parseInt(this.element.find('#silverCost').val()),
            creationTime: Date.now(),
        });
        this.close();
    }

    async close(options = {}) {
        this.resolve({ cancel: true });
        return super.close(options);
    }

    _onKeyDown(event) {
        // Close dialog
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            return this.close();
        }

        // Confirm default choice
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this._onOK();
        }
    }

}



