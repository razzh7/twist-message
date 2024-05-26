import React from "react";

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ArgsProps {
  style?: React.CSSProperties;
  className?: string | string[];
  /**
   * @zh 消息弹出动画的类名，见 react-transition-group 的 `classNames`
   * @en ClassNames of react-transition-group of the message pop-up animation, see `classNames`
   */
  transitionClassNames?: string;
  /**
   * @zh 动画持续时间，见 react-transition-group 的 `timeout`
   * @en timeout of `react-transition-group` of the message pop-up animation, see `timeout`
   * @defaultValue {enter: 100, exit: 300}
   */
  transitionTimeout?: {
    enter?: number;
    exit?: number;
  };
  /**
   * @zh 消息内容
   * @en Message content
   */
  content?: React.ReactNode | string;
  /**
   * @zh 是否显示图标
   * @en Whether to show the icon
   * @defaultValue true
   */
  showIcon?: boolean;
  /**
   * @zh 自定义图标
   * @en Custom icon
   */
  icon?: React.ReactNode;
  /**
   * @zh 自动关闭的时间，单位为 `ms`
   * @en Automatic shutdown time, the unit is `ms`
   * @defaultValue 3000
   */
  duration?: number;
  /**
   * @zh 关闭时的回调
   * @en Callback when close
   */
  onClose?: () => void;
  /**
   * @zh 当前消息的唯一标识，可以用来更新消息
   * @en The unique identifier of the current message, which can be used to update the message
   */
  key?: React.Key;
  /**
   * @zh 消息的位置，分为 `top` 上方和 `bottom` 下方
   * @en The placement of the message
   */
  placement?: 'top' | 'bottom';
  /**
   * @zh 是否显示关闭按钮
   * @en Whether to show the close button
   * @defaultValue true
   */
  closable?: boolean;
  /**
   * @zh 自定义右上角关闭按钮
   * @en Custom the close button on top-right of the drawer dialog
   */
  closeIcon?: React.ReactNode;
  type?: string;
}

export type JointContent = string | ArgsProps;

export type TypeOpen = (
  content: JointContent
) => void;

export interface GlobalMessageConfig {
  maxCount?: number;
  duration?: number;
}

export interface MessageInstance {
  info: TypeOpen;
  success: TypeOpen;
  error: TypeOpen;
  warning: TypeOpen;
  loading: TypeOpen;
  open(config: ArgsProps): void;
  destroy(key?: React.Key): void;
}