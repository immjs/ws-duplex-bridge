import { Duplex, DuplexOptions } from 'stream';
import { WebSocket } from 'ws';
export declare class DuplexBridge extends Duplex {
    destinationStream: Duplex;
    ws: WebSocket;
    constructor(ws: WebSocket, opts?: DuplexOptions);
    end(cb?: () => void): this;
    _write(chunk: any, bufferEncoding: BufferEncoding, callback: (err: Error | null | undefined) => void): void;
    _read(size?: number): any;
}
