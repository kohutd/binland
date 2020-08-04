if (typeof TextEncoder === "undefined") {
    global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === "undefined") {
    global.TextDecoder = require("util").TextDecoder;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function UTF8_Uint8Array(input: string): Uint8Array {
    return textEncoder.encode(input);
}

export function Uint8Array_UTF8(input: Uint8Array): string {
    return textDecoder.decode(input);
}