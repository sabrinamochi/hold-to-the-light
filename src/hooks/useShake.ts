import { useEffect, useRef } from 'react';

export function useShake(onShake: () => void, threshold = 18) {
  const last = useRef({ x: 0, y: 0, z: 0, t: 0, init: false });

  useEffect(() => {
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      const x = a.x ?? 0;
      const y = a.y ?? 0;
      const z = a.z ?? 0;
      if (!last.current.init) {
        last.current = { x, y, z, t: Date.now(), init: true };
        return;
      }
      const delta = Math.abs(x - last.current.x)
                  + Math.abs(y - last.current.y)
                  + Math.abs(z - last.current.z);
      const now = Date.now();
      if (delta > threshold && now - last.current.t > 700) {
        last.current.t = now;
        onShake();
      }
      last.current = { x, y, z, t: last.current.t, init: true };
    };

    const requestAndListen = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' &&
          // @ts-ignore — iOS 13+
          typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          // @ts-ignore
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handler);
          }
        } catch {}
      } else {
        window.addEventListener('devicemotion', handler);
      }
    };

    document.addEventListener('click', requestAndListen, { once: true });
    return () => {
      window.removeEventListener('devicemotion', handler);
    };
  }, [onShake, threshold]);
}
