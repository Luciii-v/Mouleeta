import PolicyLayout from '@/components/PolicyLayout';

export const metadata = {
  title: 'Shipping Policy | MOULEETA',
  description: 'Mouleeta Shipping Policy',
};

export default function ShippingPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>
        At Mouleeta, we strive to deliver a seamless shopping experience. Please review our Shipping Policy carefully to understand your rights and responsibilities.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Order Processing:</strong> Orders are typically processed within 2-3 business days.</li>
      </ul>
      
      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">Shipping Charges</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>For COD orders above ₹999, an additional ₹99 shipping charge will be applied.</li>
        <li>Free shipping for prepaid orders above ₹999.</li>
        <li>For prepaid orders below ₹999, standard shipping charges apply.</li>
      </ul>

      <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mt-8 mb-4">Delivery Time</h3>
      <p>
        Depending on your location, delivery typically takes 3-7 business days.
      </p>
    </PolicyLayout>
  );
}
