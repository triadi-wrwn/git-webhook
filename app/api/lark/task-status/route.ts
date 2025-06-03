import {
  PHONE_TARGET,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import {
  getUserPhoneNumberByUsername,
} from './route.helper';
import { LarkRequest } from './route.types';

let phoneNumber = '';

const sendMessage = async (message: string) => {
  const formData = new FormData();
  formData.append('phone', phoneNumber || PHONE_TARGET);
  formData.append('message', message);
  await fetch(WA_URL, {
    method: 'POST',
    headers: {
      Authorization: WA_TOKEN,
    },
    body: formData,
  });
};

const onRevision = async (data: LarkRequest) => {
  const {
    taskName,
    assignee,
    status,
    url,
  } = data || {};
  const phonetag = getUserPhoneNumberByUsername(assignee);
  
  const message = `✍🏻 *Lark status update*

*Task*: ${taskName}
*Assignee*: ${assignee}
*Status*: ${status}

Tolong dicek ya bang ${phonetag}
`;
  await sendMessage(message);
};

export const POST = async (
  request: Request,
  { params }: { params: { phoneNumber: string } },
) => {
  const { phoneNumber: paramPhoneNumber = '' } = params || {};
  phoneNumber = paramPhoneNumber;
  const data = (await request.json()) as LarkRequest;
  
  console.log('REQUEST DATA', data);
  const { event } = data || {}; 
  switch (event) {
    case 'update-task-status':
      await onRevision(data);
      break;
    default:
      break;
  }

  return new Response();
};
