import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "../../src/theme";
import { useSession } from "../../src/store/session";
import { useEffect } from "react";
import { registerForPush } from "../../src/services/notifications";
export default function AppTabs() {
  const role = useSession((s) => s.role);
  useEffect(() => { if (role === "chef" || role === "admin") void registerForPush(role); }, [role]);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.brand, tabBarStyle: { height: 68, paddingTop: 7, backgroundColor: "white" } }}>
    <Tabs.Screen name="tables" options={{ title: "Tables", tabBarIcon: ({ color }) => <MaterialCommunityIcons name="table-chair" size={25} color={color} /> }} />
    <Tabs.Screen name="kitchen" options={{ href: role === "chef" || role === "admin" ? undefined : null, title: "Kitchen", tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chef-hat" size={25} color={color} /> }} />
    <Tabs.Screen name="menu" options={{ title: "Menu", tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food" size={25} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog-outline" size={25} color={color} /> }} />
    <Tabs.Screen name="order/[tableId]" options={{ href: null }} />
  </Tabs>;
}
