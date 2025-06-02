import { Principal } from '@dfinity/principal';

export interface Pet {
    id?: string;
    name: string;
    age: bigint;
    image?: string;
    owner?: Principal;
} 

