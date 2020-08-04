import Packer from "./Packer";
import Unpacker from "./Unpacker";
import {bool, byte, bytes, float, int, list, binlandMap, string, Type, uint} from "./type";

export function pack(type: Type, params: any): Buffer {
    const packer = new Packer();

    packer.pack(type, params);

    return packer.buffer.slice(0, packer.offset);
}

export function unpack(buffer: Uint8Array, type: Type) {
    return new Unpacker(buffer)
        .unpack(type);
}

const Menu: Type = {
    name: "Menu",
    id: 257,
    body: {
        id: int,
        name: string,
    }
} as Type;

const Cafe: Type = {
    name: "Cafe",
    id: 256,
    body: {
        user_id: int,
        name: string,
        is_active: bool,
        menus: list(Menu),
        bytes: bytes,
        byte: byte,
        float: float,
        uint: uint,
        map: binlandMap(string, string),
    }
} as Type;

const cafeBuffer = pack(Cafe, {
    user_id: -200,
    name: "OhCafe",
    byte: 255,
    float: 3.14,
    uint: 100,
    menus: [
        {
            id: 1,
            name: "WOW",
        }
    ],
    // map: {
    //     entries: [
    //         {
    //             key: "a",
    //             value: 1,
    //         }
    //     ]
    // },
    map: new Map([["kek", "lol"]]),
});

console.log("packed", cafeBuffer);
console.log(unpack(cafeBuffer, Cafe));