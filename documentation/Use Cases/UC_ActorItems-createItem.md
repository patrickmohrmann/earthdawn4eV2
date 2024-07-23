This use case covers all items which are dropped onto an actor document (Sheet). The [UF_ActorItems-preCreate](../User%20Functions/UF_AssignLpPrompt-preCreate.md) is responsible for triggering this use case or not. Based on the Actor type several items are able to be dropped to an actor sheet and some aren't. If an item type is not foreseen for the target actor type, a warning message appears, informing the user. If, on the other hand, the item can be added to the target actor type, two functions might be triggered.
1. validateDropItem
2. _showOptionsPrompt

ValidateDropItem is responsible for validation of Legendpoints.
_showOptionsPrompt is required for additional user interaction when the item is added to the actor (choosing a talent category, or tier etc.)

### Diagram
```mermaid

stateDiagram-v2
    classDef fromOutside font-style:italic,font-weight:bold,fill:lightyellow

    state1: start item creation
    state2: edid = versatitliy
    state3: preset options
    state4: validate item
    state5: show user options
    state6: create item

    state userInteraction <<choice>>

    interaction1: triggered creation

    interaction1:::fromOutside

    [*] --> state1
    interaction1 --> state1: automatic creation
    state1 --> userInteraction: user interaction required?
    userInteraction --> state2
    state2 --> state6
    userInteraction --> state3
    state3 --> state6
    userInteraction --> state4
    state4 --> state5
    state5 --> state6
    state6 --> [*]

    

```

### Related User Functions

[UF_ActorItems-ed4eDropItem](../User%20Functions/UF_ActorItems-ed4eDropItem.md)

[UF_ActorItems-ValidateDropItem](../User%20Functions/UF_ActorItems-ValidateDropItem.md)

[UF_LpTracking-showOptionsPrompt](../User%20Functions/UF_LpTracking-showOptionsPrompt.md)

[UF_ActorItems-preCreate](../User%20Functions/UF_AssignLpPrompt-preCreate.md)


### Related Test Coverage

[TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) 

[TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) 

[TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) 



