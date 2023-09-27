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