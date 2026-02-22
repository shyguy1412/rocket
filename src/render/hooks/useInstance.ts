import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const InstanceContext = createContext('localhost');

export function useInstance() {
    return useContext(InstanceContext);
}
