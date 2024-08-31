# Combat

The Combat-Workflow is probably the most important use case of the whole Earthdawn System. The following chapter describes the complete combat workflow relevant to all types of Actors. Initiative and Active Effects are not part in this chapter, since they deserve their own.

## Selecting Targets

Targeting tokens is a foundry core functionality [CORE FUNCTION] (http...). It is possible to select one or multiple tokens for an attack. {ADD the ORder of multi selected tokens}. Some actions require a target to poperly work (like attacks). If no target is selected for these actions the difficulty will be 0 and the roll therefore will not evaluate success, failure and or extra successes. <br>
Most interactions will not keep the target so it is crucial to always have the right target selected. 

## Attack settings

To attack the user have two general options to do so. the first option is to use one of the substitude functions, which will use the dexterity step instead of an ability for the attack. The second option is to use an ability which triggers the attack workflow.

### Substitude Combat Options

There are two (or three) buttons availabel {WHERE}. One button is representing unarmed combat, the second button is using the currently equipped weapon in the main or both hands (melee, missle or thrown weapons). This button changes the icon depending on the equipped weapon type. all of these buttons use the dexterity step of the actor but trigger the respective workflow. <br>
if the namegiver has the Tail Attack option, a third button is available, representing the Tail attack option.<br>
All of these options use Dexterity for the attack attribute, they do not look for a referenced Ability.

### Using an Attack Ability

An Ability (devotion, skill or talent) is considered a combat ability, if the **roll type** value is set to *attack*. Every usage of these abilities will trigger the attack workflow instead of the ability workflow.<br> 
the ability will use the configured attribute, strain etc. for this attack and will look for the weapon with the item status equal to the one configured for this ability. Per Default the **required item status** is set to *main hand/ two handed*. in cases of abilities like *second weapon* this value has to be set to *off hand* or *shield*. <br>

## Making an Attack

After setting the right parameter Values of the abilities and items, and selecting a target, the user can trigger the attack workflow. Doing so will open up an *Attack Roll Prompt* showing potential modifier etc. the Difficulty is not visible though (there is a sysystem setting which always shows the difficulty to everyone). The attack is executed as an ability roll, so strain, success, failure and extra success calculation will take place as usual. The Chat message looks a little bit different though. <br> 
In addition to all basic information of an Ability roll, this message contains an entry for each target (see [CHAT MESSAGE ABILITY ROLL](http....) ). Each target will have one or more options in that chat message available - **Reactions**. These are only possible to be triggered by the target actors user or the GM. GMs have an additional option available by using shift-click on one of those options to use this option for all targets which have these option (e.g. **take the hit**) if this is used, all targets without these options stay available.<br>
based on the chosen option a reaction is triggered [SEE REACTIONS](REACTION), or in case of **take the hit** the next step is to chose potential avialble maneuvers [SEE MANEUVER](MANEUVER). In addition to the option to chose maneuver an option to roll damage [SEE ROLL DAMAGE](ROLL DAMAGE) becomes available.

## Using a Reactions

The available reactions available for the targets, might trigger an ability test on their own, if the result of the Reaction is successful, the attack might be stopped, based on the reaction settings on the ability (see [Abilities-Reactions](http....) for further details). <br>
It is further possible that the defender using a Reacting, might be able to use maneuvers in addition or instead to the reaction (e.g. roll with the punches). These Maneuver will adapt the rolls accordingly to the Maneuvers.<br>
If the reaction is not successful the attack roll will be continued as if **take the hit** was used. <br>

## Using a Maneuver

after a successful attack and no or unsuccessful reactions of the target, a Chat message becomes available showing all potential maneuvers of the attacker together with a list of the extra sucesses. the User can click the maneuver to activate or deactivate them. Each maneuver will reduce the number of extra successes accordingly to their item settings.<br>
In addition to the maneuvers two options are available per target in this message. The first option is **roll damage** and the second option is **assign effects**.

## Rolling for Damage

the **roll damage** option triggers a damage prompt with all left over extra successes and potential other modifiers in it. This roll prompt will although hold a list of damage adder abilities which might be used. They can be activated or deactivated by clicking them.<br>

## Assign Damage

the result of a damage roll results in a chat message with the result of the roll and two options for each target. **assign damage** and **assign effects**.<br>
The **assign damage** function is assigning the rolled result to the target and adds it to the right damage value (stun or physical). The value is usually lessened by physical armor (this might not be the case for some abilities).

## Assign Effects

The assign effects function is available twice, once on a successful attack and once after the damage test is rolled. Some effects requried only a successful attack, while others require damage or even a wound.

The following as well?
## Take Damage

### Knock down tests


## Related System settings

There are some system Settings which are related to combat:
* [Automatic Ammunition Tracking](???)
* [Automatic Range Calculation](???)


