"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type FieldErrors = Record<string, string[] | undefined>;

export function QuoteForm({
  defaultProduct,
}: {
  defaultProduct?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setStatus("loading");
    setErrors({});
    setMessage("");

    const form = new FormData(formElement);
    const payload = {
      ...Object.fromEntries(form.entries()),
      kvkk: form.get("kvkk") === "on",
    };

    try {
      const res = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: { message?: string; errors?: FieldErrors } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setMessage(`Sunucu yanıtı okunamadı (${res.status})`);
        setStatus("error");
        return;
      }
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Gönderilemedi");
        setStatus("error");
        return;
      }
      setStatus("success");
      setMessage("Talebiniz alındı. En kısa sürede sizi arayacağız.");
      formElement.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? `Bağlantı hatası: ${err.message}`
          : "Bağlantı hatası. Lütfen telefon veya WhatsApp ile ulaşın.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface grid gap-4 p-6 md:p-8" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ad Soyad" name="name" required error={errors.name?.[0]} />
        <Field label="Telefon" name="phone" type="tel" required error={errors.phone?.[0]} />
        <Field label="E-posta" name="email" type="email" error={errors.email?.[0]} />
        <Field label="İlçe / Semt" name="city" required error={errors.city?.[0]} />
      </div>
      <Field
        label="İlgilendiğiniz ürün / sistem"
        name="productInterest"
        defaultValue={defaultProduct}
        error={errors.productInterest?.[0]}
      />
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-[var(--navy)]">Mesajınız</span>
        <textarea
          name="message"
          required
          rows={4}
          className="rounded-xl border border-slate-200 px-3 py-2 focus-ring"
          placeholder="Alan bilgisi, kapasite ihtiyacı, proje tipi..."
        />
        {errors.message?.[0] ? <span className="text-sm text-red-600">{errors.message[0]}</span> : null}
      </label>
      <label className="flex items-start gap-2 text-sm text-[var(--slate)]">
        <input type="checkbox" name="kvkk" className="mt-1" required />
        <span>
          <a href="/kvkk" className="text-[var(--daikin-blue)] underline">
            KVKK aydınlatma metnini
          </a>{" "}
          okudum, iletişim amacıyla verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {errors.kvkk?.[0] ? <span className="text-sm text-red-600">{errors.kvkk[0]}</span> : null}
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Button type="submit" size="lg" className="w-full md:w-auto">
        {status === "loading" ? "Gönderiliyor..." : "Ücretsiz Teklif İste"}
      </Button>
      {message ? (
        <p
          role="status"
          className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-red-600"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function ServiceForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setStatus("loading");
    setErrors({});
    setMessage("");

    const form = new FormData(formElement);
    const payload = {
      ...Object.fromEntries(form.entries()),
      kvkk: form.get("kvkk") === "on",
    };

    try {
      const res = await fetch("/api/servis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: { message?: string; errors?: FieldErrors } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setMessage(`Sunucu yanıtı okunamadı (${res.status})`);
        setStatus("error");
        return;
      }
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Gönderilemedi");
        setStatus("error");
        return;
      }
      setStatus("success");
      setMessage("Servis talebiniz alındı. Ekibimiz sizinle iletişime geçecek.");
      formElement.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? `Bağlantı hatası: ${err.message}`
          : "Bağlantı hatası. Lütfen telefon ile ulaşın.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface grid gap-4 p-6 md:p-8" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ad Soyad" name="name" required error={errors.name?.[0]} />
        <Field label="Telefon" name="phone" type="tel" required error={errors.phone?.[0]} />
        <Field label="E-posta" name="email" type="email" error={errors.email?.[0]} />
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-[var(--navy)]">Cihaz tipi</span>
          <select name="deviceType" required className="rounded-xl border border-slate-200 px-3 py-2 focus-ring">
            <option value="">Seçin</option>
            <option>Duvar tipi split</option>
            <option>Multi split</option>
            <option>Ticari / Sky Air</option>
            <option>VRV</option>
            <option>Isı pompası</option>
            <option>Diğer</option>
          </select>
          {errors.deviceType?.[0] ? (
            <span className="text-sm text-red-600">{errors.deviceType[0]}</span>
          ) : null}
        </label>
      </div>
      <Field label="Adres" name="address" required error={errors.address?.[0]} />
      <Field label="Tercih edilen zaman" name="preferredTime" error={errors.preferredTime?.[0]} />
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-[var(--navy)]">Arıza / talep açıklaması</span>
        <textarea
          name="issue"
          required
          rows={4}
          className="rounded-xl border border-slate-200 px-3 py-2 focus-ring"
          placeholder="Cihaz modeli, hata kodu, şikayet..."
        />
        {errors.issue?.[0] ? <span className="text-sm text-red-600">{errors.issue[0]}</span> : null}
      </label>
      <label className="flex items-start gap-2 text-sm text-[var(--slate)]">
        <input type="checkbox" name="kvkk" className="mt-1" required />
        <span>
          <a href="/kvkk" className="text-[var(--daikin-blue)] underline">
            KVKK aydınlatma metnini
          </a>{" "}
          okudum ve kabul ediyorum.
        </span>
      </label>
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Button type="submit" size="lg" variant="secondary">
        {status === "loading" ? "Gönderiliyor..." : "Servis Talebi Gönder"}
      </Button>
      {message ? (
        <p
          role="status"
          className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-red-600"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--navy)]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="rounded-xl border border-slate-200 px-3 py-2 focus-ring"
      />
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
