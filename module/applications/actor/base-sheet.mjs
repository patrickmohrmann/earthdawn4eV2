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
      classes: ['earthdawn4e', 'sheet', 'actor', 'character-sheet'],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: '.actor-sheet-tabs',
          contentSelector: '.actor-sheet-body',
          initial: 'main',
        },
        {
          navSelector: '.actor-sheet-spell-tabs',
          contentSelector: '.actor-sheet-spell-body',
          initial: 'spell-matrix-tab',
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
    html.find( ".card__ability .take-strain" ).click( this._takeStrain.bind( this ) );

    // toggle holding Tpye of an owned item
    html.find( ".item__status" ).click( this._onChangeItemStatus.bind( this ) );

    // Owned Item management
    html.find( ".item-delete" ).click( this._onItemDelete.bind( this ) );

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
    * 
    * @private
    */
    // eslint-disable-next-line complexity
    // _onChangeItemStatus( event ) {
    //   event.preventDefault();
    //   const li = event.currentTarget.closest( ".item-id" );
    //   const item = this.actor.items.get( li.dataset.itemId );
    //   const currentItemStatus = item.system.itemStatus.value;
    //   const namegiver = this.actor.items.filter( i => i.type === "namegiver" )
    //   let maxItemStatus = this.actor.items.filter( i => i.type === "namegiver" && i.system.tailAttack === true ).length > 0 ? 7 : 6;
    //   let newItemStatus = 0;
    //   const weapons = this.actor.items.filter( item => item.type === "weapon" );
    //   const shields = this.actor.items.filter( item => item.type === "shield" );
    //   const armorItems = this.actor.items.filter( item => item.type === "armor" );
    //   const weaponSize = item.system.size;
    //   const weaponSizeOneHandedMin = namegiver[0].system.weaponSize.oneHanded.min;
    //   const weaponSizeTwoHandedMin = namegiver[0].system.weaponSize.twoHanded.min;
    //   const weaponSizeTwoHandedMax = namegiver[0].system.weaponSize.twoHanded.max;
    //   let itemStatusNumber = currentItemStatus;
    

    
    
    //   if ( item.type === "weapon" ) {
    //     newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
    //     // check any weapon becoming a equipped
    //     if ( newItemStatus === 3 ) {
    //       // equipping a Weapon means either holding it in one or two hands
    //       if ( weaponSize >= weaponSizeOneHandedMin && weaponSize < weaponSizeTwoHandedMin && item.system.weaponType !== "bow" && item.system.weaponType !== "crossbow" ) {
    //         /// hier sollte vermutlich ein forEach rein der auf waffen itemStatus 4 prüft
    
    //         if ( weapons.filter( i => i.system.itemStatus.value === 4 ).length > 0 ) {
    //           newItemStatus = 5;
    //           weapons.forEach( weapon => {
    //             if ( weapon.system.itemStatus.value === 5 ) {
    //               weapon.update( { "system.itemStatus.value": 2 } );
    //             }
    //           } );
    //           shields.forEach( shield => {
    //             if ( shield.system.itemStatus.value === 5 ) {
    //               shield.update( { "system.itemStatus.value": 2 } );
    //             }
    //           } );
    //         } else {
    //           newItemStatus = 4;
    //           weapons.forEach( weapon => {
    //             if ( weapon.system.itemStatus.value === 4 || weapon.system.itemStatus.value === 6 ) {
    //               weapon.update( { "system.itemStatus.value": 2 } );
    //             }
    //           } );
    //         }
    //       } else
    //         // two handed weapons can only be equipped in two hands
    //         if ( weaponSize >= weaponSizeTwoHandedMin && weaponSize <= weaponSizeTwoHandedMax && item.system.weaponType !== "bow" && item.system.weaponType !== "crossbow" ) {
    //           newItemStatus = 6;
    //           weapons.forEach( weapon => {
    //             if ( weapon.system.itemStatus.value !== 1 && weapon.system.itemStatus.value !== 2 && weapon.system.itemStatus.value !== 7 ) {
    //               weapon.update( { "system.itemStatus.value": 2 } );
    //             }
    //           } );
    //           shields.forEach( shield => {
    //             if ( shield.system.itemStatus.value === 5 ) {
    //               shield.update( { "system.itemStatus.value": 2 } );
    //             }
    //           } );
    //         } else
    //           // bows are considered two handed weapons independent of their size. is this right? have to check the rules and FASA forums
    //           if ( item.system.weaponType === "bow" || item.system.weaponType === "crossbow" ) {
    //             newItemStatus = 6;
    //             shields.forEach( shield => {
    //               if ( shield.system.itemStatus.value === 5 && !shield.system.bowUsage ) {
    //                 shield.update( { "system.itemStatus.value": 2 } );
    //               }
    //             } );
    //             weapons.forEach( weapon => {
    //               if ( weapon.system.itemStatus.value !== 1 && weapon.system.itemStatus.value !== 2 && weapon.system.itemStatus.value !== 7 ) {
    //                 weapon.update( { "system.itemStatus.value": 2 } );
    //               }
    //             } );
    //           } else {
    //             newItemStatus = 1;
    //           }
    //     } else
    //       // check any weapon becoming a Off hand weapon
    //       if ( newItemStatus === 5 && weaponSize < weaponSizeTwoHandedMin ) {
    //         weapons.forEach( weapon => {
    //           if ( weapon.system.itemStatus.value === 5 || weapon.system.itemStatus.value === 6 ) {
    //             weapon.update( { "system.itemStatus.value": 2 } );
    //           }
    //         } );
    //         shields.forEach( shield => {
    //           if ( shield.system.itemStatus.value === 5 ) {
    //             shield.update( { "system.itemStatus.value": 2 } );
    //           }
    //         } );
    //       } else
    //         // check any weapon becoming a two handed weapon
    //         // one handed weapons can only be hold in the main or off hand
    //         if ( newItemStatus === 6 && weaponSize < weaponSizeTwoHandedMin ) {
    //           if ( maxItemStatus === 7 && weaponSize <= 2 ) {
    //             newItemStatus = 7;
    //             weapons.forEach( weapon => {
    //               if ( weapon.system.itemStatus.value === 7 ) {
    //                 weapon.update( { "system.itemStatus.value": 2 } );
    //               }
    //             } );
    //           } else {
    //             newItemStatus = 1;
    //           }
    //         } else
    //           // check any weapon becoming a tail weapon
    //           // tail weapons can only be of size 1 or 2
    //           if ( newItemStatus === 7 && weaponSize > 2 ) {
    //             newItemStatus = 1;
    //           }
    
    //     item.update( { "system.itemStatus.value": newItemStatus } );
    
    //     } else 
    //     if ( item.type === "armor" ) {
    //       let piecemealSum = 0;
    //       armorItems.forEach( armor => {
    //         if ( armor.system.itemStatus.value === 3 && armor.system.piecemealArmor.selector ) {
    //           piecemealSum = piecemealSum + armor.system.piecemealArmor.size;
    //         }
    //       } );
    //       let newPiecemealItemSize = item.system.piecemealArmor.size
    //       maxItemStatus = 3
    //       newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
          
    //       if ( newItemStatus === 3 ) {
    //         if ( !item.system.piecemealArmor.selector ) {
    //         armorItems.forEach( armor => {
    //           if ( armor.system.itemStatus.value === 3 ) {
    //             armor.update( { "system.itemStatus.value": 2 } );
    //           }
    //         } );
    //       } else {
    //         armorItems.forEach( armor => {
    //           if ( armor.system.itemStatus.value === 3 && !armor.system.piecemealArmor.selector ) {
    //             armor.update( { "system.itemStatus.value": 2 } );
    //           }
    //         } );
    //         if ( newPiecemealItemSize === 3 && piecemealSum > 2 ) {
    //           armorItems.forEach( armor => {
    //             if ( piecemealSum <= 2 ) {
    //               return
    //             } else
    //             if ( armor.system.itemStatus.value === 3 && armor.system.piecemealArmor.selector ) {
    //               armor.update( { "system.itemStatus.value": 2 } );
    //               piecemealSum = piecemealSum - armor.system.piecemealArmor.size;
    //               if ( piecemealSum <= 5 ) {
    //                 return
    //               }
    //             }
    //           } );
    //         } else
    //         if ( newPiecemealItemSize === 2 && piecemealSum > 3 ) {
    //           armorItems.forEach( armor => {
    //             if ( piecemealSum <= 3 ) {
    //               return
    //             } else
    //             if ( armor.system.itemStatus.value === 3 && armor.system.piecemealArmor.selector ) {
    //               armor.update( { "system.itemStatus.value": 2 } );
    //               piecemealSum = piecemealSum - armor.system.piecemealArmor.size;
    //               if ( piecemealSum <= 5 ) {
    //                 return
    //               }
    //             }
    //           } );
    //         } else if ( newPiecemealItemSize === 1 && piecemealSum > 4 ) {
    //           armorItems.forEach( armor => {
    //             if ( piecemealSum <= 4 ) {
    //               return
    //             } else
    //             if ( armor.system.itemStatus.value === 3 && armor.system.piecemealArmor.selector ) {
    //               armor.update( { "system.itemStatus.value": 2 } );
    //               piecemealSum = piecemealSum - armor.system.piecemealArmor.size;
    //               if ( piecemealSum <= 5 ) {
    //                 return
    //               }
    //             }
    //           } );
    //         }
    //       }
    //       }
    //       item.update( { "system.itemStatus.value": newItemStatus } );
    //     } else 
    //     if ( item.type === "shield" ) {
    //       maxItemStatus = 5
    //       newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
    //       if ( newItemStatus === 3 ) {
    //         newItemStatus = 5;
    //         shields.forEach( shield => {
    //           if ( shield.system.itemStatus.value === 5 ) {
    //             shield.update( { "system.itemStatus.value": 2 } );
    //           }
    //         } );
    //         weapons.forEach( weapon => {
    //           if ( weapon.system.weaponType !== "bow" ) {
    //               if ( weapon.system.itemStatus.value === 5 || weapon.system.itemStatus.value === 6 ) {
    //                 weapon.update( { "system.itemStatus.value": 2 } );
    //               }
    //           } else if ( weapon.system.weaponType === "bow" ) {
    //             if ( !item.system.bowUsage ) {
    //               if ( weapon.system.itemStatus.value === 5 || weapon.system.itemStatus.value === 6 ) {
    //                 weapon.update( { "system.itemStatus.value": 2 } );
    //               }
    //             }
    //           }
    //         } );
    //       }
    //       item.update( { "system.itemStatus.value": newItemStatus } );
    //     } else 
    //     if ( item.type === "equipment" ) {
    //       const maxItemStatus = 3
    //       newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
    //       item.update( { "system.itemStatus.value": newItemStatus } );
    //     }
    //   }



    _onChangeItemStatus(event) {
      event.preventDefault();
      const li = event.currentTarget.closest(".item-id");
      const item = this.actor.items.get(li.dataset.itemId);
      const currentItemStatus = item.system.itemStatus.value;
      const namegiver = this.actor.items.filter(i => i.type === "namegiver")
      const maxItemStatus = this.actor.items.filter(i => i.type === "namegiver" && i.system.tailAttack === true).length > 0 ? 7 : 6;
      let newItemStatus = 0;
      const weapons = this.actor.items.filter(item => item.type === "weapon");
      const shields = this.actor.items.filter(item => item.type === "shield");
      const armorItems = this.actor.items.filter(item => item.type === "armor");
      const weaponSize = item.system.size;
      const weaponSizeOneHandedMin = namegiver[0].system.weaponSize.oneHanded.min;
      const weaponSizeTwoHandedMin = namegiver[0].system.weaponSize.twoHanded.min;
      const weaponSizeTwoHandedMax = namegiver[0].system.weaponSize.twoHanded.max;
      let itemStatusNumber = currentItemStatus;
  
      const updateItemStatus = (items, status) => {
          items.forEach(item => {
              if (item.system.itemStatus.value === status) {
                  item.update({ "system.itemStatus.value": 2 });
              }
          });
      };
  
      const isBowOrCrossbow = item.system.weaponType === "bow" || item.system.weaponType === "crossbow";
      const isOneHandedWeapon = weaponSize >= weaponSizeOneHandedMin && weaponSize < weaponSizeTwoHandedMin && !isBowOrCrossbow;
      const isTwoHandedWeapon = weaponSize >= weaponSizeTwoHandedMin && weaponSize <= weaponSizeTwoHandedMax && !isBowOrCrossbow;
  
      if (item.type === "weapon") {
          newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
          if (newItemStatus === 3) {
              if (isOneHandedWeapon) {
                  if (weapons.filter(i => i.system.itemStatus.value === 4).length > 0) {
                      newItemStatus = 5;
                      updateItemStatus(weapons, 5);
                      updateItemStatus(shields, 5);
                  } else {
                      newItemStatus = 4;
                      updateItemStatus(weapons, 4);
                      updateItemStatus(weapons, 6);
                  }
              } else if (isTwoHandedWeapon || isBowOrCrossbow) {
                  newItemStatus = 6;
                  updateItemStatus(weapons, 1);
                  updateItemStatus(weapons, 2);
                  updateItemStatus(weapons, 7);
                  updateItemStatus(shields, 5);
              } else {
                  newItemStatus = 1;
              }
          } else if (newItemStatus === 5 && weaponSize < weaponSizeTwoHandedMin) {
              updateItemStatus(weapons, 5);
              updateItemStatus(weapons, 6);
              updateItemStatus(shields, 5);
          } else if (newItemStatus === 6 && weaponSize < weaponSizeTwoHandedMin) {
              if (maxItemStatus === 7 && weaponSize <= 2) {
                  newItemStatus = 7;
                  updateItemStatus(weapons, 7);
              } else {
                  newItemStatus = 1;
              }
          } else if (newItemStatus === 7 && weaponSize > 2) {
              newItemStatus = 1;
          }
  
          item.update({ "system.itemStatus.value": newItemStatus });
      } else if (item.type === "armor") {
        let piecemealSum = armorItems.reduce((sum, armor) => {
            return sum + (armor.system.itemStatus.value === 3 && armor.system.piecemealArmor.selector ? armor.system.piecemealArmor.size : 0);
        }, 0);
    
        let newPiecemealItemSize = item.system.piecemealArmor.size;
        maxItemStatus = 3;
        newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
    
        if (newItemStatus === 3) {
          if (!item.system.piecemealArmor.selector) {
              updateItemStatus(armorItems, 3);
          } else {
              if (armor.system.itemStatus.value === 3 && !armor.system.piecemealArmor.selector) {
                  updateItemStatus(armorItems, 3);
              }
              if ([3, 2, 1].includes(newPiecemealItemSize) && piecemealSum > newPiecemealItemSize + 1) {
                  armorItems.forEach(armor => {
                      if (piecemealSum <= newPiecemealItemSize + 1) {
                          return;
                      } else if (armor.system.itemStatus.value === 3 && armor.system.piecemealArmor.selector) {
                          armor.update({ "system.itemStatus.value": 2 });
                          piecemealSum -= armor.system.piecemealArmor.size;
                      }
                  });
              }
          }
      }
    
        item.update({ "system.itemStatus.value": newItemStatus });
      } else if (item.type === "shield") {
        maxItemStatus = 5;
        newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
    
        if (newItemStatus === 3) {
            newItemStatus = 5;
            updateItemStatus(shields, 5);
            weapons.forEach(weapon => {
                if (weapon.system.weaponType !== "bow" || !item.system.bowUsage) {
                    if (weapon.system.itemStatus.value === 5 || weapon.system.itemStatus.value === 6) {
                        weapon.update({"system.itemStatus.value": 2});
                    }
                }
            });
        }
        item.update({"system.itemStatus.value": newItemStatus});
    } else if (item.type === "equipment") {
        const maxItemStatus = 3;
        newItemStatus = itemStatusNumber === maxItemStatus ? 1 : itemStatusNumber + 1;
        item.update({"system.itemStatus.value": newItemStatus});
    }
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
   * Handle rolling an attribute test.
   * @param {Event} event      The originating click event.
   * @private
   */
  _onRollAttribute( event ) {
    event.preventDefault();
    const attribute = event.currentTarget.dataset.attribute;
    this.actor.rollAttribute( attribute, {event: event} );
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
    this.actor.rollAbility( ability, {event: event} );
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
    this.actor.rollEquipment( equipment, {event: event} );
  }

  /**
   * @description Take strain is used for non rollable abilities which requires strain. player can click on the icon to take the strain damage
   * @param {Event} event     The originating click event
   * @private
   */
  _takeStrain( event ) {
    event.preventDefault();
    const li = event.currentTarget.closest( ".item-name" );
    const ability = this.actor.items.get( li.dataset.itemId );
    this.actor.takeStrain( ability.system.strain );
  }


  /**
   * Handle creating an owned ActiveEffect for the Actor.
   * @param {Event} event     The originating click event.
   * @returns {Promise|null}  Promise that resolves when the changes are complete.
   * @private
   */
  _onEffectAdd( event ) {
    event.preventDefault();
    return this.actor.createEmbeddedDocuments( 'ActiveEffect', [{
      label: `New Effect`,
      icon: 'icons/svg/item-bag.svg',
      duration: { rounds: 1 },
      origin: this.actor.uuid
    }] );
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

  _onKarmaRefresh ( ) {
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
}