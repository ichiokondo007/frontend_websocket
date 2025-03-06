import React, { useState } from 'react';

const WebSocketDemo: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const connectWebSocket = () => {
    const websocket = new WebSocket('ws://localhost:3001'); // backendのポートに合わせる
    websocket.onopen = () => {
      setLogs(prev => [...prev, 'WebSocket 接続完了']);
    };
    websocket.onmessage = (event) => {
      setLogs(prev => [...prev, '受信: ' + event.data]);
    };
    websocket.onerror = () => {
      setLogs(prev => [...prev, 'エラーが発生しました']);
    };
    websocket.onclose = () => {
      setLogs(prev => [...prev, 'WebSocket 切断']);
    };
    setWs(websocket);
  };

  // メッセージ送信の処理
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      setLogs(prev => [...prev, '送信: ' + message]);
      setMessage('');
    } else {
      setLogs(prev => [...prev, 'WebSocket が接続されていません']);
    }
  };

  return (
    <div>
      {/* ヘッダー部分：背景を青に設定 */}
      <header style={{ backgroundColor: 'blue', color: 'white', padding: '10px' }}>
        WebSocket Demo
      </header>
      <div style={{ padding: '10px' }}>
        {/* Connectionボタンにスタイルを追加 */}
        <button
          onClick={connectWebSocket}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          Connection
        </button>
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージ入力"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '8px'
            }}
          />
          {/* 送信ボタンにスタイルを追加 */}
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: 'orange',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            送信
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>ログ</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebSocketDemo;
