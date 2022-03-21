import "./onlineusers.css"
import {useCollection} from "../hooks/useCollection"
import Avatar from "./Avatar"

function OnlineUsers() {
  const {error, documents} = useCollection("users")
  return (
    <div className="user-list">
      <h2>Participants</h2>
      {documents && documents.map(user => (
        <div key={user.id} className="user-list-item">
          {user.online && <span className="online-user"></span>}
          <span>{user.displayName}</span>
          <Avatar src={user.photoURL}/>
        </div>
      ))}
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default OnlineUsers