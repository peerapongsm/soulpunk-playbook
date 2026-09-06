import { campaignSections } from './campaign.js'
import { rulesSections } from './rules.js'
const t = (en, th) => ({ en, th })
export const groups = [
  { id: 'start', title: t('Start Playing', 'เริ่มเล่น') },
  { id: 'roots', title: t('The Roots', 'The Roots') },
  { id: 'campaign', title: t('Run the Campaign', 'ดำเนินแคมเปญ') },
  { id: 'rules', title: t('Rules & References', 'กฎและข้อมูลอ้างอิง') },
]
export const sections = [
  ...campaignSections,
  { id: 'characters', group: 'start', kind: 'characters', title: t('Choose your character', 'เลือกตัวละคร'),
    body: t('Seven level-5 characters; choose four for the default crew. Scores include ancestry and the listed level-4 +2 increase. Gear is a curated campaign package: each has 25 gp, no unlisted magic items, and no soul pledge except Sable. Background equipment is included, never added again. Proficiency is +3. Read selected spells and class rules in the 2014 books. [Meet the neighborhood](#people).',
      'ตัวละครเลเวล 5 เจ็ดคน เลือกสี่คนสำหรับทีมมาตรฐาน ค่ารวมเผ่าพันธุ์และการเพิ่ม +2 ตอนเลเวล 4 ตามที่ระบุแล้ว อุปกรณ์จัดให้ตามแคมเปญ ทุกคนมี 25 gp ไม่มีไอเทมเวทที่ไม่ระบุ และไม่ผูกวิญญาณยกเว้น Sable อุปกรณ์ภูมิหลังรวมแล้ว ไม่รับซ้ำ ความชำนาญ +3 อ่านเวทและคลาสในหนังสือปี 2014 [รู้จักชุมชน](#people)') },
  ...rulesSections,
]
export const maps = {
  roots: {
    title: t('The Roots • walking routes', 'The Roots • ทางเดิน'),
    nodes: [
      { id: '1', label: t('Kael’s clinic', 'คลินิก Kael'), x: 90, y: 60 },
      { id: '4', label: t('Communal kitchen', 'ครัวชุมชน'), x: 290, y: 60 },
      { id: '3', label: t('Gold market', 'ตลาดทอง'), x: 490, y: 60 },
      { id: '6', label: t('Mara’s gate', 'ประตู Mara'), x: 90, y: 200 },
      { id: '5', label: t('Checkpoint', 'ด่านตรวจ'), x: 290, y: 200 },
      { id: '2', label: t('Glitch’s bunker', 'บังเกอร์ Glitch'), x: 490, y: 200 },
    ],
    edges: [{ from: '1', to: '4', minutes: 5 }, { from: '4', to: '3', minutes: 5 }, { from: '3', to: '2', minutes: 10 }, { from: '3', to: '5', minutes: 10 }, { from: '5', to: '6', minutes: 15 }, { from: '1', to: '6', minutes: 20, dm: true }],
  },
  archive: {
    title: t('Contract archive • room key', 'คลังสัญญา • กุญแจห้อง'),
    nodes: [
      { id: 'A1', label: t('Entry / clinic anchor', 'ทางเข้า / จุดยึดคลินิก'), x: 80, y: 70 },
      { id: 'A2', label: t('Witness index', 'สารบัญพยาน'), x: 230, y: 180 },
      { id: 'A3', label: t('Ledger vault', 'ห้องเก็บบัญชี'), x: 380, y: 70 },
      { id: 'A4', label: t('Exit / alley anchor', 'ทางออก / จุดยึดตรอก'), x: 530, y: 180 },
    ],
    edges: [{ from: 'A1', to: 'A2' }, { from: 'A2', to: 'A3' }, { from: 'A3', to: 'A4' }, { from: 'A2', to: 'A4', dm: true }],
  },
  clinic: {
    title: t('Kael’s clinic • room key', 'คลินิก Kael • กุญแจห้อง'),
    nodes: [
      { id: 'C1', label: t('Street entrance', 'ประตูหน้าถนน'), x: 70, y: 70 },
      { id: 'C2', label: t('Waiting room', 'ห้องรอ'), x: 220, y: 170 },
      { id: 'C3', label: t('Patient ward', 'ห้องผู้ป่วย'), x: 370, y: 70 },
      { id: 'C4', label: t('Storeroom', 'ห้องเก็บของ'), x: 520, y: 170 },
      { id: 'G', label: t('Mara’s gate', 'ประตู Mara'), x: 520, y: 275, dm: true },
    ],
    edges: [{ from: 'C1', to: 'C2' }, { from: 'C2', to: 'C3' }, { from: 'C3', to: 'C4' }, { from: 'C4', to: 'G', minutes: 20, dm: true }],
  },
}
export const getHandout = body => body.split(/^## (?:Handout|เอกสารแจก)\r?\n/m)[1]?.split(/^## /m)[0].trim() || ''
