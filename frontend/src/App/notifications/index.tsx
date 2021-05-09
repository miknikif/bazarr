import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalize } from "lodash";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Toast } from "react-bootstrap";
import { useTimeoutWhen } from "rooks";
import { siteRemoveNotifications } from "../../@redux/actions";
import { useReduxAction, useReduxStore } from "../../@redux/hooks/base";
import "./style.scss";

export interface NotificationContainerProps {}

const NotificationContainer: FunctionComponent<NotificationContainerProps> = () => {
  const list = useReduxStore((s) => s.site.notifications);

  const items = useMemo(
    () =>
      list.map((v) => (
        <NotificationToast key={v.id} {...v}></NotificationToast>
      )),
    [list]
  );
  return (
    <div className="alert-container">
      <div className="toast-container">{items}</div>
    </div>
  );
};

type MessageHolderProps = ReduxStore.Notification & {};

const NotificationToast: FunctionComponent<MessageHolderProps> = (props) => {
  const { message, type, id, timeout } = props;
  const removeNotification = useReduxAction(siteRemoveNotifications);

  const remove = useCallback(() => removeNotification(id), [
    removeNotification,
    id,
  ]);

  useTimeoutWhen(remove, timeout);

  return (
    <Toast onClose={remove} animation={false}>
      <Toast.Header>
        <FontAwesomeIcon
          className="mr-1"
          icon={faExclamationTriangle}
        ></FontAwesomeIcon>
        <strong className="mr-auto">{capitalize(type)}</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default NotificationContainer;
