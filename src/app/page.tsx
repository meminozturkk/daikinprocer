import { HomePage } from "@/components/sections/HomePage";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Proser Grup | Daikin Yetkili Bayi ve Servis Kartal",
  description:
    "Daikin yetkili bayi ve yetkili servis. Bireysel klima, multi, Sky Air, VRV, Altherma. Keşif, montaj ve teknik servis — Kartal / İstanbul.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
