import { useEffect } from "react";

const SYNC_EVENT = "identity-sync-requested";
const target = new EventTarget();

export function requestIdentitySync() {
  target.dispatchEvent(new Event(SYNC_EVENT));
}

export function useIdentitySyncListener(callback: () => void) {
  useEffect(() => {
    target.addEventListener(SYNC_EVENT, callback);
    return () => target.removeEventListener(SYNC_EVENT, callback);
  }, [callback]);
}
