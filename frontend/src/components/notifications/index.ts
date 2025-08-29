// Exportações dos componentes de notificação
export { default as PushNotificationService } from './PushNotificationService';
export { default as NotificationManager } from './NotificationManager';
export { default as NotificationSettings } from './NotificationSettings';

// Tipos e interfaces
export type {
  NotificationPayload,
  NotificationAction,
  NotificationPermission,
  PushSubscription
} from './PushNotificationService';
