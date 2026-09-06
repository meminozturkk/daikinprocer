import Link from "next/link";
import { categories } from "@/content/products";
import { services } from "@/content/services";
import { contact } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-[var(--navy)] text-white">
      <div className="container-pro grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">Proser Grup</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Daikin yetkili bayi ve yetkili servis. Konut, ticari ve merkezi iklimlendirme
            çözümlerinde keşif, satış, montaj ve teknik servis.
          </p>
        </div>
        <div>
          <p className="font-semibold">Ürünler</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/urunler/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Hizmetler</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/hizmetler/${s.slug}`} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/bolgeler/kartal" className="hover:text-white">
                Kartal Daikin Servis
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">İletişim</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>{contact.address.full}</li>
            <li>
              <a href={contact.phones[0].href} className="hover:text-white">
                {contact.phones[0].display}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li>{contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-pro flex flex-col gap-3 py-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {contact.legalName}. Daikin markası ilgili sahiplerine
            aittir.
          </p>
          <div className="flex gap-4">
            <Link href="/kvkk" className="hover:text-white">
              KVKK
            </Link>
            <Link href="/gizlilik" className="hover:text-white">
              Gizlilik
            </Link>
            <Link href="/iletisim" className="hover:text-white">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
