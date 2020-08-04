import {Uint8Array_UTF8} from "./UTF";
import {bool, Byte, byte, float, int, string, Type, uint, Vector} from "./type";

class Unpacker {
    buffer: Buffer;
    offset: number;

    result: any;

    constructor(buffer: Uint8Array) {
        this.buffer = Buffer.from(buffer);
        this.offset = 0;
    }

    id() {
        return this.uint();
    }

    bool(): boolean {
        return Boolean(this.byte());
    }

    byte(): number {
        const result = this.buffer.readUInt8(this.offset);
        this.offset++;

        return result;
    }

    int(): number {
        const result = this.buffer.readInt32LE(this.offset);
        this.offset += 4;

        return result;
    }

    uint(): number {
        const result = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;

        return result;
    }

    float(): number {
        const result = this.buffer.readFloatLE(this.offset);
        this.offset += 4;

        return result;
    }

    string(): string {
        const strLength = this.int();

        const result = Uint8Array_UTF8(this.buffer.slice(this.offset, this.offset + strLength));

        this.offset += strLength;

        return result;
    }

    typedVector(T: Type): any[] | Uint8Array {
        const id = this.id();
        const typeId = this.id();
        const length = this.int();

        if (id !== Vector.id) {
            throw new Error(`Unexpected vector id. Expected: ${Vector.id}, got: ${id}`);
        }

        // @ts-ignore
        if (typeId !== T.id) {
            throw new Error(`Unexpected vector type. Expected: ${T.id}, got: ${typeId}`);
        }

        let result: any[] | Uint8Array;

        if (typeId === Byte.id) {
            result = this.buffer.slice(this.offset, this.offset + length);
            this.offset += length;
        } else {
            result = new Array(length);

            for (let i = 0; i < length; i++) {
                result[i] = this.unpack(T as Type, true);
            }
        }

        return result;
    }

    unpack(type: Type, raw = false): any {
        switch (type.id) {
            case int.id:
                return this.int();
            case uint.id:
                return this.uint();
            case float.id:
                return this.float();
            case string.id:
                return this.string();
            case byte.id:
                return this.byte();
            case bool.id:
                return this.bool();
        }

        if (type.id === Vector.id) {
            return this.typedVector(type.T as Type);
        }

        if (raw) {
            return this.rawType(type);
        }

        return this.type(type);
    }

    type(type: Type): any {
        const id = this.id();

        return this.rawType(type);
    }

    rawType(type: Type): any {
        const result: any = {};

        for (const [k, v] of Object.entries(type.params)) {
            result[k] = this.unpack(v as Type);
        }

        return result;
    }
}

export default Unpacker;