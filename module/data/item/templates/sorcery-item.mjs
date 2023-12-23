import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on items that are used to represent custom active effects.
 */
export default class MagicTemplate extends SystemDataModel {
    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            level: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 1,
                integer: true,
                positive: true,
                label: "ED.Item.Spell.circle"
            } ), 
            threadsrequired: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Spell.threadsrequired"
            } ),
            weavingdifficulty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Spell.weavingdifficulty"
            } ),
            reattunedifficulty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Spell.threadsrreattunedifficultyequired"
            } ),
            castingdifficulty: new foundry.data.fields.StringField( {
                required: true,
                blank: true,
                initial: "mystic defense",
                label: "ED.Item.Spell.castingdifficulty"
            } ),
            effect: new foundry.data.fields.StringField( {
                required: true,
                blank: true,
                initial: "",
                label: "ED.Item.Spell.effect"
            } ),
            sourceDiscipline: new foundry.data.fields.StringField( {
                required: true,
                blank: false,
                initial: "elementalist",
                label: "ED.Item.Spell.sourceDiscipline"
            } ),
            concentration: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.concentration"
            } ),
            binding: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.binding"
            } ),
            spirit: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.spirit"
            } ),
            summoning: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.summoning"
            } ),
            resist: new foundry.data.fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.resist"
            } ),
            duration: new foundry.data.fields.SchemaField( {
                value: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.value"
                } ),
                uom: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "yard",
                    label: "ED.Item.Spell.uom"
                } )
            },
            {
                label: "ED.Item.Spell.duration"
            } ),
            range: new foundry.data.fields.SchemaField( {
                value: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.shape"
                } ),
                uom: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "yard",
                    label: "ED.Item.Spell.uom"
                } )
            },
            {
                label: "ED.Item.Spell.range"
            } ),
            spellArea: new foundry.data.fields.SchemaField( {
                shape: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.shape"
                } ),
                value: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.shape"
                } ),
                uom: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "yard",
                    label: "ED.Item.Spell.uom"
                } )
            },
            {
                label: "ED.Item.Spell.spellArea"
            } ),
            spellIllustion: new foundry.data.fields.SchemaField( {
                illusionType: new foundry.data.fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "figment",
                    label: "ED.Item.Spell.illusionType"
                } ),
                sensingDifficulty: new foundry.data.fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Spell.sensingDifficulty"
                } )
            },
            {
                label: "ED.Item.Spell.spellIllustion"
            } ),
            spellElement: new foundry.data.fields.SchemaField( {
                elementType: new foundry.data.fields.StringField( {
                    required: true,
                    blank: true,
                    initial: "",
                    label: "ED.Item.Spell.elementType"
                } ),
                elementSubtype: new foundry.data.fields.StringField( {
                    required: true,
                    blank: true,
                    initial: "",
                    label: "ED.Item.Spell.elementSubtype"
                } )
            },
            {
                label: "ED.Item.Spell.spellElement"
            } ),
            // @chriss its not working like this
            // extraSuccessesList: [],
            // extraThreadsList: [],
        } );
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