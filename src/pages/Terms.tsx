import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="text-slate-400 leading-relaxed space-y-4">{children}</div>
  </div>
);

export default function Terms() {
  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none">

          <Section title="1. Agreement to Terms">
            <p>By accessing or using GS Advertising & Connections ("the Platform," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Platform. These Terms apply to all visitors, users, and others who access or use the Service.</p>
            <p>GS Advertising & Connections reserves the right to update these Terms at any time. We will notify users of significant changes by posting a notice on the Platform. Your continued use of the Platform after such modifications constitutes your acceptance of the revised Terms.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>GS Advertising & Connections is a SaaS marketplace platform that connects local businesses with youth sports teams, high school athletic programs, booster clubs, leagues, tournaments, and community organizations seeking sponsorship opportunities. The Platform enables businesses to create sponsorship listings and teams to discover and apply for those opportunities.</p>
            <p>We provide the infrastructure and tools to facilitate connections but are not a party to any sponsorship agreements made between businesses and teams through the Platform. We do not guarantee the quality, safety, legality, or completeness of any listing or the ability of businesses to deliver promised sponsorships.</p>
          </Section>

          <Section title="3. User Accounts">
            <p>To access certain features of the Platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration and keep your account information updated.</p>
            <p>You may not create an account for fraudulent purposes, impersonate any person or entity, or misrepresent your affiliation with any person or entity. GS Advertising & Connections reserves the right to suspend or terminate accounts that violate these Terms.</p>
            <p>There are two account types: Business Accounts (for organizations wishing to sponsor teams) and Team Accounts (for youth athletic programs seeking sponsorship). Each account type has specific features and responsibilities as described in the Platform.</p>
          </Section>

          <Section title="4. Business Subscriptions and Payments">
            <p>Business accounts require an active subscription ($20/month) to have listings publicly visible on the Platform. Payment is accepted via PayPal (paypal.me/gsadvertising) and Cash App ($GSAdvCon). Upon payment, users must submit a payment confirmation form. GS Advertising & Connections will manually verify payments and activate subscriptions within 24 hours.</p>
            <p>Subscriptions are valid for 30 days from the activation date. GS Advertising & Connections does not offer refunds for subscription fees once a membership has been activated. If you believe there has been a billing error, contact us within 7 days of the charge.</p>
            <p>When a subscription expires, listings become hidden but are not deleted. Upon renewal, listings are automatically restored. GS Advertising & Connections is not responsible for any business opportunities missed during periods when a subscription is inactive.</p>
          </Section>

          <Section title="5. Prohibited Conduct">
            <p>You agree not to engage in any of the following activities:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Posting false, misleading, or fraudulent listings or applications</li>
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Using the Platform for any illegal purpose or in violation of any laws</li>
              <li>Attempting to gain unauthorized access to any part of the Platform</li>
              <li>Collecting user data without consent or for commercial purposes</li>
              <li>Creating multiple accounts for the same person or organization</li>
              <li>Posting content that is offensive, discriminatory, or inappropriate</li>
              <li>Soliciting financial information from other users outside the Platform's intended use</li>
            </ul>
          </Section>

          <Section title="6. Content and Intellectual Property">
            <p>Users retain ownership of content they submit to the Platform. By submitting content, you grant GS Advertising & Connections a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with operating the Platform.</p>
            <p>You represent and warrant that you own or have the necessary rights to any content you submit, and that such content does not infringe the intellectual property rights of any third party. GS Advertising & Connections respects intellectual property rights and will respond to valid takedown notices.</p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>The Platform is provided "as is" and "as available" without any warranties of any kind, either express or implied. GS Advertising & Connections does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components. We do not warrant the accuracy, completeness, or reliability of any content on the Platform.</p>
            <p>GS Advertising & Connections is not responsible for the conduct of any user on the Platform, the quality of any sponsorship relationship formed through the Platform, or the fulfillment of any sponsorship commitments made by businesses or teams.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the maximum extent permitted by law, GS Advertising & Connections shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of the Platform or any sponsorship relationship formed through the Platform.</p>
            <p>In no event shall GS Advertising & Connections's total liability to you for all claims exceed the amount paid by you to GS Advertising & Connections in the twelve months preceding the claim.</p>
          </Section>

          <Section title="9. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration, except where prohibited by law.</p>
          </Section>

          <Section title="10. Contact Information">
            <p>If you have questions about these Terms of Service, please contact us through the Contact page on the Platform or by email at gsadvertisingandconnections@gmail.com.</p>
          </Section>

          <div className="mt-8 pt-8 border-t border-white/10">
            <Link to="/privacy" className="text-gold-400 hover:text-gold-300 transition-colors">View Privacy Policy →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
