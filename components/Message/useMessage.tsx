import React from "react";
import useNotification from '../Notification/useNotification';
import type { GlobalMessageConfig, MessageInstance, ArgsProps, NoticeType, TypeOpen } from './interface';
import type { NotificationAPI } from "../Notification/interface";

const MessageHolder = React.forwardRef<NotificationAPI, GlobalMessageConfig>((props, ref) => {
  const [api, holder] = useNotification(props);

  React.useImperativeHandle(ref, () => {
    const { open, close, destroy } = api;

    return {
      open,
      close,
      destroy
    };
  });

  return holder;
});

MessageHolder.displayName = 'MessageHolder';

let keyIndex = 0;

function useMessage(
  gobalConfig: GlobalMessageConfig
): readonly [MessageInstance, React.ReactNode] {
  const { maxCount, duration: globalDuration } = gobalConfig;
  const contextHolderRef = React.useRef<NotificationAPI>(null);

  const open = (config: ArgsProps): void => {
    if (!contextHolderRef.current) {
      throw new Error('MessageHolder muse be render.');
    }

    const { open: orignOpen } = contextHolderRef.current;
    const { key, duration, placement = 'top' } = config;
    let mergedKey = key;
    let mergedDuration;
    if (key === undefined) {
      mergedKey = `twist-message-${keyIndex}`;
      keyIndex += 1;
    }

    if (duration !== undefined) {
      mergedDuration = duration;
    } else if (globalDuration) {
      mergedDuration = globalDuration || 3000;
    }

    orignOpen({
      key: mergedKey,
      maxCount: maxCount,
      duration: mergedDuration,
      content: config?.content,
      type: config?.type,
      placement: placement,
      onClose: config?.onClose,
      style: config?.style,
      className: config?.className,
      transitionClassNames: config?.transitionClassNames,
      transitionTimeout: config?.transitionTimeout,
      showIcon: config?.showIcon,
      icon: config?.icon,
      closable: config?.closable,
      closeIcon: config?.closeIcon
    });
  };

  const close = (key: React.Key) => {
    contextHolderRef.current?.close(key);
  };

  const destroy = (key?: React.Key) => {
    if (key) {
      close(key);
    } else {
      contextHolderRef.current?.destroy();
    }
  };

  const wrapAPI = {
    open,
    destroy
  } as MessageInstance;
  const staticMethods: NoticeType[] = ['info', 'success', 'error', 'warning', 'loading'];

  staticMethods.forEach((type) => {
    const typeOpen: TypeOpen = (JointContent) => {
      let config: ArgsProps = {};
      if (JointContent && typeof JointContent === 'string') {
        config = {
          content: JointContent,
          type
        };
      } else if (JointContent && typeof JointContent === 'object') {
        config = {
          ...JointContent,
          type
        };
      }

      return open(config);
    };
    wrapAPI[type] = typeOpen;
  });


  return [wrapAPI, <MessageHolder key="message-holder" ref={contextHolderRef} {...gobalConfig} />];
}

export default useMessage;