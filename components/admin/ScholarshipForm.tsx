// @ts-nocheck

import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

const DEGREE_OPTIONS = [
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Masters', label: 'Masters' },
  { value: 'PhD', label: 'PhD' },
  { value: 'All Levels', label: 'All Levels' },
];

const FUNDING_OPTIONS = [
  { value: 'Fully Funded', label: 'Fully Funded' },
  { value: 'Partial Funding', label: 'Partial Funding' },
  { value: 'Tuition Waiver', label: 'Tuition Waiver' },
  { value: 'Living Stipend', label: 'Living Stipend' },
  { value: 'Travel Grant', label: 'Travel Grant' },
];

const PROGRAM_MODE_OPTIONS = [
  { value: 'online', label: 'Online' },
  { value: 'on-campus', label: 'On Campus' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'full-time', label: 'Full Time' },
];

const PROGRAM_DURATION_OPTIONS = [
  { value: '1-year', label: '1 Year' },
  { value: '2-years', label: '2 Years' },
  { value: '3-years', label: '3 Years' },
  { value: '4-years', label: '4 Years' },
];

const PROGRAM_LEVEL_OPTIONS = [
  { value: 'regular', label: 'Regular' },
  { value: 'executive', label: 'Executive' },
  { value: 'research', label: 'Research' },
];

