import React from 'react';
import { AiCloseOutlined } from '@twist-space/react-icons/ai';
import cs from 'clsx';
import type { NoticeProps } from './interface';

function Notice(props: NoticeProps) {
  const {
    noticeKey,
    duration = 3000,
    onClose,
    content,
    closable,
    closeIcon,
    prefixCls
  } = props;
  const [timer, setTimer] = React.useState<number | null>(null);

  const onInteralClose = () => {
    onClose(noticeKey);
  };

  const startTimer = () => {
    if (duration !== 0) {
      const timer = window.setTimeout(() => {
        onClose(noticeKey);
      }, duration);
      setTimer(timer);
    }
  };

  const removeTimer = () => {
    if (timer) {
      window.clearTimeout(timer);
    }
  };

  const onMouseEnter = () => {
    removeTimer();
  };

  const onMouseLeave = () => {
    startTimer();
  };

  React.useEffect(() => {
    if (duration !== 0) {
      const timer = window.setTimeout(() => {
        onClose(noticeKey);
      }, duration);
      setTimer(timer);
      return () => {
        window.clearTimeout(timer);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const noticePrefixCls = `${prefixCls}-notice`;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cs(noticePrefixCls, {
        [`${noticePrefixCls}-closable`]: closable
      
      })}
    >
      <div className={`${noticePrefixCls}-content`}>
        {content}
        {
          closable
            ? (
              <span className={cs(`${noticePrefixCls}-content-close`)} onClick={onInteralClose}>
                {
                  closeIcon
                    ? closeIcon
                    : <AiCloseOutlined />
                }
              </span>
            )
            : null
        }
      </div>
    </div>
  );
}

export default Notice;