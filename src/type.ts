import crc32 from "./crc32";

export interface Type {
    id: number;
    body: Type | Type[] | any;

    name: string | undefined;
    generics: Type[] | undefined;
    isBare: boolean | undefined;
    isNative: boolean | undefined;
    isAlias: boolean | undefined;
}

export function bare(T: Type) {
    if (T.isBare) {
        return T;
    }

    return {...T, isBare: true};
}

export function notBare(T: Type) {
    if (!T.isBare) {
        return T;
    }

    return {...T, isBare: false};
}

export const T = {
    id: crc32("T;"),
    isNative: true,
    isBare: false,
} as Type;

export const int = {
    id: crc32("int;"),
    isNative: true,
    isBare: true,
} as Type;

export const uint = {
    id: crc32("uint;"),
    isNative: true,
    isBare: true,
} as Type;

export const float = {
    id: crc32("float;"),
    isNative: true,
    isBare: true,
} as Type;

export const string = {
    id: crc32("string;"),
    isNative: true,
    isBare: true,
} as Type;

export const byte = {
    id: crc32("byte;"),
    isNative: true,
    isBare: true,
} as Type;

export const bool = {
    id: crc32("bool;"),
    isNative: true,
    isBare: true,
} as Type;

export const bytes = {
    id: crc32("bytes{length:uint;data:byte[];};"),
    isNative: true,
    isBare: true,
} as Type;

export const array = {
    id: crc32("array{length:uint;items:T[];};"),
    body: {
        length: uint,
        items: seq(notBare(T)),
    },
    isNative: true,
    isBare: true,
} as Type;

export function seq(T: Type): Type {
    return {
        id: seq.id,
        body: null,
        generics: [T],
        isNative: true,
        isBare: true,
    } as Type;
}

seq.id = crc32("T[];");

export function list(T: Type): Type {
    return {
        id: list.id,
        body: {
            length: uint,
            items: seq(bare(T)),
        },
        generics: [T],
        isNative: true,
        isBare: true,
    } as Type;
}

list.id = crc32("list<T>{length:uint;items:!T[];};");

function binlandMapEntry(K: Type, V: Type) {
    return {
        id: binlandMapEntry.id,
        body: {
            key: bare(K),
            value: bare(V),
        },
        isNative: true,
        isBare: false,
    } as Type;
}

binlandMapEntry.id = crc32("Map.Entry<K,V>{key:K;value:V;};");

export function binlandMap(K: Type, V: Type) {
    return {
        id: binlandMap.id,
        body: {
            entries: list(binlandMapEntry(bare(K), bare(V))),
        },
        isNative: true,
        isBare: false,
    } as Type;
}

binlandMap.id = crc32("Map<K,V>{entries:list<mapEntry<!K,!V>>;};");

export function getTypeById(id: number): Type {
    return {} as Type;
}