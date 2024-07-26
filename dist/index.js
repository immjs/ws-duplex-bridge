"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplexBridge = void 0;
const stream_1 = require("stream");
const ws_1 = require("ws");
class DuplexBridge extends stream_1.Duplex {
    constructor(ws, opts) {
        super(opts);
        this.ws = ws;
        this.ws.once('close', function () {
            this.emit('close');
        }.bind(this));
        this.destinationStream = (0, ws_1.createWebSocketStream)(ws, opts);
        this.destinationStream.on('readable', () => this.push(this.destinationStream.read()));
    }
    end(cb) {
        this.ws.close();
        if (cb)
            cb();
        return this;
    }
    _write(chunk, bufferEncoding, callback) {
        if (this.ws.readyState === this.ws.CONNECTING ||
            this.ws.readyState === this.ws.OPEN) {
            this.destinationStream.write(chunk, bufferEncoding, callback);
        }
        else {
            this.emit('close');
        }
    }
    _read(size) {
        return this.destinationStream.read(size);
    }
}
exports.DuplexBridge = DuplexBridge;
