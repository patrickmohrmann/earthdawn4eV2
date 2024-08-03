## Test description:

this test covers a simple missile combat attack within close combat range without any reaction or maneuver

## User Journey:

Actor1 <ACTOR1> is adjacent to Actor2 <ACTOR2> and has Actor2 <ACTOR2> targeted. <br>
On activating the abilities *missile Weapons* a ui notification appears, informing about, that the target is in close combat range.<br>

### Diagram:

```mermaid
sequenceDiagram
actor Attacker
participant System
actor Defender

Attacker ->> Defender: Distance is close combat
Attacker ->> System: attack with missile weapon
System -->> Attacker: ui notification - close combat
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
