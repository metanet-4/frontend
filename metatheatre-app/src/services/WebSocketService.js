// src/services/WebSocketService.js
import { EventBus } from './EventBus';  // 중괄호 없이 default import
import store from '../store/modules/modalStore'
class WebSocketService {
    constructor() {
        this.socket = null;
    }

    connect(url) {
        if (!this.socket) {
            this.socket = new WebSocket(url);
            this.socket.onopen = () => {
                console.log('WebSocket 연결됨');
            };
            this.socket.onerror = (error) => {
                console.error('WebSocket 에러:', error);
            };
            this.socket.onclose = (event) => {
                console.log('WebSocket 연결 종료됨:', event);
            };
            this.socket.onmessage = (message) => {
                console.log('수신된 메시지:', message.data);
                store.commit('addAlarm', { message: message.data });
                // EventBus.emit('ws-message', message.data);
            };
        }
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('웹소켓이 연결되어 있지 않습니다.');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

const wsInstance = new WebSocketService();
export default wsInstance;
