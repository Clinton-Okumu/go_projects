// Setup dev-only keep-awake error guard before Expo loads dev tools.
if (__DEV__) {
  const msg = "Unable to activate keep awake";
  const g = global;
  const ErrorUtils = g && g.ErrorUtils;
  if (ErrorUtils && ErrorUtils.getGlobalHandler && ErrorUtils.setGlobalHandler) {
    const prev = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((err, isFatal) => {
      const text = String((err && err.message) || err);
      if (text.includes(msg)) return;
      prev(err, isFatal);
    });
  }

  try {
    const rejectionTracking = require("promise/setimmediate/rejection-tracking");
    rejectionTracking.enable({
      allRejections: true,
      onUnhandled: (id, error) => {
        const text = String((error && error.message) || error);
        if (text.includes(msg)) return;
        console.warn(`Possible Unhandled Promise Rejection (id: ${id}):`);
        console.warn(error);
      },
    });
  } catch {}
}

import "expo-router/entry";
