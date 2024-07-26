import { Duplex, DuplexOptions } from 'stream';
import { createWebSocketStream, WebSocket } from 'ws';

export class DuplexBridge extends Duplex {
  // not nice making me do this, could've been prevented with a simple event
  // don't you think 'ws'?
  destinationStream: Duplex;
  ws: WebSocket;
  constructor(ws: WebSocket, opts?: DuplexOptions) {
    super(opts);
    this.ws = ws;
    this.ws.once(
      'close',
      function (this: DuplexBridge) {
        this.emit('close');
      }.bind(this),
    );
    this.destinationStream = createWebSocketStream(ws, opts);
    this.destinationStream.on('readable', () =>
      this.push(this.destinationStream.read()),
    );
  }
  end(cb?: () => void) {
    this.ws.close();
    if (cb) cb();
    return this;
  }
  _write(
    chunk: any,
    bufferEncoding: BufferEncoding,
    callback: (err: Error | null | undefined) => void,
  ): void {
    if (
      this.ws.readyState === this.ws.CONNECTING ||
      this.ws.readyState === this.ws.OPEN
    ) {
      this.destinationStream.write(chunk, bufferEncoding, callback);
    } else {
      this.emit('close');
    }
  }
  _read(size?: number) {
    return this.destinationStream.read(size);
  }
}
