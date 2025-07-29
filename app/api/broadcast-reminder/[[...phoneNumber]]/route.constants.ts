import type { User } from './route.types';

export const EVENT_TYPE = {
  created: 'pullrequest:created',
  updated: 'pullrequest:updated',
  approved: 'pullrequest:approved',
  unapproved: 'pullrequest:unapproved',
  cr_created: 'pullrequest:changes_request_created',
  cr_removed: 'pullrequest:changes_request_removed',
  merged: 'pullrequest:fulfilled',
} as const;

export const PHONE_TARGET = process.env.PHONE_TARGET || '';
export const WA_URL = process.env.WA_URL || '';
export const WA_TOKEN = process.env.WA_TOKEN || '';
export const GITLAB_TOKEN = process.env.GITLAB_ACCESS_TOKEN || '';
export const GITLAB_TOKEN_TEST = process.env.GITLAB_ACCESS_TOKEN_TEST || '';

export const USER_MAP_LIST: User[] = [
  {
    name: '@triadi.wrn',
    phoneNumber: '6282320018281',
    projectIds: ['crm-shiptracking'],
  },
  {
    name: '@edi.teknikal',
    phoneNumber: '6281221747708',
    projectIds: ['crm-shiptracking', 'crm-bag'],
  },
  {
    name: '@sauzanico',
    phoneNumber: '6285845830956',
    projectIds: ['crm-shiptracking'],
  },
  {
    name: '@alohdr',
    phoneNumber: '6281364475006',
    projectIds: ['crm-shiptracking'],
  },
  {
    name: '@zdrobbany',
    phoneNumber: '6287883300113',
    projectIds: [],
  },
  {
    name: '@teknikal1',
    phoneNumber: '6281320144088',
    projectIds: [],
  },
  {
    name: '@muhyasin89',
    phoneNumber: '628111767305',
    projectIds: ['crm-shiptracking'],
  },
  {
    name: '@zakyalvan1',
    phoneNumber: '6281320144088',
    projectIds: ['crm-shiptracking', 'crm-bag'],
  },
  {
    name: '@ulungprayitno',
    phoneNumber: '6285697955565',
    projectIds: [],
  },
  {
    name: '@0xabdu',
    phoneNumber: '6289622142528',
    projectIds: ['crm-shiptracking'],
  },
  {
    name: '@krisnarusdiono',
    phoneNumber: '6282116917200',
    projectIds: ['crm-bag'],
  },
  {
    name: '@nach9',
    phoneNumber: '6281288802981',
    projectIds: ['crm-shiptracking'],
  },
  {
    name: '4damrr',
    phoneNumber: '6285748642623',
    projectIds: ['crm-shiptracking'],
  },
];

export const PROJECTS_IDS = {
  CRM_SHIPTRACKING: 'crm-shiptracking',
  CRM_BAG: 'crm-bag',
  CRM_BBN: 'crm-bbn',
} as const;

export const PROJECTS = [
  {
    id: PROJECTS_IDS.CRM_SHIPTRACKING,
    name: 'CRM Ship Tracking',
    time: '10.00',
    dcRoomId: 'shiptracking-voice-room',
  },
];
