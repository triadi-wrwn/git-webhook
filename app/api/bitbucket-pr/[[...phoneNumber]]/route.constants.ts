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
];
