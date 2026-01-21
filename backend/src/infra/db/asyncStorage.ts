import { AsyncLocalStorage } from "async_hooks";

// Create an instance of AsyncLocalStorage to store request-specific data
export const asyncLocalStorage = new AsyncLocalStorage<{ token?: string }>();