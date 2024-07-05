import ED4E from "../../config.mjs";

/**
 * Extend the basic ActorSheet with modifications
 * @augments {ActorSheet}
 */
export default class ActorSheetEd extends ActorSheet {

  /**
   * @override
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject( super.defaultOptions, {
      classes: [ "earthdawn4e", "sheet", "actor", "character-sheet" ],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: ".actor-sheet-tabs",
          contentSelector: ".actor-sheet-body",
          initial: "main",
        },
        {
          navSelector: ".actor-sheet-spell-tabs",
          contentSelector: ".actor-sheet-spell-body",
          initial: "spell-matrix-tab",
        },
      ],
      scrollY: [
        ".main",
      ],
    } );
  }

  /** @override */
  get template() {
    return `systems/ed4e/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */
  /*  Get Data            */
  /* -------------------------------------------- */
  async getData() {
    const systemData = super.getData();
    systemData.systemFields = this.document.system.schema.fields;
    systemData.enrichment = await this.actor._enableHTMLEnrichment();
    await this.actor._enableHTMLEnrichmentEmbeddedItems();
    systemData.config = ED4E;
    systemData.splitTalents = game.settings.get( "ed4e", "talentsSplit" );
    return systemData;
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners( html ) {
    super.activateListeners( html );

    // View Item Sheets
    html.find( ".item-edit" ).click( this._onItemEdit.bind( this ) );

    // All listeners below are only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute tests
    html.find( ".attribute-card__grid--item .rollable" ).click( this._onRollAttribute.bind( this ) );

    // Ability tests
    html.find( ".card__ability .rollable" ).click( this._onRollAbility.bind( this ) );

    // Equipment tests
    html.find( ".card__equipment .rollable" ).click( this._onRollEquipment.bind( this ) );

    // take strain
    html.find( ".card__ability .take-strain" ).click( this._onTakeStrain.bind( this ) );

    // toggle holding Tpye of an owned item
    html.find( ".item__status" ).mousedown( this._onChangeItemStatus.bind( this ) );

    // Owned Item management
    html.find( ".item-delete" ).click( this._onItemDelete.bind( this ) );

    // Actor Sheet Buttons
    html.find( ".action-buttons" ).click( event => {
      const action = event.currentTarget.dataset.action;
      const actionMapping = {
        "recovery": () => this._onRecoveryRoll( event ),
        "takeDamage": () => this._onTakeDamage( event ),
        "jumpUp": () => this._onJumpUp( event ),
        "initiative": () => this._onInitiative( event ),
        "halfMagic": () => this._onHalfMagic( event ),
        "knockdownTest": () => this._onKnockDown( event ),
      };
      // Check if the action exists in the mapping and call it
      if ( actionMapping.hasOwnProperty( action ) ) {
        actionMapping[action]();
      }
    } );

    // Effect Management
    html.find( ".effect-add" ).click( this._onEffectAdd.bind( this ) );
    html.find( ".effect-edit" ).click( this._onEffectEdit.bind( this ) );
    html.find( ".effect-delete" ).click( this._onEffectDelete.bind( this ) );

    // Karma refresh button --> karma ritual
    html.find( ".button__Karma-refresh" ).click( this._onKarmaRefresh.bind( this ) );

    // item card description shown on item click
    html.find( ".card__name" ).click( event => this._onCardExpand( event ) );

    // Legend point History (Earned)
    html.find( ".legend-point__history--earned" ).click( this._onLegendPointHistoryEarned.bind( this ) );

    html.find( ".item-upgrade__attribute" ).click( this._onAttributeEnhancement.bind( this ) );

    html.find( ".item-upgrade__ability" ).click( this._onAbilityEnhancement.bind( this ) );



     // NEW ######################################################
     html.on('click', '.group-header', event => {
      const header = event.currentTarget;
      const itemUuid = header.dataset.itemUuid;
  
      // Toggle the folded/unfolded state for each entry related to the clicked header
      html.find(`.group-entry[data-item-uuid="${itemUuid}"]`).each((index, entry) => {
        if ($(entry).hasClass('folded')) {
          $(entry).removeClass('folded').addClass('unfolded');
        } else {
          $(entry).removeClass('unfolded').addClass('folded');
        }
      });
    });
    // NEW ######################################################


  }

  /**
   * Handle changing the holding type of an owned item.
   * @description itemStatus.value =
   * 1: owned,
   * 2: carried,
   * 3: equipped,
   * 4: mainHand,
   * 5: offHand,
   * 6: twoHanded,
   * 7: tail
   * @param {Event} event      The originating click event.
   * @private
   */
  // eslint-disable-next-line complexity
  _onChangeItemStatus( event ) {
    event.preventDefault();

    // if left click is used, rotate the item normally
    const rotate = event.button === 0 || event.button === 2;
    // if shift+left click is used, unequip the item
    const unequip = rotate && event.shiftKey;
    // middle click is used to deposit the item
    const deposit = event.button === 1;
    // if right click is used, rotate status backwards
    const backwards = event.button === 2;

    const li = event.currentTarget.closest( ".item-id" );
    const item = this.actor.items.get( li.dataset.itemId );

    if ( unequip ) return item.system.carry()?.then( _ => this.render() );
    if ( rotate ) return this.actor.rotateItemStatus( item.id, backwards ).then( _ => this.render() );
    if ( deposit ) return item.system.deposit()?.then( _ => this.render() );
  }


  /**
   * Legend Point history earned
   * @param { Event } event    The originating click event.
   * @private
   */
  _onLegendPointHistoryEarned( event ) {
    event.preventDefault();
    this.actor.legendPointHistoryEarned( this.actor );
  }

/**
 * @description This function is used to upgrade attributes
 */
async _onAttributeEnhancement( event ) {
  event.preventDefault();
  const attribute = event.currentTarget.dataset.attribute;
  await this.actor.upgradeAttribute( attribute );
}

/**
 * @description This function is used to upgrade attributes
 */
async _onAbilityEnhancement( event ) {
  event.preventDefault();
  const li = event.currentTarget.closest( ".item-id" );
  const ability = this.actor.items.get( li.dataset.itemId );
  this.actor.upgradeAbility( ability );
}

  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollAttribute( event ) {
    event.preventDefault();
    const attribute = event.currentTarget.dataset.attribute;
    this.actor.rollAttribute( attribute, { event: event } );
  }

  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollAbility( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-id" );
    const ability = this.actor.items.get( li.dataset.itemId );
    this.actor.rollAbility( ability, { event: event } );
  }

  /**
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollEquipment( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-id" );
    const equipment = this.actor.items.get( li.dataset.itemId );
    this.actor.rollEquipment( equipment, { event: event } );
  }

  /**
   * @description Take strain is used for non-rollable abilities which requires strain. player can click on the icon to take the strain damage
   * @param {Event} event     The originating click event
   * @private
   */
    _onTakeStrain( event ) {
        event.preventDefault();
        const li = event.currentTarget.closest( ".item-id" );
        const ability = this.actor.items.get( li.dataset.itemId );
        this.actor.takeStrain( ability.system.strain );
    }

  /**
   * Handles Recovery tests
   * @param {Event} event The originating click event.
   * @private
   */
  async _onRecoveryRoll( event ) {
    event.preventDefault();
    const recoveryMode = await this.actor.getPrompt( "recovery" );
    this.actor.rollRecovery( recoveryMode, {event: event} );
  }

  async _onTakeDamage( event ) {
    const takeDamage = await this.actor.getPrompt( "takeDamage" );
    if ( !takeDamage || takeDamage === "close" ) return;

    this.actor.takeDamage(
      takeDamage.damage,
      false,
      takeDamage.damageType,
      takeDamage.armorType,
      takeDamage.ignoreArmor,
    );
  }

  _onJumpUp( event ) {
    event.preventDefault();
    this.actor.jumpUp( {event: event} );
  }

  _onInitiative( event ) {
    event.preventDefault();
    this.actor.rollInitiative( {event: event} );
  }

  _onHalfMagic( event ) {
    event.preventDefault();
    this.actor.rollHalfMagic( {event: event} );
  }

  _onKnockDown( event ) {
    event.preventDefault();
    const damageTaken = 0;
    this.actor.knockdownTest( damageTaken );
  }


  /**
   * Handle creating an owned ActiveEffect for the Actor.
   * @param {Event} event     The originating click event.
   * @returns {Promise|null}  Promise that resolves when the changes are complete.
   * @private
   */
  _onEffectAdd( event ) {
    event.preventDefault();
    return this.actor.createEmbeddedDocuments( "ActiveEffect", [ {
      label: "New Effect",
      icon: "icons/svg/item-bag.svg",
      duration: { rounds: 1 },
      origin: this.actor.uuid
    } ] );
  }

  /**
   * Handle deleting an existing Owned ActiveEffect for the Actor.
   * @param {Event} event                       The originating click event.
   * @returns {Promise<ActiveEffect>|undefined} The deleted item if something was deleted.
   * @private
   */
  _onEffectDelete( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const effect = this.actor.effects.get( itemId );
    if ( !effect ) return;
    return effect.deleteDialog();
  }

  /**
   * Handle editing an existing Owned ActiveEffect for the Actor.
   * @param {Event}event    The originating click event.
   * @returns {any}         The rendered item sheet.
   * @private
   */

  _onEffectEdit( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const effect = this.actor.effects.get( itemId );
    return effect.sheet?.render( true );
  }

  /**
   * Handle deleting an existing Owned Item for the Actor.
   * @param {Event} event                 The originating click event.
   * @returns {Promise<ItemEd>|undefined} The deleted item if something was deleted.
   * @private
   */
  async _onItemDelete( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const item = this.actor.items.get( itemId );
    if ( !item ) return;
    return item.deleteDialog();
  }

  /**
   * Handle editing an existing Owned Item for the Actor.
   * @param {Event}event    The originating click event.
   * @returns {ItemSheetEd} The rendered item sheet.
   * @private
   */
  _onItemEdit( event ) {
    event.preventDefault();
    const itemId = event.currentTarget.parentElement.dataset.itemId;
    const item = this.actor.items.get( itemId );
    return item.sheet?.render( true );
  }

  _onKarmaRefresh() {
    this.actor.karmaRitual();
  }

  _onCardExpand( event ) {
    event.preventDefault();

    const itemDescription = $( event.currentTarget )
      .parent( ".item-id" )
      .parent( ".card__ability" )
      .children( ".card__description" );

    itemDescription.toggleClass( "card__description--toggle" );
  }

  async _onDropItem(event, data) {
    const itemData = await fromUuid(data.uuid);
    // Items which cost LP once added to the actor
    const lpRelevantItemTypes = ["knackAbility", "knackKarma", "knackManeuver", "spell", "spellKnack", "thread"];
    if (this.actor.type === "character" && lpRelevantItemTypes.includes(itemData.type)) {
      // Parse the dropped data
      try {
        data = JSON.parse(event.dataTransfer.getData('text/plain'));
      } catch (err) {
        return false;
      }

      // Confirm dialog
      const confirmed = await new Promise((resolve) => {
        new Dialog({
          title: "Confirm Item Drop",
          content: "<p>Do you want to add this item to the actor?</p>",
          buttons: {
            free: {
              icon: '<i class="fas fa-check"></i>',
              label: "For Free",
              callback: async () => {
                // this.actor.addAbility( itemData, false, true );
                const abilityAddedSuccessfully = await this.actor.addAbility(itemData, false, true);
                if (!abilityAddedSuccessfully) {
                  console.error("Failed to add LP transaction. Aborting item drop.");
                  return; // Exit if the LP transaction was not successful
                } else {
                  super._onDropItem(event, data);
                }
                resolve(true);
              },
            },
            spendLP: {
              icon: '<i class="fas fa-check"></i>',
              label: "Spend LP",
              callback: async () => {
                // this.actor.addAbility( itemData, false, true );
                const abilityAddedSuccessfully = await this.actor.addAbility(itemData, false, true);
                if (!abilityAddedSuccessfully) {
                  console.error("Failed to add LP transaction. Aborting item drop.");
                  return; // Exit if the LP transaction was not successful
                } else {
                  super._onDropItem(event, data);
                }
                resolve(true);
              },
            },
            no: {
              icon: '<i class="fas fa-times"></i>',
              label: "No",
              callback: () => resolve(false),
            },
          },
          default: "no",
          close: () => resolve(false),
        }).render(true);
      });

      if (confirmed) {
        return super._onDropItem(event, data);
      } else {
        return false;
      }
    } else if (itemData.type === "talent") {
      if (this.actor.type === "character") {
        // Parse the dropped data
        try {
          data = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch (err) {
          return false;
        }
        // Confirm dialog
        const confirmed = await new Promise((resolve) => {
          new Dialog({
            title: "Confirm Item Drop",
            content: "<p>Do you want to add this item to the actor?</p>",
            buttons: {
              free: {
                icon: '<i class="fas fa-check"></i>',
                label: "Standard Talent",
                callback: async () => {
                  resolve(true);
                  super._onDropItem(event, data);
                },
              },
              spendLP: {
                icon: '<i class="fas fa-check"></i>',
                label: "Versatility Talent",
                callback: async () => {
                  // this.actor.addAbility( itemData, false, true );
                  const versatility = this.actor.items.find(i => i.type === "talent" && i.system.edid === "versatility");
                  const versatilityTalentsCount = this.actor.items.filter(i => 
                    i.type === "talent" && 
                    i.system.edid === "versatility" && 
                    i.system.talentCategory === "versatility"
                  ).length;
                  if (versatility) {
                    const currentVersatilityTalents = this.actor.items.filter(i => i.type === "talent" && i.system.talentCategory === "versatility");
                    if (currentVersatilityTalents.length >= versatility.system.level + versatilityTalentsCount) {
                      ui.notifications.error("You already have the maximum number of Versatility Talents.");
                      return
                    } else {
                      super._onDropItem(event, data);
                    }
                    resolve(true);
                  } else if ( itemData.system.talentCategory === "versatility" && itemData.system.edid === "versatility") {
                    super._onDropItem(event, data);
                  } else {
                    ui.notifications.error("You do not have the Versatility Talent.");
                    return
                  }
                }
              },
              no: {
                icon: '<i class="fas fa-times"></i>',
                label: "No",
                callback: () => resolve(false),
              },
            },
            default: "no",
            close: () => resolve(false),
          }).render(true);
        });

        if (confirmed) {
          // return super._onDropItem(event, data);
        } else {
          return false;
        }
      }
    } else return super._onDropItem(event, data);
  
  }

  async _onDropItem(event, data) {
    const itemData = await fromUuid(data.uuid);
    // Items which cost LP once added to the actor
    const knacks = ["knackAbility", "knackKarma", "knackManeuver"];
    const spells = ["spell", "spellKnack"];
    const abilities = ["talent", "skills", "devotions"];
    const threads = ["thread"];
    if ( this.actor.type === "character" ) {
      if ( knacks.includes(itemData.type ) ) {

      } else if ( spells.includes(itemData.type ) ) {
          
        } else if ( abilities.includes(itemData.type ) ) {
          
          } else if ( threads.includes(itemData.type ) ) {
          
            } else return super._onDropItem(event, data);
    } else return super._onDropItem(event, data);
  }
}