import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { Role } from "@restaurant/shared";
import { colors } from "../src/theme";
import { useSession } from "../src/store/session";

export default function RoleScreen() {
  const setRole = useSession((s) => s.setRole);
  const choose = (role: Role) => { setRole(role); router.replace("/(app)/tables"); };
  return <SafeAreaView style={s.page}>
    <View style={s.brand}><View style={s.logo}><MaterialCommunityIcons name="silverware-fork-knife" size={30} color="white" /></View><Text style={s.brandName}>ServeFlow</Text></View>
    <View><Text style={s.eyebrow}>RESTAURANT OPERATIONS</Text><Text style={s.title}>Good service starts here.</Text><Text style={s.subtitle}>Choose how you’re working today. You can switch roles anytime.</Text></View>
    <View style={s.roles}>
      <RoleCard icon="room-service-outline" title="Waiter" body="Take orders, manage tables and follow every dish." onPress={() => choose("waiter")} />
      <RoleCard icon="chef-hat" title="Chef" body="See the kitchen queue, update dishes and edit the menu." onPress={() => choose("chef")} />
    </View>
    <Text style={s.future}>Customer ordering is coming in a future release.</Text>
  </SafeAreaView>;
}
function RoleCard({ icon, title, body, onPress }: { icon: any; title: string; body: string; onPress: () => void }) {
  return <Pressable style={s.role} onPress={onPress}><View style={s.roleIcon}><MaterialCommunityIcons name={icon} size={32} color={colors.brand} /></View><View style={{ flex: 1 }}><Text style={s.roleTitle}>{title}</Text><Text style={s.roleBody}>{body}</Text></View><MaterialCommunityIcons name="arrow-right" size={24} color={colors.brand} /></Pressable>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream, padding: 24, justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }, logo: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }, brandName: { fontSize: 22, fontWeight: "800", color: colors.ink },
  eyebrow: { color: colors.brand, fontWeight: "800", letterSpacing: 1.5, fontSize: 12 }, title: { fontSize: 42, lineHeight: 46, fontWeight: "900", color: colors.ink, marginTop: 12 }, subtitle: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 14 },
  roles: { gap: 14 }, role: { flexDirection: "row", alignItems: "center", gap: 15, backgroundColor: "white", padding: 18, borderRadius: 24, borderWidth: 1, borderColor: colors.border }, roleIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: "#FFF0EA", alignItems: "center", justifyContent: "center" }, roleTitle: { fontSize: 21, fontWeight: "800", color: colors.ink }, roleBody: { color: colors.muted, lineHeight: 20, marginTop: 3 }, future: { textAlign: "center", color: colors.muted, fontSize: 12 },
});
