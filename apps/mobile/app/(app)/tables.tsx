import { router } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TableCard } from "../../src/components/TableCard";
import { tables } from "../../src/data";
import { colors } from "../../src/theme";
import { useSession } from "../../src/store/session";
export default function Tables() {
  const role = useSession((s) => s.role);
  return <SafeAreaView style={s.page}><View style={s.header}><View><Text style={s.eyebrow}>{role === "chef" ? "KITCHEN FLOOR" : "DINING FLOOR"}</Text><Text style={s.title}>Good evening</Text><Text style={s.sub}>8 tables · 3 active orders</Text></View><View style={s.avatar}><Text>SF</Text></View></View>
    <View style={s.summary}><Text style={s.summaryNumber}>2</Text><Text style={s.summaryLabel}>New</Text><Text style={s.summaryNumber}>1</Text><Text style={s.summaryLabel}>Cooking</Text><Text style={s.summaryNumber}>1</Text><Text style={s.summaryLabel}>Ready</Text></View>
    <FlatList data={tables} numColumns={2} keyExtractor={(x) => x.id} columnWrapperStyle={s.row} contentContainerStyle={{ paddingBottom: 20 }} renderItem={({ item }) => <TableCard table={item} onPress={() => router.push({ pathname: "/(app)/order/[tableId]", params: { tableId: item.id } })} />} />
  </SafeAreaView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 18 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 18, paddingBottom: 16 }, eyebrow: { color: colors.brand, fontWeight: "800", fontSize: 11, letterSpacing: 1.4 }, title: { color: colors.ink, fontSize: 30, fontWeight: "900", marginTop: 4 }, sub: { color: colors.muted, marginTop: 4 }, avatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFDCCC", alignItems: "center", justifyContent: "center" }, summary: { flexDirection: "row", alignItems: "baseline", backgroundColor: colors.ink, borderRadius: 18, padding: 15, marginBottom: 16, gap: 8 }, summaryNumber: { color: "white", fontSize: 20, fontWeight: "900", marginLeft: 5 }, summaryLabel: { color: "#CFC5BF", marginRight: 8 }, row: { justifyContent: "space-between", marginBottom: 12 } });
