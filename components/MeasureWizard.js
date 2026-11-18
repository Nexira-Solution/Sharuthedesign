'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ruler,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Search,
  Check,
  Edit3,
  AlertCircle,
  ShieldCheck,
  Shirt,
  Heart,
  Smile,
  Users,
} from 'lucide-react';
import Img from './Img';
import MeasurementGuideVisual from './MeasurementGuideVisual';
import { api } from '@/lib/api';

const AUD = [
  {
    key: 'men',
    label: 'Men',
    note: 'Shirts (Half/Full Hand), Jiffa, Office Combos, Suits, Pants, Tracks',
    icon: Shirt,
    cover: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'women',
    label: 'Women',
    note: 'Designer Blouses, Kurtis, Salwars, Lehengas, Gowns, Office Suits',
    icon: Heart,
    cover: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'kids',
    label: 'Kids',
    note: 'Boys Kurta & Suits, Girls Pattu Pavadai, Princess Frocks',
    icon: Smile,
    cover: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'family',
    label: 'Family & Groups',
    note: 'Couple Coordinated Sets, Dad & Son, Mom & Daughter, Full Family Matching',
    icon: Users,
    cover: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80',
  },
];

const blankForm = {
  customerName: '',
  phone: '',
  email: '',
  country: 'India',
  city: '',
  occasion: '',
  eventDate: '',
  fitPreference: 'Regular Fit',
  reference: '',
  notes: '',
};

