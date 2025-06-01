import { Principal } from '@dfinity/principal';

export interface Pet {
    name: string;
    age: bigint;
    image?: string;
    owner?: Principal;
} 