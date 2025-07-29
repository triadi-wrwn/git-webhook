import { PROJECTS, USER_MAP_LIST } from './route.constants';
import type { ProjectType } from './route.types';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function didCheckboxChangeToChecked(
  previousMd: string,
  currentMd: string,
  label: string,
): boolean {
  const uncheckedPattern = new RegExp(
    `\\[-? ?\\]\\s*${escapeRegExp(label)}`,
    'i',
  );
  const checkedPattern = new RegExp(`\\[x\\]\\s*${escapeRegExp(label)}`, 'i');

  const wasUnchecked = uncheckedPattern.test(previousMd) && !checkedPattern.test(previousMd);
  const isNowChecked = checkedPattern.test(currentMd);

  return wasUnchecked && isNowChecked;
}

const getUserIdByUserName = (userName: string) => {
  const foundUser = USER_MAP_LIST.find((el) => el.name === userName);
  return foundUser ? foundUser.phoneNumber : null;
};

const getProjectMembers = (projectId: ProjectType) => {
  const users = USER_MAP_LIST.filter((el) => el.projectIds.includes(projectId));
  return users.map((user) => `@${user.phoneNumber}`).join(' ');
};

const getProjectDetail = (projectId: ProjectType) => PROJECTS.find((el) => el.id === projectId);

export {
  didCheckboxChangeToChecked,
  getProjectDetail,
  getProjectMembers,
  getUserIdByUserName,
};
