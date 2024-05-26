import React from "react";
import { createPortal } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Notice from "./Notice";
import cs from 'clsx';
import type {
  NotificationAPI,
  OpenConfig,
  Placements,
  Placement,
  NotificationConfig
} from './interface';
import '../styles';

const Notification = React.forwardRef<NotificationAPI, NotificationConfig>((props, ref) => {
  const { maxCount } = props;
  const [configList, setConfigList] = React.useState<OpenConfig[]>([]);
  const onNoticeClose = (key: React.Key) => {
    const notice = configList.find((notice) => notice.key === key);
    notice?.onClose?.();
    setConfigList((list) => list.filter((notice) => notice.key !== key));
  };

  React.useImperativeHandle(ref, () => ({
    open: (config: OpenConfig) => {
      setConfigList((list) => {
        const clone = [...list];
        const key = config.key;
        const index = clone.findIndex((notice) => notice.key === key);
        const innerConfig = { ...config };
        if (index >= 0) {
          clone[index] = innerConfig;
        } else {
          clone.push(innerConfig);
        }

        if (maxCount && clone.length > maxCount) {
          clone.shift();
        }
        return clone;
      });
    },
    close(key: React.Key) {
      setConfigList((list) => list.filter((notice) => notice.key !== key));
    },
    destroy() {
      setConfigList([]);
    }
  }));

  const [placements, setPlacements] = React.useState<Placements>({});

  React.useEffect(() => {
    const _placements: Placements = {};

    configList.forEach((config) => {
      config.placement = config.placement ? config.placement : 'top';
      const _placement = config.placement;
      _placements[_placement] = _placements[_placement] || [];
      _placements[_placement]!.push(config);
    });

    setPlacements(_placements);
  }, [configList]);

  const placementList = Object.keys(placements) as Placement[];

  return (
    createPortal(
      <>
        {
          placementList.map((placement) => {
            const config = placements[placement];
            return (
              <div key={placement} className={cs("twist-message-wrapper", `twist-message-${placement}`)}>
                <TransitionGroup component={null}>
                  {
                    config?.map((notice) => (
                      /** @ts-ignore transition error */
                      <CSSTransition
                        key={notice.key}
                        timeout={notice.transitionTimeout || 300}
                        classNames={notice.transitionClassNames || 'fadeMessage'}
                        onExit={(e: HTMLElement) => {
                          e.style.height = `${e.scrollHeight}px`;
                        }}
                        onExiting={(e: HTMLElement) => {
                          e.style.height = '0';
                        }}
                        onExited={(e: HTMLElement) => {
                          e.style.height = '0';
                          notice.onClose && notice.onClose();
                        }}
                        appear
                      >
                        <Notice noticeKey={notice.key!} {...notice} onClose={onNoticeClose} />
                      </CSSTransition>
                    ))
                  }
                </TransitionGroup>
              </div>
            );
          })
        }
      </>,
      document.body
    )
  );
});

Notification.displayName = 'Notification';

export default Notification;