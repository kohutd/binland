import crc32 from "./crc32";

export interface Type {
    name: string | null;
    id: number;
    body: Type | Type[] | any;

    T: Type | null;
    isBare: boolean | null;
    isNative: boolean | null;
    isAlias: boolean | null;
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

export const seq: Type = {
    id: crc32("seq=[];"),
    isNative: true,
    isBare: true,
} as Type;

export function typedSeq(T: Type): Type {
    return {
        id: typedSeq.id,
        body: null,
        T,
        isNative: true,
        isBare: true,
    } as Type;
}

typedSeq.id = crc32("typedSeq<T>=T[];");

export function array(T: Type): Type {
    T = notBare(T);

    return {
        id: array.id,
        body: {
            length: uint,
            items: seq,
        },
        T,
        isNative: true,
        isBare: true,
    } as Type;
}

array.id = crc32("array<T>{length:uint;items:[];};");

export function list(T: Type): Type {
    T = bare(T);

    return {
        id: list.id,
        body: {
            length: uint,
            items: typedSeq(T),
        },
        T,
        isNative: true,
        isBare: true,
    } as Type;
}

list.id = crc32("list<T>{length:uint;items:!T[];};");

function binlandMapEntry(K: Type, V: Type) {
    return {
        id: binlandMapEntry.id,
        body: {
            key: K,
            value: V,
        },
        isNative: true,
        isBare: false,
    } as Type;
}

binlandMapEntry.id = crc32("mapEntry<K,V>{key:K;value:V;};");

export function binlandMap(K: Type, V: Type) {
    return {
        id: binlandMap.id,
        body: {
            entries: list(binlandMapEntry(K, V)),
        },
        isNative: true,
        isBare: false,
    } as Type;
}

binlandMap.id = crc32("map<K,V>{entries:list<mapEntry<K,V>>;};");