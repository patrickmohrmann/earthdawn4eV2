import SentientTemplate from "./sentient.mjs";

/**
 * A template for all actors that represent namegivers, that is, PCs and NPCs.
 * @mixin
 */
export default class NamegiverTemplate extends SentientTemplate {

    /** @inheritDoc */
    static defineSchema() {
        return super.defineSchema();
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