const REGION_OPTIONS = [
  { value: 'Global', label: 'Global (All Regions)' },
  { value: 'Europe', label: 'Europe' },
  { value: 'North America', label: 'North America' },
  { value: 'Asia Pacific', label: 'Asia Pacific' },
  { value: 'Middle East', label: 'Middle East' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Latin America', label: 'Latin America' },
];

const COUNTRY_OPTIONS = [
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Japan', label: 'Japan' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'China', label: 'China' },
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'India', label: 'India' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
];

const FIELD_OPTIONS = [
  { value: 'All Fields', label: 'All Fields' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Medicine & Health', label: 'Medicine & Health' },
  { value: 'Computer Science & IT', label: 'Computer Science & IT' },
  { value: 'Business & Management', label: 'Business & Management' },
  { value: 'Economics & Finance', label: 'Economics & Finance' },
  { value: 'Social Sciences', label: 'Social Sciences' },
  { value: 'Humanities', label: 'Humanities' },
  { value: 'Natural Sciences', label: 'Natural Sciences' },
  { value: 'Law', label: 'Law' },
  { value: 'Education', label: 'Education' },
  { value: 'Arts & Design', label: 'Arts & Design' },
];

const MONTH_OPTIONS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

const PERIOD_OPTIONS = [
  { value: 'early', label: 'Early' },
  { value: 'mid', label: 'Mid' },
  { value: 'late', label: 'Late' },
];

const DEFAULT_FAQS = [
  { question: "Can I apply if I am still completing my degree?", answer: "Yes, final-year students can apply. You must provide proof of graduation before the programme starts." },
  { question: "Is there an application fee for this scholarship?", answer: "No, this scholarship does not require any application fee." },
];

interface ScholarshipFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
}

export default function ScholarshipForm({ initialData, onSubmit, submitLabel }: ScholarshipFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [selectedDegrees, setSelectedDegrees] = useState<any[]>(
    initialData?.degreeLevel?.map((v: string) => DEGREE_OPTIONS.find(o => o.value === v) || { value: v, label: v }) || []
  );
  const [selectedFunding, setSelectedFunding] = useState<any[]>(
    initialData?.fundingType?.map((v: string) => FUNDING_OPTIONS.find(o => o.value === v) || { value: v, label: v }) || []
  );
  const [selectedProgramModes, setSelectedProgramModes] = useState<any[]>(
    initialData?.programMode?.map((v: string) => PROGRAM_MODE_OPTIONS.find(o => o.value === v) || { value: v, label: v }) || []
  );
  const [selectedProgramDurations, setSelectedProgramDurations] = useState<any[]>(
    initialData?.programDuration?.map((v: string) => PROGRAM_DURATION_OPTIONS.find(o => o.value === v) || { value: v, label: v }) || []
  );
  const [selectedProgramLevels, setSelectedProgramLevels] = useState<any[]>(
    initialData?.programLevel?.map((v: string) => PROGRAM_LEVEL_OPTIONS.find(o => o.value === v) || { value: v, label: v }) || []
  );
  const [selectedRegions, setSelectedRegions] = useState<any[]>(
    initialData?.region?.map((v: string) => REGION_OPTIONS.find(o => o.value === v) || { value: v, label: v }) || []
  );
  const [selectedCountries, setSelectedCountries] = useState<any[]>(
    initialData?.hostCountries?.map((v: string) => ({ value: v, label: v })) || []
  );
  const [selectedFields, setSelectedFields] = useState<any[]>(
    initialData?.fields?.map((v: string) => ({ value: v, label: v })) || []
  );
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    provider: initialData?.provider || '',
    description: initialData?.description || '',
    benefits: Array.isArray(initialData?.benefits) ? initialData.benefits.join('\n') : (initialData?.benefits || ''),
    eligibility: Array.isArray(initialData?.eligibility) ? initialData.eligibility.join('\n') : (initialData?.eligibility || ''),
    howToApply: Array.isArray(initialData?.howToApply) ? initialData.howToApply.join('\n') : (initialData?.howToApply || ''),
    requiredDocuments: Array.isArray(initialData?.requiredDocuments) ? initialData.requiredDocuments.join('\n') : (initialData?.requiredDocuments || ''),
    applicationTips: initialData?.applicationTips || '',
    officialLink: initialData?.officialLink || '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    importantDates: initialData?.importantDates || { resultsAnnouncement: '', programmeStart: '' },
    faqs: initialData?.faqs?.length ? initialData.faqs : [{ question: '', answer: '' }],
    useDefaultFaqs: initialData?.faqs?.length ? false : true,
    // New deadline fields
    deadlineMonth: initialData?.deadlineMonth ?? 0,
    deadlinePeriod: initialData?.deadlinePeriod || 'early',
  });

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs, useDefaultFaqs: false });
  };

  const addFaq = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }], useDefaultFaqs: false });
  };

  const removeFaq = (index: number) => {
    if (formData.faqs.length > 1) {
      const newFaqs = [...formData.faqs];
      newFaqs.splice(index, 1);
      setFormData({ ...formData, faqs: newFaqs, useDefaultFaqs: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const benefitsArray = formData.benefits.split('\n').filter((line: string) => line.trim());
    const eligibilityArray = formData.eligibility.split('\n').filter((line: string) => line.trim());
    const howToApplyArray = formData.howToApply.split('\n').filter((line: string) => line.trim());
    const requiredDocumentsArray = formData.requiredDocuments.split('\n').filter((line: string) => line.trim());
    
    let faqsArray = formData.faqs.filter((f: any) => f.question.trim() && f.answer.trim());
    if (formData.useDefaultFaqs && faqsArray.length === 0) {
      faqsArray = DEFAULT_FAQS;
    }

    const payload = {
      ...formData,
      degreeLevel: selectedDegrees.map(d => d.value),
      fundingType: selectedFunding.map(f => f.value),
      programMode: selectedProgramModes.map(m => m.value),
      programDuration: selectedProgramDurations.map(d => d.value),
      programLevel: selectedProgramLevels.map(l => l.value),
      region: selectedRegions.map(r => r.value),
      hostCountries: selectedCountries.map(c => c.value),
      fields: selectedFields.map(f => f.value),
      benefits: benefitsArray,
      eligibility: eligibilityArray,
      howToApply: howToApplyArray,
      requiredDocuments: requiredDocumentsArray,
      faqs: faqsArray
    };

    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider / Organization *</label>
            <input type="text" required value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Month *</label>
              <Select
                options={MONTH_OPTIONS}
                value={MONTH_OPTIONS.find(m => m.value === formData.deadlineMonth)}
                onChange={(opt: any) => setFormData({...formData, deadlineMonth: opt.value})}
                className="react-select"
                classNamePrefix="select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Period *</label>
              <Select
                options={PERIOD_OPTIONS}
                value={PERIOD_OPTIONS.find(p => p.value === formData.deadlinePeriod)}
                onChange={(opt: any) => setFormData({...formData, deadlinePeriod: opt.value})}
                className="react-select"
                classNamePrefix="select"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">Deadline will display as e.g., "Early January"</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level *</label>
            <Select isMulti options={DEGREE_OPTIONS} value={selectedDegrees} onChange={(v: any) => setSelectedDegrees(v)} className="react-select" classNamePrefix="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Type</label>
            <Select isMulti options={FUNDING_OPTIONS} value={selectedFunding} onChange={(v: any) => setSelectedFunding(v)} className="react-select" classNamePrefix="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Mode</label>
            <Select isMulti options={PROGRAM_MODE_OPTIONS} value={selectedProgramModes} onChange={(v: any) => setSelectedProgramModes(v)} className="react-select" classNamePrefix="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Duration</label>
            <Select isMulti options={PROGRAM_DURATION_OPTIONS} value={selectedProgramDurations} onChange={(v: any) => setSelectedProgramDurations(v)} className="react-select" classNamePrefix="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Level</label>
            <Select isMulti options={PROGRAM_LEVEL_OPTIONS} value={selectedProgramLevels} onChange={(v: any) => setSelectedProgramLevels(v)} className="react-select" classNamePrefix="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
            <Select isMulti options={REGION_OPTIONS} value={selectedRegions} onChange={(v: any) => setSelectedRegions(v)} className="react-select" classNamePrefix="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
            <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="https://example.com/image.jpg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Official Application Link *</label>
            <input type="url" required value={formData.officialLink} onChange={(e) => setFormData({...formData, officialLink: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="https://" />
          </div>
        </div>
      </div>

      {/* Host Countries */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Host Countries *</h2>
        <CreatableSelect isMulti options={COUNTRY_OPTIONS} value={selectedCountries} onChange={(v: any) => setSelectedCountries(v)} className="react-select" classNamePrefix="select" placeholder="Type to search or add custom country..." />
      </div>

      {/* Fields of Study */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Fields of Study *</h2>
        <CreatableSelect isMulti options={FIELD_OPTIONS} value={selectedFields} onChange={(v: any) => setSelectedFields(v)} className="react-select" classNamePrefix="select" placeholder="Type to search or add custom field..." />
      </div>

      {/* Program Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Program Overview</h2>
        <textarea rows={6} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Scholarship Benefits</h2>
        <p className="text-sm text-gray-500 mb-3">Enter each benefit on a new line</p>
        <textarea rows={4} value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm" />
      </div>

      {/* Eligibility */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Eligibility Criteria</h2>
        <p className="text-sm text-gray-500 mb-3">Enter each requirement on a new line</p>
        <textarea rows={5} value={formData.eligibility} onChange={(e) => setFormData({...formData, eligibility: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm" />
      </div>

      {/* How to Apply */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Application Process</h2>
        <p className="text-sm text-gray-500 mb-3">Enter each step on a new line</p>
        <textarea rows={5} value={formData.howToApply} onChange={(e) => setFormData({...formData, howToApply: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm" />
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Required Documents</h2>
        <p className="text-sm text-gray-500 mb-3">Enter each document on a new line</p>
        <textarea rows={5} value={formData.requiredDocuments} onChange={(e) => setFormData({...formData, requiredDocuments: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm" />
      </div>

      {/* Important Dates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Important Dates</h2>
        <div className="space-y-3">
          <input type="text" value={formData.importantDates.resultsAnnouncement} onChange={e => setFormData({...formData, importantDates: {...formData.importantDates, resultsAnnouncement: e.target.value}})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Results Announcement (e.g., '3-4 months after deadline')" />
          <input type="text" value={formData.importantDates.programmeStart} onChange={e => setFormData({...formData, importantDates: {...formData.importantDates, programmeStart: e.target.value}})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Programme Start (e.g., 'September 2026')" />
        </div>
      </div>

      {/* Application Tips */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Application Tips</h2>
        <textarea rows={4} value={formData.applicationTips} onChange={(e) => setFormData({...formData, applicationTips: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Frequently Asked Questions</h2>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.useDefaultFaqs} onChange={(e) => setFormData({ ...formData, useDefaultFaqs: e.target.checked, faqs: [{ question: '', answer: '' }] })} className="w-4 h-4 text-[#0B3B2F] rounded" />
            <span className="text-sm text-gray-700">Use default FAQs</span>
          </label>
        </div>

        {!formData.useDefaultFaqs && (
          <>
            {formData.faqs.map((faq: any, index: number) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <label className="text-sm font-medium text-gray-700">FAQ #{index + 1}</label>
                  <button type="button" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                </div>
                <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2" placeholder="Question" />
                <textarea rows={2} value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Answer" />
              </div>
            ))}
            <button type="button" onClick={addFaq} className="text-sm text-[#0B3B2F] hover:underline">+ Add another FAQ</button>
          </>
        )}
      </div>

      {/* Featured Option */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 text-[#0B3B2F] rounded" />
          <span className="text-gray-700">Feature this scholarship on the homepage</span>
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="bg-[#0B3B2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1A5D4A] transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={() => window.history.back()} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
