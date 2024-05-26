/** ============== Types ============== */
export type {
  NoticeType,
  ArgsProps,
  JointContent,
  TypeOpen,
  GlobalMessageConfig,
  MessageInstance
} from './Message/interface';

export type {
  NotificationConfig,
  OpenConfig,
  NoticeProps,
  NotificationAPI,
  Placement,
  Placements,
  OpenTask,
  CloseTask,
  DestroyTask,
  Task
} from './Notification/interface';

/** ============== components ============== */
export { default as Message } from './Message';
export { default as useMessage } from './Message/useMessage';
export { default as Notification } from './Notification/Notification';
export { default as useNotification } from './Notification/useNotification';