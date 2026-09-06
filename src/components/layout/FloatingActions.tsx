import { contact } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 md:bottom-6 md:right-6">
      <Button
        href={contact.whatsapp.href}
        variant="whatsapp"
        size="sm"
        external
        className="shadow-xl"
      >
        WhatsApp
      </Button>
      <Button href={contact.phones[0].href} variant="secondary" size="sm" external className="shadow-xl">
        Ara
      </Button>
    </div>
  );
}
