Hooks.once( "ready", async () => {
    // eslint-disable-next-line no-unused-expressions
    game.tours.register(
      "ed4e",
      "earthdawnSettings",
      await SidebarTour.fromJSON( "/systems/ed4e/module/tours/earthdawn-settings.json" )
    );
    // game.tours.register(
    //   "ed4e",
    //   "spellcasting",
    //   await SidebarTour.fromJSON( "/systems/ed4e/module/tours/spellcasting.json" )
    // )
  } );