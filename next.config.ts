import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/sayfa/prosergrup-hakkinda",
        destination: "/kurumsal",
        permanent: true,
      },
      {
        source: "/hizmetler/klima-sistemleri",
        destination: "/urunler/bireysel-klimalar",
        permanent: true,
      },
      {
        source: "/hizmetler/havalandirma-sistemi",
        destination: "/urunler/havalandirma",
        permanent: true,
      },
      {
        source: "/hizmetler/isitma-sistemi",
        destination: "/urunler/isi-pompalari",
        permanent: true,
      },
      {
        source: "/hizmetler/servis-hizmetleri",
        destination: "/hizmetler/yetkili-servis",
        permanent: true,
      },
      {
        source: "/urunler/duvar-tipi-split-klimalar",
        destination: "/urunler/bireysel-klimalar",
        permanent: true,
      },
      {
        source: "/urunler/multi-split-klimalar",
        destination: "/urunler/multi-split",
        permanent: true,
      },
      {
        source: "/urunler/ticari-split-klimalar",
        destination: "/urunler/ticari-klimalar",
        permanent: true,
      },
      {
        source: "/urunler/vrf-klima-sistemleri",
        destination: "/urunler/vrv-sistemleri",
        permanent: true,
      },
      {
        source: "/urunler/havadan-suya-isi-pompalari",
        destination: "/urunler/isi-pompalari",
        permanent: true,
      },
      {
        source: "/urunler/havalandirma-urunleri",
        destination: "/urunler/havalandirma",
        permanent: true,
      },
      {
        source: "/haber/klima-secerken-nelere-dikkat-etmeliyiz",
        destination: "/blog/klima-secerken-nelere-dikkat-etmeliyiz",
        permanent: true,
      },
      {
        source: "/teklif-formu",
        destination: "/teklif-al",
        permanent: true,
      },
      {
        source: "/gizlilik-politikasi",
        destination: "/gizlilik",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
