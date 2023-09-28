import ArmorData from "./armor.mjs";
import DisciplineData from "./discipline.mjs";
import EffectData from "./effect.mjs";
import EquipmentData from "./equipment.mjs";
import MaskData from "./mask.mjs";
import NamegiverData from "./namegiver.mjs";
import PathData from "./path.mjs";
import QuestorData from "./questor.mjs";
import ShieldData from "./shield.mjs";
import ThreadData from "./thread.mjs";
import WeaponData from "./weapon.mjs";

export {
    ArmorData,
    DisciplineData,
    EffectData,
    EquipmentData,
    MaskData,
    NamegiverData,
    PathData,
    QuestorData,
    ShieldData,
    ThreadData,
    WeaponData
};
export {default as ClassTemplate} from "./templates/class.mjs";
export {default as PhysicalItemTemplate} from "./templates/physical-item.mjs";

export const config = {
    armor: ArmorData,
    discipline: DisciplineData,
    activeEffect: EffectData,
    equipment: EquipmentData,
    mask: MaskData,
    namegiver: NamegiverData,
    path: PathData,
    questor: QuestorData,
    shield: ShieldData,
    patternThread: ThreadData,
    weapon: WeaponData
};