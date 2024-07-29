this use case allows the user to change the item weight accordingly to the namegiver. Each namegiver item has a field in den details tab **weight multiplier**. this is the value which will be multiplied to any item if the functionality of that item is triggered.

every physical item (armor, equipment, shield or weapon) has a button in the details tab of that item **tailor to Namegiver** if this button is clicked, the item will be changed.
* the name will get an extention (Namegiver Item Name).
* the weight-calculation field of the item will be updated by the namegiver item value
* the checkbox next to the ** tailor to Namegiver** button will be checked. 
* the weight of the item will be updated accordingly.

the **tailor to Namegiver** button can not be clicked once per item, as long as the checkmark next to the button is checked. this check can only be removed by a user of type GM. 

**Note:** if an Item shall be only usable by small characters, the item should be created that way. this function is meant to cover the *Races and Weight* rules and to avoid the necessity to create all items with different weights of the necessity to update all those items manually

### Diagram
```mermaid
stateDiagram-v2
    classDef fromOutside font-style:italic,font-weight:bold,fill:lightyellow

    
```

### Related User Functions

[UF_ActorItems-onWeightCalculation](../User%20Functions/UF_ActorItems-onWeightCalculation.md)

[UF_ActorItems-tailorToNamegiver](../User%20Functions/UF_ActorItems-tailorToNamegiver.md)



### Related Test Coverage

| Test Coverage | Related Documentation | related User Function |
|---------------|-----------------------|-----------------------|
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |
| Test case | [TC_YYYYYY-XXXXX](https://github.com/patrickmohrmann/earthdawn4eV2/) | UserFunction |