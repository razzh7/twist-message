import React from 'react';
import {
  AiInfoCircleFilled,
  AiCheckCircleFilled,
  AiCloseCircleFilled,
  AiCloseOutlined,
  AiLoadingOutlined
} from '@twist-space/react-icons/ai';
import cs from 'clsx';
import type { NoticeProps } from './interface';
import '../styles';

function Notice(props: NoticeProps) {
  const {
    noticeKey,
    duration = 3000,
    onClose,
    content,
    icon,
    type,
    closable,
    closeIcon,
    style,
    showIcon = true
  } = props;
  const [timer, setTimer] = React.useState<number | null>(null);
  const renderIcon = () => {
    let content: React.ReactNode;
    if (icon) {
      content = icon;
    } else {
      switch (type) {
      case 'info':
        content = <AiInfoCircleFilled />;
        break;
      case 'success':
        content = <AiCheckCircleFilled />;
        break;
      case 'error':
        content = <AiCloseCircleFilled />;
        break;
      case 'warning':
        content = <AiInfoCircleFilled />;
        break;
      case 'loading':
        content = <AiLoadingOutlined spin />;
        break;
      default:
        content = null;
      }
    }

    return content;
  };

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

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={cs('twist-message', `twist-message-${type}`, closable && 'twist-message-closable')} style={style} role="alert">
        <span className='twist-message-icon'>{showIcon ? renderIcon() : null}</span>
        <span className='twist-message-content'>{content}</span>
        { closable
          ? (
            <span className={cs('twist-message-close-btn', 'twist-message-icon-hover')} onClick={onInteralClose}>
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