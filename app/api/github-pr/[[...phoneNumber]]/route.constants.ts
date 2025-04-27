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

export const USER_MAP_LIST = [
  {
    display_name: 'trdi. wrwn',
    account_id: '557058:43bce807-9e43-40cc-a57e-0cc315502b0c',
    nickname: 'tri_',
    phoneNumber: '6282320018281',
  },
  {
    display_name: 'Asep Saepul Rohmat',
    account_id: '5d12f36e90096d0c4c8cf9e5',
    nickname: 'Asep Saepul Rohmat',
    phoneNumber: '6288806366064',
  },
  {
    display_name: 'aldirafithanifah',
    account_id: '60503189009fee006920d80e',
    nickname: 'aldirafithanifah',
    phoneNumber: '6289639971606',
  },
  {
    display_name: 'Moch. Arief Febriansyah',
    account_id: '60dc3a0c7d01690070292d33',
    nickname: 'Moch. Arief Febriansyah',
    phoneNumber: '6285295248759',
  },
  {
    display_name: 'Andhy Renal Hidayat',
    account_id: '6114c28fe6e6f800717635ed',
    nickname: 'Andhy Renal Hidayat',
    phoneNumber: '6285975190806',
  },
  {
    display_name: 'krisna',
    account_id: '6152b59e7a6be40071923778',
    nickname: 'krisna',
    phoneNumber: '6282116917200',
  },
  {
    display_name: 'arrizky hasya pratama',
    account_id: '62b963ffd752af0e54eb40c6',
    nickname: 'arrizky hasya pratama',
    phoneNumber: '6285161867116',
  },
  {
    display_name: 'Josua Sitanggang',
    account_id: '712020:c853cd52-e15e-454d-8b04-4f0aed650423',
    nickname: 'Josua Sitanggang',
    phoneNumber: '6288264894239',
  },
  {
    display_name: 'Hasbi Ashshidiq',
    type: 'user',
    account_id: '5d415d0676cb3e0d9d31f167',
    nickname: 'Hasbi Ashshidiq',
    phoneNumber: '6287830047567',
  },
];
