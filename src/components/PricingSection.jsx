"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck, FaCrown, FaWandSparkles, FaUtensils, FaCircleQuestion, FaCreditCard } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import { SERVER_URL } from "@/lib/apiConfig";

const pricingTiers = [
  {
    name: "Free Explorer",
    price: "$0",
    rawPrice: 0,
    period: "Lifetime Access",
    description: "Perfect for home cooks getting started on their culinary adventure.",
    features: [
      "Browse recipe cards & ratings",
      "Save favorite recipes to personal collection",
      "Limit: Max 2 published recipes",
      "Basic search & filter tools",
      "Standard community support"
    ],
    cta: "Get Started Free",
    popular: false,
    badge: null,
    href: "/register"
  },
  {
    name: "Premium Member",
    price: "$14.99",
    rawPrice: 14.99,
    period: "Lifetime Access",
    description: "Unlock all platform recipes, secret cooking instructions, and unlimited recipe uploads.",
    features: [
      "AI Smart Recipe Generator (Weekly 2 AI recipes)",
      "AI Smart Grocery List & Price Estimator (Unlimited Access)",
      "Unlimited access to ALL Free & Premium recipes",
      "Full step-by-step cooking instructions & secret ingredients",
      "Unlimited recipe creation & publishing",
      "Ad-free browsing & distraction-free cooking mode",
      "Priority customer & creator support"
    ],
    cta: "Get Premium Lifetime Access",
    popular: true,
    badge: "Recommended",
    href: "#"
  }
];

const faqs = [
  {
    q: "Are these membership plans one-time lifetime purchases?",
    a: "Yes! The Premium Member plan offers complete lifetime access with no recurring monthly subscriptions or hidden renewal charges."
  },
  {
    q: "Can I purchase single paid recipes without a subscription?",
    a: "Yes! If you prefer not to upgrade to Premium Member, you can purchase individual paid recipes permanently for a low one-time fee."
  },
  {
    q: "What payment methods do you accept?",
    a: "We support major credit & debit cards (Visa, MasterCard, American Express), Stripe secure checkout, and mobile payments."
  },
  {
    q: "Do admins or verified creators get special perks?",
    a: "RecipeHub administrators receive complete unrestricted lifetime access to all recipes on the platform for moderation and maintenance."
  }
];

