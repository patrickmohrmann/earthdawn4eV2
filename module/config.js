// Namespace Configuration Values
const ED4E = {};

/**
 * Configuration data for abilities.
 *
 * @typedef {object} AttributeConfiguration
 * @property {string} label                               Localized label.
 * @property {string} abbreviation                        Localized abbreviation.
 * @property {Object<string, number|string>}  [defaults]  Default values for this Attribute based on actor type.
 *                                                        If a string is used, the system will attempt to fetch.
 *                                                        the value of the specified Attribute.
 */

/**
 * The set of Attribute Scores used within the system.
 * @enum {AttributeConfiguration}
 */
ED4E.attributes = {
	str: {
		label: "ED.Attributes.strength",
		abbreviation: "ED.Attribute.strengthAbbr"
	},
	dex: {
		label: "ED.Attributes.dexterity",
		abbreviation: "ED.Attributes.dexterityAbbr"
	},
	tou: {
		label: "ED.Attributes.toughness",
		abbreviation: "ED.Attributes.toughnessAbbr"
	},
	per: {
		label: "ED.Attributes.perception",
		abbreviation: "ED.Attributes.perceptionAbbr"
	},
	wil: {
		label: "ED.Attributes.willpower",
		abbreviation: "ED.Attributes.willpowerAbbr"
	},
	cha: {
		label: "ED.Attributes.charisma",
		abbreviation: "ED.Attributes.charismaAbbr"
	}
}

// Since Foundry does not support hot reloading object notation templates...
Hooks.on('hotReload', async ({ content, extension, packageId, packageType, path } = {}) => {
	if (extension === 'hbs') {
		const key = Object.entries(flattenObject(templates)).find(([_, tpath]) => tpath == path)?.[0];
		if (!key) throw new Error(`Unrecognized template: ${path}`);
		await new Promise((resolve, reject) => {
			game.socket.emit('template', path, resp => {
				if (resp.error) return reject(new Error(resp.error));
				const compiled = Handlebars.compile(resp.html);
				Handlebars.registerPartial(generateTemplateKey(key), compiled);
				console.log(`Foundry VTT | Retrieved and compiled template ${path} as ${key}`);
				resolve(compiled);
			});
		});
		Object.values(ui.windows).forEach(app => app.render(true));
	}
});
