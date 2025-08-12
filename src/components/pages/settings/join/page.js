'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  'Custom Content Calendar',
  'Unlimited Template Access',
  'Trending Content Collection',
  'Academy',
  'Priority Support',
];

const JoinPage = () => {
  const [plan, setPlan] = useState('monthly');

  return (
    <div className="min-h-screen bg-brand-light-beige flex flex-col items-center justify-center px-4 fade-in">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6">
          <div className="bg-brand-cream border border-brand-beige rounded-lg px-6 py-2 flex flex-col items-center">
            <Image src="/images/brand-appeal-logo-wide-bw.svg" alt="Brand Appeal Logo" width={340} height={80} className="object-contain" />
          </div>
        </div>
        {/* Heading */}
        <h1 className="text-3xl font-semibold heading-primary mb-4 text-center">Choose Your Plan</h1>
        {/* Promo Banner */}
        <div className="w-full mb-6">
          <div className="bg-brand-warm-brown text-brand-cream rounded-lg px-6 py-3 text-center font-semibold">
            Use Code: <span className="font-bold">TSS50</span> for 50% off monthly plans!
          </div>
        </div>
        {/* Plan Toggle */}
        <div className="flex justify-center mb-6 w-full">
          <div className="bg-brand-cream rounded-lg flex overflow-hidden border border-brand-beige">
            <button
              className={`px-6 py-2 font-semibold text-lg focus:outline-none transition-colors ${plan === 'monthly' ? 'bg-brand-soft-beige text-brand-charcoal' : 'text-brand-warm-brown'}`}
              onClick={() => setPlan('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 font-semibold text-lg focus:outline-none transition-colors ${plan === 'annual' ? 'bg-brand-soft-beige text-brand-charcoal' : 'text-brand-warm-brown'}`}
              onClick={() => setPlan('annual')}
            >
              Annual
            </button>
          </div>
        </div>
        {/* Price */}
        <div className="mb-2 text-center">
          {plan === 'monthly' ? (
            <>
              <span className="text-5xl font-bold text-brand-charcoal">$49</span>
              <span className="text-xl text-brand-charcoal font-poppins"> /month</span>
            </>
          ) : (
            <>
              <span className="text-5xl font-bold text-brand-charcoal">$19</span>
              <span className="text-xl text-brand-charcoal font-poppins"> /month</span>
            </>
          )}
        </div>
        {plan === 'monthly' ? (
          <div className="mb-6 text-brand-warm-brown text-center font-poppins">
            Or save $360/year with annual billing
          </div>
        ) : (
          <div className="mb-6 text-center font-poppins">
            <div className="text-brand-charcoal text-lg mb-1">Billed annually at $228</div>
            <div className="text-brand-warm-brown text-xl font-semibold">Save $360/year</div>
          </div>
        )}
        {/* Features List */}
        <div className="w-full bg-white rounded-xl shadow card p-6 mb-8">
          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-brand-charcoal font-poppins text-lg">
                <span className="mr-3 text-brand-warm-brown">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        {/* Action Buttons */}
        <button className="w-full bg-brand-charcoal text-brand-cream text-2xl font-semibold py-5 rounded-lg shadow hover:bg-brand-warm-brown transition relative mb-3" style={{boxShadow: '4px 8px 0 0 #e2d4c2'}}>
          Get Started Now <span className="ml-2">&rarr;</span>
        </button>
        <Link href="/admin" className="w-full mt-2 text-lg text-brand-charcoal font-poppins underline hover:text-brand-warm-brown transition bg-transparent text-center block">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default JoinPage;
