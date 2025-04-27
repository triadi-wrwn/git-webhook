import {
  PHONE_TARGET, USER_MAP_LIST,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import type { PullRequestGitlab, User } from './route.types';

let phoneNumber = '';

const truncate = (
  value: string | undefined,
  length: number = 50,
) => (value && value.length > length ? `${value.substring(0, length - 3)}...` : value);

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
      action,
    },
    reviewers,
    user,
  } = data || {};
  const foundReviewer = reviewers.find((p) => p.id === user.id);
  const isApproved = action === 'approved' || action === 'approval';
  const message = `✍🏻 *${repositoryName}* PR #${id} approval status update

${title}
${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Approval Status*: ${reviewers.map((p) => (
    `${getUserPhoneNumber(p)}${foundReviewer?.id === p.id && isApproved ? ' ✅' : ' ⛔'}`
  ))
    .join(', ')}
`;
  await sendMessage(message);
};

const onComment = async (data: PullRequestGitlab) => {
  console.log('MR COMMENT', data);
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
      author_id: authorId,
      note,
    },
    user,
  } = data || {};
  const message = `✍🏻 *${repositoryName}* PR #${id} comments updated

${title}
${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Commented By*: ${getUserPhoneNumber(user)}
*Comment*: ${truncate(note)}`;
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
  console.log('REQUEST PARAMS', params);
  const data = await request.json() as PullRequestGitlab;
  console.log('REQUEST DATA', data);
  const eventType = request.headers.get('X-Gitlab-Event');
  console.log('REQUEST HEADERS', eventType);
  const { object_attributes: objAttr } = data || {};
  const { action } = objAttr || {};
  if (eventType === 'Merge Request Hook') {
    switch (action) {
      case 'open': {
        await onCreatedPR(data);
        break;
      }
      case 'update': {
        await onUpdatedPR(data);
        break;
      }
      case 'merge': {
        await onMergedPR(data);
        break;
      }
      case 'unapproved':
      case 'unapproval':
      case 'approval':
      case 'approved': {
        await onApproval(data);
        break;
      }
      default: {
        break;
      }
    }
  }

  if (eventType === 'Note Hook') {
    await onComment(data);
  }

  return new Response();
};
