import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Role } from "@restaurant/shared";
import { api } from "../src/api/client";
import { useSession } from "../src/store/session";
import { colors } from "../src/theme";

type LoginResult = { token: string; role: Role; name: string };
export default function Login() {
  const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const login = useSession((s) => s.login);
  const submit = async () => {
    setLoading(true); setError("");
    try {
      const session = await api<LoginResult>("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
      login(session); router.replace("/(app)/tables");
    } catch (e) { setError(e instanceof Error ? e.message : "Login failed"); } finally { setLoading(false); }
  };
  return <SafeAreaView style={s.page}><View style={s.brand}><View style={s.logo}><MaterialCommunityIcons name="silverware-fork-knife" size={29} color="white" /></View><Text style={s.brandName}>ServeFlow</Text></View>
    <View><Text style={s.eyebrow}>RESTAURANT OPERATIONS</Text><Text style={s.title}>Welcome back.</Text><Text style={s.subtitle}>Sign in to open your role workspace.</Text></View>
    <View style={s.form}><Text style={s.label}>Username</Text><TextInput autoCapitalize="none" value={username} onChangeText={setUsername} style={s.input} placeholder="chef" /><Text style={s.label}>Password</Text><TextInput secureTextEntry value={password} onChangeText={setPassword} style={s.input} placeholder="••••••••" />{!!error && <Text style={s.error}>{error}</Text>}<Pressable style={s.button} onPress={submit} disabled={loading}>{loading ? <ActivityIndicator color="white" /> : <Text style={s.buttonText}>Sign in</Text>}</Pressable></View>
    <Text style={s.help}>Admin, chef, waiter and customer accounts are listed in README.</Text>
  </SafeAreaView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream, padding: 24, justifyContent: "space-between" }, brand: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }, logo: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }, brandName: { fontSize: 22, fontWeight: "800", color: colors.ink }, eyebrow: { color: colors.brand, fontWeight: "800", letterSpacing: 1.5, fontSize: 12 }, title: { fontSize: 42, fontWeight: "900", color: colors.ink, marginTop: 10 }, subtitle: { color: colors.muted, fontSize: 17, marginTop: 10 }, form: { backgroundColor: "white", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: colors.border }, label: { color: colors.ink, fontWeight: "800", marginBottom: 7, marginTop: 8 }, input: { height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, backgroundColor: "#FFFCF8" }, error: { color: colors.brand, marginTop: 10 }, button: { height: 52, borderRadius: 15, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center", marginTop: 18 }, buttonText: { color: "white", fontWeight: "900", fontSize: 16 }, help: { textAlign: "center", color: colors.muted, fontSize: 12 } });
