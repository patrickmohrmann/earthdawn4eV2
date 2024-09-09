import ActorDescriptionTemplate from "./templates/description.mjs";
import NamegiverTemplate from "./templates/namegiver.mjs";


/**
 * System data definition for NPCs.
 * @mixin
 */
export default class NpcData extends NamegiverTemplate.mixin(
    ActorDescriptionTemplate
) {

    /** @inheritDoc */
    static _systemType = "npc";

    /* -------------------------------------------- */

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            mobRules: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Actor.Configuration.mobRules"
            } ),
            // characteristics: new fields.SchemaField( {
            //     health: new fields.SchemaField( {
                    maxWounds: new fields.NumberField( {
                        required: true,
                        initial: 0,
                        label: "ED.Actor.Configuration.maxWounds"
                    } ),
            //     } )
            // } )
        } );
    }

    static LOCALIZATION_PREFIXES = ["ED.Actor"];

    /* -------------------------------------------- */
    /*  Data Preparation                            */
    /* -------------------------------------------- */

    /** @inheritDoc */
    prepareBaseData() {
        super.prepareBaseData();
        this.#prepareBaseAttributes();
    }

    /* -------------------------------------------- */

    /**
     * Prepare calculated attribute values and corresponding steps.
     * @private
     */
    #prepareBaseAttributes() {
        for ( const attributeData of Object.values( this.attributes ) ) {
            attributeData.baseStep = attributeData.step;
        }
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