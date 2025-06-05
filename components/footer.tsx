import Link from "next/link"
import { Send } from "lucide-react"
import paymentConfig from "@/data/payment_config.json"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const telegramLink =
    paymentConfig.telegramLink || `https://t.me/${paymentConfig.telegramUser?.replace("@", "") || "replipaysupport"}`

  return (
    <footer className="py-8 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {currentYear} RepliPay. All rights reserved.</p>
        <Link
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors mt-2"
        >
          <Send size={16} /> Contact us on Telegram:{" "}
          {paymentConfig.telegramUser || paymentConfig.telegramContact || "Support"}
        </Link>
      </div>
    </footer>
  )
}
