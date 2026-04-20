'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Clock, CheckCircle, Send, AlertCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is The Open Scholarships completely free?',
    answer: 'Yes, The Open Scholarships is 100% free forever. We do not charge any fees for accessing scholarship information, application guides, or any of our resources.'
  },
  {
    question: 'How do you verify scholarship information?',
    answer: 'We manually research every scholarship from official sources. Our team verifies deadlines, eligibility, and requirements before publishing.'
  },
  {
    question: 'How often is the scholarship data updated?',
    answer: 'Our scholarship database is updated daily. We track deadline changes and add new opportunities as soon as they are announced.'
  },
  {
    question: 'Can I submit a scholarship not listed on The Open Scholarships?',
    answer: 'Absolutely! Use the contact form above to submit scholarship details. We will review and add it to our database.'
  },
  {
    question: 'Do you offer application assistance?',
    answer: 'We provide detailed application guides and tips. However, we do not write applications for students. Our goal is to empower you with information.'
  },
  {
    question: 'How can I report incorrect information?',
    answer: 'Please use the contact form or email us directly. We appreciate your help in keeping our database accurate.'
  }
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-6">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="General Question">General Question</option>
                  <option value="Scholarship Submission">Scholarship Submission</option>
                  <option value="Report Correction">Report Correction</option>
                  <option value="Partnership">Partnership Opportunity</option>
                  <option value="Technical Issue">Technical Issue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>
              
              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}
              
              {status === 'success' && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}
              
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#0B3B2F] text-white py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Consistent Card Design */}
        <div className="lg:col-span-1">
          {/* Direct Channels - Using consistent card styling */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-4">Direct Channels</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A] text-sm">Email</p>
                  <p className="text-gray-600 text-sm">support@theopenscholarships.com</p>
                  <p className="text-xs text-gray-400 mt-1">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A] text-sm">WhatsApp Community</p>
                  <p className="text-gray-600 text-sm">Join our student community</p>
                  <p className="text-xs text-gray-400 mt-1">Get instant updates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A] text-sm">Response Time</p>
                  <p className="text-gray-600 text-sm">Within 24 hours</p>
                  <p className="text-xs text-gray-400 mt-1">Monday - Friday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Response Promise */}
          <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] text-white rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Response Guarantee</h3>
              <p className="text-white/70 text-sm">
                We read every message and reply within 24 hours. Your questions matter to us.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Vertical stack, one per row */}
      <div className="mt-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-3">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-[#D4A373] mx-auto"></div>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Find quick answers to common questions about The Open Scholarships.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#1A1A1A] pr-4 text-sm md:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    openFaqIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A] rounded-2xl p-8 text-center text-white">
        <h3 className="font-serif text-2xl mb-3">Still Have Questions?</h3>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Can&apos;t find what you&apos;re looking for? Reach out to us directly and we&apos;ll help you.
        </p>
        <a
          href="mailto:support@theopenscholarships.com"
          className="inline-block bg-[#D4A373] text-[#0B3B2F] px-6 py-2.5 rounded-lg font-medium hover:bg-[#C67B5E] transition-colors"
        >
          Email Us Directly
        </a>
      </div>
    </div>
  );
}
