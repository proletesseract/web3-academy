// src/lib/passportClient.ts
import { Passport } from '@imtbl/sdk';
import { imtblConfig } from './imtblConfig';

// Initialize the Passport client with the configuration
export const passportClient = new Passport(imtblConfig); 