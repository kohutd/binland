import Packer from "./Packer";
import Unpacker from "./Unpacker";
import {Type} from "./type";

export function pack(type: Type, params: any): Buffer {
    const packer = new Packer();

    packer.pack(type, params);

    return packer.buffer.slice(0, packer.offset);
}

export function unpack(buffer: Uint8Array, type: Type) {
    return new Unpacker(buffer)
        .unpack(type);
}

// const Menu: Type = {
//     id: 257,
//     params: {
//         id: int,
//         name: string,
//     }
// } as Type;
//
// const Cafe: Type = {
//     id: 256,
//     params: {
//         user_id: int,
//         name: string,
//         is_active: bool,
//         menus: Vector(Menu),
//     }
// } as Type;
//
// const cafeBuffer = pack(Cafe, {
//     name: "OhCafe",
//     menus: [
//         {
//             id: 1,
//             name: "WOW",
//         }
//     ]
// });
//
// console.log("packed", cafeBuffer);
// console.log(unpack(cafeBuffer, Cafe));
// console.log(new Uint8Array(pack(string, "Diana")))
//
// console.log(crc32("Sequence{length:uint;items:T[];};"))