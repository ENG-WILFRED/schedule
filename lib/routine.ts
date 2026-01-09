export type Block = {
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: number[]
  status?: 'upcoming'|'active'|'done'
}

const todayTemplate: Block[] = [
  { name: 'Wake up', start: '09:00', end: '09:15', strict: false, notifyBefore: [15] },
  { name: 'Beach workout', start: '09:15', end: '10:00', strict: false, notifyBefore: [10] },
  { name: 'Shower & Feed', start: '10:00', end: '11:00', strict: false, notifyBefore: [10] },
  { name: 'Morning check-in', start: '11:00', end: '11:15', strict: true, notifyBefore: [10,2] },
  { name: 'Flexible block', start: '11:15', end: '14:30', strict: false, notifyBefore: [30] },
  { name: 'Tennis', start: '15:00', end: '19:00', strict: true, notifyBefore: [30] },
  { name: 'Evening reset', start: '19:00', end: '20:00', strict: false, notifyBefore: [10] },
  { name: 'Meetings', start: '20:00', end: '22:00', strict: true, notifyBefore: [15] },
  { name: 'Wind-down', start: '22:00', end: '23:00', strict: false, notifyBefore: [10] },
  { name: 'Decompression', start: '23:00', end: '00:00', strict: false, notifyBefore: [10] },
  { name: 'Deep Work', start: '00:00', end: '03:00', strict: true, notifyBefore: [0] }
]

function parseHM(hm: string){
  const [hh,mm] = hm.split(':').map(Number)
  return { hh, mm }
}

function nowHM(){
  const d = new Date()
  return { hh: d.getHours(), mm: d.getMinutes() }
}

function hmToMinutes({hh,mm}:{hh:number,mm:number}){return hh*60+mm}

function statusForBlock(block: Block, now: {hh:number,mm:number}){
  const start = hmToMinutes(parseHM(block.start))
  const end = hmToMinutes(parseHM(block.end))
  const n = hmToMinutes(now)
  if(n < start) return 'upcoming' as const
  if(n >= start && n < end) return 'active' as const
  return 'done' as const
}

export function getTodayRoutine(): Block[]{
  const now = nowHM()
  return todayTemplate.map(b=>({ ...b, status: statusForBlock(b, now) }))
}

export default { getTodayRoutine }
