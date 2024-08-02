## Test description:

this test covers the ranges of weapons

### Prerequisites:

Actor1 <ACTOR1> and Actor2 <ACTOR2> exist.

Actor1 <ACTOR1> has the following items:
**Abilities**
* Talent-A <TALENT-A> (Melee Weapons) with *required Item Status* set to **main- or two-handed** and *Action Type* set to **Attack**.  
* Talent-B <TALENT-B> (unarmed Combat) with *required Item Status* set to **main- or two-handed** and *Action Type* set to **Attack**.
* Talent-C <TALENT-C> (throwing Weapons) with *required Item Status* set to **main- or two-handed** and *Action Type* set to **Attack**.
* Talent-D <TALENT-D> (Missile Weapons) with *required Item Status* set to **main- or two-handed** and *Action Type* set to **Attack**.
* Item-A <ITEM-A> (Broadsword) has *weapon Type* set to **Melee** and a **no** range values set 
* Item-B <ITEM-B> (Broadsword) has *weapon Type* set to **unarmed** and a **no** range values set 
* Item-C <ITEM-C> (Broadsword) has *weapon Type* set to **throwing/Melee** and a range values set to
  * short range min = 2
  * short range mage = 5
  * long range min = 6
  * long range max = 10
* Item-D <ITEM-D> (Broadsword) has *weapon Type* set to **throwing** and a range values set to
  * short range min = 2
  * short range mage = 5
  * long range min = 6
  * long range max = 10
* Item-E <ITEM-E> (Broadsword) has *weapon Type* set to **Missle** and a range values set to
  * short range min = 2
  * short range mage = 20
  * long range min = 21
  * long range max = 40

**Note** amunition is either not implemented, or the amount is high enough for this test to not interfere.

Actor2 <ACTOR2> has the following items:
* Talent-A <TALENT-A> (Avoid Blow) with *reaction Type* set to **physical Defense**.


| Test Instruction  | Expected Result  |
|---|---|
| Actor1 <ACTOR1> is at a distance between 21 and 40 of Actor2 <ACTOR2> and tries to attack with Talent-A <TALENT-A>. verify that: <ul><li>- an error notifiaction appears saying that the range is to big</li></ul> | <ul><li>- [ ] a Notification appears saying that the Range is to high.</li></ul> |
| Actor1 <ACTOR1> is at a distance between 21 and 40 of Actor2 <ACTOR2> and tries to attack with Talent-B <TALENT-B>. verify that: <ul><li>- an error notifiaction appears saying that the range is to big</li></ul> | <ul><li>- [ ] a Notification appears saying that the Range is to high.</li></ul> |
| Actor1 <ACTOR1> is at a distance between 21 and 40 of Actor2 <ACTOR2> and tries to attack with Talent-C <TALENT-C>. verify that: <ul><li>- an error notifiaction appears saying that the range is to big</li></ul> | <ul><li>- [ ] a Notification appears saying that the Range is to high.</li></ul> |
| Actor1 <ACTOR1> is at a distance between 21 and 40 of Actor2 <ACTOR2> and tries to attack with Talent-D <TALENT-D>. verify that: <ul><li>- the roll prompts opens with a modifier of **-2** </li></ul> | <ul><li>- [ ] A roll prompt appears with a modifier **-2** (for long range)</li></ul> |
| confirm the prompt (repeat until success) and verify that: <ul><li>- a roll is executed with a modifier of **-2** </li> <li>- two click options (Buttons) appear for Actor2 <ACTOR2>. **take the hit** and **avoid Blow** </li></ul> | <ul><li>- [ ] roll was executed with a modifier of **-2**</li> <li>- [ ] two click options for Ator2 <ACTOR2> are available. </li></ul> |
| Actor1 <ACTOR1> confirms the options with **take the hit** and verify that: <ul><li>- a new option appears for Actor1 <ACTOR1> to **roll damage** </li></ul>  | <ul><li>- [ ] a new option **roll damage** appears </li></ul> |
| Actor1 <ACTOR1> confirms the **roll damage** option and verify that: <ul><li>- the damage test prompt opens </li></ul>  | <ul><li>- [ ] the damage prompt opens </li> </ul> |
| Actor1 <ACTOR1> confirms the damage prompt. Verify that: <ul><li>- the damage roll was executed with a modifier of **-2** </li><li>- a click option **apply damage** appears </li></ul>  | <ul><li>- [ ] the damage roll was executed with  a modifier of **-2** </li> <li>- [ ] a click option **apply damage** appears</li></ul> |
| Actor1 <ACTOR1> confirms the click option **apply damage**. verify that: <ul><li>-  Actor2 <ACTOR2> receives the damage lessend by his physical armor </li></ul>  | <ul><li>- [ ] Actor2 <ACTOR2> receives the damage lessend by his physical armor</li> </ul> |
