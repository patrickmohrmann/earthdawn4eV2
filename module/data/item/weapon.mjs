import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import { inRange } from "../../utils.mjs";

/**
 * Data model template with information on weapon items.
 * @property {string} weaponType            type of weapon
 * @property {object} damage                damage object
 * @property {string} damage.attribute       base attribute used for damage
 * @property {number} damage.baseStep        weapon basic damage step
 * @property {number} size                  weapon size 1-7
 * @property {number} strengthMinimum       strength minimum to use without penalty
 * @property {number} dexterityMinimum      dexterity minimum to use without penalty
 * @property {number} rangeShort            short range
 * @property {number} rangeLong             long range
 * @property {number} ammunition            ammunition amount
 * @property {number} forgeBonus            forged damage bonus
 */
export default class WeaponData extends PhysicalItemTemplate.mixin(
  ItemDescriptionTemplate
) {

    static _itemStatusOrder = [ "owned", "carried", "mainHand", "offHand", "twoHands", "tail" ];

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return this.mergeSchema( super.defineSchema(), {
            weaponType: new fields.StringField( {
                required: true,
                nullable: true,
                initial: "",
                label: "ED.Item.Weapon.Label.weaponType",
                hint: "ED.Item.Weapon.Hint.weaponType"
            } ),
            damage: new fields.SchemaField( {
                attribute: new fields.StringField( {
                    required: true,
                    nullable: false,
                    initial: "str",
                    label: "ED.Item.Weapon.Label.damageAttribute",
                    hint: "ED.Item.Weapon.Hint.damageAttribute"
                } ),
                baseStep: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Weapon.Label.damageBaseStep",
                    hint: "ED.Item.Weapon.Hint.damageBaseStep"
                } ),
            } ),
            size: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 1,
                max: 7,
                initial: 1,
                integer: true,
                positive: true,
                label: "ED.Item.Weapon.Label.size",
                hint: "ED.Item.Weapon.Hint.size"
            } ),
            strengthMinimum: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 3,
                initial: 3,
                integer: true,
                label: "ED.Item.Weapon.Label.strengthMinimum",
                hint: "ED.Item.Weapon.Hint.strengthMinimum"
            } ),
            dexterityMinimum: new fields.NumberField( {
                required: true,
                nullable: true,
                min: 0,
                integer: true,
                label: "ED.Item.Weapon.Label.dexterityMinimum",
                hint: "ED.Item.Weapon.Hint.dexterityMinimum"
            } ),
            range: new fields.SchemaField( {
                shortMin: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Weapon.rangeShort"
                } ),
                shortMax: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Weapon.rangeShort"
                } ),
                longMin: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 0,
                    initial: 0,
                    integer: true,
                    label: "ED.Item.Weapon.rangeLong"
                } ),
                longMax: new fields.NumberField( {
                    required: true,
                    nullable: false,
                    min: 1,
                    initial: 1,
                    integer: true,
                    label: "ED.Item.Weapon.rangeLong"
                } ),
            } ),
            ammunition: new fields.SchemaField( {
                amount: new fields.NumberField( {
                    required: true,
                    nullable: true,
                    min: 0,
                    integer: true,
                    label: "ED.Item.Weapon.Label.ammunition"
                } ),
                type: new fields.StringField( {
                    required: true,
                    nullable: true,
                    blank: true,
                    initial: "",
                label: "ED.Item.Weapon.ammunition.type"
            } ),
            } ),
            forgeBonus: new fields.NumberField( {
                required: true,
                nullable: false,
                min: 0,
                initial: 0,
                integer: true,
                label: "ED.Item.Weapon.Label.forgeBonus",
                hint: "ED.Item.Weapon.Hint.forgeBonus"
            } ),
        } );
    }

    /* -------------------------------------------- */
    /*  Getters                                     */
    /* -------------------------------------------- */

    /** @override */
    get nextItemStatus() {
        const namegiver = this.parent.parent?.namegiver;
        const weaponSizeLimits = namegiver?.system.weaponSize;

        // no limits or tail given, every status is okay
        if ( !weaponSizeLimits ) return super.nextItemStatus;
        return this._rotateValidItemStatus( this.statusIndex, false );
    }

    /** @override */
    get previousItemStatus() {
        const namegiver = this.parent.parent?.namegiver;
        const weaponSizeLimits = namegiver?.system.weaponSize;

        // no limits or tail given, every status is okay
        if ( !weaponSizeLimits ) return super.previousItemStatus;
        return this._rotateValidItemStatus( this.statusIndex, true );
    }

    /**
     * Checks if the weapon type is a two-handed ranged weapon. True if the weapon
     * type is either 'bow' or 'crossbow', and false otherwise.
     * @type {boolean}
     */
    get isTwoHandedRanged() {
        return ["bow", "crossbow"].includes( this.weaponType );
    }

    /* -------------------------------------------- */
    /*  Methods                                     */
    /* -------------------------------------------- */

    /**
     * Rotates the status of the item based on the current status.
     * The rotation follows the order defined in `_itemStatusOrder`.
     *
     * @param {number} currentStatusIndex - The index of the current status in `_itemStatusOrder`.
     * @param {boolean} [backwards=false] - If true, rotates the status backwards. If false or not provided, rotates the status forwards.
     * @returns {string} The next valid status for the item if rotating forwards, or the previous valid status if rotating backwards.
     */
    _rotateValidItemStatus( currentStatusIndex, backwards = false ) {
        return backwards ? this._getPreviousItemStatus( currentStatusIndex ) : this._getNextItemStatus( currentStatusIndex );
    }

    /**
     * Determines the next status of the item based on the current status.
     * It follows the order defined in `_itemStatusOrder`.
     * If the item can be handled with the next status, it returns the next status.
     * If not, it recursively calls itself with the next status index until it finds a valid status.
     *
     * @param {number} currentStatusIndex - The index of the current status in `_itemStatusOrder`.
     * @returns {string} The next valid status for the item.
     */
    _getNextItemStatus( currentStatusIndex ) {
        const statusOrder = this.constructor._itemStatusOrder;
        const namegiver = this.parent.parent?.namegiver;

        switch ( statusOrder[currentStatusIndex] ) {
            case "owned":
                return "carried";
            case "carried":
                return this.canBeHandledWith( "mainHand", namegiver )
                  ? "mainHand"
                  : this._getNextItemStatus( ++currentStatusIndex );
            case "mainHand":
                return this.canBeHandledWith( "offHand", namegiver )
                  ? "offHand"
                  : this._getNextItemStatus( ++currentStatusIndex );
            case "offHand":
                return this.canBeHandledWith( "twoHands", namegiver )
                  ? "twoHands"
                  : this._getNextItemStatus( ++currentStatusIndex );
            case "twoHands":
                return this.canBeHandledWith( "tail", namegiver ) ? "tail" : "owned";
            case "tail":
            default:
                return "owned";
        }
    }

    _getPreviousItemStatus( currentStatusIndex ) {
        const statusOrder = this.constructor._itemStatusOrder;
        const namegiver = this.parent.parent?.namegiver;

        if ( currentStatusIndex < 0 ) currentStatusIndex = statusOrder.length - 1;

        switch ( statusOrder[currentStatusIndex] ) {
            case "tail":
                return this.canBeHandledWith( "twoHands", namegiver )
                  ? "twoHands"
                  : this._getPreviousItemStatus( --currentStatusIndex );
            case "twoHands":
                return this.canBeHandledWith( "offHand", namegiver )
                  ? "offHand"
                  : this._getPreviousItemStatus( --currentStatusIndex );
            case "offHand":
                return this.canBeHandledWith( "mainHand", namegiver )
                  ? "mainHand"
                  : this._getPreviousItemStatus( --currentStatusIndex );
            case "mainHand":
                return "carried";
            case "carried":
                return "owned";
            case "owned":
                return this.canBeHandledWith( "tail", namegiver )
                  ? "tail"
                  : this._getPreviousItemStatus( --currentStatusIndex );
            default:
                return "owned";
        }
    }

    /**
     * Check if the weapon is possible for the given handling type based on the  limits given in the namegiver.
     * @param {string} handlingType The handling type to check for. One of "mainHand", "offHand", "oneHand", "twoHands", "tail".
     * @param {ItemEd} namegiver The namegiver document.
     * @returns {boolean} True if the weapon is within the limits of the namegiver for the given handling.
     * If no namegiver or appropriate limits are given, returns `undefined`.
     */
    canBeHandledWith( handlingType, namegiver ) {
        const hasTailAttack = namegiver?.system.tailAttack;
        const weaponSizeLimits = namegiver?.system.weaponSize;
        const size = this.size;
        if ( !weaponSizeLimits || size == null || hasTailAttack == null ) return undefined;

        switch ( handlingType ) {
            case "oneHand":
            case "mainHand":
            case "offHand":
                return inRange( size, weaponSizeLimits.oneHanded.min, weaponSizeLimits.oneHanded.max )
                  && !this.isTwoHandedRanged;
            case "twoHands":
                return inRange( size, weaponSizeLimits.twoHanded.min, weaponSizeLimits.twoHanded.max )
                  || this.isTwoHandedRanged;
            case "tail":
                return hasTailAttack && size <= 2;
            default:
                return undefined;
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