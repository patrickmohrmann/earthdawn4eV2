## Test description:

this test covers a simple missle combat attack with a short range without any reaction or maneuver

## User Journey:

Actor1 <ACTOR1> is adjacent to Actor2 <ACTOR2> and has Actor2 <ACTOR2> targeted. <br>
On activating the abilities *Missle Weapons* a roll prompt appears.<br>
After confirmation of the roll prompt a chat message is created showing information about the roll result (success, failure, extra successes etc.)<br>
The chat message contains two click options only usable by the GM or Actor2 <ACTOR2>.<br>
the options are **take the hit** and **use avoid Blow**.<br>
Actor2 <ACTOR2> choses **take the hit** and by doing so, a roll prompt is created for Actor1 <ACTOR1> to roll damage.<br>
Extra successes from the attack roll are handed over to the damage roll prompt with a rate 2:1.<br>
on confirming the roll damage prompt, a chat message appears with the result and an option only usable by Gm and or Actor1 <ACTOR1> to assign the damage to Actor2 <ACTOR2>.<br>
on activation of the apply damage option, the roll damage result is added to the damage value of Actor2 <ACTOR2> lessend by the physical armor value.<br>

### Diagram:

```mermaid
sequenceDiagram
actor Attacker
participant System
actor Defender

Attacker ->> Defender: Distance is short
Attacker ->> System: attack with missile weapon
System -->> Attacker: prompt for attack
Attacker ->> Defender: roll Attack
System -->> Defender: show reactions
Defender ->> System: chose **take the hit**
System ->> Attacker: damage prompt
Attacker ->> Defender: roll Damage
Attacker ->> Defender: assign Damage
```

### Prerequisites:

Actor1 <ACTOR1> and Actor2 <ACTOR2> exist.

Actor1 <ACTOR1> has the following items:
**Abilities**
* Talent-D <TALENT-D> (Missile Weapons) with *required Item Status* set to **main- or two-handed** and *Action Type* set to **Attack**.
* Item-E <ITEM-E> (Bow) has *weapon Type* set to **Missle** and a range values set to
  * short range min = 2
  * short range mage = 20
  * long range min = 21
  * long range max = 40

**Note** amunition is either not implemented, or the amount is high enough for this test to not interfere.

Actor2 <ACTOR2> has the following items:
* Talent-A <TALENT-A> (Avoid Blow) with *reaction Type* set to **physical Defense**.

## Test:

| Test Instruction  | Expected Result  |
|---|---|
|   | <ul><li>- [ ] </li> <li>- [ ] </li></ul> |
|   | <ul><li>- [ ] </li> <li>- [ ] </li></ul> |
|   | <ul><li>- [ ] </li> <li>- [ ] </li></ul> |
|   | <ul><li>- [ ] </li> <li>- [ ] </li></ul> |
|   | <ul><li>- [ ] </li> <li>- [ ] </li></ul> |
|   | <ul><li>- [ ] </li> <li>- [ ] </li></ul> |