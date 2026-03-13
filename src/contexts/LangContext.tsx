"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "artdou-lang";
type Lang = "en" | "zh";

const translations: Record<
  Lang,
  Record<string, string>
> = {
  en: {
    cart: "Cart",
    cartCount: "Cart ({count})",
    subtotal: "Subtotal",
    checkout: "Proceed to checkout",
    backToShop: "Back to shop",
    addToCart: "Add to cart",
    viewDetails: "View details",
    cartEmpty: "Your cart is empty. Start by adding a piece you love.",
    reviewItems: "Review your items here and complete checkout.",
    thankYou: "Thank you for your order!",
    paymentSuccess: "Your payment was successful. We'll start preparing your ArtDoU pieces and send you a confirmation email soon.",
    orderThanks: "Thank you for your order.",
    paymentCancelled: "Payment cancelled",
    cancelMessage: "You have cancelled the payment. Your cart is still available in case you want to complete the order later.",
    cancelMessageZh: "You can return to the shop to checkout again.",
    browseCollection: "Browse collection",
    seasonalSelection: "Seasonal selection",
    orderNumber: "Order #",
  },
  zh: {
    cart: "购物车",
    cartCount: "购物车 ({count})",
    subtotal: "小计",
    checkout: "前往结算",
    backToShop: "返回商城",
    addToCart: "加入购物车",
    viewDetails: "查看详情",
    cartEmpty: "购物车是空的，去挑一件吧。",
    reviewItems: "在此确认商品并完成结算。",
    thankYou: "感谢下单！",
    paymentSuccess: "支付已成功，我们会尽快备货并发送确认邮件。",
    orderThanks: "感谢你的订单，我们会尽快处理并与您确认发货信息。",
    paymentCancelled: "支付已取消",
    cancelMessage: "你已取消支付，购物车仍保留，可随时回来结算。",
    cancelMessageZh: "如需再次下单，请返回商城。",
    browseCollection: "浏览系列",
    seasonalSelection: "当季精选",
    orderNumber: "订单号 ",
  },
};

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, opts?: { count?: number }) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

function getStoredLang(): Lang {
  if (typeof window === "undefined") return "zh";
  const s = localStorage.getItem(STORAGE_KEY);
  return s === "en" ? "en" : "zh";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    setLangState(getStoredLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, opts?: { count?: number }) => {
      let text = translations[lang][key] ?? key;
      if (opts?.count !== undefined) {
        text = text.replace("{count}", String(opts.count));
      }
      return text;
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
