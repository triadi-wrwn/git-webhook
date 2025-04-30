import { USER_MAP_LIST } from './route.constants';
import type { User } from './route.types';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function didCheckboxChangeToChecked(
  previousMd: string,
  currentMd: string,
  label: string,
): boolean {
  const uncheckedPattern = new RegExp(`\\[-? ?\\]\\s*${escapeRegExp(label)}`, 'i');
  const checkedPattern = new RegExp(`\\[x\\]\\s*${escapeRegExp(label)}`, 'i');

  const wasUnchecked = uncheckedPattern.test(previousMd) && !checkedPattern.test(previousMd);
  const isNowChecked = checkedPattern.test(currentMd);

  return wasUnchecked && isNowChecked;
}

const getUserPhoneNumberById = (userId: number) => {
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === userId);
  if (foundUser?.type === 'general') {
    return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber} (${foundUser.nickname})` : (foundUser?.nickname || '');
  }
  return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber}` : (foundUser?.nickname || '');
};

const getUserPhoneNumber = (data: User) => {
  const { id: accountId, name: displayName } = data || {};
  const foundUser = USER_MAP_LIST.find((el) => el.account_id === accountId);
  if (foundUser?.type === 'general') {
    return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber} (${foundUser.nickname})` : (foundUser?.nickname || '');
  }
  return foundUser && foundUser.phoneNumber ? `@${foundUser.phoneNumber}` : foundUser?.nickname || displayName;
};

export { didCheckboxChangeToChecked, getUserPhoneNumber, getUserPhoneNumberById };
