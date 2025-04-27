import {
  EVENT_TYPE,
  PHONE_TARGET, USER_MAP_LIST,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import type { Account, PullRequestBase } from './route.types';

let phoneNumber = '';

const getUserPhoneNumber = (data: Account) => {
  console.log('ACCOUNT INFO', data);
  const { account_id: accountId, display_name: displayName } = data;
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === accountId);
  return foundUser ? `@${foundUser.phoneNumber}` : displayName;
};

const sendMessage = async (message: string) => {
  console.log('SEND MESSAGE', message);
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

const onCreatedPR = async (data: PullRequestBase) => {
  console.log('MR CREATED', data);
  const {
    pullrequest: {
      author,
      links: {
        html: {
          href: prLink,
        },
      },
      id,
      title,
      reviewers,
    },
    repository: {
      name: repositoryName,
    },
  } = data || {};
  const message = `🆕 *${repositoryName}* PR #${id} created by ${getUserPhoneNumber(author)}
 
${title}
${prLink}
*Reviewers*: ${reviewers.length > 0 ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ') : 'None'}`;
  await sendMessage(message);
};

const onUpdatedPR = async (data: PullRequestBase) => {
  console.log('MR UPDATED', data);
  const {
    pullrequest: {
      links: {
        html: {
          href: prLink,
        },
      },
      author,
      id,
      title,
      reviewers,
    },
    repository: {
      name: repositoryName,
    },
  } = data || {};
  const message = `🆕 *${repositoryName}* PR #${id} updated
 
${title}
${prLink}
*Author*: ${getUserPhoneNumber(author)}
*Reviewers*: ${reviewers.length > 0 ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ') : 'None'}`;
  await sendMessage(message);
};

const onApproval = async (data: PullRequestBase) => {
  console.log('MR APPROVAL', data);
  const {
    pullrequest: {
      links: {
        html: {
          href: prLink,
        },
      },
      author,
      id,
      title,
      participants,
      comment_count: commentCount = 0,
    },
    repository: {
      name: repositoryName,
    },
  } = data || {};
  const message = `✍🏻 *${repositoryName}* PR #${id} approval status update
 
${title}
${prLink}
*Author*: ${getUserPhoneNumber(author)}
*Approval Status*: ${participants.map((p) => (
    `${getUserPhoneNumber(p.user)}${p.state === 'approved' ? ' ✅' : ''}${p.state === 'changes_requested' ? ' ⛔' : ''}`
  )).join(', ')}
*Comment Count*: ${commentCount}`;
  await sendMessage(message);
};

const onMergedPR = async (data: PullRequestBase) => {
  console.log('MR MERGED', data);
  const {
    actor,
    pullrequest: {
      links: {
        html: {
          href: prLink,
        },
      },
      author,
      id,
      title,
    },
    repository: {
      name: repositoryName,
    },
  } = data || {};
  const message = `🚀 *${repositoryName}* PR #${id} *merged* by ${getUserPhoneNumber(actor)}
 
${title}
${prLink}
*Author*: ${getUserPhoneNumber(author)}`;
  await sendMessage(message);
};

export const POST = async (request: Request, { params }: { params: { phoneNumber: string } }) => {
  const { phoneNumber: paramPhoneNumber = '' } = params || {};
  phoneNumber = paramPhoneNumber;
  const {
    created,
    merged,
    updated,
  } = EVENT_TYPE;
  console.log('REQUEST PARAMS', params);
  const data = await request.json();
  console.log('REQUEST DATA', data);
  const eventType = request.headers.get('x-event-key');
  console.log('REQUEST HEADERS', request.headers.entries());
  if (eventType) {
    switch (eventType) {
      case created: {
        await onCreatedPR(data);
        break;
      }
      case updated: {
        await onUpdatedPR(data);
        break;
      }
      case merged: {
        await onMergedPR(data);
        break;
      }
      default: {
        await onApproval(data);
        break;
      }
    }
  }

  return new Response();
};
