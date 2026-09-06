import { contact } from "@/content/site";

export function FloatingActions() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 md:p-6">
      <div className="pointer-events-auto ml-auto flex w-fit flex-col items-stretch gap-2">
        <a
          href={contact.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-[3rem] items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-[#1ebe57] sm:min-w-[9.5rem]"
          aria-label="WhatsApp ile yazın"
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
        <a
          href={contact.phones[0].href}
          className="inline-flex min-h-11 min-w-[3rem] items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-[var(--navy-soft)] sm:min-w-[9.5rem]"
          aria-label={`Ara: ${contact.phones[0].display}`}
        >
          <PhoneIcon />
          <span className="hidden sm:inline">Hemen Ara</span>
        </a>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.4-1.4A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5ZM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.2.8.9-3.1-.2-.3A9 9 0 1 1 12 21Zm5-6.6c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.3 7.3 0 0 1-2.1-1.3 8 8 0 0 1-1.5-1.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.3-.4s0-.3 0-.4-.6-1.5-.8-2-.2-.5-.5-.5h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a9.4 9.4 0 0 0 3.6 3.1c1.4.6 1.9.6 2.6.5s1.1-.5 1.3-.9.3-.8.2-.9-.2-.2-.5-.3Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.5 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.6c0-.5.4-1 1-1H7c.5 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .7-.2 1l-2.2 2.2Z" />
    </svg>
  );
}
