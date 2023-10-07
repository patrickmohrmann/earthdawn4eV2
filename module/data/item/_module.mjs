import ArmorData from "./armor.mjs";
import AttackData from "./attack.mjs";
import CurseHorrorMarkData from "./curse-horror-mark.mjs";
import DevotionData from "./devotion.mjs";
import DisciplineData from "./discipline.mjs";
import EffectData from "./effect.mjs";
import EquipmentData from "./equipment.mjs";
import KnackData from "./knack.mjs";
import ManeuverData from "./maneuver.mjs";
import MaskData from "./mask.mjs";
import NamegiverData from "./namegiver.mjs";
import PathData from "./path.mjs";
import PoisonDiseaseData from "./poison-disease.mjs";
import PowerData from "./power.mjs";
import QuestorData from "./questor.mjs";
import ShieldData from "./shield.mjs";
import SkillData from "./skill.mjs";
import SpecialData from "./special.mjs";
import SpellData from "./spell.mjs";
import TalentData from "./talent.mjs";
import ThreadData from "./thread.mjs";
import WeaponData from "./weapon.mjs";

export {
    ArmorData,
    AttackData,
    CurseHorrorMarkData,
    DevotionData,
    DisciplineData,
    EffectData,
    EquipmentData,
    KnackData,
    ManeuverData,
    MaskData,
    NamegiverData,
    PathData,
    PoisonDiseaseData,
    PowerData,
    QuestorData,
    ShieldData,
    SkillData,
    SpecialData,
    SpellData,
    TalentData,
    ThreadData,
    WeaponData
};
export {default as ClassTemplate} from "./templates/class.mjs";
export {default as PhysicalItemTemplate} from "./templates/physical-item.mjs";

export const config = {
    armor: ArmorData,
    attack: AttackData,
    cursemark: CurseHorrorMarkData,
    devotion: DevotionData,
    discipline: DisciplineData,
    effect: EffectData,
    equipment: EquipmentData,
    knack: KnackData,
    maneuver: ManeuverData,
    mask: MaskData,
    namegiver: NamegiverData,
    path: PathData,
    poisonDisease: PoisonDiseaseData,
    power: PowerData,
    questor: QuestorData,
    shield: ShieldData,
    skill: SkillData,
    special: SpecialData,
    spell: SpellData,
    talent: TalentData,
    thread: ThreadData,
    weapon: WeaponData
};
