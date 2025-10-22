export type CallAction =
  | 'unlock'
  | 'verify'
  | 'deny'
  | 'redirect'
  | 'confirm'
  | 'ask';

export type ColorKey = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'white' | 'slate';

export interface CallPoint {
  id: string;
  shortLabel: string;
  lines: string[];
  color: ColorKey;
  action: CallAction;
  accessRule: string;
  guardPrompt: string;
  notes: string;
}

export interface IntercomColumn {
  id: string;
  title: string;
  buttons: CallPoint[];
}

export const colorSwatches: Record<ColorKey, string> = {
  yellow: '#facc15',
  pink: '#f9a8d4',
  blue: '#93c5fd',
  green: '#86efac',
  orange: '#fdba74',
  white: '#f8fafc',
  slate: '#cbd5f5'
};

export const callPoints: IntercomColumn[] = [
  {
    id: 'column-a',
    title: 'Service & P2 Stack',
    buttons: [
      {
        id: 'loading-dock',
        shortLabel: 'Loading Dock',
        lines: ['Loading', 'Dock'],
        color: 'white',
        action: 'confirm',
        accessRule: 'Confirm loading or delivery purpose before opening.',
        guardPrompt: '“Do you need the loading dock or garage door?”',
        notes: 'Open via desk push button only after the request is confirmed.'
      },
      {
        id: 'p1-dog-relief',
        shortLabel: 'P1 Dog Relief',
        lines: ['P1 E8', 'Dog Relief'],
        color: 'yellow',
        action: 'unlock',
        accessRule: 'Always unlock for deliveries and dog walkers.',
        guardPrompt: '“Delivery or parcel access — you’re clear to enter.”',
        notes: 'Primary parcel access. Unlock immediately after greeting.'
      },
      {
        id: 'p1-parcel-room',
        shortLabel: 'P1 Parcel',
        lines: ['P1 Parcel', 'Room'],
        color: 'yellow',
        action: 'unlock',
        accessRule: 'Treat parcels as P1 access and unlock when verified.',
        guardPrompt: '“Parcel access confirmed — the door is open for you.”',
        notes: 'Use for couriers referencing parcel room or ramp.'
      },
      {
        id: 'p1-ramp',
        shortLabel: 'Ramp C02',
        lines: ['P1 Ramp', 'C02'],
        color: 'yellow',
        action: 'unlock',
        accessRule: 'Ramp callers are typically delivery or maintenance.',
        guardPrompt: '“Ramp access granted — proceed to the loading area.”',
        notes: 'Unlock and advise them to follow on-site signage.'
      },
      {
        id: 'p2-e8',
        shortLabel: 'P2 E8',
        lines: ['P2', 'E8'],
        color: 'pink',
        action: 'verify',
        accessRule: 'Verify caller identity before unlocking the door.',
        guardPrompt: '“Can I get your unit number or name, please?”',
        notes: 'Residential callers must provide verification. Unlock only once confirmed.'
      },
      {
        id: 'p2-e5',
        shortLabel: 'P2 E5',
        lines: ['P2', 'E5'],
        color: 'pink',
        action: 'deny',
        accessRule: 'Never unlock private elevator E5 from security desk.',
        guardPrompt: '“This is the private residential lobby. Please use E8 instead.”',
        notes: 'Remind caller to follow signage to the public elevator bank.'
      },
      {
        id: 'p2-e7',
        shortLabel: 'P2 E7',
        lines: ['P2', 'E7'],
        color: 'pink',
        action: 'redirect',
        accessRule: 'Redirect to street-level exit. Door stays open during daytime.',
        guardPrompt: '“Please exit via Yonge Street — the door should already be open.”',
        notes: 'If locked, guide them to another parking level with E7 access.'
      }
    ]
  },
  {
    id: 'column-b',
    title: 'P3 & P4 Stack',
    buttons: [
      {
        id: 'p3-e8',
        shortLabel: 'P3 E8',
        lines: ['P3', 'E8'],
        color: 'blue',
        action: 'verify',
        accessRule: 'Verify caller identity before unlocking the door.',
        guardPrompt: '“Security here — which suite are you visiting today?”',
        notes: 'Always ask for a unit number or name before using the key.'
      },
      {
        id: 'p3-e5',
        shortLabel: 'P3 E5',
        lines: ['P3', 'E5'],
        color: 'blue',
        action: 'deny',
        accessRule: 'E5 is private. Never release from the security desk.',
        guardPrompt: '“E5 is restricted — please head over to the public elevator E8.”',
        notes: 'Log any persistent requests for private elevator access.'
      },
      {
        id: 'p3-e7',
        shortLabel: 'P3 E7',
        lines: ['P3', 'E7'],
        color: 'blue',
        action: 'redirect',
        accessRule: 'Direct caller to the Yonge Street exit doors.',
        guardPrompt: '“Use the Yonge Street exit; if it’s locked, try another level.”',
        notes: 'Ensure the caller knows that E7 remains unsecured during daytime.'
      },
      {
        id: 'p4-e8',
        shortLabel: 'P4 E8',
        lines: ['P4', 'E8'],
        color: 'green',
        action: 'verify',
        accessRule: 'Always confirm resident identity before releasing the door.',
        guardPrompt: '“May I have your suite number for verification?”',
        notes: 'Check cameras if the caller sounds unsure or unfamiliar.'
      },
      {
        id: 'p4-e5',
        shortLabel: 'P4 E5',
        lines: ['P4', 'E5'],
        color: 'green',
        action: 'deny',
        accessRule: 'Private elevator. Never unlock remotely.',
        guardPrompt: '“E5 is the private lobby — please use elevator E8 instead.”',
        notes: 'Politely redirect without releasing the door.'
      },
      {
        id: 'p4-e7',
        shortLabel: 'P4 E7',
        lines: ['P4', 'E7'],
        color: 'green',
        action: 'redirect',
        accessRule: 'Point callers to the street exit or another parking level.',
        guardPrompt: '“Head to the Yonge Street exit; it should be accessible.”',
        notes: 'Encourage them to move to the open exit doors if needed.'
      }
    ]
  },
  {
    id: 'column-c',
    title: 'P5 & Special',
    buttons: [
      {
        id: 'p5-e8',
        shortLabel: 'P5 E8',
        lines: ['P5', 'E8'],
        color: 'orange',
        action: 'verify',
        accessRule: 'Always verify before releasing high-level parking access.',
        guardPrompt: '“Security at Gloucester — who am I speaking with?”',
        notes: 'Use camera view to double-check identity if unsure.'
      },
      {
        id: 'p5-e5',
        shortLabel: 'P5 E5',
        lines: ['P5', 'E5'],
        color: 'orange',
        action: 'deny',
        accessRule: 'Never release private elevator doors remotely.',
        guardPrompt: '“E5 stays locked — redirecting you to E8 for access.”',
        notes: 'Remind caller of private access policies.'
      },
      {
        id: 'p5-e7',
        shortLabel: 'P5 E7',
        lines: ['P5', 'E7'],
        color: 'orange',
        action: 'redirect',
        accessRule: 'Guide caller to the street-level exit for departure.',
        guardPrompt: '“Use the street exit; the door should already be open.”',
        notes: 'Advise them to try another level if they encounter a locked door.'
      },
      {
        id: 'pool',
        shortLabel: 'Pool 6F',
        lines: ['Pool', '6F'],
        color: 'white',
        action: 'deny',
        accessRule: 'No remote unlock from desk. Confirm purpose and redirect.',
        guardPrompt: '“Pool access can’t be unlocked from here. What do you need assistance with?”',
        notes: 'If it is an emergency, contact concierge or property management immediately.'
      },
      {
        id: 'other',
        shortLabel: 'Other Call',
        lines: ['Other', 'Call'],
        color: 'slate',
        action: 'ask',
        accessRule: 'Gather details before taking any action.',
        guardPrompt: '“There’s no door connected — how can I assist you?”',
        notes: 'Document unusual requests in the security log with time and details.'
      }
    ]
  }
];
