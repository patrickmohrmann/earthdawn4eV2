import SystemDataModel from "../../abstract.mjs";
import TargetTemplate from "./targeting.mjs";
import ED4E from "../../../config.mjs";

/**
 * Data model template with information on items that are used to represent custom active effects.
 */
export default class MagicTemplate extends SystemDataModel .mixin( 
    TargetTemplate 
) {
    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            magicType: new fields.StringField( {
                required: true,
                nullable: true,
                blank: true,
                trim: true,
                choices: ED4E.spellcastingTypes,
                label: "X.magicType",
                hint: "X.the type of thread weaving this talent belongs to",
            } ),
            level: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                initial: 1,
                integer: true,
                positive: true,
                label: "ED.Item.Spell.circle"
            } ), 
            threadsrequired: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Spell.threadsrequired"
            } ),
            weavingdifficulty: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Spell.weavingdifficulty"
            } ),
            reattunedifficulty: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Spell.threadsrreattunedifficultyequired"
            } ),
            castingdifficulty: new fields.StringField( {
                required: true,
                blank: true,
                initial: "mystic defense",
                label: "ED.Item.Spell.castingdifficulty"
            } ),
            effect: new fields.StringField( {
                required: true,
                blank: true,
                initial: "",
                label: "ED.Item.Spell.effect"
            } ),
            concentration: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.concentration"
            } ),
            binding: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.binding"
            } ),
            spirit: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.spirit"
            } ),
            summoning: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.summoning"
            } ),
            resist: new fields.BooleanField( {
                required: true,
                initial: false,
                label: "ED.Item.Spell.resist"
            } ),
            duration: new fields.SchemaField( {
                value: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.value"
                } ),
                uom: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "yard",
                    label: "ED.Item.Spell.uom"
                } )
            },
            {
                label: "ED.Item.Spell.duration"
            } ),
            range: new fields.SchemaField( {
                value: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.shape"
                } ),
                uom: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "yard",
                    label: "ED.Item.Spell.uom"
                } )
            },
            {
                label: "ED.Item.Spell.range"
            } ),
            spellArea: new fields.SchemaField( {
                shape: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.shape"
                } ),
                value: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "0",
                    label: "ED.Item.Spell.shape"
                } ),
                uom: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "yard",
                    label: "ED.Item.Spell.uom"
                } )
            },
            {
                label: "ED.Item.Spell.spellArea"
            } ),
            spellIllustion: new fields.SchemaField( {
                illusionType: new fields.StringField( {
                    required: true,
                    blank: false,
                    initial: "figment",
                    label: "ED.Item.Spell.illusionType"
                } ),
                sensingDifficulty: new fields.NumberField( {
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
            spellElement: new fields.SchemaField( {
                elementType: new fields.StringField( {
                    required: true,
                    blank: true,
                    initial: "",
                    label: "ED.Item.Spell.elementType"
                } ),
                elementSubtype: new fields.StringField( {
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