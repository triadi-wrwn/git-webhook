import { PHONE_TARGET, WA_TOKEN, WA_URL } from './route.constants';
import { getUserPhoneNumberByUsername } from './route.helper';
import type { LarkRequest } from './route.types';

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
    qaNotes,
  } = data || {};
  const phonetag = getUserPhoneNumberByUsername(assignee);
  const message = `✍🏻 *Lark status update*

*Task*: ${taskName}
*Assignee*: ${assignee}
*Status*: ${status}
*Url*: ${url}
*QA Notes*: ${qaNotes}

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
  const rawBody = await request.text();

  // Optional: sanitize control characters
  // eslint-disable-next-line no-control-regex
  const sanitized = rawBody.replace(/[\u0000-\u001F]+/g, '');

  // Then try parsing
  let data;
  try {
    data = JSON.parse(sanitized);
  } catch (err) {
    console.error('Still invalid JSON:', err);
  }

  // const data = (await request.json()) as LarkRequest;
  console.log('REQUEST DATA', data);
  const { event } = data || {};
  switch (event) {
    case 'update-task-status':
      await onRevision(data as LarkRequest);
      break;
    default:
      break;
  }

  return new Response();
};
