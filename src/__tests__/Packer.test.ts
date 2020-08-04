import {pack, unpack} from "../index";
import {int, string} from "../type";

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomBytes(size: number = 2048) {
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        bytes[i] = random(0, 255);
    }
    return bytes;
}

test("int", () => {
    const val = 7555;
    const buffer = pack(int, val);

    expect(buffer.length)
        .toBe(4);

    expect(buffer.readInt32LE(0))
        .toBe(val);
});

test("string", () => {
    const val = "binland";
    const buffer = pack(string, val);

    let offset = 0;
    const length = buffer.readInt32LE(offset);
    offset += 4;

    expect(length)
        .toBe(val.length);

    expect(buffer.length)
        .toBe(offset + length);

    expect(unpack(buffer, string))
        .toBe(val);
});

test("bool", () => {
});

test("double", () => {
});