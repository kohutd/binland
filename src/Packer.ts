import {bool, Byte, byte, float, int, sameType, string, Type, uint, Vector} from "./type";
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
            value = "";
        }

        const stringBuffer = UTF8_Uint8Array(value);

        this.uint(stringBuffer.length);

        this.writeBuffer(stringBuffer);

        return this;
    }

    typedVector(T: Type, items: any[]) {
        if (!Array.isArray(items)) {
            items = [];
        }

        this.id(Vector.id);
        this.id(T.id);
        this.uint(items.length);

        if (sameType(T, Byte)) {
            this.ensureSize(items.length);
            this.buffer.set(items, this.offset);
            this.offset += items.length;
        } else {
            items.forEach((item: any) => {
                this.pack(T, item, true);
            });
        }

        return this;
    }

    pack(type: Type, value: any, raw = false): this {
        switch (type.id) {
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
        }

        if (type.id === Vector.id) {
            return this.typedVector(type.T as Type, value);
        }


        if (raw) {
            return this.rawType(type, value);
        }

        return this.type(type, value);
    }

    type(type: Type, params: any) {
        this.buffer.writeInt32LE(type.id, this.offset);
        this.offset += 4;

        return this.rawType(type, params);
    }

    rawType(type: Type, params: any) {
        if (typeof type.params === "string") {
            this.pack(type, params);
        } else {
            for (const [k, v] of Object.entries(type.params)) {
                this.pack(v as Type, params[k]);
            }
        }

        return this;
    }

    byte(value: number) {
        this.ensureSize(1);
        this.buffer.writeUInt8(value, this.offset);
        this.offset++;

        return this;
    }

    bool(value: boolean) {
        this.byte(value ? 1 : 0);

        return this;
    }

    protected writeBuffer(buffer: Uint8Array) {
        this.ensureSize(buffer.length);

        this.buffer.set(buffer, this.offset);
        this.offset += buffer.length;

        return this.buffer;
    }
}

export default Packer;