// Pop up 
new Dialog(
    {
        title: game.i18n.localize( "X-LP" ),
        content: `  
        <form> 
          <div>
            <label>${game.i18n.localize( "X-LPAmount" )}</label>
            <input type='number' id='legendPoints'>
          </div>  
          <div>
            <label>${game.i18n.localize( "X-Description" )}</label>
            <input type='string' id='description'>
          </div> 
        </form>`,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: game.i18n.localize( "X-ok" )
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: game.i18n.localize( "X-cancel" )
            }
        },
        default: "yes",

        // Code
        close: async ( html ) => {

            // variable -- getting result from input field
            const resultLp = document.getElementById( "legendPoints" ).value;
            const resultDescription = document.getElementById( "description" ).value;
            // console.log( " pop up eingabe: ", resultLp, resultDescription );

            if ( resultLp !== "" ) {
                // find all selected tokens and map them to the actor
                const actors = canvas.tokens.controlled.map( token => token.actor );

                // console.log( token )
                // update the legendpoint total of the actor with the result of the pop up input
                const transactionData = {
                    amount: Number( resultLp ),
                    description: resultDescription,
                };
                token.actor.addLpTransaction( "earnings", transactionData );

            }
        }
    }
).render( true );