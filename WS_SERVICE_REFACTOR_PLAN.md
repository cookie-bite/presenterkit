# WebSocket Service Refactor Plan

## 1. Read and Analyze `wss.js`
- The file handles all WebSocket connections, message parsing, business logic, and DB access in one place.
- Uses both global (`db.events`) and per-event (`db['event-<id>']`) NeDB stores, but will move to MongoDB.
- Many command handlers (e.g., `JOIN_ROOM`, `SET_USER`, etc.) follow similar patterns:
  - Parse message
  - Fetch/update event/user data
  - Send responses to clients/rooms

---

## 2. Identify Repetitive Patterns
- **Command Handling:** Each command (`JOIN_ROOM`, `SET_USER`, etc.) is handled in a big if/else chain.
- **Event/User DB Operations:** Many handlers fetch/update event or user data, often with similar logic.
- **Room/User Messaging:** Many handlers send updates to all users in a room or to a specific user.
- **Authentication/Authorization:** Several handlers verify tokens or check user roles.
- **Cleanup:** On disconnect, user/event cleanup logic is repeated.

---

## 3. Service Separation Plan

### A. Folder Structure
```
/services
  event.service.js
  user.service.js
  slide.service.js
  display.service.js
  message.service.js
  invitation.service.js
wss.js
```

### B. Service Responsibilities
- **event.service.js**: Event creation, update, deletion; event-wide state (displays, slides, config, etc.); room activity tracking
- **user.service.js**: User join/leave logic; user state updates (isActive, isInLobby, isAdmin, etc.); authentication/authorization helpers
- **slide.service.js**: Slide upload, update, delete; slide list management
- **display.service.js**: Display creation, update, page changes, sharing
- **message.service.js**: Handling chat/questions/queue logic
- **invitation.service.js**: Invitation token generation, validation, email sending

### C. Refactor Steps
1. **Extract Business Logic**
   - Move all event/user/slide/display/message logic from `wss.js` into the appropriate service file.
   - Each service exports functions like `handleJoinRoom`, `handleSetUser`, etc.
2. **Thin WebSocket Layer**
   - `wss.js` only:
     - Handles WebSocket connections and message parsing
     - Calls service functions based on `req.command`
     - Sends responses using `sendRoom`/`sendUser`
3. **Service Function Signatures**
   - Each service function receives the parsed message, the WebSocket (`ws`), and any needed helpers (e.g., `sendRoom`).
   - Example:
     ```js
     // user.service.js
     exports.handleJoinRoom = async (req, ws, sendRoom, sendUser) => { ... }
     ```
4. **Centralize Messaging**
   - For now, keep `sendRoom` and `sendUser` in `wss.js` as utility functions used by all services.
5. **Testing**
   - With logic in services, you can now write unit tests for each function.

---

## 4. Example Command Refactor
**Before (in wss.js):**
```js
if (req.command === 'JOIN_ROOM') {
  // all join logic here
}
```
**After:**
```js
const { handleJoinRoom } = require('./services/user.service')
...
if (req.command === 'JOIN_ROOM') {
  await handleJoinRoom(req, ws, sendRoom, sendUser)
}
```

---

## 5. Naming Suggestions for Service Files
- **Singular form:** `event.service.js`, `user.service.js`, etc.
- **Short forms:** `event.svc.js`, `user.svc.js`, `slide.svc.js`, etc.
- **Other options:** `eventSrv.js`, `userSrv.js`, `slideSrv.js`

**Recommended:** Use `*.service.js` for clarity and convention.

---

## 6. What Moves to `invitation.service.js`?

### Responsibilities:
- Invitation token generation (for presenter/speaker invites)
- Token validation (when presenters use their invite link)
- Sending invitation emails
- Tracking invitation status (pending/used/expired)

### Where is this logic currently?
- **Currently, invitation logic is not explicitly separated in `wss.js`.**
- You will add this as you implement the new invitation flow:
  - When the organizer sends invitations, call `invitation.service.js` to generate/store tokens and send emails.
  - When a presenter accesses the upload page with a token, call `invitation.service.js` to validate the token.
- As you migrate, any code related to generating, validating, or managing invitation tokens/links/emails should go in `invitation.service.js`.

---

## 7. Summary Table

| Service File         | Handles...                                   |
|----------------------|----------------------------------------------|
| event.service.js     | Event CRUD, event state, room activity       |
| user.service.js      | User join/leave, user state, auth            |
| slide.service.js     | Slide upload/update/delete                   |
| display.service.js   | Display management, sharing, page changes    |
| message.service.js   | Chat, questions, queue                       |
| invitation.service.js| Invitation tokens, email sending             |

---

**You can now work step by step with this plan, moving logic from `wss.js` into services, and ask for help on each part as you go!** 