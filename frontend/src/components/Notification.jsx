const Notification = ({ message, type }) => {
  if (!message) return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
};

export default Notification;