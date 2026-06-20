export interface NotificationContext {
  userId?: string;
  phone?: string;
  module?: string;
  error?: string;
  details?: string;
  reason?: string;
}

export interface PushResult {
  sent: boolean;
  successCount: number;
  failureCount: number;
}

export interface ChannelResult {
  sent: boolean;
}
