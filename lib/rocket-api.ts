const ROCKET_CONFIG = {
  BASE_URL: "https://amigurumi-gaur.pikapod.net/api/v1",
  WS_URL: "wss://amigurumi-gaur.pikapod.net/websocket",
  AUTH: {
    userId: 'qrzRQGpEiGxsSG6M2',
    authToken: 'TkZDG5qK3T1FJiw9N2joUBtNaD8VGQqP3P8jJlHS4rH'
  }
};

// WebSocket connection handler
let ws: WebSocket | null = null;
let messageCallbacks: { [channelId: string]: (message: any) => void } = {};

const connectWebSocket = () => {
  if (ws) return;

  ws = new WebSocket(ROCKET_CONFIG.WS_URL);

  ws.onopen = () => {
    console.log('WebSocket connected');
    // Connect and login
    ws?.send(JSON.stringify({
      msg: 'connect',
      version: '1',
      support: ['1']
    }));

    // Login after connection
    ws?.send(JSON.stringify({
      msg: 'method',
      method: 'login',
      id: 'login-' + Date.now(),
      params: [{
        resume: ROCKET_CONFIG.AUTH.authToken
      }]
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message:', data);

    // Handle different message types
    if (data.msg === 'ping') {
      ws?.send(JSON.stringify({ msg: 'pong' }));
    } else if (data.msg === 'changed' && data.collection === 'stream-room-messages') {
      // New message received
      const [roomId, message] = data.fields.args;
      if (messageCallbacks[roomId]) {
        messageCallbacks[roomId](message);
      }
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    ws = null;
    // Reconnect after a delay
    setTimeout(connectWebSocket, 5000);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const getRocketHeaders = () => ({
  "X-Auth-Token": ROCKET_CONFIG.AUTH.authToken,
  "X-User-Id": ROCKET_CONFIG.AUTH.userId,
  "Content-Type": "application/json"
});

export const rocketApi = {
  async getMessages(channelId: string) {
    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.messages?roomId=${channelId}`, {
      method: 'GET',
      headers: getRocketHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    return data.messages.map((msg: any) => ({
      id: msg._id,
      content: msg.msg,
      username: msg.u.username,
      created_at: msg.ts,
      user: {
        id: msg.u._id,
        name: msg.u.name,
        username: msg.u.username
      },
      isEdited: msg._updatedAt !== msg.ts,
      editedAt: msg._updatedAt !== msg.ts ? msg._updatedAt : null,
      reactions: msg.reactions || {},
      attachments: msg.attachments || [],
      isPinned: msg.pinned || false
    }));
  },

  subscribeToMessages(channelId: string, callback: (message: any) => void) {
    console.log(`Subscribing to messages for channel: ${channelId}`);
    
    // Ensure WebSocket is connected
    connectWebSocket();

    // Store callback
    messageCallbacks[channelId] = callback;

    // Subscribe to room messages
    ws?.send(JSON.stringify({
      msg: 'sub',
      id: `room-messages-${channelId}`,
      name: 'stream-room-messages',
      params: [
        channelId,
        {
          useCollection: false,
          args: [{ 'visitorToken': false }]
        }
      ]
    }));

    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from messages for channel: ${channelId}`);
      delete messageCallbacks[channelId];
      ws?.send(JSON.stringify({
        msg: 'unsub',
        id: `room-messages-${channelId}`
      }));
    };
  }
}; 