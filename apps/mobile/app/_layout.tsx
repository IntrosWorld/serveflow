import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
const client = new QueryClient();
export default function Layout() {
  return <QueryClientProvider client={client}><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }} /></QueryClientProvider>;
}
