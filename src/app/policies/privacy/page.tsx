import PolicyLayout from '@/components/PolicyLayout';

export const metadata = {
  title: 'Privacy Policy | MOULEETA',
  description: 'Mouleeta Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        At Mouleeta, your privacy is our priority. We are committed to safeguarding your personal information and being transparent about how we collect, use, and protect it.
      </p>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">1. Information We Collect</h3>
      <p>We may collect the following types of information:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Personal Information:</strong> Name, phone number, email address, shipping/billing address.</li>
        <li><strong>Payment Information:</strong> Payment method details (we do not store credit/debit card information).</li>
        <li><strong>Order Details:</strong> Purchase history and preferences.</li>
        <li><strong>Usage Data:</strong> Pages visited, time spent on site, browser type, and device information.</li>
      </ul>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">2. How We Use Your Information</h3>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Process and deliver your orders</li>
        <li>Send updates regarding your purchases</li>
        <li>Improve our website and services</li>
        <li>Respond to your inquiries or support requests</li>
        <li>Inform you of promotions or new launches (only with your consent)</li>
      </ul>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">3. Sharing Your Information</h3>
      <p>
        We do not sell, rent, or trade your personal data. We only share information with trusted third-party service providers (e.g., payment gateways, delivery partners) strictly for order fulfillment and website functionality.
      </p>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">4. Cookies and Tracking</h3>
      <p>
        Our website uses cookies to enhance your browsing experience and collect analytics data. You can manage or disable cookies through your browser settings.
      </p>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">5. Your Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Access or request deletion of your personal data</li>
        <li>Opt-out of promotional communications at any time</li>
        <li>Correct inaccurate information</li>
      </ul>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">6. Data Security</h3>
      <p>
        We implement industry-standard security measures to protect your data from unauthorized access or misuse.
      </p>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">7. Policy Updates</h3>
      <p>
        This policy may be updated from time to time. Changes will be posted here, and continued use of our website signifies your acceptance of those changes.
      </p>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">8. Contact Us</h3>
      <p>
        If you have questions or concerns about our privacy practices, please contact us at:
        <br />
        📧 <a href="mailto:shopmouleeta@gmail.com" className="underline underline-offset-4">shopmouleeta@gmail.com</a>
        <br />
        📞 <a href="tel:+919911888029" className="underline underline-offset-4">+91 9911888029</a>
      </p>
    </PolicyLayout>
  );
}
