import PolicyLayout from '@/components/PolicyLayout';

export const metadata = {
  title: 'Contact Us | MOULEETA',
  description: 'Get in touch with Mouleeta.',
};

export default function ContactPage() {
  return (
    <PolicyLayout title="Contact Us">
      <div className="flex flex-col gap-6 text-center">
        <p>We would love to hear from you. For any inquiries, support, or feedback, please reach out to us using the details below.</p>
        
        <div className="bg-white/50 border border-[#1A1A1A]/10 p-8 mt-8">
          <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mb-6">Mouleeta Headquarters</h3>
          
          <div className="flex flex-col gap-4 font-inter text-[#1A1A1A]/80">
            <p className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold mb-1">Address</span>
              NOIDA SECTOR - 88<br />
              UTTAR PRADESH - 201305<br />
              India
            </p>
            
            <p className="flex flex-col mt-4">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold mb-1">Phone</span>
              <a href="tel:+919911888029" className="hover:text-[#1A1A1A] transition-colors">+91 9911888029</a>
            </p>

            <p className="flex flex-col mt-4">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold mb-1">Email</span>
              <a href="mailto:shopmouleeta@gmail.com" className="hover:text-[#1A1A1A] transition-colors">shopmouleeta@gmail.com</a>
            </p>

            <p className="flex flex-col mt-4">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold mb-1">Business Hours</span>
              Mon to Sat - 11:00 AM to 6:00 PM (IST)
            </p>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
