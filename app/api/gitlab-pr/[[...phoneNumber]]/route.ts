import {
  GITLAB_TOKEN,
  PHONE_TARGET,
  WA_TOKEN,
  WA_URL,
} from './route.constants';
import {
  didCheckboxChangeToChecked,
  getUserPhoneNumber,
  getUserPhoneNumberById,
} from './route.helper';
import type { GitlabNote, PullRequestGitlab } from './route.types';

let phoneNumber = '';
let isRequestChanges = false;
let commentCount = 0;

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

const getNotes = async (projectId: number, mrId: number) => fetch(
  `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mrId}/notes`,
  {
    headers: {
      'PRIVATE-TOKEN': GITLAB_TOKEN!,
    },
  },
);

const onCreatedPR = async (data: PullRequestGitlab) => {
  const {
    repository: { name: repositoryName },
    object_attributes: { iid: id, title, url: prLink },
    reviewers = [],
    user: author,
  } = data || {};
  const message = `🆕 *${repositoryName}* MR #${id} *created* by ${getUserPhoneNumber(
    author,
  )}
 
*Title*: ${title}
*Url*: ${prLink}
*Reviewers*: ${
  reviewers?.length > 0
    ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ')
    : 'None'
}`;
  await sendMessage(message);
};

const onApproval = async (
  data: PullRequestGitlab,
) => {
  const {
    repository: { name: repositoryName },
    object_attributes: {
      iid: id,
      title,
      url: prLink,
      author_id: authorId,
      action,
    },
    user: reviewer,
  } = data || {};
  const isApproved = !isRequestChanges && (action === 'approved' || action === 'approval');
  const message = `✍🏻 *${repositoryName}* MR #${id} *approval* status update

*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Approval Status*: ${
  reviewer
    ? `${getUserPhoneNumber(reviewer)}${isApproved ? ' ✅' : ' ⛔ Need Changes'}`
    : ''
}
*Comment Count*: ${commentCount}
`;
  await sendMessage(message);
};

const onUpdatedPR = async (data: PullRequestGitlab) => {
  const {
    repository: { name: repositoryName },
    object_attributes: {
      iid: id, title, url: prLink, author_id: authorId,
    },
    reviewers = [],
  } = data || {};

  const message = `🆙 *${repositoryName}* MR #${id} updated
 
*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}
*Reviewers*: ${
  reviewers.length > 0
    ? reviewers.map((reviewer) => getUserPhoneNumber(reviewer)).join(', ')
    : '-'
}`;

  await sendMessage(message);
};

// let timeoutId: NodeJS.Timeout | undefined;

// const onComment = async (data: PullRequestGitlab) => {
//   const {
//     repository: { name: repositoryName },
//     merge_request: {
//       iid: id, title, author_id: authorId, url: prLink,
//     },
//     project: { id: projectId },
//     user,
//   } = data || {};
//   console.log('DECONTRUCTING DATA');

//   try {
//     console.log('FETCHING NOTES...');
//     const gitlabResponse = await getNotes(projectId, id);
//     console.log('GITLAB RESPONSE', gitlabResponse);
//     const notes: GitlabNote[] = await gitlabResponse.json();

//     if (!Array.isArray(notes)) throw new Error('Unexpected GitLab API response');

//     // Filter only real user comments
//     const userComments = notes.filter(
//       (el) => el.system === false && el.author?.id === user?.id,
//     );
//     console.log('COMMENTS FROM REVIEWER', userComments);
//     const commentCount = userComments.length;

//     const message = `✍🏻 *${repositoryName}* MR #${id} *comments* update

// *Title*: ${title}
// *Url*: ${prLink}
// *Author*: ${getUserPhoneNumberById(authorId)}
// *Commented By*: ${getUserPhoneNumber(user)}
// *Comment Count*: ${commentCount}`;

//     await sendMessage(message);
//   } catch (error) {
//     console.error('Failed to send message:', error);
//   }
// };

const onMergedPR = async (data: PullRequestGitlab) => {
  const {
    repository: { name: repositoryName },
    object_attributes: {
      iid: id, title, url: prLink, author_id: authorId,
    },
    user: actor,
  } = data || {};
  const message = `🚀 *${repositoryName}* MR #${id} *merged* by ${getUserPhoneNumber(
    actor,
  )}
 
*Title*: ${title}
*Url*: ${prLink}
*Author*: ${getUserPhoneNumberById(authorId)}`;
  await sendMessage(message);
};

export const POST = async (
  request: Request,
  { params }: { params: { phoneNumber: string } },
) => {
  const { phoneNumber: paramPhoneNumber = '' } = params || {};
  phoneNumber = paramPhoneNumber;
  const data = (await request.json()) as PullRequestGitlab;
  const eventType = request.headers.get('X-Gitlab-Event');
  const {
    project: { id: projectId } = {},
    object_attributes: objAttr,
    changes: {
      description,
      description: {
        previous: previousDescription,
        current: currentDescription,
      } = {},
    } = {},
  } = data || {};
  const { action, iid: mrId } = objAttr || {};
  console.log('REQUEST DATA', data);

  if (description && previousDescription && currentDescription) {
    isRequestChanges = didCheckboxChangeToChecked(
      previousDescription,
      currentDescription,
      'Request changes',
    );
  }

  console.log('IS REQUEST CHANGE', isRequestChanges);
  console.log('SHOULD GET NOTES COUNT', isRequestChanges && projectId && mrId);
  if (isRequestChanges && projectId && mrId) {
    const gitlabResponse = await getNotes(projectId, mrId);
    console.log('GITLAB RESPONSE', gitlabResponse);
    const notes: GitlabNote[] = await gitlabResponse.json();

    if (!Array.isArray(notes)) throw new Error('Unexpected GitLab API response');

    // Filter only real user comments
    const userComments = notes.filter((el) => el.system === false);
    console.log('COMMENTS FROM REVIEWER', userComments);
    commentCount = userComments.length;
    console.log('COMMENT COUNT', commentCount);
  }

  if (eventType === 'Merge Request Hook') {
    switch (action) {
      case 'open': {
        await onCreatedPR(data);
        break;
      }
      case 'update': {
        if (isRequestChanges) {
          await onApproval(data);
        } else {
          await onUpdatedPR(data);
        }
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

  // if (eventType === 'Note Hook') {
  //   clearTimeout(timeoutId);
  //   timeoutId = setTimeout(async () => {
  //     console.log('NOTE HOOK', data);
  //     await onComment(data);
  //   }, 3000);
  // }

  return new Response();
};
