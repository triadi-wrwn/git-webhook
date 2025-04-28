export interface PullRequestBase {
  repository: Repository;
  actor: Account;
  pullrequest: PullRequest;
}

export interface PullRequestApproval extends PullRequestBase {
  approval: Approval;
}

export interface Approval {
  date: string;
  user: Account;
}

export interface PullRequest {
  comment_count: number;
  task_count: number;
  type: string;
  id: number;
  title: string;
  description: string;
  rendered: Rendered;
  state: string;
  merge_commit?: string;
  close_source_branch: boolean;
  closed_by?: Account;
  author: Account;
  reason: string;
  created_on: string;
  updated_on: string;
  destination: Destination;
  source: Source;
  reviewers: Account[];
  participants: Participant[];
  links: PullRequestLinks;
  summary: Title;
}

export interface PullRequestLinks {
  self: Self;
  html: Self;
  commits: Self;
  approve: Self;
  'request-changes': Self;
  diff: Self;
  diffstat: Self;
  comments: Self;
  activity: Self;
  merge: Self;
  decline: Self;
  statuses: Self;
}

export interface Participant {
  type: string;
  user: Account;
  role: string;
  approved: boolean;
  state: ApprovalKey;
  participated_on?: string;
}

export interface Source {
  branch: SourceBranch;
  commit: Commit;
  repository: ExternalRepo;
}

export interface SourceBranch {
  name: string;
  links: Links;
}

export interface Destination {
  branch: Branch;
  commit: Commit;
  repository: ExternalRepo;
}

export interface ExternalRepo {
  type: string;
  full_name: string;
  links: Links;
  name: string;
  uuid: string;
}

export interface Commit {
  hash: string;
  links: CommitLinks;
  type: string;
}

export interface CommitLinks {
  self: Self;
  html: Self;
}

export interface Branch {
  name: string;
}

export interface Rendered {
  title: Title;
  description: Title;
}

export interface Title {
  type: string;
  raw: string;
  markup: string;
  html: string;
}

export interface Repository {
  type: string;
  full_name: string;
  links: Links;
  name: string;
  scm: string;
  website?: Links;
  owner: Account;
  workspace: Workspace;
  is_private: boolean;
  project: Project;
  uuid: string;
  parent?: Links;
}

export interface Project {
  type: string;
  key: string;
  uuid: string;
  name: string;
  links: Links;
  id: number;
}

export interface Workspace {
  type: string;
  uuid: string;
  name: string;
  slug: string;
  links: Links;
}

export interface Account {
  display_name: string;
  links: Links;
  type: string;
  uuid: string;
  account_id: string;
  nickname: string;
}

export interface Links {
  self: Self;
  html: Self;
  avatar: Self;
}

export interface Self {
  href: string;
}

export type EventKey =
  | 'pullrequest:created'
  | 'pullrequest:updated'
  | 'pullrequest:approved'
  | 'pullrequest:unapproved'
  | 'pullrequest:changes_request_created'
  | 'pullrequest:changes_request_removed'
  | 'pullrequest:fulfilled';

export type ApprovalKey = 'changes_requested' | 'approved' | null;

export type PullRequestGitlab = {
  object_kind: string;
  event_type: string;
  user: User;
  project: Project;
  object_attributes: ObjectAttributes;
  labels: unknown[];
  changes: Changes;
  repository: Repository;
  reviewers: User[];
  merge_request: ObjectAttributes;
};

export type Changes = {
  description: Description;
  last_edited_at: Description;
  last_edited_by_id: TedByID;
  updated_at: Description;
  updated_by_id: TedByID;
};

export type Description = {
  previous: null | string;
  current: string;
};

export type TedByID = {
  previous: null;
  current: number;
};

export type ObjectAttributes = {
  assignee_id: null;
  author_id: number;
  created_at: string;
  description: string;
  draft: boolean;
  head_pipeline_id: null;
  id: number;
  iid: number;
  last_edited_at: string;
  last_edited_by_id: number;
  merge_commit_sha: null;
  merge_error: null;
  merge_params: MergeParams;
  merge_status: string;
  merge_user_id: null;
  merge_when_pipeline_succeeds: boolean;
  milestone_id: null;
  source_branch: string;
  source_project_id: number;
  state_id: number;
  target_branch: string;
  target_project_id: number;
  time_estimate: number;
  title: string;
  updated_at: string;
  updated_by_id: number;
  prepared_at: string;
  assignee_ids: unknown[];
  blocking_discussions_resolved: boolean;
  detailed_merge_status: string;
  first_contribution: boolean;
  human_time_change: null;
  human_time_estimate: null;
  human_total_time_spent: null;
  labels: unknown[];
  last_commit: LastCommit;
  reviewer_ids: number[];
  source: Project;
  state: string;
  target: Project;
  time_change: number;
  total_time_spent: number;
  url: string;
  work_in_progress: boolean;
  approval_rules: unknown[];
  action: string;
  note: string
};

export type LastCommit = {
  id: string;
  message: string;
  title: string;
  timestamp: Date;
  url: string;
  author: null[];
};

export type MergeParams = {
  force_remove_source_branch: string;
};

export type ProjectGitlab = {
  id: number;
  name: string;
  description: null;
  web_url: string;
  avatar_url: null;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path: string;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
};

export type RepositoryGitlab = {
  name: string;
  url: string;
  description: null;
  homepage: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email: string;
};

export type TimerMap = {
  [mergeRequestId: string]: NodeJS.Timeout;
};

export type GitlabNote = {
  id: number;
  type: string;
  body: string;
  author: NoteAuthor;
  created_at: string;
  updated_at: string;
  system: boolean;
  noteable_id: number;
  noteable_type: string;
  project_id: number;
  commit_id: null;
  position: NotePosition;
  resolvable: boolean;
  resolved: boolean;
  resolved_by: null;
  resolved_at: null;
  confidential: boolean;
  internal: boolean;
  imported: boolean;
  imported_from: string;
  noteable_iid: number;
  commands_changes: unknown;
};

export type NoteAuthor = {
  id: number;
  username: string;
  name: string;
  state: string;
  locked: boolean;
  avatar_url: string;
  web_url: string;
};

export type NotePosition = {
  base_sha: string;
  start_sha: string;
  head_sha: string;
  old_path: string;
  new_path: string;
  position_type: string;
  old_line: null;
  new_line: number;
  line_range: LineRange;
};

export type LineRange = {
  start: End;
  end: End;
};

export type End = {
  line_code: string;
  type: string;
  old_line: null;
  new_line: number;
};
