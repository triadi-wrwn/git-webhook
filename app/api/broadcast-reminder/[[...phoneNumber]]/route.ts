import {
  PHONE_TARGET,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import {
  getProjectDetail,
  getProjectMembers,
} from './route.helper';
import type { ProjectType, ReminderPayload } from './route.types';

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

const sendReminder = async (projectId: ProjectType) => {
  const { name, dcRoomId, time } = getProjectDetail(projectId) || {};
  const message = `👋 Hi, reminder friendly ya!

Daily Stand-Up ${name}
🕙 Hari ini jam ${time} WIB
📍 Discord → ${dcRoomId}
🗒️ Durasi ±15 menit

Mohon join tepat waktu ya, kita bahas progres, kendala, dan rencana kerja hari ini.
Kalau ada kendala gabung, kabari Bella dulu ya. Thanks! 🙌

${getProjectMembers(projectId)}`;
  await sendMessage(message);
};

export const POST = async (
  request: Request,
  { params }: { params: { phoneNumber: string } },
) => {
  const data = (await request.json()) as ReminderPayload;
  console.log('REMINDER FOR: ', data);
  const { projectId } = data || {};
  const { phoneNumber: paramPhoneNumber = '' } = params || {};
  phoneNumber = paramPhoneNumber;
  if (phoneNumber) {
    await sendReminder(projectId);
  }

  return new Response();
};
