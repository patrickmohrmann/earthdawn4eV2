import ED4E from "../../../config.mjs";

/**
 * Data model template for Challenge types
 * @property {object} challenge        The object containing the challenge data for different challenge types.  
 * @property {string} challenge.rate   Challenge rate.
 * Später zu erweitern mit Environment und vielem mehr 
 * @mixin
 */
export default class ChallengeFields {

    static get challenge() {
        const fields = foundry.data.fields;
        return {
            challenge: new fields.SchemaField( {
                rate: new fields.StringField( {
                    required: true,
                    nullable: false,
                    initial: "circle1",
                    choices: ED4E.challengeRates,
                    label: "ED.Data.Actor.Labels.challengeRate",
                    hint: "ED.Data.Actor.Hints.challengeRate"
                } ), 
            } )
        };
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