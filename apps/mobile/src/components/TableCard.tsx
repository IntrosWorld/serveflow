import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Table } from "../data";
import { colors } from "../theme";
const status = {
  available: { label: "Available", color: colors.green, bg: "#EAF8F1" },
  pending: { label: "New order", color: colors.brand, bg: "#FFF0EA" },
  preparing: { label: "Preparing", color: colors.amber, bg: "#FFF6DF" },
  added_later: { label: "Added later", color: colors.blue, bg: "#EAF3FD" },
  completed: { label: "Ready", color: colors.green, bg: "#EAF8F1" },
};
export function TableCard({ table, onPress }: { table: Table; onPress: () => void }) {
  const meta = status[table.status];
  return <Pressable onPress={onPress} style={[s.card, { borderTopColor: meta.color }]}>
    <View style={s.top}><Text style={s.name}>{table.name}</Text><MaterialCommunityIcons name="chevron-right" size={21} color={colors.muted} /></View>
    <Text style={s.seats}>{table.seats} seats</Text>
    <View style={[s.badge, { backgroundColor: meta.bg }]}><View style={[s.dot, { backgroundColor: meta.color }]} /><Text style={[s.label, { color: meta.color }]}>{meta.label}</Text></View>
    {!!table.items && <Text style={s.items}>{table.items} dishes</Text>}
  </Pressable>;
}
const s = StyleSheet.create({ card: { width: "48%", minHeight: 150, backgroundColor: "white", borderRadius: 20, padding: 16, borderTopWidth: 4, borderWidth: 1, borderColor: colors.border }, top: { flexDirection: "row", justifyContent: "space-between" }, name: { fontSize: 22, fontWeight: "900", color: colors.ink }, seats: { color: colors.muted, marginTop: 4 }, badge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20, marginTop: 22 }, dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 }, label: { fontWeight: "800", fontSize: 12 }, items: { color: colors.muted, fontSize: 12, marginTop: 8 } });
