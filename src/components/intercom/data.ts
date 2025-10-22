export type CallType =
  | 'delivery'
  | 'resident'
  | 'privateLobby'
  | 'commercial'
  | 'loadingDock'
  | 'pool'
  | 'other';

export type PanelColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'white' | 'slate';

export type ControlAction = 'talk' | 'key' | 'off';

export interface IntercomButtonDefinition {
  id: string;
  column: number;
  row: number;
  label: string;
  subLabel?: string;
  color: PanelColor;
  callType: CallType;
  location: string;
}

export const intercomButtons: IntercomButtonDefinition[] = [
  {
    id: 'p2-c004',
    column: 0,
    row: 0,
    label: 'P2 C004',
    subLabel: 'Resident / Private',
    color: 'pink',
    callType: 'resident',
    location: 'Parking Level 2 – Suite C004'
  },
  {
    id: 'p2-c003',
    column: 0,
    row: 1,
    label: 'P2 C003',
    subLabel: 'Resident / Private',
    color: 'pink',
    callType: 'resident',
    location: 'Parking Level 2 – Suite C003'
  },
  {
    id: 'p1-parcel',
    column: 0,
    row: 2,
    label: 'P1 E8',
    subLabel: 'Parcel Room',
    color: 'yellow',
    callType: 'delivery',
    location: 'Parking Level 1 – Parcel Room Door'
  },
  {
    id: 'p1-dog-ttc',
    column: 0,
    row: 3,
    label: 'P1 E8',
    subLabel: 'Dog Relief / TTC',
    color: 'yellow',
    callType: 'delivery',
    location: 'Parking Level 1 – Dog Relief / TTC Gate'
  },
  {
    id: 'p1-ramp',
    column: 0,
    row: 4,
    label: 'P1 E8',
    subLabel: 'Ramp C02',
    color: 'yellow',
    callType: 'delivery',
    location: 'Parking Level 1 – Ramp C02 Entrance'
  },
  {
    id: 'p1-e5-main',
    column: 0,
    row: 5,
    label: 'P1 E5',
    subLabel: 'Main Lobby',
    color: 'pink',
    callType: 'privateLobby',
    location: 'Parking Level 1 – Private Lobby'
  },
  {
    id: 'p2-e5-east',
    column: 0,
    row: 6,
    label: 'P2 E5',
    subLabel: 'East Lobby',
    color: 'pink',
    callType: 'privateLobby',
    location: 'Parking Level 2 – Private Lobby'
  },
  {
    id: 'p3-e5-east',
    column: 0,
    row: 7,
    label: 'P3 E5',
    subLabel: 'East Lobby',
    color: 'blue',
    callType: 'privateLobby',
    location: 'Parking Level 3 – Private Lobby'
  },
  {
    id: 'p4-e5-east',
    column: 0,
    row: 8,
    label: 'P4 E5',
    subLabel: 'East Lobby',
    color: 'green',
    callType: 'privateLobby',
    location: 'Parking Level 4 – Private Lobby'
  },
  {
    id: 'loading-dock',
    column: 0,
    row: 9,
    label: 'Loading Dock',
    subLabel: 'Freight / Pool',
    color: 'white',
    callType: 'loadingDock',
    location: 'Loading Dock & Pool Corridor'
  },
  {
    id: 'pool',
    column: 0,
    row: 10,
    label: 'Pool',
    subLabel: '6th Floor',
    color: 'white',
    callType: 'pool',
    location: 'Level 6 – Pool Entrance'
  },
  {
    id: 'info-desk',
    column: 0,
    row: 11,
    label: 'Info Desk',
    subLabel: 'Assistance',
    color: 'white',
    callType: 'other',
    location: 'Security Desk Assistance'
  },
  {
    id: 'p2-e8-main',
    column: 1,
    row: 0,
    label: 'P2 E8',
    subLabel: 'Main',
    color: 'pink',
    callType: 'resident',
    location: 'Parking Level 2 – Elevator E8 Main'
  },
  {
    id: 'p3-e8-main',
    column: 1,
    row: 1,
    label: 'P3 E8',
    subLabel: 'Main',
    color: 'blue',
    callType: 'resident',
    location: 'Parking Level 3 – Elevator E8 Main'
  },
  {
    id: 'p4-e8-main',
    column: 1,
    row: 2,
    label: 'P4 E8',
    subLabel: 'Main',
    color: 'green',
    callType: 'resident',
    location: 'Parking Level 4 – Elevator E8 Main'
  },
  {
    id: 'p5-e8-main',
    column: 1,
    row: 3,
    label: 'P5 E8',
    subLabel: 'Main',
    color: 'orange',
    callType: 'resident',
    location: 'Parking Level 5 – Elevator E8 Main'
  },
  {
    id: 'p2-e8-east',
    column: 1,
    row: 4,
    label: 'P2 E8',
    subLabel: 'East',
    color: 'pink',
    callType: 'resident',
    location: 'Parking Level 2 – Elevator E8 East'
  },
  {
    id: 'p3-e8-east',
    column: 1,
    row: 5,
    label: 'P3 E8',
    subLabel: 'East',
    color: 'blue',
    callType: 'resident',
    location: 'Parking Level 3 – Elevator E8 East'
  },
  {
    id: 'p4-e8-east',
    column: 1,
    row: 6,
    label: 'P4 E8',
    subLabel: 'East',
    color: 'green',
    callType: 'resident',
    location: 'Parking Level 4 – Elevator E8 East'
  },
  {
    id: 'p5-e8-east',
    column: 1,
    row: 7,
    label: 'P5 E8',
    subLabel: 'East',
    color: 'orange',
    callType: 'resident',
    location: 'Parking Level 5 – Elevator E8 East'
  },
  {
    id: 'p1-e7',
    column: 1,
    row: 8,
    label: 'P1 E7',
    subLabel: 'Commercial',
    color: 'yellow',
    callType: 'commercial',
    location: 'Parking Level 1 – Commercial Elevator'
  },
  {
    id: 'p2-e7',
    column: 1,
    row: 9,
    label: 'P2 E7',
    subLabel: 'Commercial',
    color: 'pink',
    callType: 'commercial',
    location: 'Parking Level 2 – Commercial Elevator'
  },
  {
    id: 'p3-e7',
    column: 1,
    row: 10,
    label: 'P3 E7',
    subLabel: 'Commercial',
    color: 'blue',
    callType: 'commercial',
    location: 'Parking Level 3 – Commercial Elevator'
  },
  {
    id: 'directory',
    column: 1,
    row: 11,
    label: 'Directory',
    subLabel: 'Assist',
    color: 'white',
    callType: 'other',
    location: 'General Directory Assistance'
  },
  {
    id: 'p4-4012',
    column: 2,
    row: 0,
    label: 'P4 4012',
    subLabel: 'Resident',
    color: 'green',
    callType: 'resident',
    location: 'Parking Level 4 – Stall 4012'
  },
  {
    id: 'p4-4013',
    column: 2,
    row: 1,
    label: 'P4 4013',
    subLabel: 'Resident',
    color: 'green',
    callType: 'resident',
    location: 'Parking Level 4 – Stall 4013'
  },
  {
    id: 'p4-4015',
    column: 2,
    row: 2,
    label: 'P4 4015',
    subLabel: 'Resident',
    color: 'green',
    callType: 'resident',
    location: 'Parking Level 4 – Stall 4015'
  },
  {
    id: 'p4-4018',
    column: 2,
    row: 3,
    label: 'P4 4018',
    subLabel: 'Resident',
    color: 'green',
    callType: 'resident',
    location: 'Parking Level 4 – Stall 4018'
  },
  {
    id: 'p3-3017',
    column: 2,
    row: 4,
    label: 'P3 3017',
    subLabel: 'Resident',
    color: 'blue',
    callType: 'resident',
    location: 'Parking Level 3 – Stall 3017'
  },
  {
    id: 'p3-3019',
    column: 2,
    row: 5,
    label: 'P3 3019',
    subLabel: 'Resident',
    color: 'blue',
    callType: 'resident',
    location: 'Parking Level 3 – Stall 3019'
  },
  {
    id: 'p2-2013',
    column: 2,
    row: 6,
    label: 'P2 2013',
    subLabel: 'Resident',
    color: 'pink',
    callType: 'resident',
    location: 'Parking Level 2 – Stall 2013'
  },
  {
    id: 'p2-2015',
    column: 2,
    row: 7,
    label: 'P2 2015',
    subLabel: 'Resident',
    color: 'pink',
    callType: 'resident',
    location: 'Parking Level 2 – Stall 2015'
  },
  {
    id: 'p1-1011',
    column: 2,
    row: 8,
    label: 'P1 1011',
    subLabel: 'Resident',
    color: 'yellow',
    callType: 'resident',
    location: 'Parking Level 1 – Stall 1011'
  },
  {
    id: 'security-spare',
    column: 2,
    row: 9,
    label: 'Security',
    subLabel: 'Spare Line',
    color: 'white',
    callType: 'other',
    location: 'Security Desk Spare Line'
  },
  {
    id: 'maintenance',
    column: 2,
    row: 10,
    label: 'Maintenance',
    subLabel: 'On Call',
    color: 'white',
    callType: 'other',
    location: 'Building Maintenance'
  },
  {
    id: 'training-mode',
    column: 2,
    row: 11,
    label: 'Training',
    subLabel: 'Simulation',
    color: 'white',
    callType: 'other',
    location: 'Training & Orientation'
  }
];