const PricingSection = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUserEmail = session?.user?.email;

  const [openFaq, setOpenFaq] = useState(null);
  const [dynamicTiers, setDynamicTiers] = useState(pricingTiers);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchDynamicPlans = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/pricing-plans`);
        const json = await res.json();
        if (json.success && json.plans) {
          const rawP = json.plans.proFoodie?.rawPrice || json.plans.masterChef?.rawPrice || 14.99;
          const fetchedPrice = json.plans.proFoodie?.price || json.plans.masterChef?.price || "$14.99";
          setDynamicTiers([
            pricingTiers[0],
            {
              ...pricingTiers[1],
              price: fetchedPrice,
              rawPrice: rawP,
              description: json.plans.proFoodie?.description || pricingTiers[1].description,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic pricing plans:", err);
      }
    };
    fetchDynamicPlans();
  }, [SERVER_URL]);

  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    if (currentUserEmail) {
      fetch(`${SERVER_URL}/check-user-role?email=${currentUserEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.isPremium) {
            setIsPremiumUser(true);
          }
        })
        .catch((err) => console.error("Failed to check user role/premium:", err));
    } else {
      setIsPremiumUser(false);
    }
  }, [currentUserEmail, SERVER_URL]);

  const handleUpgradeClick = async (tier) => {
    if (tier.price === "$0" || tier.name === "Free Explorer") {
      if (currentUserEmail) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
      return;
    }

    // Unauthenticated user: prompt login & save intent
    if (!currentUserEmail) {
      toast("Please log in first to purchase Premium Membership!", { icon: "🔒" });
      localStorage.setItem(
        "pending_membership_checkout",
        JSON.stringify({
          tier: tier.name,
          rawPrice: tier.rawPrice || 14.99,
        })
      );
      setTimeout(() => {
        router.push("/login?redirect=checkout_membership");
      }, 1000);
      return;
    }

    // Authenticated user: Check if user is ALREADY a Premium Member
    try {
      const checkRes = await fetch(`${SERVER_URL}/check-user-role?email=${currentUserEmail}`);
      const checkData = await checkRes.json();
      const isAlreadyPremium = checkData?.data?.isPremium || session?.user?.isPremium || isPremiumUser;
      if (isAlreadyPremium) {
        toast.success("You are already a Premium Member! Enjoy lifetime access to all features.", {
          duration: 4000,
          style: {
            borderRadius: "14px",
            background: "#1E293B",
            color: "#F59E0B",
            fontWeight: "bold",
            border: "1px solid #F59E0B40"
          },
        });
        return;
      }
    } catch (err) {
      console.error("Error verifying premium status:", err);
    }

    // Authenticated user: trigger Stripe Checkout Session
    setCheckoutLoading(true);
    const toastId = toast.loading("Redirecting to Stripe Checkout...");
    try {
      const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: "membership_upgrade",
          title: `${tier.name} Lifetime Access`,
          price: Number(tier.rawPrice || 14.99),
          userEmail: currentUserEmail,
          userId: session?.user?.id || session?.user?._id || "N/A",
        }),
      });

      const sessionData = await res.json();
      if (sessionData.success && sessionData.url) {
        toast.dismiss(toastId);
        window.location.href = sessionData.url;
      } else {
        toast.dismiss(toastId);
        toast.error(sessionData.message || "Failed to initiate Stripe Checkout.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.dismiss(toastId);
      toast.error("Stripe Checkout Connection Error.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-16 bg-base-100 text-base-content transition-colors duration-300">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-widest border border-primary/20">
            <FaWandSparkles className="w-3.5 h-3.5" />
            <span>Lifetime Access Plans</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Membership & <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Pricing Plans</span>
          </h2>
          <p className="text-base-content/70 text-base md:text-lg leading-relaxed font-medium">
            Unlock unlimited recipes, secret ingredients, and full cooking instructions with a single lifetime membership.
          </p>
        </div>

        {/* 2 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {dynamicTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-3xl p-8 md:p-10 transition-all duration-300 ${
                tier.popular
                  ? "bg-base-100 border-2 border-primary shadow-2xl scale-105 z-10"
                  : "bg-base-200/50 border border-base-300 hover:border-primary/40 hover:shadow-xl"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <FaCrown className="w-3 h-3" />
                  <span>{tier.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <FaUtensils className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 my-4">
                  <span className="text-4xl md:text-5xl font-black">{tier.price}</span>
                  <span className="badge badge-success badge-sm font-extrabold text-white px-2.5 py-2">
                    {tier.period}
                  </span>
                </div>

                <p className="text-sm opacity-80 leading-relaxed mb-6 font-medium">
                  {tier.description}
                </p>

                <div className="border-t border-base-300/60 my-6"></div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm font-medium">
                      <div className="mt-0.5 p-1 rounded-full bg-success/20 text-success shrink-0">
                        <FaCheck className="w-3 h-3" />
                      </div>
                      <span className="opacity-90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleUpgradeClick(tier)}
                disabled={checkoutLoading}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  tier.name === "Free Explorer"
                    ? "bg-base-300 text-base-content hover:bg-primary hover:text-white"
                    : "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl"
                }`}
              >
                {tier.name !== "Free Explorer" && <FaCreditCard className="text-sm" />}
                <span>{tier.cta}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-base-200/40 rounded-3xl p-6 md:p-10 border border-base-300/50 shadow-sm space-y-6 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center">Plan Comparison Matrix</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="border-b border-base-300 text-base-content/70">
                  <th className="bg-transparent text-left py-4 text-sm font-bold">Feature</th>
                  <th className="bg-transparent text-center py-4 text-sm font-bold">Free Explorer</th>
                  <th className="bg-transparent text-center py-4 text-sm font-bold text-primary">Premium Member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/40">
                <tr>
                  <td className="font-semibold py-4">Standard & Free Recipe Access</td>
                  <td className="text-center py-4 opacity-70">Teaser & Card View</td>
                  <td className="text-center py-4 text-success font-bold">✓ Full Ingredients & Instructions</td>
                </tr>
                <tr>
                  <td className="font-semibold py-4">Premium Secret Paid Recipes</td>
                  <td className="text-center py-4 opacity-50">Pay per recipe</td>
                  <td className="text-center py-4 text-success font-bold">✓ Included Free</td>
                </tr>
                <tr>
                  <td className="font-semibold py-4">Recipe Creation Limit</td>
                  <td className="text-center py-4 opacity-70">Max 2 Uploads</td>
                  <td className="text-center py-4 text-success font-bold">✓ Unlimited Recipe Uploads</td>
                </tr>
                <tr>
                  <td className="font-semibold py-4">AI Smart Grocery List & Price Estimator</td>
                  <td className="text-center py-4 opacity-50">✕ Locked</td>
                  <td className="text-center py-4 text-emerald-500 font-extrabold">✓ Unlimited Access (AI Powered)</td>
                </tr>
                <tr>
                  <td className="font-semibold py-4">Ad-Free & Distraction-Free Mode</td>
                  <td className="text-center py-4 opacity-50">✕</td>
                  <td className="text-center py-4 text-success font-bold">✓ Ad-Free Cooking Mode</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold flex items-center justify-center gap-2">
              <FaCircleQuestion className="text-primary" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-base-content/70">Got questions about membership? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="collapse collapse-plus bg-base-200/60 rounded-2xl border border-base-300/50"
              >
                <input
                  type="radio"
                  name="pricing-faq"
                  checked={openFaq === i}
                  onChange={() => setOpenFaq(openFaq === i ? null : i)}
                />
                <div className="collapse-title text-base font-bold">
                  {faq.q}
                </div>
                <div className="collapse-content text-sm text-base-content/80 leading-relaxed font-medium">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
