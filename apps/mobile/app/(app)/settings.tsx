import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSession } from "../../src/store/session";
import { colors } from "../../src/theme";
export default function Settings() {
  const role = useSession((s) => s.role); const clear = useSession((s) => s.clearRole);
  return <SafeAreaView style={s.page}><Text style={s.eyebrow}>OPERATIONS</Text><Text style={s.title}>Settings</Text>
    <View style={s.role}><View style={s.icon}><MaterialCommunityIcons name={role === "chef" ? "chef-hat" : "room-service-outline"} size={27} color={colors.brand} /></View><View><Text style={s.label}>Current role</Text><Text style={s.value}>{role === "chef" ? "Chef" : "Waiter"}</Text></View></View>
    <Setting icon="table-chair" title="Manage tables" body="Add, rename, reorder or disable tables" />
    <Setting icon="bell-outline" title="Notifications" body="New orders and added-later alerts" />
    <Setting icon="wifi" title="Connection" body="Live updates connected" />
    <Pressable style={s.switch} onPress={() => { clear(); router.replace("/"); }}><Text style={s.switchText}>Switch role</Text></Pressable>
  </SafeAreaView>;
}
function Setting({ icon, title, body }: { icon: any; title: string; body: string }) { return <Pressable style={s.setting}><MaterialCommunityIcons name={icon} size={25} color={colors.ink} /><View style={{ flex: 1 }}><Text style={s.settingTitle}>{title}</Text><Text style={s.settingBody}>{body}</Text></View><MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} /></Pressable>; }
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream, padding: 18 }, eyebrow: { color: colors.brand, fontWeight: "900", letterSpacing: 1.3, fontSize: 11, marginTop: 18 }, title: { color: colors.ink, fontSize: 32, fontWeight: "900" }, role: { flexDirection: "row", gap: 14, alignItems: "center", backgroundColor: colors.ink, padding: 18, borderRadius: 20, marginVertical: 18 }, icon: { backgroundColor: "white", width: 48, height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center" }, label: { color: "#CFC5BF", fontSize: 12 }, value: { color: "white", fontWeight: "900", fontSize: 19 }, setting: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "white", padding: 17, borderRadius: 17, marginBottom: 10, borderWidth: 1, borderColor: colors.border }, settingTitle: { color: colors.ink, fontWeight: "800" }, settingBody: { color: colors.muted, fontSize: 12, marginTop: 3 }, switch: { borderWidth: 1.5, borderColor: colors.brand, padding: 15, borderRadius: 15, marginTop: 12 }, switchText: { color: colors.brand, textAlign: "center", fontWeight: "900" } });
