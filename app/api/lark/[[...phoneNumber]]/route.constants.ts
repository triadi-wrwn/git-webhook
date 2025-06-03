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
    display_name: 'Triadi W',
    phoneNumber: '6282320018281',
  },
  {
    display_name: 'Edi Pramono',
    phoneNumber: '6281221747708',
  },
  {
    display_name: 'Nico Sauza',
    phoneNumber: '6285845830956',
  },
  {
    display_name: 'Hendro S',
    phoneNumber: '6281364475006',
  },
  {
    display_name: 'Zaid R',
    phoneNumber: '6287883300113',
  },
  {
    display_name: 'Muh Yasin',
    phoneNumber: '628111767305',
  },
  {
    display_name: 'Muhammad Zaky Alvan',
    phoneNumber: '6281320144088',
  },
  {
    display_name: 'Ulung Prayitno',
    phoneNumber: '6285697955565',
  },
  {
    display_name: 'Aldi Abdu Malik',
    phoneNumber: '6289622142528',
  },
  {
    display_name: 'Krisna Rusdiono',
    phoneNumber: '6282116917200',
  },
  {
    display_name: 'Nur Achdiansyah',
    phoneNumber: '6281288802981',
  },
  {
    display_name: 'Bella',
    phoneNumber: '6285257906656',
  },
];
