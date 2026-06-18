import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
export async function registerForPush(role: "waiter" | "chef") {
  const permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== "granted") return null;
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  const api = process.env.EXPO_PUBLIC_API_URL;
  if (api) await fetch(`${api}/devices`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, role }) });
  return token;
}
