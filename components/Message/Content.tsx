import React from 'react';
import cs from 'clsx';
import {
  AiInfoCircleFilled,
  AiCheckCircleFilled,
  AiCloseCircleFilled,
  AiLoadingOutlined,
} from '@twist-space/react-icons/ai';

interface TwistContentProps {
  prefixCls: string;
  type?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function TwistContent(porps: TwistContentProps) {
  const {
    prefixCls,
    type,
    icon,
    showIcon,
    children
  } = porps;

  const renderIcon = () => {
    let content: React.ReactNode;
    if (icon) {
      content = icon;
    } else {
      switch (type) {
      case 'info':
        content = <AiInfoCircleFilled color='#1677ff' />;
        break;
      case 'success':
        content = <AiCheckCircleFilled color='#52c41a'/>;
        break;
      case 'error':
        content = <AiCloseCircleFilled color='#ff4d4f' />;
        break;
      case 'warning':
        content = <AiInfoCircleFilled color='#faad14' />;
        break;
      case 'loading':
        content = <AiLoadingOutlined spin color='#1677ff' />;
        break;
      default:
        content = null;
      }
    }

    return content;
  };

  return (
    <div className={`${prefixCls}-${type}`} role='alert'>
      {
        showIcon
          ? (
          <span className={cs(`${prefixCls}-icon`)}>
            {renderIcon()}
          </span>
          )
          : null
      }
      <span className={cs(`${prefixCls}-content`)}>
        {children}
      </span>
    </div>
  );
}

export default TwistContent;