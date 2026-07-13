import PolicyLayout from '@/components/PolicyLayout';

export const metadata = {
  title: 'Return and Exchange Policy | MOULEETA',
  description: 'Mouleeta Return and Exchange Policy',
};

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Return and Exchange Policy">
      <p>
        At Mouleeta, we strive to deliver a seamless shopping experience. Please review our Return and Exchange Policy carefully to understand your rights and responsibilities.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>We offer a 4-day return window from the date of delivery.</li>
        <li>For prepaid order cancellations after dispatch, shipping charges will be deducted, and the remaining amount will be refunded.</li>
        <li>For COD orders, cancellation requests after dispatch will also incur a shipping charge deduction.</li>
        <li>If your order is damaged, a full unboxing video without any cuts is mandatory as proof. Returns will be void if the return tag is broken.</li>
        <li>Returns for size issues are eligible for exchange only.</li>
      </ul>
      <p className="font-medium text-[#1A1A1A]">
        Important Note: <span className="font-light">Mouleeta is not liable for providing assistance with your order beyond 4 days from the delivery date.</span>
      </p>
      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">Contact Information</h3>
      <p>
        For any inquiries regarding returns, exchanges, or shipping, please contact us at <a href="mailto:shopmouleeta@gmail.com" className="underline underline-offset-4">shopmouleeta@gmail.com</a> or call us at <a href="tel:+919911888029" className="underline underline-offset-4">+91 9911888029</a>.
      </p>
    </PolicyLayout>
  );
}
