import type { PROJECTS_IDS } from './route.constants';

export type ProjectType = (typeof PROJECTS_IDS)[keyof typeof PROJECTS_IDS];

export type User = {
  name: string;
  phoneNumber: string;
  projectIds: ProjectType[];
};

export type ReminderPayload = {
  projectId: ProjectType;
};
