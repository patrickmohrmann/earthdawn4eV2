activating an ability with the roll type set to **attack** triggers the attack roll with the difficulty [getDifficulty](http:...) of the selected target. The equipped item (see [itemStatus](http:...)) defines which weapon is currently hold and can be used for an attack. <br>
If the equipped weapon is fitting to the distance of the target and the roll ability a roll Prompt appears to roll the ability.<br>
a chat message appears showing the result and providing the possibility to react to the attack as the defender. (see [UC_Reactions-reaction](../Use%20Cases/UC_Reactions-reaction.md)<br>
If the Reaction is successful the attack ends. Otherwise the attacker has the option to chose maneuvers based on his extra successes (see [UC_Maneuvers-maneuver](../Use%20Cases/UC_Maneuvers-maneuver.md)) and/or triggers the damage Roll (see [UC_Damage-damage](../Use%20Cases/UC_Damage-damage.md)). the successful attack also provides the option to assign Active Effects.<br>
the damage result can be assigned to the target as well as active effects which require damage. The damage is lessend by the targets armor.

### Diagram
```mermaid
stateDiagram-v2
    classDef fromOutside font-style:italic,font-weight:bold,fill:lightyellow
    classDef foundryCore font-style:italic,font-weight:bold,fill: lightgreen
    classDef useCase font-style:italic,font-weight:bold,color:white,fill: green
    classDef userFunction font-style:italic,font-weight:bold,fill:lightblue
    classDef userFunctionReturn font-style:italic,font-weight:bold,fill:aqua
    classDef dialog font-style:italic,font-weight:bold,fill:orange

    ###################### status #######################


    triggerAction1: attack ability

    getDifficulty: getDifficulty

    ReactionUC: Reaction
    assignDamageEffects: assign Damage Effects
    assignAttackEffects: assign Attack Effects
    rollDamage: roll damage
    AssignDamage: assign damage

    ReactionResult: Reaction Result


    ####################### Decisions #######################

    state combatType <<choice>>
    state Reaction <<choice>>
    state ReactionSuccess <<choice>>
    state choseManeuver <<choice>>

    ######################## Colorations ######################

    triggerAction1:::fromOutside

    getDifficulty:::userFunction
    ReactionUC:::userFunction
    ManeuverUF:::userFunction
    rollDamage:::userFunction
    assignAttackEffects:::userFunction
    assignDamageEffects:::userFunction
    AssignDamage:::userFunction

    RollPrompt:::dialog

##################### StateDiagram ########################

    [*] --> triggerAction1
    triggerAction1 --> getDifficulty
    getDifficulty --> combatType: Combat Type
    combatType --> distanzToTarget: Ranged Combat
    combatType --> RollPrompt: Close Combat
    distanzToTarget  --> RollPrompt

    RollPrompt --> Reaction: use Reaction?
    Reaction --> rollDamage: no Reaction 
    Reaction --> ReactionUC: yes
    ReactionUC --> ReactionSuccess: Success ?
    ReactionSuccess --> ReactionResult: no Success 
    ReactionResult --> choseManeuver: chose Maneuver
    choseManeuver --> ManeuverUF: yes
    choseManeuver --> rollDamage: no
    ReactionResult --> assignAttackEffects

    ManeuverUF --> rollDamage
    rollDamage --> AssignDamage
    AssignDamage --> assignDamageEffects

    assignDamageEffects --> [*]
    AssignDamage --> [*]
    ReactionSuccess --> [*]: yes
```
Diagramm Note: assign Attack Effects shall be part of a split/Merge option 
maneuverUF rename
add color for subusecases

### Related User Functions & Sub-use cases

[UC_Reactions-reactions](../Use%20Cases/UC_Reactions-reactions.md)

[UC_Maneuver-maneuver](../Use%20Cases/UC_Maneuver-maneuver.md)

[UC_Damage-damage](../Use%20Cases/UC_Damage-damage.md)

[UF_ChatMessage-create](../User%20Functions/UF_ChatMessage-create.md)

[UF_ChatMessage-getHTML](../User%20Functions/UF_ChatMessage-getHTML.md)

[UF_ChatMessage-onCreate](../User%20Functions/UF_ChatMessage-onCreate.md)

[UF_ChatMessage-onReaction](../User%20Functions/UF_ChatMessage-onReaction.md)

[UF_ChatMessage-updateChatMessage](../User%20Functions/UF_ChatMessage-updateChatMessage.md)

[UF_Rolls-attackSubstitude](../User%20Functions/UF_Rolls-attackSubstitude.md)

[UF_Rolls-targetReactions](../User%20Functions/UF_Rolls-targetReactions.md)

[UF_Settings-automaticRangeCalculation](../User%20Functions/UF_Settings-automaticRangeCalculation.md)


### Related Test Coverage

| Test Coverage | Related Documentation |
|---------------|-----------------------|
| Close Attack | [[Test] - Close Attack all Actor types](https://github.com/patrickmohrmann/earthdawn4eV2/issues/956) |
| Range Attack | [[Test] - Attack with Ranged Weapon](https://github.com/patrickmohrmann/earthdawn4eV2/issues/929) |
| Attack with unarmed substitude | [[Test] - Attack with unarmed substitute](https://github.com/patrickmohrmann/earthdawn4eV2/issues/963) |
| Attack with weapon substitude | [[Test] - Attack with armed substitute](https://github.com/patrickmohrmann/earthdawn4eV2/issues/964) |
| Attack with Tail | [[Test] - Attack with tail](https://github.com/patrickmohrmann/earthdawn4eV2/issues/966) |

