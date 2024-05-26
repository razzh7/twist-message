import React from "react";
import Notification from "./Notification";
import type { NotificationConfig, NotificationAPI, Task, OpenConfig } from './interface';

function mergeConfig<T>(...objList: Partial<T>[]): T {
  const clone: T = {} as T;

  objList.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key as keyof T];

        if (val !== undefined) {
          clone[key as keyof T] = val as T[keyof T];
        }
      });
    }
  });

  return clone;
}

function useNotification(
  commonConfig: NotificationConfig
): readonly [NotificationAPI, React.ReactNode] {
  const { maxCount, duration } = commonConfig;
  const notificationsRef = React.useRef<NotificationAPI>(null);
  const contextHolder = (
    <Notification
      ref={notificationsRef}
      maxCount={maxCount}
      duration={duration}
    />
  );
  const [taskQueue, setTaskQueue] = React.useState<Task[]>([]);

  const api: NotificationAPI = {
    open: (config) => {
      const mergedConfig = mergeConfig(commonConfig, config) as OpenConfig;
      setTaskQueue((queue) => [...queue, { type: 'open', config: mergedConfig }]);
    },
    close: (key: React.Key) => {
      notificationsRef.current?.close(key);
    },
    destroy: () => {
      notificationsRef.current?.destroy();
    }
  };

  React.useEffect(() => {
    if (notificationsRef.current && taskQueue.length) {
      const current = notificationsRef.current;
      taskQueue.forEach((task) => {
        switch (task.type) {
        case 'open':
          current.open(task.config);
          break;
        case 'close':
          current.close(task.key);
          break;
        case 'destroy':
          current.destroy();
          break;
        }
      });
      // clear taskQueue
      setTaskQueue((oriQueue) => oriQueue.filter((task) => !taskQueue.includes(task)));
    }
  }, [taskQueue]);

  return [api, contextHolder];
}

export default useNotification;