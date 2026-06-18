import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { menu } from "../../src/data";
import { useSession } from "../../src/store/session";
import { colors } from "../../src/theme";
export default function Menu() {
  const role = useSession((s) => s.role);
  return <SafeAreaView style={s.page}><View style={s.header}><View><Text style={s.eyebrow}>RESTAURANT MENU</Text><Text style={s.title}>Dishes</Text></View>{role === "chef" && <Pressable style={s.new}><MaterialCommunityIcons name="plus" size={20} color="white" /><Text style={s.newText}>New dish</Text></Pressable>}</View>
    <FlatList data={menu} keyExtractor={(x) => x.id} renderItem={({ item }) => <View style={s.item}><Text style={s.emoji}>{item.emoji}</Text><View style={{ flex: 1 }}><Text style={s.name}>{item.name}</Text><Text style={s.category}>{item.category} · ₹{item.price}</Text></View>{role === "chef" && <Pressable><MaterialCommunityIcons name="pencil-outline" size={22} color={colors.muted} /></Pressable>}</View>} />
  </SafeAreaView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream, padding: 18 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 18, marginBottom: 10 }, eyebrow: { color: colors.brand, fontWeight: "900", letterSpacing: 1.3, fontSize: 11 }, title: { fontSize: 32, fontWeight: "900", color: colors.ink }, new: { flexDirection: "row", gap: 5, backgroundColor: colors.brand, padding: 12, borderRadius: 14 }, newText: { color: "white", fontWeight: "800" }, item: { flexDirection: "row", gap: 14, alignItems: "center", backgroundColor: "white", borderRadius: 18, padding: 15, marginTop: 10, borderWidth: 1, borderColor: colors.border }, emoji: { fontSize: 34 }, name: { color: colors.ink, fontSize: 16, fontWeight: "800" }, category: { color: colors.muted, marginTop: 4 } });
