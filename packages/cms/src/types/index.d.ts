export * from './react';

export type TopLevelPartial<S> = Required<S> extends object ? { [K in keyof S]?: S[K] } : never;

export type Unpacked<T> = T extends { [K in keyof T]: infer U } ? U : never;
