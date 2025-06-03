import { USER_MAP_LIST } from './route.constants';

const getUserPhoneNumberByUsername = (userName: string) => {
  const foundUser = USER_MAP_LIST.find((el) => el.display_name === userName);
  return foundUser && foundUser.phoneNumber
    ? `@${foundUser.phoneNumber}`
    : userName || '';
};

export {
  getUserPhoneNumberByUsername,
};
