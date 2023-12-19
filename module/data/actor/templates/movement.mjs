export default class MovementFields {
  /**
   * Fields that describe movement shared between sentient actors and namegiver items.
   * @type {object}
   * @property {object} movement        The object containing the speed data for different movement types.
   * @property {number} movement.walk   Walking speed.
   * @property {number} movement.fly    Flying speed.
   * @property {number} movement.swim   Swimming speed.
   * @property {number} movement.burrow Burrowing speed.
   * @property {number} movement.climb  Climbing speed.
   */
  static get movement() {
    return {
      movement: new foundry.data.fields.SchemaField( {
          walk: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            min: 0,
            initial: 0,
            integer: true,
            label: "ED.Item.Namegiver.walk"
          } ),
          fly: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            min: 0,
            initial: 0,
            integer: true,
            label: "ED.Item.Namegiver.fly"
          } ),
          swim: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            min: 0,
            initial: 0,
            integer: true,
            label: "ED.Item.Namegiver.swim"
          } ),
          burrow: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            min: 0,
            initial: 0,
            integer: true,
            label: "ED.Item.Namegiver.burrow"
          } ),
          climb: new foundry.data.fields.NumberField( {
            required: true,
            nullable: false,
            min: 0,
            initial: 0,
            integer: true,
            label: "ED.Item.Namegiver.climb"
          } )
        },
        {
          label: "ED.Item.Namegiver.movement"
        }
      )
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