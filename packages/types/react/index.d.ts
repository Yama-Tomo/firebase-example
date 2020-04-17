import { FunctionComponent } from 'react';

declare module 'react' {
  type FCX<P = {}> = FunctionComponent<P & { className?: string }>;
}

export type ContextStateType<T> = T extends React.Context<infer R> ? R : never;
