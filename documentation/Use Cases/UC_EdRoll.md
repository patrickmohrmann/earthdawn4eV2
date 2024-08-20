This Use Case covers the handling of Roll data. it is triggered by all use cases which roll any dice. Based on the input the triggering function provide this use case evaluates the result. Success, failure, extra successes are only the obvious validations, but this function does also handle the explosion of dice, the handling of additional dice like karma, devotions or similar options. 

Based on the input the information needed to show all relevant details are prepared together with the right chat message file.

### Diagram
```mermaid
stateDiagram-v2
    classDef fromOutside font-style:italic,font-weight:bold,fill:lightyellow
    classDef foundryCore font-style:italic,font-weight:bold,fill: lightgreen
    classDef userFunction font-style:italic,font-weight:bold,fill:lightblue
    classDef userFunctionReturn font-style:italic,font-weight:bold,fill:aqua
    classDef dialog font-style:italic,font-weight:bold,fill:orange

    ###################### status #######################

    condition1: CONDITIONNAME1
    condition2: CONDITIONNAME1
    condition3: CONDITIONNAME1

    triggerAction1: TRIGGERACTION1
    triggerAction2: TRIGGERACTION2
    triggerAction3: TRIGGERACTION3

    userFunction1: USERFUNCTION1
    userFunction2: USERFUNCTION2
    userFunction3: USERFUNCTION3

    state1: STATE1
    state2: STATE2
    state3: STATE3

    dialog1: DIALOG1

    ####################### Decisions #######################

    state DECISION1 <<choice>>
    state DECISION2 <<choice>>
    state DECISION3 <<choice>>

    ######################## Colorations ######################

    triggerAction1:::fromOutside
    triggerAction2:::fromOutside
    triggerAction3:::fromOutside

    userFunction1:::userFunction
    userFunction2:::userFunction
    userFunction3:::userFunction

    dialog1:::dialog

    ##################### StateDiagram ########################

    
```

### Related User Functions

[UF_Rolls-total](../User%20Functions/UF_Rolls-total.md)

[UF_Rolls-ruleOfOne](../User%20Functions/UF_Rolls-ruleOfOne.md)

[UF_Rolls-isSuccess](../User%20Functions/UF_Rolls-isSuccess.md)

[UF_Rolls-isFailure](../User%20Functions/UF_Rolls-isFailure.md)

[UF_Rolls-numDice](../User%20Functions/UF_Rolls-numDice.md)

[UF_Rolls-totalStrain](../User%20Functions/UF_Rolls-totalStrain.md)

[UF_Rolls-numSuccesses](../User%20Functions/UF_Rolls-numSuccesses.md)

[UF_Rolls-numExtraSuccesses](../User%20Functions/UF_Rolls-numExtraSuccesses.md)

[UF_Rolls-getChatFlavor](../User%20Functions/UF_Rolls-getChatFlavor.md)

[UF_Rolls-setChatFlavor](../User%20Functions/UF_Rolls-setChatFlavor.md)

[UF_Rolls-stepFormula](../User%20Functions/UF_Rolls-stepFormula.md)

[UF_Rolls-explodingDice](../User%20Functions/UF_Rolls-explodingDice.md)

[UF_Rolls-addExtraDice](../User%20Functions/UF_Rolls-addExtraDice.md)

[UF_Rolls-addResourceDice](../User%20Functions/UF_Rolls-addResourceDice.md)

[UF_Rolls-addExtraSteps](../User%20Functions/UF_Rolls-addExtraSteps.md)

[UF_Rolls-getFlavorTemplateData](../User%20Functions/UF_Rolls-getFlavorTemplateData.md)

[UF_Rolls-addSuccessClass](../User%20Functions/UF_Rolls-addSuccessClass.md)

[UF_Rolls-getTooltipsRollData](../User%20Functions/UF_Rolls-getTooltipsRollData.md)

[UF_Rolls-getTooltip](../User%20Functions/UF_Rolls-getTooltip.md)

[UF_Rolls-render](../User%20Functions/UF_Rolls-render.md)

[UF_Rolls-toMessage](../User%20Functions/UF_Rolls-toMessage.md)



### Related Test Coverage

- every Flavor file with every option. so one test per flavor should cover all.

are thread weaving und spellcasting different from ability? probably at least spellcasting because it triggers effect options like attack. thread weaving might not.

| Test Coverage | Related Documentation |
|---------------|-----------------------|
| Ability rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| arbitrary Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| Attack rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| Attribute Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| damage Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| effect Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| Half magic Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| Initiative Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| Spellcasting Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |
| Thread weaving Rolls | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/issues/) |


