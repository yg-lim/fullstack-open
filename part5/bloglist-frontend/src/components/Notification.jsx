export default function Notification({ notification }) {
  if (notification) return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}