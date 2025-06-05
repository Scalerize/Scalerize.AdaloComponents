/**
 * Polyfill to ensure __DEV__ exists when this component bundle
 * is executed inside Adalo’s Web-pack based editor, where Metro’s
 * global constant is not injected.
 *
 * We define it *once* on the global object before any library
 * (e.g. react-native-gesture-handler inside react-native-draggable-flatlist)
 * is imported, preventing the “__DEV__ is not defined” crash.
 */
if (typeof globalThis.__DEV__ === 'undefined') {
  // Treat everything except explicit production builds as “development”
  globalThis.__DEV__ = process.env.NODE_ENV !== 'production';
}

///////////////////////////////////////////////////////////////////////////////
// Gesture-Handler compatibility: stub DeviceEventEmitter for web/Adalo editor
///////////////////////////////////////////////////////////////////////////////
import * as ReactNative from 'react-native';

if (
  !ReactNative.DeviceEventEmitter ||
  typeof ReactNative.DeviceEventEmitter.addListener !== 'function'
) {
  const noop = () => {};
  const fakeSubscription = { remove: noop };

  ReactNative.DeviceEventEmitter = {
    addListener: () => fakeSubscription,
    removeAllListeners: noop,
    removeSubscription: noop,
    emit: noop,
  };
}

/* eslint-disable import/prefer-default-export */
// Exporting something (even empty) allows both ES-module and CJS import styles.
export {};