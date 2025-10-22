export type IntercomActionType =
  | 'autoUnlock'
  | 'verifyUnlock'
  | 'neverUnlock'
  | 'redirect'
  | 'confirmThenUnlock'
  | 'askPurpose'
  | 'noDoorControl';

export interface IntercomTarget {
  id: string;
  column: 1 | 2 | 3;
  row: number;
  label: string;
  subLabel?: string;
  colorClass: string;
  textClass?: string;
  actionType: IntercomActionType;
  guardScript: string;
  helperNote?: string;
}

export const intercomTargets: IntercomTarget[] = [
  {
    id: 'loading-dock',
    column: 1,
    row: 1,
    label: 'Loading Dock',
    colorClass: 'bg-slate-100',
    textClass: 'text-slate-800',
    actionType: 'confirmThenUnlock',
    guardScript: 'Loading dock, security speaking — do you need the dock or garage door opened?',
    helperNote: 'Confirm their purpose before unlocking. Use desk push button for the garage door if required.'
  },
  {
    id: 'p1-e8',
    column: 1,
    row: 2,
    label: 'P1 E8',
    subLabel: 'Dog Relief / TTC',
    colorClass: 'bg-yellow-200',
    textClass: 'text-slate-900',
    actionType: 'autoUnlock',
    guardScript: "Delivery or parcel access — you’re clear to enter.",
    helperNote: 'Always unlock P1 E8 Dog Relief for deliveries.'
  },
  {
    id: 'p1-e5',
    column: 1,
    row: 3,
    label: 'P1 E5',
    subLabel: 'Private Lobby',
    colorClass: 'bg-yellow-100',
    actionType: 'neverUnlock',
    guardScript:
      'This is the private residential lobby. Please follow the parking signs to E8 or use the commercial elevator for exit.',
    helperNote: 'Never unlock E5 (private elevator bank).'
  },
  {
    id: 'p1-e7',
    column: 1,
    row: 4,
    label: 'P1 E7',
    subLabel: 'Commercial',
    colorClass: 'bg-yellow-50',
    textClass: 'text-slate-800',
    actionType: 'redirect',
    guardScript:
      'Please use the Yonge Street exit; the door is unlocked during daytime. If it’s locked, head to another parking level.',
    helperNote: 'Redirect callers to the street exit — do not unlock from the desk.'
  },
  {
    id: 'p2-e8',
    column: 2,
    row: 1,
    label: 'P2 E8',
    subLabel: 'Resident',
    colorClass: 'bg-pink-200',
    textClass: 'text-slate-900',
    actionType: 'verifyUnlock',
    guardScript: 'Hi there — can I have your unit number or name for verification?'
  },
  {
    id: 'p2-e5',
    column: 2,
    row: 2,
    label: 'P2 E5',
    subLabel: 'Private Lobby',
    colorClass: 'bg-pink-100',
    actionType: 'neverUnlock',
    guardScript:
      'This is the private residential lobby. Please follow the parking signs to E8 or use the commercial elevator for exit.'
  },
  {
    id: 'p2-e7',
    column: 2,
    row: 3,
    label: 'P2 E7',
    subLabel: 'Commercial',
    colorClass: 'bg-pink-50',
    textClass: 'text-slate-800',
    actionType: 'redirect',
    guardScript:
      'Please use the Yonge Street exit; the door is unlocked during daytime. If it’s locked, head to another parking level.'
  },
  {
    id: 'p3-e8',
    column: 2,
    row: 4,
    label: 'P3 E8',
    subLabel: 'Resident',
    colorClass: 'bg-sky-200',
    textClass: 'text-slate-900',
    actionType: 'verifyUnlock',
    guardScript: 'Hi there — can I have your unit number or name for verification?'
  },
  {
    id: 'p3-e5',
    column: 2,
    row: 5,
    label: 'P3 E5',
    subLabel: 'Private Lobby',
    colorClass: 'bg-sky-100',
    actionType: 'neverUnlock',
    guardScript:
      'This is the private residential lobby. Please follow the parking signs to E8 or use the commercial elevator for exit.'
  },
  {
    id: 'p3-e7',
    column: 2,
    row: 6,
    label: 'P3 E7',
    subLabel: 'Commercial',
    colorClass: 'bg-sky-50',
    textClass: 'text-slate-800',
    actionType: 'redirect',
    guardScript:
      'Please use the Yonge Street exit; the door is unlocked during daytime. If it’s locked, head to another parking level.'
  },
  {
    id: 'p4-e8',
    column: 3,
    row: 1,
    label: 'P4 E8',
    subLabel: 'Resident',
    colorClass: 'bg-emerald-200',
    textClass: 'text-slate-900',
    actionType: 'verifyUnlock',
    guardScript: 'Hi there — can I have your unit number or name for verification?'
  },
  {
    id: 'p4-e5',
    column: 3,
    row: 2,
    label: 'P4 E5',
    subLabel: 'Private Lobby',
    colorClass: 'bg-emerald-100',
    actionType: 'neverUnlock',
    guardScript:
      'This is the private residential lobby. Please follow the parking signs to E8 or use the commercial elevator for exit.'
  },
  {
    id: 'p4-e7',
    column: 3,
    row: 3,
    label: 'P4 E7',
    subLabel: 'Commercial',
    colorClass: 'bg-emerald-50',
    textClass: 'text-slate-800',
    actionType: 'redirect',
    guardScript:
      'Please use the Yonge Street exit; the door is unlocked during daytime. If it’s locked, head to another parking level.'
  },
  {
    id: 'p5-e8',
    column: 3,
    row: 4,
    label: 'P5 E8',
    subLabel: 'Resident',
    colorClass: 'bg-orange-200',
    textClass: 'text-slate-900',
    actionType: 'verifyUnlock',
    guardScript: 'Hi there — can I have your unit number or name for verification?'
  },
  {
    id: 'pool',
    column: 3,
    row: 5,
    label: 'Pool 6F',
    colorClass: 'bg-white',
    textClass: 'text-slate-800',
    actionType: 'noDoorControl',
    guardScript: 'Security here — there’s no door control from the desk. What do you need assistance with?'
  },
  {
    id: 'other',
    column: 3,
    row: 6,
    label: 'Other',
    subLabel: 'Unlabeled',
    colorClass: 'bg-slate-200',
    textClass: 'text-slate-800',
    actionType: 'askPurpose',
    guardScript: 'Security here — there’s no door connected to this button. How can I assist you?'
  }
];
