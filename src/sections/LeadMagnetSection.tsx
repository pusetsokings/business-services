import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LeadMagnetSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      leftRef.current,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    ).fromTo(
      rightRef.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      '-=0.7'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleDownload = () => {
    // Create a professional business plan template as HTML and download as text
    const templateContent = `BUSINESS PLAN TEMPLATE
================================
Prepared by: [Your Company Name]
Date: [Date]


EXECUTIVE SUMMARY
-----------------
[Write a brief overview of your business idea, mission, and key objectives. 
This should be concise but compelling - aim for 1-2 paragraphs.]


COMPANY DESCRIPTION
-------------------
Company Name: [Your Company Name]
Legal Structure: [Sole Proprietorship / Partnership / Pty Ltd]
Industry: [Your Industry]
Location: [Business Address]

[Describe what your business does, the problem it solves, and what makes it unique.]


MARKET ANALYSIS
---------------
Target Market: [Describe your ideal customers]
Market Size: [Estimated size of your market in Botswana]
Competitors: [List key competitors and their strengths/weaknesses]
Competitive Advantage: [What sets you apart]


PRODUCTS OR SERVICES
--------------------
[Describe what you are selling. Include pricing, features, and benefits.]

Product/Service 1: [Name] - [Description] - [Price]
Product/Service 2: [Name] - [Description] - [Price]


MARKETING & SALES STRATEGY
--------------------------
[How will you reach customers and generate sales?]

Channels:
- [Digital marketing / Social media]
- [Direct sales]
- [Partnerships]
- [Word of mouth / Referrals]


OPERATIONS PLAN
---------------
Location: [Where will you operate?]
Equipment/Tools Needed: [List key equipment]
Suppliers: [Key suppliers]
Day-to-Day Operations: [Describe daily activities]


MANAGEMENT TEAM
---------------
[Name] - [Role] - [Qualifications/Experience]
[Name] - [Role] - [Qualifications/Experience]


FINANCIAL PROJECTIONS
---------------------
Startup Costs:
- Registration & Licenses: P[Amount]
- Equipment: P[Amount]
- Marketing: P[Amount]
- Working Capital: P[Amount]
- Other: P[Amount]
Total Startup: P[Amount]

Monthly Operating Costs:
- Rent: P[Amount]
- Salaries: P[Amount]
- Utilities: P[Amount]
- Marketing: P[Amount]
- Other: P[Amount]
Total Monthly: P[Amount]

Revenue Projections:
Year 1: P[Amount]
Year 2: P[Amount]
Year 3: P[Amount]

Break-even Analysis: [When do you expect to break even?]


FUNDING REQUIREMENTS
--------------------
Total Funding Needed: P[Amount]
Use of Funds:
- [Purpose]: P[Amount]
- [Purpose]: P[Amount]


APPENDIX
--------
[Include any supporting documents: CVs, market research, letters of intent, etc.]


---
This template was provided by Prospero Business Services.
For a comprehensive, professionally written business plan tailored to your specific 
business needs, contact us at info@prosperokings.com or call +267 72 402849.

We also offer:
- Company registration with CIPA
- Tax clearance certificates
- Council trade licenses
- PPR procurement registration
- Branding & logo design
- Landing pages & digital presence
`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Business_Plan_Template_Prospero.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <section
      id="lead-magnet"
      ref={sectionRef}
      className="bg-bg-primary section-padding content-padding"
    >
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Text */}
          <div ref={leftRef}>
            <span className="section-label mb-4 block">FREE RESOURCE</span>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium text-text-primary leading-tight tracking-tight mb-6 text-balance">
              Not Ready for the Full Package?
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg text-balance">
              Download our simplified business plan template. See the quality of our work
              before you commit. No email required — just grab it and start planning.
            </p>
            <button
              onClick={handleDownload}
              className={`mb-3 inline-flex items-center gap-2 transition-all duration-300 ${
                downloaded
                  ? 'bg-success text-white px-8 py-3.5 rounded-pill font-medium'
                  : 'btn-primary'
              }`}
            >
              {downloaded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Free Template
                </>
              )}
            </button>
            <p className="text-text-muted text-sm">
              Or upgrade to a comprehensive business plan for P1,500
            </p>
          </div>

          {/* Right: Template Preview */}
          <div ref={rightRef} className="flex justify-center md:justify-end">
            <div className="relative">
              <img
                src="/images/img-template-preview.jpg"
                alt="Business Plan Template Preview"
                className="rounded-card shadow-2xl max-w-md w-full"
                style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)' }}
              />
              {/* Decorative glow */}
              <div
                className="absolute -inset-4 rounded-3xl -z-10 opacity-30"
                style={{
                  background: 'radial-gradient(circle at center, rgba(200, 150, 62, 0.3), transparent 70%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
