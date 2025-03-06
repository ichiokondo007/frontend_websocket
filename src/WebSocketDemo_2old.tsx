import React, { useState } from 'react';

const WebSocketDemo: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [serverUrl, setServerUrl] = useState('ws://localhost:3001'); // SSL対応のURL

  const connectWebSocket = () => {
    // 既存の接続を閉じるてから接続
    if (ws) {
      ws.close();
    }

    const websocket = new WebSocket(serverUrl);
    websocket.onopen = () => {
      setLogs(prev => [...prev, 'WebSocket接続完了']);
    };
    websocket.onmessage = (event) => {
      setLogs(prev => [...prev, '受信: ' + event.data]);
    };
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLogs(prev => [...prev, 'エラーが発生']);
    };
    websocket.onclose = (event) => {
      setLogs(prev => [...prev, `WebSocket切断（コード: ${event.code}, 理由: ${event.reason || '理由なし'}）`]);
      setWs(null);
    };
    setWs(websocket);
  };

  // WebSocket切断の処理
  const disconnectWebSocket = () => {
    if (ws) {
      ws.close(1000, "ユーザーによる切断"); // 1000は正常終了のステータスコード
      setLogs(prev => [...prev, '切断処理を開始しました']);
      // 注：oncloseイベントハンドラでsetWs(null)が実行されます
    } else {
      setLogs(prev => [...prev, 'WebSocketは既に切断されています']);
    }
  };

  // メッセージ送信の処理
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      setLogs(prev => [...prev, '送信: ' + message]);
      setMessage('');
    } else {
      setLogs(prev => [...prev, 'WebSocketが接続されていません']);
    }
  };

  // ログをクリアする関数を修正
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div>
      {/* ヘッダー部分：背景を青に設定 */}
      <header style={{ backgroundColor: '#004d99', color: 'white', padding: '10px' }}>
        WebSocket Demo
      </header>
      <div style={{ padding: '10px' }}>
        {/* サーバーURL入力フィールド */}
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <input
            id="server-url"
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="Server URL"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '8px',
              width: 'calc(100% - 100px)',
              maxWidth: '400px'
            }}
          />
        </div>

        {/* 接続状態表示と接続ボタンを横に並べる */}
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            readOnly
            value={ws?.readyState === WebSocket.OPEN
              ? '接続中'
              : ws?.readyState === WebSocket.CONNECTING
                ? '接続中...'
                : '未接続'}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '8px',
              width: 'calc(100% - 200px)', // ボタンが2つになるので幅を調整
              maxWidth: '400px',
              backgroundColor: ws?.readyState === WebSocket.OPEN ? '#e8f5e9' : '#ffebee',
              color: ws?.readyState === WebSocket.OPEN ? 'green' : 'red',
              fontWeight: 'bold'
            }}
          />

          {/* 接続ボタン */}
          <button
            onClick={connectWebSocket}
            disabled={ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING}
            style={{
              backgroundColor: ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING ? '#cccccc' : 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING ? 'not-allowed' : 'pointer',
              marginRight: '8px'
            }}
          >
            WS接続
          </button>

          {/* 切断ボタン */}
          <button
            onClick={disconnectWebSocket}
            disabled={!ws || ws.readyState !== WebSocket.OPEN}
            style={{
              backgroundColor: !ws || ws.readyState !== WebSocket.OPEN ? '#cccccc' : 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: !ws || ws.readyState !== WebSocket.OPEN ? 'not-allowed' : 'pointer'
            }}
          >
            WS切断
          </button>
        </div>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージ入力"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '8px',
              width: 'calc(100% - 100px)',
              maxWidth: '400px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          {/* 送信ボタンにスタイルを追加 */}
          <button
            onClick={sendMessage}
            disabled={!ws || ws.readyState !== WebSocket.OPEN}
            style={{
              backgroundColor: !ws || ws.readyState !== WebSocket.OPEN ? '#cccccc' : 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: !ws || ws.readyState !== WebSocket.OPEN ? 'not-allowed' : 'pointer'
            }}
          >
            送信
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={clearLogs}
              style={{
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              ログクリア
            </button>
          </div>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px',
            height: '200px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            marginTop: '10px'
          }}>
            {logs.length === 0 ? (
              <p style={{ color: '#888' }}>ログ無し</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {logs.map((log, index) => (
                  <li key={index} style={{
                    padding: '5px 0',
                    borderBottom: index < logs.length - 1 ? '1px solid #eee' : 'none',
                    color: log.includes('エラー') ? 'red' : log.includes('受信') ? 'blue' : log.includes('切断') ? 'orange' : 'black'
                  }}>
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketDemo;
