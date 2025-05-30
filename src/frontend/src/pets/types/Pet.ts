import { Principal } from '@dfinity/principal';

export interface Pet {
    name: string;
    age: bigint;
    owner: Principal;
} 