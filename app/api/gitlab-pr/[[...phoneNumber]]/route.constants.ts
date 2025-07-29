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

export const USER_MAP_LIST = [
  {
    display_name: '@triadi.wrn',
    account_id: 20077026,
    nickname: 'tri_',
    phoneNumber: '6282320018281',
  },
  {
    display_name: '@edi.teknikal',
    account_id: 21712590,
    nickname: 'Edi Pramono',
    phoneNumber: '6281221747708',
  },
  {
    display_name: '@sauzanico',
    account_id: 7763984,
    nickname: 'Nico Sauza',
    phoneNumber: '6285845830956',
  },
  {
    display_name: '@alohdr',
    account_id: 12042712,
    nickname: 'Hendro Susilo',
    phoneNumber: '6281364475006',
  },
  {
    display_name: '@zdrobbany',
    account_id: 5120760,
    nickname: 'Zaid Robbany',
    phoneNumber: '6287883300113',
  },
  {
    display_name: '@teknikal1',
    account_id: 21695238,
    type: 'general',
    nickname: 'Teknikal Kartala',
    phoneNumber: '6281320144088',
  },
  {
    display_name: '@muhyasin89',
    account_id: 1536138,
    nickname: 'muhammad yasin',
    phoneNumber: '628111767305',
  },
  {
    display_name: '@zakyalvan1',
    account_id: 9833096,
    nickname: 'Zaky Alvan',
    phoneNumber: '6281320144088',
  },
  {
    display_name: '@ulungprayitno',
    account_id: 1464731,
    nickname: 'Ulung Prayitno',
    phoneNumber: '6285697955565',
  },
  {
    display_name: '@0xabdu',
    account_id: 27891079,
    nickname: 'Aldi Abdu Malik',
    phoneNumber: '6289622142528',
  },
  {
    display_name: '@krisnarusdiono',
    account_id: 11682855,
    nickname: 'Krisna Rusdiono',
    phoneNumber: '6282116917200',
  },
  {
    display_name: '@nach9',
    account_id: 2726363,
    nickname: 'Nur Achdiansyah',
    phoneNumber: '6281288802981',
  },
  {
    display_name: '4damrr',
    account_id: 20349870,
    nickname: 'Adam Raihan Ramadhani',
    phoneNumber: '6285748642623',
  },
];
