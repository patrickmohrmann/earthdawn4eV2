import SentientTemplate from "./sentient.mjs";

/**
 * A template for all actors that represent namegivers, that is, PCs and NPCs.
 * @mixin
 */
export default class NamegiverTemplate extends SentientTemplate {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema(super.defineSchema(), {
            languages: new fields.SchemaField( {
                speak: this.getLanguageDataField(),
                readWrite: this.getLanguageDataField(),
            } ),
        } );
    }

    static getLanguageDataField() {
        const fields = foundry.data.fields;
        return new fields.SetField(
          new fields.StringField( {
              blank: false,
              // choices need to be in the form of an object with the same key and value
              // for the `formField` Handlebars helper to work correctly and have the name
              // as the value attribute of the option tag
              choices: () => {
                const languages = game.settings.get("ed4e", "languages");
                if (!languages || languages.length === 0) {
                  return {}; // Skip the function and return an empty object
                }
                return Object.fromEntries(languages.map(lang => [lang, lang]));
              }
          } ),
          {
              required: true,
              nullable: false,
              initial: [],
          }
        )
    }

    /**
     * Gets the type of magic of the first thread weaving talent encountered.
     * @type {string} The type of thread weaving magic as defined in {@link ED4E.spellcastingTypes},
     * or an empty string if there is no corresponding talent.
     */
    get magicType() {
        const threadWeavingTalents = this.parent.items.filter( item => item.system?.magic?.threadWeaving );
        return threadWeavingTalents[0]?.system.magic.magicType ?? "";
    }

    /* -------------------------------------------- */
    /*  Migrations                                  */
    /* -------------------------------------------- */

    /** @inheritDoc */
    static migrateData( source ) {
        super.migrateData( source );
        // specific migration functions
    }
}