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
  const { id: accountId, name: displayName } = data || {};
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === accountId);
  return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber}` : foundUser?.nickname || displayName;
};

const getUserPhoneNumberById = (userId: number) => {
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === userId);
  return foundUser ? `@${foundUser.phoneNumber}` : '';
};

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

const onCreatedPR = async (data: PullRequestGitlab) => {
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
    },
    reviewers = [],
    user: author,
  } = data || {};
  const message = `🆕 *${repositoryName}* MR #${id} *created* by ${getUserPhoneNumber(author)}
 
*Title*: ${title}
*Url*: ${prLink}
*Reviewers*: ${reviewers?.length > 0 ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ') : 'None'}`;
  await sendMessage(message);
};

const onUpdatedPR = async (data: PullRequestGitlab) => {
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
    reviewers = [],
  } = data || {};
  const author = USER_MAP_LIST.find((el) => el.account_id === authorId);
  const message = `🆕 *${repositoryName}* MR #${id} updated
 
*Title*: ${title}
*Url*: ${prLink}
*Author*: ${author?.phoneNumber}
*Reviewers*: ${reviewers.length > 0 ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ') : '-'}`;
  await sendMessage(message);
};

const onApproval = async (data: PullRequestGitlab) => {
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
    user: reviewer,
  } = data || {};
  const isApproved = action === 'approved' || action === 'approval';
  const message = `✍🏻 *${repositoryName}* MR #${id} *approval* status update

*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Approval Status*: ${reviewer ? `${getUserPhoneNumber(reviewer)}${isApproved ? ' ✅' : ' ⛔'}` : ''}
`;
  await sendMessage(message);
};

const onComment = async (data: PullRequestGitlab) => {
  const {
    repository: {
      name: repositoryName,
    },
    object_attributes: {
      note,
    },
    merge_request: {
      iid: id,
      title,
      author_id: authorId,
      url: prLink,
    },
    user,
  } = data || {};
  const message = `✍🏻 *${repositoryName}* MR #${id} *comments* update

*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Commented By*: ${getUserPhoneNumber(user)}
*Comment*: ${truncate(note)}`;
  await sendMessage(message);
};

const onMergedPR = async (data: PullRequestGitlab) => {
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
  const message = `🚀 *${repositoryName}* MR #${id} *merged* by ${getUserPhoneNumber(actor)}
 
*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}`;
  await sendMessage(message);
};

export const POST = async (request: Request, { params }: { params: { phoneNumber: string } }) => {
  const { phoneNumber: paramPhoneNumber = '' } = params || {};
  phoneNumber = paramPhoneNumber;
  const data = await request.json() as PullRequestGitlab;
  const eventType = request.headers.get('X-Gitlab-Event');
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
