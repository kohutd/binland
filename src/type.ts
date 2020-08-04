import crc32 from "./crc32";

export type Type = {
    id: number;
    params: any;

    T: Type | null;

    isNative: boolean | null;
};

export const int: Type = {
    id: crc32("native int;"),
    isNative: true,
} as Type;

export const uint: Type = {
    id: crc32("native uint;"),
    isNative: true,
} as Type;

export const float: Type = {
    id: crc32("native float;"),
    isNative: true,
} as Type;

export const string: Type = {
    id: crc32("native string;"),
    isNative: true,
} as Type;

export const byte: Type = {
    id: crc32("native byte;"),
    isNative: true,
} as Type;

export const bool: Type = {
    id: crc32("native bool;"),
    isNative: true,
} as Type;

export function Vector(T: Type): Type {
    return {
        id: Vector.id,
        T,
    } as Type;
}

Vector.id = crc32("type Vector<T> length:uint, items:T[];");

export const Int: Type = {
    id: crc32("type Int = int;"),
    params: int,
    isNative: false,
} as Type;

export const Uint: Type = {
    id: crc32("type Uint = uint;"),
    params: uint,
    isNative: false,
} as Type;

export const Float: Type = {
    id: crc32("type Float = float;"),
    params: float,
    isNative: false,
} as Type;

export const String: Type = {
    id: crc32("type String = string;"),
    params: string,
    isNative: false,
} as Type;

export const Byte: Type = {
    id: crc32("type Byte = byte;"),
    params: byte,
    isNative: false,
} as Type;

export const Bool: Type = {
    id: crc32("type Bool = bool;"),
    params: bool,
    isNative: false,
} as Type;

export function sameType(a: Type, b: Type): boolean {
    return a === b || a.id === b.id;
}