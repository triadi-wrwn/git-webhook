import {
  EVENT_TYPE,
  PHONE_TARGET, USER_MAP_LIST,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import type { PullRequestGitlab, User } from './route.types';

let phoneNumber = '';

const getUserPhoneNumber = (data: User) => {
  console.log('ACCOUNT INFO', data);
  const { id: accountId, name: displayName } = data;
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === accountId);
  return foundUser ? `@${foundUser.phoneNumber}` : displayName;
};

const getUserPhoneNumberById = (userId: number) => {
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === userId);
  return foundUser ? `@${foundUser.phoneNumber}` : '';
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

const onCreatedPR = async (data: PullRequestGitlab) => {
  console.log('MR CREATED', data);
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
    },
    reviewers,
    user: author,
  } = data || {};
  const message = `🆕 *${repositoryName}* PR #${id} created by ${getUserPhoneNumber(author)}
 
${title}
${prLink}
*Reviewers*: ${reviewers.length > 0 ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ') : 'None'}`;
  await sendMessage(message);
};

const onUpdatedPR = async (data: PullRequestGitlab) => {
  console.log('MR UPDATED', data);
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
      author_id: authorId,
    },
    reviewers,
  } = data || {};
  const author = USER_MAP_LIST.find((el) => el.account_id === authorId);
  const message = `🆕 *${repositoryName}* PR #${id} updated
 
${title}
${prLink}
*Author*: ${author?.phoneNumber}
*Reviewers*: ${reviewers.length > 0 ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ') : 'None'}`;
  await sendMessage(message);
};

const onApproval = async (data: PullRequestGitlab) => {
  console.log('MR APPROVAL', data);
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
      author_id: authorId,
    },
    reviewers,
    user,
  } = data || {};
  const foundReviewer = reviewers.find((p) => p.id === user.id);
  const message = `✍🏻 *${repositoryName}* PR #${id} approval status update
 
${title}
${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Approval Status*: ${reviewers.map((p) => (
    `${getUserPhoneNumber(p)}${foundReviewer?.id === p.id ? ' ✅' : ''}`
  ))
    .join(', ')}
`;
  await sendMessage(message);
};

const onMergedPR = async (data: PullRequestGitlab) => {
  console.log('MR MERGED', data);
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
      author_id: authorId,
    },
    user: actor,
  } = data || {};
  const message = `🚀 *${repositoryName}* PR #${id} *merged* by ${getUserPhoneNumber(actor)}
 
${title}
${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}`;
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
  const eventType = request.headers.get('X-Gitlab-Event');
  console.log('REQUEST HEADERS', eventType);
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
