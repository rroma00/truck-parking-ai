import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Legal({ type }) {
  // Scroll to top on mount when switching between terms and privacy
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#081b44] font-['Inter']">
      {/* Header */}
      <header className="bg-white border-b border-[#dde6f5] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#5b6783] hover:text-primary transition font-semibold text-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </Link>
          <div className="font-['Manrope'] font-black text-xl text-[#081b44]">
            TruckPark AI
          </div>
          <div className="w-[100px]"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {type === 'terms' ? (
          <div>
            <div className="mb-12">
              <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-4 block text-[#163e90]">Regulatory & Compliance</span>
              <h1 className="text-4xl md:text-5xl font-['Manrope'] font-black tracking-tight text-[#081b44] mb-6">Terms of Service</h1>
              <p className="text-lg text-[#5b6783] leading-relaxed">
                Please review the terms and conditions that govern the use of TruckPark AI. These terms outline our role as an AI communications platform and define user responsibilities.
              </p>
            </div>
            
            <article className="space-y-12 text-[#2c3b59]">
              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">1. Nature of the Service</h3>
                <p className="leading-loose mb-4">TruckPark AI is a <strong>software platform</strong> that provides automated communication and booking tools. We are <strong>not</strong> a parking provider, operator, or property manager. Our platform solely facilitates communication and automated coordination between commercial drivers and parking lot owners.</p>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">2. AI Automation & No Guarantees</h3>
                <p className="leading-loose mb-4">Our service relies on artificial intelligence to handle phone calls, SMS interactions, and parking reservations. As a user, you acknowledge that:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  <li className="flex items-start space-x-3 bg-white border border-[#dde6f5] p-4 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-[#0c2f75]">smart_toy</span>
                    <span className="text-sm">Interactions may be fully automated without human intervention.</span>
                  </li>
                  <li className="flex items-start space-x-3 bg-white border border-[#dde6f5] p-4 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-[#0c2f75]">warning</span>
                    <span className="text-sm">We do not guarantee 100% accuracy, uptime, or call handling success.</span>
                  </li>
                </ul>
                <p className="leading-loose mt-4 text-sm text-[#5b6783] italic">Users are strictly responsible for verifying critical details, confirming automated bookings, and ensuring system availability meets their needs.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">3. Limitation of Liability</h3>
                <p className="leading-loose">To the maximum extent permitted by law, TruckPark AI and its affiliates shall <strong>not</strong> be liable for any direct, indirect, incidental, or consequential damages arising from the use of the service. This explicitly includes, but is not limited to, liability for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-[#5b6783]">
                  <li>Missed, delayed, or incorrectly processed bookings.</li>
                  <li>Pricing discrepancies or reservation errors caused by AI misinterpretation or system failure.</li>
                  <li>Communication dropouts, SMS delivery failures, or third-party telecom outages.</li>
                  <li>Any resulting loss of revenue, operational losses, or business interruptions.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">4. Payments & Platform Role</h3>
                <p className="leading-loose">Because TruckPark AI does not own or operate parking facilities, any payments for parking services are strictly between the driver and the lot owner. TruckPark AI may apply standard platform or processing fees for facilitating these automated transactions, which will be disclosed at the time of booking.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">5. User & Owner Responsibilities</h3>
                <p className="leading-loose"><strong>Lot Owners:</strong> You must maintain accurate and up-to-date availability, pricing, and facility rules in your dashboard. The AI depends entirely on the accuracy of the data you provide.<br /><br /><strong>Drivers/Users:</strong> You must provide truthful and accurate information when interacting with the system and comply with all posted lot restrictions and local laws.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">6. Acceptable Use</h3>
                <p className="leading-loose">You agree not to misuse the platform, attempt to manipulate the AI logic, abuse our communication channels (including excessive spam calls or SMS), or interfere with the fundamental operation of our infrastructure. Violation of these terms will result in immediate account termination.</p>
              </section>
            </article>
          </div>
        ) : (
          <div>
            <div className="mb-12">
              <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-4 block text-[#163e90]">Regulatory & Compliance</span>
              <h1 className="text-4xl md:text-5xl font-['Manrope'] font-black tracking-tight text-[#081b44] mb-6">Privacy Policy</h1>
              <p className="text-lg text-[#5b6783] leading-relaxed">
                Learn how TruckPark AI collects, processes, and protects data to power our automated reservation and communication assistant.
              </p>
            </div>

            <article className="space-y-12 text-[#2c3b59]">
              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">1. Data Collection</h3>
                <p className="leading-loose mb-6">In order to facilitate automated parking management, TruckPark AI collects operational data through dashboard inputs, automated AI phone interactions, and SMS workflows. This data includes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white border border-[#dde6f5] p-6 rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-[#0c2f75] text-3xl mb-3">call</span>
                    <h4 className="font-bold text-[#081b44] mb-2">Communications Data</h4>
                    <p className="text-sm leading-relaxed text-[#5b6783]">Phone numbers, call metadata, voice recordings, and SMS message transcripts generated during interactions with our AI.</p>
                  </div>
                  <div className="bg-white border border-[#dde6f5] p-6 rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-[#0c2f75] text-3xl mb-3">local_shipping</span>
                    <h4 className="font-bold text-[#081b44] mb-2">Operational Data</h4>
                    <p className="text-sm leading-relaxed text-[#5b6783]">Booking details, reservation histories, vehicle information, and relevant location data necessary to fulfill parking requests.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">2. Role of AI & Data Usage</h3>
                <p className="leading-loose">Our AI is designed to independently answer calls, parse user requests, and execute booking workflows or operational decisions based on lot owner configurations—often without any human intervention. The data we collect is fundamentally used to automate these bookings, debug communication failures, and provide system analytics.</p>
                <p className="leading-loose mt-4">We may use anonymized, aggregated transcripts and interaction data to improve our system reliability and conversational accuracy. However, no personally identifiable information (PII) is intentionally used to train our core foundation models.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">3. Third-Party Service Providers</h3>
                <p className="leading-loose">To provide seamless communication, we explicitly rely on third-party infrastructure. Services such as <strong>Twilio</strong> are utilized to route, transcribe, and manage incoming phone calls and SMS messages. These external providers securely process communication data strictly on our behalf to operate the service.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">4. Data Sharing & Security</h3>
                <p className="leading-loose mb-6"><strong>We do not sell your data.</strong> Information is only shared with essential service providers required to operate the platform (e.g., telecom integrations, cloud hosting).</p>
                <div className="relative rounded-2xl overflow-hidden bg-[#081b44] p-8 text-white shadow-lg">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-4">Data Security</h4>
                    <p className="text-sm opacity-80 leading-relaxed max-w-md">We secure your communications and operational data using industry-standard protocols, including active TLS encryption for data in transit and AES encryption for data at rest across our cloud databases.</p>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <span className="material-symbols-outlined text-[160px]">lock</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#10285f] mb-4">5. User Rights</h3>
                <p className="leading-loose">You have the right to request access to the personal data we hold about you or request its deletion. To exercise these rights or inquire about how your data is handled during automated interactions, please contact our support team.</p>
              </section>
            </article>
          </div>
        )}
      </main>
      
      {/* Footer minimal */}
      <footer className="border-t border-[#dde6f5] bg-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-['Manrope'] font-bold text-[#081b44] text-lg">TruckPark AI</p>
          <p className="text-[#5b6783] text-sm mt-2">© 2026 TruckPark AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
