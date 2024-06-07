import React from "react";
import { render } from "../utils/render";
import useMessage from "./useMessage";
import type {
  TypeOpen,
  NoticeType,
  JointContent,
  GlobalMessageConfig,
  MessageInstance
} from "./interface";
import type { OpenConfig, OpenTask } from "../Notification/interface";

interface BaseMethods {
  open: (config: OpenConfig) => void;
  config: typeof setMessageGlobalConfig;
  destroy: (key: React.Key) => void;
}

interface MessageMethods {
  info: TypeOpen;
  success: TypeOpen;
  error: TypeOpen;
  warning: TypeOpen;
  loading: TypeOpen;
}

interface GlobalMessage {
  instance: MessageInstance
  commonConfig: VoidFunction
}

type TypeTask = {
  type: NoticeType;
  args: JointContent;
}

type DestroyTask = {
  type: 'destroy';
  key: React.Key;
}

type Task = OpenTask | TypeTask | DestroyTask;

let taskQueue: Task[] = [];
let message: GlobalMessage;
let defaultConfig: GlobalMessageConfig = {
  prefixCls: 'twist-message'
};

function setMessageGlobalConfig(
  config: GlobalMessageConfig
): GlobalMessageConfig {
  defaultConfig = {
    ...defaultConfig,
    ...config
  };

  return defaultConfig;
}

function destroy(key: React.Key) {
  const task: DestroyTask = {
    type: 'destroy',
    key
  };

  taskQueue.push(task);

  flushNotice();
}

function open(config: OpenConfig) {
  const task: OpenTask = {
    type: 'open',
    config: {
      ...defaultConfig,
      ...config
    }
  };
  taskQueue.push(task);

  flushNotice();
}

interface GlobalHolderRef {
  instance: MessageInstance;
}

const GlobalHolder = React.forwardRef<GlobalHolderRef, GlobalMessageConfig>((props, ref) => {
  const [api, holder] = useMessage(props);

  React.useImperativeHandle(ref, () => {
    const { open, destroy, info, success, error, warning, loading } = api;
    const instance = {
      open,
      destroy,
      info,
      success,
      error,
      warning,
      loading
    };

    return {
      instance
    };
  });
  return holder;
});

GlobalHolder.displayName = 'GlobalHolder';

function flushNotice() {
  if (!message) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    message = {} as GlobalMessage;

    render(
      <GlobalHolder
        ref={(node) => {
          if (node) {
            message.instance = node.instance;
            flushNotice();
          }
        }}
        {...defaultConfig}
      />,
      div
    );
  }

  if (!message.instance) return;

  taskQueue.forEach((task) => {
    switch (task.type) {
    case 'open':
      message.instance.open(task.config);
      break;
    case 'destroy':
      message.instance.destroy(task.key);
      break;
    default:
      message.instance[task.type](task.args);
    }
  });

  // Clear taskQueue
  taskQueue = [];
}

function typeOpen(type: NoticeType, args: JointContent) {
  const task: TypeTask = {
    type,
    args
  };

  taskQueue.push(task);

  flushNotice();
}

const methods: (keyof MessageMethods)[] = ['success', 'info', 'warning', 'error', 'loading'];
const baseStaticMethods: BaseMethods = {
  open,
  config: setMessageGlobalConfig,
  destroy
};

const staticMethods = baseStaticMethods as MessageMethods & BaseMethods;

methods.forEach((type: keyof MessageMethods) => {
  staticMethods[type] = (args) => typeOpen(type, args);
});

export default staticMethods;