export default function MeasureWizard({ guides = [], categories = [], initialAudience = '' }) {
  const [audience, setAudience] = useState(
    AUD.some((a) => a.key === initialAudience) ? initialAudience : ''
  );
  const [guide, setGuide] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({});
  const [unit, setUnit] = useState('inches');
  const [form, setForm] = useState(blankForm);
  const [isReviewing, setIsReviewing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [doneData, setDoneData] = useState(null);

  // Determine stage: 1 = choose audience, 2 = choose category/dress, 3 = step-by-step measure or review
  const stage = !audience ? 1 : !guide ? 2 : 3;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, currentStep, isReviewing, doneData]);

  const pickAudience = (key) => {
    setAudience(key);
    setGuide(null);
    setCurrentStep(0);
    setIsReviewing(false);
  };

  const pickGuide = (g) => {
    setGuide(g);
    setCurrentStep(0);
    setValues({});
    setUnit(g.unit || 'inches');
    setIsReviewing(false);
  };

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Unit conversion
  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    const factor = newUnit === 'cm' ? 2.54 : 1 / 2.54;
    const converted = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v && !isNaN(v)) {
        converted[k] = (parseFloat(v) * factor).toFixed(1);
      }
    });
    setValues(converted);
    setUnit(newUnit);
  };

  const adjustValue = (stepIdx, delta) => {
    const cur = parseFloat(values[stepIdx] || 0);
    const updated = Math.max(0, cur + delta).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    setValues({ ...values, [stepIdx]: updated });
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    const curVal = values[currentStep];
    if (!curVal || parseFloat(curVal) <= 0) {
      setErr(`Please enter your ${guide.steps[currentStep]?.label} measurement to proceed.`);
      return;
    }
    setErr('');
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handlePrevStep = () => {
    setErr('');
    if (isReviewing) {
      setIsReviewing(false);
      setCurrentStep(guide.steps.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const jumpToStep = (idx) => {
    setErr('');
    setIsReviewing(false);
    setCurrentStep(idx);
  };

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);

    const measurementList = guide.steps.map((s, i) => ({
      label: s.label,
      value: values[i] || '0',
      unit,
      stepIndex: i + 1,
    }));

    try {
      const res = await api('/api/submissions', 'POST', {
        ...form,
        audience,
        unit,
        guide: guide._id,
        guideTitle: guide.title,
        measurements: measurementList,
      });

      setDoneData({
        ticketId: res.ticketId || `SHARU-${(res.id || '').slice(-6).toUpperCase()}`,
        customerName: form.customerName,
        phone: form.phone,
        guideTitle: guide.title,
        unit,
        measurements: measurementList,
      });
    } catch (x) {
      setErr(x.message || 'Failed to submit measurements. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // Final Confirmation Screen with Order Tracking Option
  if (doneData) {
    const waText = encodeURIComponent(
      `Hello Sharu The Design Studio,\nI have submitted my measurements for *${doneData.guideTitle}*.\n` +
      `Ticket ID: *${doneData.ticketId}*\nCustomer: ${doneData.customerName}\nPhone: ${doneData.phone}\n` +
      `Sizes (${doneData.unit}):\n` +
      doneData.measurements.map((m) => `• ${m.label}: ${m.value} ${doneData.unit}`).join('\n') +
      `\nPlease review and confirm tailoring timeline.`
    );

    return (
      <div className="done-box luxury-confirm">
        <div className="confirm-icon-wrap">
          <Sparkles size={40} className="confirm-sparkle" />
        </div>
        <span className="badge new confirm-ticket-badge">
          ORDER TICKET: {doneData.ticketId}
        </span>
        <h2>Measurements Received for Tailoring</h2>
        <p className="lead" style={{ margin: '12px auto 24px', maxWidth: '54ch' }}>
          Thank you, <strong>{doneData.customerName}</strong>. Your custom measurements for <strong>{doneData.guideTitle}</strong> have been recorded in our master tailoring system.
        </p>

        {/* Real-time Tracking Callout Card */}
        <div className="tracking-card-callout">
          <div className="track-callout-icon">
            <Search size={24} />
          </div>
          <div className="track-callout-body">
            <h4>Live Order Tracking is Now Available!</h4>
            <p>
              You can track cutting, stitching, and dispatch status anytime using your mobile number (<strong>{doneData.phone}</strong>) or Ticket ID (<strong>{doneData.ticketId}</strong>).
            </p>
            <Link href={`/track?q=${encodeURIComponent(doneData.ticketId)}`} className="btn track-now-btn">
              <Search size={15} /> Track This Order Now
            </Link>
          </div>
        </div>

        <div className="confirm-specs">
          <h4>Recorded Measurements ({doneData.unit}):</h4>
          <div className="specs-grid">
            {doneData.measurements.map((m, i) => (
              <div key={i} className="spec-row">
                <span className="spec-name">{m.label}</span>
                <span className="spec-val"><strong>{m.value}</strong> {doneData.unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 28, gap: 12 }}>
          <a
            className="btn"
            href={`https://wa.me/919876543210?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} /> Send to Tailor on WhatsApp
          </a>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDoneData(null);
              setGuide(null);
              setAudience('');
              setValues({});
              setIsReviewing(false);
              setForm(blankForm);
            }}
          >
            Measure Another Garment
          </button>
        </div>
      </div>
    );
  }

  const audienceGuides = guides.filter((g) => {
    if (audience === 'family') return g.audience === 'family' || g.audience === 'family-group';
    return g.audience === audience;
  });

  const step = guide?.steps?.[currentStep];
  const progressPercent = guide ? Math.round(((currentStep + (isReviewing ? 1 : 0)) / guide.steps.length) * 100) : 0;

  return (
    <div className="measure-wizard-root">
      {/* Step Tracker Header */}
      <div className="wz-header">
        <div className="wz-steps" aria-label="Progress">
          <button
            type="button"
            className={`wz-tab ${stage === 1 ? 'on' : stage > 1 ? 'done' : ''}`}
            onClick={() => { if (stage > 1) pickAudience(''); }}
          >
            1. Target Group {audience && `(${AUD.find((a) => a.key === audience)?.label})`}
          </button>
          <button
            type="button"
            className={`wz-tab ${stage === 2 ? 'on' : stage > 2 ? 'done' : ''}`}
            onClick={() => { if (stage > 2) setGuide(null); }}
            disabled={stage < 2}
          >
            2. Dress Category {guide && `(${guide.title})`}
          </button>
          <span className={`wz-tab ${stage === 3 && !isReviewing ? 'on' : isReviewing ? 'done' : ''}`}>
            3. Step-by-Step Measurements
          </span>
          <span className={`wz-tab ${isReviewing ? 'on' : ''}`}>
            4. Review & Submit
          </span>
        </div>

        {guide && (
          <div className="wz-progress-bar-wrap">
            <div className="wz-progress-bar" style={{ width: `${progressPercent}%` }} />
            <div className="wz-progress-meta">
              <span>{isReviewing ? 'All measurements recorded' : `Measuring: ${step?.label}`}</span>
              <span>{isReviewing ? '100%' : `${currentStep + 1} of ${guide.steps.length} (${progressPercent}%)`}</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: CHOOSE TARGET GROUP */}
        {stage === 1 && (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="stage-intro">
              <h2>1. Who are you measuring for?</h2>
              <p className="lead">Select the group to explore all tailor-made garment categories and picture guides.</p>
            </div>

            <div className="choice-grid">
              {AUD.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.key}
                    className="choice audience-card"
                    onClick={() => pickAudience(a.key)}
                  >
                    <div className="pic">
                      <Img src={a.cover} alt={a.label} w={600} />
                      <span className="aud-icon-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color="#fff" />
                      </span>
                    </div>
                    <div className="txt">
                      <h3>{a.label}</h3>
                      <p>{a.note}</p>
                      <span className="choice-cta">Explore categories →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STAGE 2: CHOOSE GARMENT CATEGORY */}
        {stage === 2 && (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="stage-top-bar">
              <button className="back-link" onClick={() => setAudience('')}>
                <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: -2 }} /> Change group ({AUD.find((a) => a.key === audience)?.label})
              </button>
              <span className="aud-indicator-pill">
                Browsing: <strong>{AUD.find((a) => a.key === audience)?.label} Collections</strong>
              </span>
            </div>

            <div className="stage-intro">
              <h2>2. Choose the garment to measure</h2>
              <p className="lead">
                Pick the exact outfit type. We will guide you step-by-step through each specific measurement point with reference pictures.
              </p>
            </div>

            {audienceGuides.length ? (
              <div className="choice-grid">
                {audienceGuides.map((g) => (
                  <button key={g._id || g.slug} className="choice guide-card" onClick={() => pickGuide(g)}>
                    <div className="pic">
                      <Img
                        src={g.coverImage || g.steps?.find((s) => s.image)?.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80'}
                        alt={g.title}
                        w={600}
                      />
                      <span className="steps-count-badge">📏 {g.steps?.length || 6} steps</span>
                    </div>
                    <div className="txt">
                      <h3>{g.title}</h3>
                      <p>{g.description || `${g.steps?.length} tailored fit points.`}</p>
                      <span className="choice-cta">Start Measuring →</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty">
                No guides added for this group yet. Please visit the studio or choose another group.
              </div>
            )}
          </motion.div>
        )}

        {/* STAGE 3: STEP-BY-STEP MEASUREMENT WALKTHROUGH */}
        {stage === 3 && !isReviewing && step && (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="stage-top-bar">
              <button className="back-link" onClick={() => setGuide(null)}>
                <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: -2 }} /> Change dress ({guide.title})
              </button>
              <div className="unit-toggle" role="group" aria-label="Measurement Unit">
                <button
                  type="button"
                  className={unit === 'inches' ? 'on' : ''}
                  onClick={() => handleUnitToggle('inches')}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  className={unit === 'cm' ? 'on' : ''}
                  onClick={() => handleUnitToggle('cm')}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Step navigation pill pills */}
            <div className="step-pills-bar">
              {guide.steps.map((s, idx) => {
                const hasVal = values[idx] && parseFloat(values[idx]) > 0;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`step-pill ${idx === currentStep ? 'active' : ''} ${hasVal ? 'filled' : ''}`}
                    onClick={() => jumpToStep(idx)}
                    title={s.label}
                  >
                    <span className="pill-num">{idx + 1}</span>
                    <span className="pill-name">{s.label}</span>
                    {hasVal && <span className="pill-val">({values[idx]})</span>}
                  </button>
                );
              })}
            </div>

            {/* Split Walkthrough View: Visual Diagram on Left + Input on Right */}
            <div className="step-measure-grid">
              {/* Left Column: Dedicated Visual Guide */}
              <div className="step-visual-col">
                <MeasurementGuideVisual
                  diagramKey={step.diagramKey || step.label}
                  label={step.label}
                  instruction={step.instruction}
                  tip={step.tip}
                  typicalRange={step.typicalRange}
                  unit={unit}
                  studioImage={step.image || guide.coverImage}
                />
              </div>

              {/* Right Column: Step Instructions & Large Input */}
              <div className="step-input-col">
                <div className="step-badge-row">
                  <span className="step-counter-tag">
                    STEP {currentStep + 1} OF {guide.steps.length}
                  </span>
                  <span className="garment-type-tag">{guide.title}</span>
                </div>

                <h2 className="step-title">{step.label}</h2>
                {step.instruction && <p className="step-instruction">{step.instruction}</p>}

                {/* Main Interactive Input Card */}
                <div className="measurement-input-card">
                  <label htmlFor="current-measure-input" className="input-label">
                    Enter your {step.label} size in <strong>{unit}</strong>:
                  </label>

                  <div className="big-measure-input-row">
                    <input
                      id="current-measure-input"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0.1"
                      autoFocus
                      required
                      value={values[currentStep] || ''}
                      onChange={(e) => {
                        setErr('');
                        setValues({ ...values, [currentStep]: e.target.value });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleNextStep();
                        }
                      }}
                      placeholder="0.0"
                      className="big-num-input"
                    />
                    <span className="big-unit-label">{unit}</span>
                  </div>

                  {/* Touch Steppers for Rapid Mobile Adjustments */}
                  <div className="quick-steppers" aria-label="Quick adjust">
                    <button type="button" onClick={() => adjustValue(currentStep, -0.5)}>-0.5</button>
                    <button type="button" onClick={() => adjustValue(currentStep, -0.25)}>-0.25</button>
                    <button type="button" onClick={() => adjustValue(currentStep, 0.25)}>+0.25</button>
                    <button type="button" onClick={() => adjustValue(currentStep, 0.5)}>+0.5</button>
                  </div>

                  {err && (
                    <div className="alert" role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertCircle size={16} /> {err}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="step-nav-actions">
                    {currentStep > 0 && (
                      <button type="button" className="btn ghost" onClick={handlePrevStep}>
                        <ChevronLeft size={16} /> Previous
                      </button>
                    )}
                    <button type="button" className="btn next-step-btn" onClick={handleNextStep}>
                      {currentStep < guide.steps.length - 1 ? (
                        <>
                          Next: {guide.steps[currentStep + 1]?.label} <ChevronRight size={16} />
                        </>
                      ) : (
                        <>Review All Sizes & Submit →</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Overview preview of current progress */}
                <div className="recorded-so-far">
                  <h4>Recorded so far:</h4>
                  <div className="mini-chips">
                    {guide.steps.slice(0, currentStep).map((s, i) => (
                      <span key={i} className="mini-chip" onClick={() => jumpToStep(i)}>
                        {s.label}: <b>{values[i]} {unit}</b> <Edit3 size={11} style={{ display: 'inline', marginLeft: 3 }} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 4: OVERALL SIZE SUMMARY & SUBMISSION FORM */}
        {stage === 3 && isReviewing && (
          <motion.div
            key="stage-review"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="stage-top-bar">
              <button className="back-link" onClick={handlePrevStep}>
                <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: -2 }} /> Back to measurements
              </button>
              <div className="unit-toggle" role="group">
                <button
                  type="button"
                  className={unit === 'inches' ? 'on' : ''}
                  onClick={() => handleUnitToggle('inches')}
                >
                  Inches
                </button>
                <button
                  type="button"
                  className={unit === 'cm' ? 'on' : ''}
                  onClick={() => handleUnitToggle('cm')}
                >
                  CM
                </button>
              </div>
            </div>

            <div className="stage-intro">
              <span className="badge ok" style={{ marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} /> ALL STEPS COMPLETED
              </span>
              <h2>Overall Size Summary & Customer Details</h2>
              <p className="lead">
                Review your measurements below. You can click any measurement to edit it before sending directly to our master tailor.
              </p>
            </div>

            <form onSubmit={submit} className="review-and-submit-form">
              {/* Master Tailor Spec Table */}
              <div className="spec-review-card">
                <div className="spec-review-head">
                  <h3>Master Tailor Cut Sheet — {guide.title}</h3>
                  <span className="unit-badge">Unit: {unit.toUpperCase()}</span>
                </div>

                <div className="spec-table-grid">
                  {guide.steps.map((s, i) => (
                    <div key={i} className="spec-table-cell">
                      <div className="cell-info">
                        <span className="cell-num">{i + 1}.</span>
                        <span className="cell-label">{s.label}</span>
                      </div>
                      <div className="cell-actions">
                        <span className="cell-val">
                          <strong>{values[i] || '—'}</strong> {unit}
                        </span>
                        <button
                          type="button"
                          className="cell-edit-btn"
                          onClick={() => jumpToStep(i)}
                          title="Edit this size"
                        >
                          <Edit3 size={13} style={{ display: 'inline', verticalAlign: -1 }} /> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fit Preference Selector */}
              <div className="fit-pref-section">
                <h3>Select Fit Preference</h3>
                <div className="fit-chips">
                  {[
                    ['Slim Fit', 'Fitted silhouette with minimum ease for a sharp modern look.'],
                    ['Regular Fit', 'Classic tailoring with balanced breathing and sitting comfort.'],
                    ['Relaxed Fit', 'Generous traditional comfort fit with ample room.'],
                  ].map(([fitName, fitDesc]) => (
                    <button
                      key={fitName}
                      type="button"
                      className={`fit-chip ${form.fitPreference === fitName ? 'on' : ''}`}
                      onClick={() => setForm({ ...form, fitPreference: fitName })}
                    >
                      <b>{fitName}</b>
                      <span>{fitDesc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact Form */}
              <div className="customer-details-card">
                <h3>Customer & Occasion Details</h3>
                <p className="lead" style={{ marginBottom: 20 }}>
                  We will contact you via WhatsApp to confirm the fabric, design details, and dispatch date.
                </p>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="fn">Full Name *</label>
                    <input
                      id="fn"
                      required
                      value={form.customerName}
                      onChange={setField('customerName')}
                      placeholder="e.g. Karthik Sundaram"
                      autoComplete="name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ph">Phone / WhatsApp Number (with country code) *</label>
                    <input
                      id="ph"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={setField('phone')}
                      placeholder="+91 98401 23456"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="em">Email (optional)</label>
                    <input
                      id="em"
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="co">Country of Residence *</label>
                    <input
                      id="co"
                      required
                      value={form.country}
                      onChange={setField('country')}
                      placeholder="e.g. India, USA, UK, Singapore, Malaysia"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ci">City / Town</label>
                    <input
                      id="ci"
                      value={form.city}
                      onChange={setField('city')}
                      placeholder="e.g. Chennai, London, Toronto"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="occ">What is the dress for?</label>
                    <select id="occ" value={form.occasion} onChange={setField('occasion')}>
                      <option value="">Select occasion / function</option>
                      {categories.map((c) => (
                        <option key={c._id || c.slug} value={c.name}>{c.name}</option>
                      ))}
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Muhurtham / Temple Wedding">Muhurtham / Temple Wedding</option>
                      <option value="Housewarming / Pooja">Housewarming / Pooja</option>
                      <option value="Executive Daily Office">Executive Daily Office</option>
                      <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ed">Event / Need-By Date (Optional)</label>
                    <input
                      id="ed"
                      type="date"
                      value={form.eventDate}
                      onChange={setField('eventDate')}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ref">Liked Piece from Collection (Optional)</label>
                    <input
                      id="ref"
                      value={form.reference}
                      onChange={setField('reference')}
                      placeholder="e.g. The Emerald Windsor 3-Piece Suit"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="no">Special Tailoring Notes / Fabric Requests</label>
                  <textarea
                    id="no"
                    value={form.notes}
                    onChange={setField('notes')}
                    placeholder="Mention any specific collar style, cuff embroidery, preferred color, or special fit requirement..."
                  />
                </div>

                {err && (
                  <div className="alert" role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} /> {err}
                  </div>
                )}

                <div className="submit-action-bar">
                  <button type="submit" className="btn submit-measure-btn" disabled={busy}>
                    {busy ? 'Submitting to Master Tailor...' : '✓ Submit Measurements for Tailoring'}
                  </button>
                  <p className="privacy-note">
                    <ShieldCheck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                    Your measurements are securely sent directly to our studio atelier for tailoring.
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
