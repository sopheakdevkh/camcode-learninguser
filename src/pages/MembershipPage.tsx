import React, { useState } from 'react';
import { Check, CreditCard, Crown, Receipt, ShieldCheck } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { BillingCycle, PlanTier } from '@/types';

export const MembershipPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { user, invoices, upgradePlan } = useLearner();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(user.billingCycle ?? 'monthly');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const plans = catalogService.getPlans();

  const handleSelectPlan = (tier: PlanTier) => {
    upgradePlan(tier, billingCycle);
    setSuccessMsg(`Your membership is now updated to ${tier.toUpperCase()} (${billingCycle}).`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {t.nav.membership}
          </h1>
          <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
            Manage your academy plan, billing cycle, and payment receipts.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex p-1 rounded-[10px] bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] self-start">
          {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold capitalize cursor-pointer ${
                billingCycle === cycle
                  ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                  : 'text-[#6e6a62] dark:text-[#A3ACA6] hover:text-[#141312] dark:text-[#f6f3ec]'
              }`}
            >
              {cycle} {cycle === 'yearly' && '· Save 20%'}
            </button>
          ))}
        </div>
      </div>

      {successMsg && <Alert tone="success">{successMsg}</Alert>}

      {/* Active Plan Banner */}
      <section className="card-note rounded-[18px] p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] flex items-center justify-center">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec] capitalize">
                Current Plan: {user.activePlan}
              </h2>
              <Badge tone="success">Active</Badge>
            </div>
            <p className="text-[13.5px] text-[#6e6a62] dark:text-[#A3ACA6]">
              {user.activePlan === 'free'
                ? 'Free forever plan — upgrade anytime to unlock subscription courses and full video clinics.'
                : `Billed ${user.billingCycle ?? 'monthly'} · Next renewal ${user.renewalDate ?? '2026-12-25'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#4c4842] dark:text-[#D5D1C8]">
          <CreditCard className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
          <span>Default method: Visa •••• 4242</span>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = user.activePlan === plan.tier;
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={`card-note rounded-[18px] p-6 flex flex-col justify-between gap-6 ${
                plan.highlighted ? 'ring-2 ring-[#1c5b48] dark:ring-[#2D7A62]' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[19px] font-bold text-[#141312] dark:text-[#f6f3ec]">{pickText(plan.name)}</h3>
                  {isCurrent && <Badge tone="primary">Current</Badge>}
                </div>
                <p className="text-[13.5px] text-[#6e6a62] dark:text-[#A3ACA6]">{pickText(plan.tagline)}</p>

                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] font-extrabold text-[#141312] dark:text-[#f6f3ec]">${price}</span>
                  <span className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((f, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-[13.5px] ${
                        f.included ? 'text-[#141312] dark:text-[#f6f3ec]' : 'text-[#6e6a62] line-through'
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          f.included ? 'text-[#16A34A]' : 'text-[#CBD5E1]'
                        }`}
                      />
                      <span>{pickText(f.label)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Button
                  fullWidth
                  variant={isCurrent ? 'outline' : 'primary'}
                  disabled={isCurrent}
                  onClick={() => handleSelectPlan(plan.tier)}
                >
                  {isCurrent ? 'Active Plan' : `Switch to ${pickText(plan.name)}`}
                </Button>
                <p className="text-[11.5px] text-[#6e6a62] dark:text-[#A3ACA6] text-center">
                  {pickText(plan.cancellationPolicy)}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Billing History */}
      <section className="card-note rounded-[18px] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec] flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" />
            Billing & Invoice History
          </h2>
          <span className="inline-flex items-center gap-1 text-[12px] text-[#16A34A] font-medium">
            <ShieldCheck className="h-4 w-4" />
            Verified Receipts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-[#ded8ca] dark:border-[#2A332E] text-[#6e6a62] dark:text-[#A3ACA6] text-[12px] uppercase">
                <th className="py-2.5 pr-4">Invoice</th>
                <th className="py-2.5 pr-4">Date</th>
                <th className="py-2.5 pr-4">Description</th>
                <th className="py-2.5 pr-4">Method</th>
                <th className="py-2.5 pr-4">Amount</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded8ca] dark:divide-[#2A332E]/70 dark:divide-[#2A332E]">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 pr-4 font-mono-custom font-semibold text-[#141312] dark:text-[#f6f3ec]">
                    {inv.id}
                  </td>
                  <td className="py-3 pr-4 text-[#6e6a62] dark:text-[#A3ACA6]">{inv.date}</td>
                  <td className="py-3 pr-4 text-[#141312] dark:text-[#f6f3ec]">{pickText(inv.description)}</td>
                  <td className="py-3 pr-4 text-[#6e6a62] dark:text-[#A3ACA6]">{inv.method}</td>
                  <td className="py-3 pr-4 font-semibold text-[#141312] dark:text-[#f6f3ec]">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <Badge tone="success">{inv.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

