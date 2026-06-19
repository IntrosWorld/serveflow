import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../src/api/client";
import { colors } from "../../src/theme";
import { useSession } from "../../src/store/session";
type ApiTable = { id: string; name: string; enabled: boolean; position: number; status?: "available" | "pending" | "preparing" | "added_later" | "completed" };
type ActiveOrder = { tableId: string; batches: { type: "original" | "added_later"; items: { status: string }[] }[] };
export default function Tables() {
  const role = useSession((s) => s.role); const name = useSession((s) => s.name); const [query, setQuery] = React.useState("");
  const { data = [], isLoading, error } = useQuery({ queryKey: ["tables"], queryFn: () => api<ApiTable[]>("/tables") });
  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: () => api<ActiveOrder[]>("/orders"), refetchInterval: 5000 });
  const filtered = data.filter((x) => x.enabled && x.name.toLowerCase().includes(query.toLowerCase())).map((table) => {
    const order = orders.find((x) => x.tableId === table.id); if (!order) return table;
    const items = order.batches.flatMap((x) => x.items); const added = order.batches.some((x) => x.type === "added_later" && x.items.some((i) => i.status !== "completed"));
    const status = added ? "added_later" : items.every((x) => x.status === "completed") ? "completed" : items.some((x) => x.status === "started" || x.status === "ready") ? "preparing" : "pending";
    return { ...table, status } as ApiTable;
  });
  return <SafeAreaView style={s.page}><View style={s.header}><View><Text style={s.eyebrow}>{role === "customer" ? "CHOOSE YOUR TABLE" : "DINING FLOOR"}</Text><Text style={s.title}>Hello, {name}</Text><Text style={s.sub}>{filtered.length} tables available to view</Text></View></View>
    <View style={s.search}><MaterialCommunityIcons name="magnify" size={21} color={colors.muted} /><TextInput style={{ flex: 1 }} value={query} onChangeText={setQuery} placeholder="Search table number..." /></View>
    {isLoading ? <Text style={s.message}>Loading tables…</Text> : error ? <Text style={s.error}>{error.message}</Text> : <FlatList data={filtered} numColumns={2} keyExtractor={(x) => x.id} columnWrapperStyle={s.row} renderItem={({ item }) => <TableTile table={item} onPress={() => router.push({ pathname: "/(app)/order/[tableId]", params: { tableId: item.id, tableName: item.name } })} />} />}
  </SafeAreaView>;
}
function TableTile({ table, onPress }: { table: ApiTable; onPress: () => void }) {
  const status = table.status ?? "available"; const color = status === "available" ? colors.green : status === "preparing" ? colors.amber : status === "added_later" ? colors.blue : colors.brand;
  return <View onTouchEnd={onPress} style={[s.card, { borderTopColor: color }]}><Text style={s.table}>{table.name}</Text><Text style={s.tableHint}>Tap to open menu</Text><View style={s.status}><View style={[s.dot, { backgroundColor: color }]} /><Text style={{ color, fontWeight: "800", fontSize: 12 }}>{status.replace("_", " ")}</Text></View></View>;
}
import React from "react";
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 18 }, header: { paddingTop: 20, paddingBottom: 14 }, eyebrow: { color: colors.brand, fontWeight: "900", fontSize: 11, letterSpacing: 1.4 }, title: { color: colors.ink, fontSize: 28, fontWeight: "900", marginTop: 4 }, sub: { color: colors.muted, marginTop: 4 }, search: { flexDirection: "row", gap: 9, height: 50, alignItems: "center", backgroundColor: "white", borderRadius: 15, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, marginBottom: 14 }, row: { justifyContent: "space-between", marginBottom: 12 }, card: { width: "48%", backgroundColor: "white", padding: 17, minHeight: 140, borderRadius: 20, borderWidth: 1, borderTopWidth: 4, borderColor: colors.border }, table: { fontSize: 23, fontWeight: "900", color: colors.ink }, tableHint: { color: colors.muted, fontSize: 12, marginTop: 5 }, status: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 26 }, dot: { width: 8, height: 8, borderRadius: 4 }, message: { color: colors.muted, textAlign: "center", marginTop: 30 }, error: { color: colors.brand, textAlign: "center", marginTop: 30 } });
