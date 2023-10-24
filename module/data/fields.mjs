/*
* Field implementations are taken from the [DnD5e system]{@link https://github.com/foundryvtt/dnd5e}
*/

/**
 * Special case StringField that includes automatic validation for identifiers.
 */
export class IdentifierField extends foundry.data.fields.StringField {
  /**
   * @override
   */
  _validateTyp( value ) {
    if ( ed4e.utils.validators.isValidIdentifier( value ) ) {
      throw new Error( game.i18n.localize( "ED.Errors.IdentifierError" ) );
    }
  }
}

/* -------------------------------------------- */

/**
 * @callback MappingFieldInitialValueBuilder
 * @param {string} key       The key within the object where this new value is being generated.
 * @param {*} initial        The generic initial data provided by the contained model.
 * @param {object} existing  Any existing mapping data.
 * @returns {object}         Value to use as default for this key.
 */

/**
 * @typedef {DataFieldOptions} MappingFieldOptions
 * @property {string[]} [initialKeys]       Keys that will be created if no data is provided.
 * @property {MappingFieldInitialValueBuilder} [initialValue]  Function to calculate the initial value for a key.
 * @property {boolean} [initialKeysOnly=false]  Should the keys in the initialized data be limited to the keys provided
 *                                              by `options.initialKeys`?
 */

/**
 * A subclass of ObjectField that represents a mapping of keys to the provided DataField type.
 * @param {DataField} model                    The class of DataField which should be embedded in this field.
 * @param {MappingFieldOptions} [options={}]   Options which configure the behavior of the field.
 * @property {string[]} [initialKeys]          Keys that will be created if no data is provided.
 * @property {MappingFieldInitialValueBuilder} [initialValue]  Function to calculate the initial value for a key.
 * @property {boolean} [initialKeysOnly=false]  Should the keys in the initialized data be limited to the keys provided
 *                                              by `options.initialKeys`?
 */
export class MappingField extends foundry.data.fields.ObjectField {
  constructor( model, options ) {
    if ( !( model instanceof foundry.data.fields.DataField ) ) {
      throw new Error( 'MappingField must have a DataField as its contained element' );
    }
    super( options );

    /**
     * The embedded DataField definition which is contained in this field.
     * @type {DataField}
     */
    this.model = model;
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  static get _defaults() {
    return foundry.utils.mergeObject( super._defaults, {
      initialKeys: null,
      initialValue: null,
      initialKeysOnly: false,
    } );
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  _cleanType( value, options ) {
    Object.entries( value ).forEach(
      // disable eslint for the rule `no-return-assign`
      // this would apply in the following line, since arrow functions have an implicit `return`
      // it is, however, good practice to write it in that short concise manner
      // (the irony of the fact that this comment now make the code more unreadable than just using curly braces is not lost on me ;) )
      // see https://github.com/eslint/eslint/issues/5150
      /* eslint-disable */
      ([k, v]) => (value[k] = this.model.clean(v, options)),
      /* eslint-enable */
    );
    return value;
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  getInitialValue( data ) {
    let keys = this.initialKeys;
    const initial = super.getInitialValue( data );
    if ( !keys || !foundry.utils.isEmpty( initial ) ) return initial;
    if ( !( keys instanceof Array ) ) keys = Object.keys( keys );
    for ( const key of keys ) {
      initial[key] = this._getInitialValueForKey( key );
    }
    return initial;
  }

  /* -------------------------------------------- */

  /**
   * Get the initial value for the provided key.
   * @param {string} key      Key within the object being built.
   * @param {object} [object] Any existing mapping data.
   * @returns {*}              Initial value based on provided field type.
   */
  _getInitialValueForKey( key, object ) {
    const initial = this.model.getInitialValue();
    return this.initialValue?.( key, initial, object ) ?? initial;
  }

  /* -------------------------------------------- */

  /**
   * @override
   */
  _validateType( value, options = {} ) {
    if ( foundry.utils.getType( value ) !== 'Object' ) throw new Error( 'Must be an Object' );
    const errors = this._validateValues( value, options );
    if ( !foundry.utils.isEmpty( errors ) ) {
      throw new foundry.data.validation.DataModelValidationError(
        Object.entries( errors ).map(
          ( [k, v] ) => `\n${k}: ${errors[k].toString()}`
        ).join( '' )
      );
    }
  }

  /* -------------------------------------------- */

  /**
   * Validate each value of the object.
   * @param {object} value    The object to validate.
   * @param {object} options  Validation options.
   * @returns {Object<Error>} An object of value-specific errors by key.
   */
  _validateValues( value, options ) {
    const errors = {};
    for ( const [k, v] of Object.entries( value ) ) {
      const error = this.model.validate( v, options );
      if ( error ) errors[k] = error;
    }
    return errors;
  }

  /* -------------------------------------------- */

  /**
   * @override
   */
  initialize( value, model, options = {} ) {
    if ( !value ) return value;
    const obj ={};
    const initialKeys = ( this.initialKeys instanceof Array ) ? this.initialKeys : Object.keys( this.initialKeys ?? {} );
    const keys = this.initialKeysOnly ? initialKeys : Object.keys( value );
    for ( const key of keys ) {
      const data = value[key] ?? this._getInitialValueForKey( key, value );
      obj[key] = this.model.initialize( data, model, options );
    }
    return obj;
  }

  /* -------------------------------------------- */

  /**
   * @inheritDoc
   */
  _getField( path ) {
    if ( path.length === 0 ) {
      return this;
    } else if ( path.length === 1 ) {
      return this.model;
    }
    path.shift();
    return this.model._getField( path );
  }
}
