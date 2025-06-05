export interface Plan {
  id: string // e.g., '1-year', 'basic-monthly'
  name: string
  officialPriceUSD?: number
  salePriceMMK: number
  stock: number
  features: string[]
}

export interface Product {
  slug: string
  name: string
  tagline: string
  logoUrl: string
  accentColorClass: string
  plans: Plan[]
}

export interface FaqItem {
  id: string // Unique ID for each FAQ
  question: string
  answer: string
}

export interface SellerNotes {
  title: string
  notes: string[]
}

export interface PaymentAccount {
  type: string // e.g., 'KBZPay', 'WaveMoney'
  name: string // Account holder name
  number: string // Account number or ID
  details?: string // Optional additional details
}

export interface PaymentConfig {
  telegramContact: string // e.g., '@YourTelegramName'
  telegramLink?: string // Full URL e.g., 'https://t.me/YourTelegramName'
  paymentInstructionsTitle: string
  paymentInstructions: string // General instructions text
  accounts: PaymentAccount[] // Array of payment accounts
  confirmationNote: string // Note shown on order confirmation
}
