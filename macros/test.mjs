// Pop up 
new Dialog(
    {
      title: game.i18n.localize('X-LP'), 
      content:`  
        <form> 
          <div>
            <label>${game.i18n.localize('X-LPAmount')}</label>
            <input type='number' id='legendPoints'></input>
          </div>  
          <div>
            <label>${game.i18n.localize('X-Description')}</label>
            <input type='string' id='description'></input>
          </div> 
        </form>`,
      buttons:{
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize('earthdawn.o.ok')
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: game.i18n.localize('earthdawn.c.cancel')
        }
      },
      default:'yes',
  
      // Code
      close: async (html) => {
  
        //variable -- getting result from input field
        const resultLp = document.getElementById("legendPoints").value;
        const resultDescription = document.getElementById("description").value;
        console.log(" pop up eingabe: ", resultLp, resultDescription);
        
        if (resultLp !== ''){
        //find all selected tokens and map them to the actor
        const actors = canvas.tokens.controlled.map(token => token.actor);
        
        console.log(token)
        //update the legendpoint total of the actor with the result of the pop up input
        const transactionData = {
            amount: Number(resultLp),
            lpBefore: token.actor.system.lp.current,
            lpAfter: token.actor.system.lp.current + Number(resultLp),
            description: resultDescription,
        }
        token.actor.addLpTransaction( "earnings", transactionData)
        // const actorUpdates = actors.map(actor => ({
        //      _id: actor.id, "data.legendpointtotal": actor.data.data.legendpointtotal += Number(result) }));
        // const actorUpdatescurrent = actors.map(actor => ({ _id: actor.id, "data.legendpointcurrent": actor.data.data.legendpointcurrent += Number(result) }));
        // await Actor.updateDocuments(actorUpdates);
        // await Actor.updateDocuments(actorUpdatescurrent);
        // actors.forEach(element => console.log(element));
        //   // message output
        //   for (const element of actors) {
        //       let chatData = {
        //       actor: element.id,
        //       speaker: ChatMessage.getSpeaker({actor: element}),
        //       content: `${game.i18n.localize('earthdawn.e.earns')} ${result} ${game.i18n.localize('earthdawn.l.legend')}`,      
        //       };
              // chat output
            //   await ChatMessage.create(chatData, {});
            // };
  }
      }   
    }
  ).render(true);