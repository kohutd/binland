import {bare, bool, byte, bytes, float, int, list, binlandMap, string, Type, typedSeq, uint} from "./type";
import {UTF8_Uint8Array} from "./UTF";

class Packer {
    options: any;

    buffer: Buffer;
    offset: number;

    constructor(options: any = {}) {
        this.options = options;

        this.buffer = Buffer.alloc(1024);
        this.offset = 0;
    }

    ensureSize(size: number) {
        //
    }

    id(value: number) {
        return this.uint(value);
    }

    byte(value: number) {
        this.ensureSize(1);
        this.buffer.writeUInt8(value, this.offset);
        this.offset++;

        return this;
    }

    bool(value: boolean) {
        this.uint(value ? 1 : 0);

        return this;
    }

    int(value: number) {
        this.ensureSize(4);

        if (typeof value !== "number") {
            value = 0;
        }

        this.buffer.writeInt32LE(value, this.offset);

        this.offset += 4;

        return this;
    }

    uint(value: number) {
        this.ensureSize(4);

        if (typeof value !== "number") {
            value = 0;
        }

        this.buffer.writeUInt32LE(value, this.offset);

        this.offset += 4;

        return this;
    }

    float(value: number) {
        this.ensureSize(4);

        if (typeof value !== "number") {
            value = 0.0;
        }

        this.buffer.writeFloatLE(value, this.offset);

        this.offset += 4;

        return this;
    }

    string(value: string) {
        if (typeof value !== "string") {
            value = String(value);
        }

        const stringBuffer = UTF8_Uint8Array(value);

        this.uint(stringBuffer.length);
        this.writeBuffer(stringBuffer);

        return this;
    }

    bytes(value: Uint8Array) {
        if (!(value instanceof Uint8Array)) {
            value = new Uint8Array(0);
        }

        this.uint(value.length);
        this.writeBuffer(value);

        return this;
    }

    type(type: Type, params: any) {
        if (!type.isBare) {
            this.id(type.id);
        }

        for (const [k, v] of Object.entries(type.body)) {
            this.pack(v as Type, params[k]);
        }

        return this;
    }

    typedSeq(T: Type, items: any[]) {
        for (const item of items) {
            this.pack(T, item);
        }

        return this;
    }

    list(T: Type, items: any[]) {
        T = bare(T);

        if (!Array.isArray(items)) {
            items = [];
        }

        this.id(T.id);
        this.uint(items.length);
        this.typedSeq(T, items);

        return this;
    }

    pack(T: Type, value: any): this {
        switch (T.id) {
            case int.id:
                return this.int(value);
            case uint.id:
                return this.uint(value);
            case float.id:
                return this.float(value);
            case string.id:
                return this.string(value);
            case byte.id:
                return this.byte(value);
            case bool.id:
                return this.bool(value);
            case bytes.id:
                return this.bytes(value);
            case typedSeq.id:
                return this.typedSeq(T.T as Type, value);
            case list.id:
                return this.list(T.T as Type, value);
        }

        if (T.id === binlandMap.id) {
            if (value instanceof Map) {
                value = {
                    entries: Array.from(value.entries()).map(entry => ({key: entry[0], value: entry[1]})),
                };
            }
        }

        return this.type(T, value);
    }

    protected writeBuffer(buffer: Uint8Array) {
        this.ensureSize(buffer.length);

        this.buffer.set(buffer, this.offset);
        this.offset += buffer.length;

        return this.buffer;
    }
}

export default Packer;