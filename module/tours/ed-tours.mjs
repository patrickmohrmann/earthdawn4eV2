
export default class EdTour extends Tour {
    static tours = [
        "systems/ed4e/module/tours/lang/actor-item-creation",
        "systems/ed4e/module/tours/lang/sidebar-settings"
    ]
    static gmTours = [

    ]

    static async travelAgency(){
        const lang = game.i18n.lang === "de" ? "de" : "en"
        console.log( "Adding ED Tours" );
        for( let tour of this.tours ){
            const obj = await game.ed4e.tours.EdTour.fromJSON( `${tour.replace( "/lang/", `/${lang}/` ) }.json` );
            game.tours.register( obj.config.module, obj.id, obj );
        }
        if( !game.user.isGM ) return

        for( let tour of this.gmTours ){
            const obj = await game.ed4e.tours.EdTour.fromJSON( `${tour.replace( "/lang/", `/${lang}/` ) }.json` );
            game.tours.register( obj.config.module, obj.id, obj );
        }
    }

    async _preStep() {
        if( this.currentStep.activateTab ){
            ui.sidebar.activateTab( this.currentStep.activateTab )
        }
        else if( this.currentStep.activateLayer && canvas.activeLayer.options.name !== this.currentStep.activateLayer ){
            await canvas[this.currentStep.activateLayer].activate()
            await delay( 100 )
        }
        else if( this.currentStep.appTab ){
            this.app.activateTab( this.currentStep.appTab )
        }
        if( this.currentStep.action !== "none" ) {
            // Actor and Item Creation Tour Actions
            if ( this.currentStep.action === "createActor" ) {
                Actor.implementation.createDialog()  
            }
            else if ( this.currentStep.action === "createItem" ) {
                Item.implementation.createDialog()      
            }
        }
    }

    // exit(){
    //     super.exit()
    // }

    async start() {
        if( this.config.preCommand ){
            const AsyncFunction = Object.getPrototypeOf( async function(){ } ).constructor
            const fn = new AsyncFunction( this.config.preCommand )
            await fn.call( this );
        }
        if( this.app ){
            await this.app.render( true, {focus: true} )
            while( !this.app.rendered ) await delay( 50 )
        }
        if( this.app || this.config.preCommand )
            while( !$( this.steps[this.stepIndex + 1].selector + ':visible' ).length) await delay(50)

        const res = await super.start()
        $('#tooltip').show()
        return res
    }

}