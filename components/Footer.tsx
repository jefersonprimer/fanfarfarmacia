import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { STORE_SETTINGS } from "@/lib/pharmacy";
import { categoryPath } from "@/lib/catalog";
import { InstagramIcon } from "@/components/InstagramIcon";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const settings = STORE_SETTINGS;

const navLinks = [
  { label: "Todos os Produtos", href: "/departamento" },
  {
    label: "Medicamentos & Genéricos",
    href: categoryPath("Medicamentos", "Genéricos"),
  },
  { label: "Ofertas da Semana", href: "/ofertas", highlight: true },
  { label: "Serviços Farmacêuticos", href: "/servicos-de-saude" },
];

const institutionalLinks = [
  {
    label: "Política de Privacidade (LGPD)",
    href: "/politica-de-privacidade",
  },
  { label: "Termos e Condições de Uso", href: "/termos-de-uso" },
  { label: "Dúvidas Frequentes (FAQ)", href: "/faq" },
];

const paymentMethods = [
  { name: "Visa", src: "/payments/visa.svg" },
  { name: "MasterCard", src: "/payments/mastercard.svg" },
  { name: "Amex", src: "/payments/amex.svg" },
  { name: "Diners", src: "/payments/diners.svg" },
  { name: "Elo", src: "/payments/elo.svg" },
  { name: "JCB", src: "/payments/jcb.svg" },
  { name: "Nupay", src: "/payments/nupay.svg" },
  { name: "Pix", src: "/payments/pix.svg" },
];

export default function Footer() {
  return (
    <>
      <section className="bg-white px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-7 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-start gap-4 sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <WhatsAppIcon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Tire suas dúvidas por WhatsApp
                </h2>
                <p className="mt-1 text-sm font-medium text-emerald-50">
                  Atendimento 24 horas por dia, todos os dias.
                </p>
                <p className="text-xs text-emerald-100/90">
                  Atendentes disponíveis das 07h às 23h.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Acessar WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-white text-slate-600 pt-14 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo-name.png"
                alt="Fanfar Farmácias"
                width={160}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Sua farmácia de confiança em Frederico Westphalen - RS. Cuidado,
              atenção farmacêutica de qualidade, medicamentos com procedência
              garantida e a facilidade do pedido direto pelo WhatsApp.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                title="Instagram da Fanfar Farmácias"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                title="WhatsApp Oficial"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-blue-600 ${
                      link.highlight
                        ? "text-amber-500 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Atendimento em FW
            </h4>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  {settings.address}
                  <br />
                  {settings.city} - {settings.state}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p>{settings.businessHoursWeekday}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {settings.businessHoursWeekend}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{settings.whatsappDisplay}</span>
              </div>
            </div>
          </div>

          {/* Legal & Institutional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Institucional & LGPD
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {institutionalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-4 border-t border-gray-100 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Formas de pagamento
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Parcele em até 3x* sem juros nos cartões de crédito
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-2.5">
            {paymentMethods.map((method) => (
              <li key={method.name} className="shrink-0">
                <Image
                  src={method.src}
                  alt={method.name}
                  width={48}
                  height={32}
                  unoptimized
                  className="h-8 w-12 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Responsible & Anvisa Disclaimers */}
      <div className="bg-neutral-100 text-neutral-600 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[11px] leading-relaxed space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-neutral-800">
            <span>Razão Social: Fanfar Farmácias Ltda.</span>
            <span>·</span>
            <span>CNPJ: {settings.cnpj}</span>
            <span>·</span>
            <span>
              Responsável Técnica: {settings.pharmacistResponsible} (
              {settings.crfRs})
            </span>
            <span>·</span>
            <span>{settings.anvisaAfe}</span>
          </div>

          <p>
            <strong className="text-neutral-900">Aviso Legal Regulatório:</strong> As informações contidas
            neste site não devem ser usadas para automedicação e não substituem,
            em hipótese alguma, as orientações dadas pelo médico ou
            farmacêutico. Somente o médico está apto a diagnosticar qualquer
            problema de saúde e prescrever o tratamento adequado. Medicamentos
            sob prescrição médica dependem de retenção de receita para sua
            entrega e dispensação. Preços e disponibilidade de estoque estão
            sujeitos a confirmação final pela farmácia.
          </p>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>
            © 2026 {settings.pharmacyName}. Todos os direitos reservados.
            Frederico Westphalen - RS.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Saúde, cuidado e praticidade perto de você
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
