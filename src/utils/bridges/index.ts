import * as JSBridgesUtil from "./JSBridgesUtil";
import * as adjust from "./adjust";
import * as firebase from "./fcmToken";
import * as jpush from "./jgToken";
import * as injectUtil from "./injectUtil";
import * as capacitor from "./CapacitorBridgeUtil"


export const native = {
  ...JSBridgesUtil,
  ...adjust,
  ...firebase,
  ...jpush,
  ...injectUtil,
  ...capacitor,
};