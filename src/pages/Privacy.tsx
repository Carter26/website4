import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="text-slate-400 leading-relaxed space-y-4">{children}</div>
  </div>
);

export default function Privacy() {
  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none">

          <Section title="1. Introduction">
            <p>GS Advertising & Connections ("we," "us," or "our") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Platform.</p>
            <p>We reserve the right to make changes to this Privacy Policy at any time. We will alert you about any changes by updating the date of this policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong className="text-white">Information You Provide:</strong> We collect information you voluntarily provide when you register on the Platform, create a profile, submit listings or applications, or contact us. This includes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email address, and password</li>
              <li>Business or team profile information (name, description, location, category)</li>
              <li>Payment confirmation details (business name, email, payment method, transaction ID)</li>
              <li>Profile photos and logos you upload</li>
              <li>Messages sent through contact forms</li>
            </ul>
            <p><strong className="text-white">Automatically Collected Information:</strong> When you use the Platform, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages viewed and time spent on the Platform</li>
              <li>Referring URLs</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and manage your account</li>
              <li>Provide and improve Platform features and functionality</li>
              <li>Process and verify subscription payments</li>
              <li>Connect businesses with teams</li>
              <li>Send notifications about applications, listings, and account activity</li>
              <li>Respond to your questions and support requests</li>
              <li>Monitor and analyze Platform usage to improve user experience</li>
              <li>Enforce our Terms of Service and prevent fraudulent activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Sharing Your Information">
            <p>We do not sell, rent, or trade your personal information to third parties. We may share your information in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">With Other Users:</strong> Business profiles and listings are publicly visible to all Platform visitors. Team profiles are visible to registered users. Application details are visible to the receiving business.</li>
              <li><strong className="text-white">Service Providers:</strong> We use Supabase for database and authentication services. These providers have access to data solely to perform services on our behalf.</li>
              <li><strong className="text-white">Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental authority.</li>
              <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored using Supabase, which employs industry-standard security practices including encryption at rest and in transit.</p>
            <p>However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security. In the event of a data breach that affects your personal information, we will notify you as required by applicable law.</p>
          </Section>

          <Section title="6. Your Rights and Choices">
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information through your profile settings</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your account and associated personal data</li>
              <li><strong className="text-white">Opt-Out:</strong> Opt out of non-essential communications</li>
            </ul>
            <p>To exercise these rights, contact us through the Contact page or at gsadvertisingandconnections@gmail.com. We will respond to your request within 30 days.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>The Platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. Team accounts for youth athletic programs must be created by a parent, guardian, or adult coach. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.</p>
          </Section>

          <Section title="8. Cookies and Tracking">
            <p>We use essential cookies and local storage to maintain your session and preferences on the Platform. These are necessary for the Platform to function. We do not currently use third-party advertising cookies or tracking pixels. You can control cookie settings through your browser, but disabling essential cookies may affect Platform functionality.</p>
          </Section>

          <Section title="9. Third-Party Links">
            <p>The Platform may contain links to third-party websites, including PayPal and Cash App for payment processing. These third-party sites have their own privacy policies, and we are not responsible for their content or practices. We encourage you to review the privacy policies of any third-party sites you visit.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us through the Contact page on the Platform or at gsadvertisingandconnections@gmail.com. We are committed to resolving any privacy concerns promptly and transparently.</p>
          </Section>

          <div className="mt-8 pt-8 border-t border-white/10">
            <Link to="/terms" className="text-gold-400 hover:text-gold-300 transition-colors">View Terms of Service →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
