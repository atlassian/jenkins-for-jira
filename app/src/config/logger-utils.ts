// eslint-disable-next-line max-classes-per-file
import { Writable } from 'stream';
import safeJsonStringify from 'safe-json-stringify';
import bformat from 'bunyan-format';
import { isNodeDev } from '../utils/is-node-env';
import { createHashWithSharedSecret } from '../utils/encryption';

// TODO - update with sensitive tupes to be removed
const SENSITIVE_DATA_FIELDS = [''];
// For any Micros env we want the logs to be in JSON format.
// Otherwise, if local development, we want human-readable logs.
const outputMode = process.env.MICROS_ENV ? 'json' : 'short';

type ChunkData = {
    msg?: string;
    filterHttpRequests?: boolean;
    level?: number | undefined;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key:string]: any
};

type Callback = (error?: Error | null) => void;

//  See https://github.com/probot/probot/issues/1577
export const filterHttpRequests = (record: ChunkData) => {
    const { msg, filterHttpRequests: filteredRequests } = record;
    return !!filteredRequests && /(GET|POST|DELETE|PUT|PATCH)/.test(msg || '');
};
//
// class RawLogStream extends Writable {
//     private readonly writeStream: NodeJS.WritableStream;
//
//     public constructor() {
//         super({ objectMode: true });
//         this.writeStream = bformat({ outputMode, levelInString: true, color: isNodeDev() });
//     }
//
//     public async writeLogs(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {
//         // Skip unwanted logs
//         if (filterHttpRequests(record)) {
//             await next();
//             return;
//         }
//
//         const chunk = `${safeJsonStringify(record)} `;
//         this.writeStream.write(chunk, encoding);
//     }
// }
//
// export class SafeRawLogStream extends RawLogStream {
//     public async writeSafeLogs(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {
//         // Skip unsafe data
//         if (record.unsafe) {
//             return next();
//         }
//
//         const hashedRecord = SafeRawLogStream.hashSensitiveData(record);
//         return new Promise<void>((resolve, reject) => {
//             super.write(hashedRecord, encoding, (error?: Error | null) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve();
//                 }
//                 next(error);
//             });
//         });
//     }
//
//     private static hashSensitiveData(record: ChunkData): Record<string, string | undefined> {
//         const recordClone = { ...record };
//
//         Object.keys(recordClone).forEach((key: string) => {
//             if (SENSITIVE_DATA_FIELDS.includes(key)) {
//                 recordClone[key] = createHashWithSharedSecret(recordClone[key]);
//             }
//         });
//
//         return recordClone;
//     }
// }


class RawLogStream extends Writable {
    private readonly writeStream: NodeJS.WritableStream;

    public constructor() {
        super({ objectMode: true });
        this.writeStream = bformat({ outputMode, levelInString: true, color: isNodeDev() });
    }

	// eslint-disable-next-line consistent-return
    public async _write(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {

        // Skip unwanted logs
        if (filterHttpRequests(record)) {
            return next();
        }

        const chunk = `${safeJsonStringify(record)} `;
        this.writeStream.write(chunk, encoding);
        next();
    }
}

export class SafeRawLogStream extends RawLogStream {

    // eslint-disable-next-line consistent-return,no-underscore-dangle
    public async _write(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {
        // Skip unsafe data
        if (record.unsafe) {
            return next();
        }
        const hashedRecord = this.hashSensitiveData(record);
        // eslint-disable-next-line no-underscore-dangle
        await super._write(hashedRecord, encoding, next);
    }

    // eslint-disable-next-line class-methods-use-this
    private hashSensitiveData(record: ChunkData): Record<string, string | undefined> {
        const recordClone = { ...record };

        Object.keys(recordClone).forEach((key: string) => {
            if (SENSITIVE_DATA_FIELDS.includes(key)) {
                recordClone[key] = createHashWithSharedSecret(recordClone[key]);
            }
        });

        return recordClone;
    }
}
