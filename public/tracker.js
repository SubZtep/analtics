document.addEventListener(
  "DOMContentLoaded",
  () => {
    setTimeout(() => {
      navigator.sendBeacon(
        `${window.KAJAIO.origin}/feature/${window.KAJAIO.visit}`,
        JSON.stringify({
          location: window.location.href,
          referrer: document.referrer,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          pixelRatio: window.devicePixelRatio,
        })
      );
    }, 500);
  }
);

document.addEventListener("visibilitychange", () => {
  navigator.sendBeacon(
    `${window.KAJAIO.origin}/event/${window.KAJAIO.visit}/visibilitychange`,
    document.visibilityState
  );
});
