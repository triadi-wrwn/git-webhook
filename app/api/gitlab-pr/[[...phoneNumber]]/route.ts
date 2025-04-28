import {
  GITLAB_TOKEN,
  PHONE_TARGET, USER_MAP_LIST,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import type {
  GitlabNote, PullRequestGitlab, TimerMap, User,
} from './route.types';

let phoneNumber = '';

// Global memory
const pendingTimers: TimerMap = {};

const getUserPhoneNumber = (data: User) => {
  const { id: accountId, name: displayName } = data || {};
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === accountId);
  if (foundUser?.type === 'general') {
    return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber} (${foundUser.nickname})` : (foundUser?.nickname || '');
  }
  return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber}` : foundUser?.nickname || displayName;
};

const getUserPhoneNumberById = (userId: number) => {
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === userId);
  if (foundUser?.type === 'general') {
    return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber} (${foundUser.nickname})` : (foundUser?.nickname || '');
  }
  return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber}` : (foundUser?.nickname || '');
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

const getNotes = async (projectId: number, mrId: number) => fetch(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mrId}/notes`, {
  headers: {
    'PRIVATE-TOKEN': GITLAB_TOKEN!,
  },
});

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
  const message = `🆕 *${repositoryName}* MR #${id} updated
 
*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
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
    merge_request: {
      iid: id,
      title,
      author_id: authorId,
      url: prLink,
    },
    project: {
      id: projectId,
    },
    user,
  } = data || {};

  const timerKey = `${projectId}-${id}`;

  if (pendingTimers[timerKey]) {
    clearTimeout(pendingTimers[timerKey]);
  }

  pendingTimers[timerKey] = setTimeout(async () => {
    console.log('FETCHING NOTES...');
    try {
      const gitlabResponse = await getNotes(projectId, id);
      console.log('GITLAB RESPONSE', gitlabResponse);
      const notes: GitlabNote[] = await gitlabResponse.json();

      if (!Array.isArray(notes)) throw new Error('Unexpected GitLab API response');

      // Filter only real user comments
      const userComments = notes.filter((el) => el.system === false && el.author?.id === user?.id);
      console.log('COMMENTS FROM REVIEWER', userComments);
      const commentCount = userComments.length;

      const message = `✍🏻 *${repositoryName}* MR #${id} *comments* update

*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Commented By*: ${getUserPhoneNumber(user)}
*Comment Count*: ${commentCount}`;

      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      delete pendingTimers[timerKey];
    }
  }, 5000);
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
  console.log('EVENT', eventType, action);
  console.log('REQUEST DATA', data);
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
