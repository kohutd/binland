import {Uint8Array_UTF8} from "./UTF";
import {binlandMap, bool, byte, bytes, float, getTypeById, int, list, string, T, Type, uint} from "./type";

class Unpacker {
    buffer: Buffer;
    offset: number;

    constructor(buffer: Uint8Array) {
        this.buffer = Buffer.from(buffer);
        this.offset = 0;
    }

    id() {
        return this.uint();
    }

    bool(): boolean {
        return Boolean(this.uint());
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

    bytes(): Uint8Array {
        const length = this.int();

        const result = this.buffer.slice(this.offset, this.offset + length);

        this.offset += length;

        return result;
    }

    list(T: Type): any[] {
        const typeId = this.id();
        const length = this.int();

        if (typeId !== T.id) {
            throw new Error(`Unexpected list type. Expected: ${T.id}, got: ${typeId}`);
        }

        return this.typedSeq(T, length);
    }

    array(): any[] {
        const length = this.int();

        return this.typedSeq(T, length);
    }

    unpack(type: Type): any {
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
            case bytes.id:
                return this.bytes();
            case list.id:
                return this.list(type.body.items.generics[0]);
        }

        return this.type(type);
    }

    type(type: Type): any {
        if (!type.isBare) {
            const id = this.id();

            if (type.id === T.id) {
                type = getTypeById(id);
            }
        }

        let result: any = {};

        for (const [k, v] of Object.entries(type.body)) {
            result[k] = this.unpack(v as Type);
        }

        if (type.id === binlandMap.id) {
            result = new Map(result.entries.map((entry: any) => ([entry.key, entry.value])));
        }

        return result;
    }

    protected typedSeq(T: Type, length: number): any[] {
        let result = new Array(length);

        for (let i = 0; i < length; i++) {
            result[i] = this.unpack(T);
        }

        return result;
    }
}

export default Unpacker;