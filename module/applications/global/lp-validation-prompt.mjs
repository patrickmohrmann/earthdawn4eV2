export default class LpValidationPrompt extends FormApplication {
    constructor(object, options = {}) {
        super(object, options);
        this.item = object;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "lp-validation-prompt",
            title: "Legend Point Cost",
            template: "systems/ed4e/templates/prompts-popups/lp-validation-prompt.hbs",
            width: 400,
            height: "auto",
            classes: ["yourSystemName", "lp-validation"],
            submitOnChange: true,
            closeOnSubmit: false
        });
    }

    getData() {
        // This method provides data to the template. Adjust as necessary.
        return {
            item: this.item
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Enable the OK button only if the "confirm-anyway" checkbox is checked
        html.find('input[name="confirm-anyway"]').change(event => {
            const isChecked = event.currentTarget.checked;
            html.find('button[name="ok"]').prop('disabled', !isChecked);
        });

        // Bind the Free button click event
        html.find('button[name="free"]').click(this._onFree.bind(this));

        // Bind the OK button click event
        html.find('button[name="ok"]').click(this._onOk.bind(this));

        // Bind the Cancel button click event
        html.find('button[name="cancel"]').click(this._onCancel.bind(this));
    }

    
    

    async _updateObject(event, formData) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Process the formData
        console.log("Form data submitted:", formData);

        // Example: Update this.item based on formData
        // This is a placeholder. Replace with actual logic to update your item or other entities.
        for (const [key, value] of Object.entries(formData)) {
            if (this.item.hasOwnProperty(key)) {
                this.item[key] = value;
            }
        }

        console.log("Updated item:", this.item);

        // Optionally, close the form after updating
        this.close();
    }

    async _onFree(event) {
        event.preventDefault();
        // Implement your logic for the Free action
        console.log("Free action triggered");
        this.close(); // Close the dialog
    }

    async _onCancel(event) {
        event.preventDefault();
        // Implement your logic for the Cancel action
        console.log("Cancel action triggered");
        this.close(); // Close the dialog
    }

}