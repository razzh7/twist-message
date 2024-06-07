import React from "react";
import useNotification from '../Notification/useNotification';
import Content from './Content';
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
  const { prefixCls = 'twist-message', maxCount, duration: globalDuration } = gobalConfig;
  const contextHolderRef = React.useRef<NotificationAPI>(null);
  const open = (config: ArgsProps): void => {
    if (!contextHolderRef.current) {
      throw new Error('MessageHolder muse be render.');
    }

    const { open: orignOpen } = contextHolderRef.current;
    const {
      key,
      type,
      icon,
      duration,
      placement = 'top',
      content,
      showIcon = true,
      onClose,
      style,
      className,
      transitionClassNames,
      transitionTimeout,
      closable,
      closeIcon
    } = config;
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
      content: (
        <Content
          type={type}
          icon={icon}
          prefixCls={prefixCls}
          showIcon={showIcon}
        >
          {content}
        </Content>
      ),
      type,
      placement: placement,
      onClose,
      style,
      className,
      transitionClassNames,
      transitionTimeout,
      showIcon,
      icon,
      closable,
      closeIcon
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


  return [
    wrapAPI,
    <MessageHolder
      key={`${prefixCls}-holder`}
      ref={contextHolderRef}
      prefixCls={prefixCls}
      maxCount={maxCount}
      duration={globalDuration}
    />
  ];
}

export default useMessage;