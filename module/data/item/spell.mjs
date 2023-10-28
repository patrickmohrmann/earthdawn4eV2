import SystemDataModel from "../abstract.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

/**
 * Data model template with information on Spell items.
 * @property {number} circle                                circle
 * @property {number} threadsrequired                       required threads to cast the sepll
 * @property {number} weavingdifficulty                     weaving difficulty
 * @property {number} reattunedifficulty                    difficulty to re attune the spell
 * @property {number} castingdifficulty                     casting difficulty
 * @property {object} duration                              duration
 * @property {number} duration.value                        spell duration value
 * @property {string} duration.uom                          spell duration range unit
 * @property {object} range                                 range
 * @property {number} range.value                           spell range value
 * @property {string} range.uom                             spell range unit
 * @property {string} effect                                Effect
 * @property {string} sourceDiscipline                      Disciplin of the Spell
 * @property {boolean} concentration                        Concentration needed
 * @property {boolean} binding                              binding spell
 * @property {boolean} spirit                               spirit
 * @property {boolean} summoning                            summoning spell
 * @property {boolean} resist                               possible to resist
 * @property {object} spellArea                             spell area
 * @property {string} spellArea.shape                       spell area shape
 * @property {string} spellArea.uom                         spell area range unit
 * @property {object} spellIllustion                        illusion
 * @property {string} spellIllustion.illusionType           type of illusion
 * @property {number} spellIllustion.sensingDifficulty      sensing difficulty
 * @property {object} spellElement                          spell element
 * @property {string} spellElement.elementType              element type
 * @property {string} spellElement.elementSubtype           element subtype
 * @property {object} extraSuccessesList                    extra Successes
 * @property {object} extraThreadsList                      extra Threads   
 */
export default class SpellData extends SystemDataModel.mixin(
    ItemDescriptionTemplate
)  {

    /** @inheritDoc */
    static defineSchema() {
        return this.mergeSchema( super.defineSchema(), {
            circle: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Spell.circle"
            } ), 
            threadsrequired: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Spell.threadsrequired"
            } ),
            weavingdifficulty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                label: "ED.Item.Spell.weavingdifficulty"
            } ),
            reattunedifficulty: new foundry.data.fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
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
                    initial: "circle",
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
                    initial: "circle",
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
                    initial: "circle",
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