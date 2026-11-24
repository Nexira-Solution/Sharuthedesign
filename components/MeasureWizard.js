'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2, ChevronLeft, ChevronRight, Sparkles, MessageCircle, Check,
  Edit3, AlertCircle, ShieldCheck, Shirt, Heart, Smile, Users,
} from 'lucide-react';
import Img from './Img';
import MeasurementGuideVisual from './MeasurementGuideVisual';
import { api } from '@/lib/api';
import './MeasureWizard.css';

const AUD = [
  {
    key: 'men', label: 'Men', icon: Shirt,
    note: 'Shirts, Jiffa, Office Combos, Suits, Pants, Tracks',
    cover: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'women', label: 'Women', icon: Heart,
    note: 'Blouses, Kurtis, Salwars, Lehengas, Gowns, Office Suits',
    cover: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'kids', label: 'Kids', icon: Smile,
    note: 'Boys Kurta & Suits, Girls Pattu Pavadai, Princess Frocks',
    cover: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'family', label: 'Family & Groups', icon: Users,
    note: 'Couple Sets, Dad & Son, Mom & Daughter, Full Family Matching',
    cover: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80',
  },
];

const FITS = [
  ['Slim Fit', 'Fitted, with minimum ease for a sharp modern look.'],
  ['Regular Fit', 'Classic tailoring with balanced comfort.'],
  ['Relaxed Fit', 'Generous traditional fit with ample room.'],
];

const OCCASIONS = [
  'Wedding Reception', 'Muhurtham / Temple Wedding', 'Housewarming / Pooja',
  'Executive Daily Office', 'Birthday / Anniversary', 'Other',
];

const blankForm = {
  customerName: '', phone: '', email: '', country: 'India', city: '',
  occasion: '', eventDate: '', fitPreference: 'Regular Fit', reference: '', notes: '',
};

const matchesAudience = (g, key) =>
  key === 'family' ? g.audience === 'family' || g.audience === 'family-group' : g.audience === key;

const Alert = ({ children }) => (
  <div className="mw-alert" role="alert"><AlertCircle size={16} /> <span>{children}</span></div>
);

export default function MeasureWizard({ guides = [], categories = [], initialAudience = '', whatsapp = '' }) {
  const [audience, setAudience] = useState(AUD.some((a) => a.key === initialAudience) ? initialAudience : '');
  const [guide, setGuide] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({});
  const [unit, setUnit] = useState('inches');
  const [form, setForm] = useState(blankForm);
  const [isReviewing, setIsReviewing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [doneData, setDoneData] = useState(null);

  // 1 = who, 2 = measure, 3 = review
  const stage = !audience || !guide ? 1 : !isReviewing ? 2 : 3;
  const audLabel = AUD.find((a) => a.key === audience)?.label;

  const pickAudience = (key) => {
    setAudience(key);
    const chosen = guides.filter((g) => matchesAudience(g, key))[0] || null;
    setGuide(chosen);
    setCurrentStep(0);
    setValues({});
    if (chosen?.unit) setUnit(chosen.unit);
    setIsReviewing(false);
  };

  useEffect(() => {
    if (initialAudience && AUD.some((a) => a.key === initialAudience) && !guide && guides.length > 0) pickAudience(initialAudience);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAudience, guides]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, currentStep, isReviewing, doneData]);

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const resetToStart = () => { setAudience(''); setGuide(null); setIsReviewing(false); };

  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    const factor = newUnit === 'cm' ? 2.54 : 1 / 2.54;
    const converted = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v && !isNaN(v)) converted[k] = (parseFloat(v) * factor).toFixed(1);
    });
    setValues(converted);
    setUnit(newUnit);
  };

  const adjustValue = (idx, delta) => {
    const cur = parseFloat(values[idx] || 0);
    const updated = Math.max(0, cur + delta).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    setValues({ ...values, [idx]: updated });
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    const cur = values[currentStep];
    if (!cur || parseFloat(cur) <= 0) {
      setErr(`Please enter your ${guide.steps[currentStep]?.label} measurement to continue.`);
      return;
    }
    setErr('');
    if (currentStep < guide.steps.length - 1) setCurrentStep((p) => p + 1);
    else setIsReviewing(true);
  };

  const handlePrevStep = () => {
    setErr('');
    if (isReviewing) { setIsReviewing(false); setCurrentStep(guide.steps.length - 1); }
    else if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const jumpToStep = (idx) => { setErr(''); setIsReviewing(false); setCurrentStep(idx); };

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const measurementList = guide.steps.map((s, i) => ({ label: s.label, value: values[i] || '0', unit, stepIndex: i + 1 }));
    try {
      const res = await api('/api/submissions', 'POST', {
        ...form, audience, unit, guide: guide._id, guideTitle: guide.title, measurements: measurementList,
      });
      setDoneData({
        ticketId: res.ticketId || `SHARU-${(res.id || '').slice(-6).toUpperCase()}`,
        customerName: form.customerName, phone: form.phone, guideTitle: guide.title, unit, measurements: measurementList,
      });
    } catch (x) {
      setErr(x.message || 'Failed to submit measurements. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  /* ---------- Confirmation ---------- */
  if (doneData) {
    const waNumber = String(whatsapp || '919876543210').replace(/\D/g, '');
    const waText = encodeURIComponent(
      `Hello Sharu The Design Studio,\nI have submitted my measurements for *${doneData.guideTitle}*.\n` +
      `Ticket ID: *${doneData.ticketId}*\nCustomer: ${doneData.customerName}\nPhone: ${doneData.phone}\n` +
      `Sizes (${doneData.unit}):\n` +
      doneData.measurements.map((m) => `• ${m.label}: ${m.value} ${doneData.unit}`).join('\n') +
      `\nPlease review and confirm tailoring timeline.`
    );
    return (
      <div className={`mw-root mw-confirm`}>
        <div className="mw-confirmIcon"><Sparkles size={34} /></div>
        <span className="mw-ticket">TICKET {doneData.ticketId}</span>
        <h2>Measurements received</h2>
        <p className="mw-lead">
          Thank you, <strong>{doneData.customerName}</strong>. Your measurements for <strong>{doneData.guideTitle}</strong> are with our master tailors.
        </p>
        {/* Order tracking card: re-add here when /track goes live */}
        <div className="mw-specsBox">
          <h4>Recorded measurements ({doneData.unit})</h4>
          <div className="mw-specsGrid">
            {doneData.measurements.map((m, i) => (
              <div key={i} className="mw-specRow">
                <span>{m.label}</span>
                <span><strong>{m.value}</strong> {doneData.unit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mw-actions">
          <a className="mw-btn" href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> Send to tailor on WhatsApp
          </a>
          <button
            type="button"
            className={`mw-btn mw-ghost`}
            onClick={() => { setDoneData(null); resetToStart(); setValues({}); setForm(blankForm); }}
          >
            Measure another garment
          </button>
        </div>
      </div>
    );
  }

  const step = guide?.steps?.[currentStep];
  const progressPercent = guide ? Math.round(((currentStep + (isReviewing ? 1 : 0)) / guide.steps.length) * 100) : 0;
  const tabCls = (n) => `mw-tab ${stage === n ? 'mw-tabOn' : stage > n ? 'mw-tabDone' : ''}`;

  const unitToggle = (
    <div className="mw-units" role="group" aria-label="Measurement unit">
      <button type="button" className={unit === 'inches' ? 'mw-on' : ''} onClick={() => handleUnitToggle('inches')}>Inches</button>
      <button type="button" className={unit === 'cm' ? 'mw-on' : ''} onClick={() => handleUnitToggle('cm')}>cm</button>
    </div>
  );

  return (
    <div className="mw-root">
      <div className="mw-head">
        <div className="mw-stepper" aria-label="Progress">
          <button type="button" className={tabCls(1)} onClick={() => stage > 1 && resetToStart()} disabled={stage === 1}>
            <i>{stage > 1 ? <Check size={14} /> : 1}</i>
            <span>Who</span>
          </button>
          <button type="button" className={tabCls(2)} onClick={() => isReviewing && setIsReviewing(false)} disabled={stage < 3}>
            <i>{stage > 2 ? <Check size={14} /> : 2}</i>
            <span>Measure</span>
          </button>
          <span className={tabCls(3)}>
            <i>3</i>
            <span>Review</span>
          </span>
        </div>

        {guide && (
          <div>
            <div className="mw-track"><div className="mw-bar" style={{ width: `${progressPercent}%` }} /></div>
            <div className="mw-pmeta">
              <span>{isReviewing ? 'All measurements recorded' : step?.label}</span>
              <span>{isReviewing ? '100%' : `${currentStep + 1} of ${guide.steps.length}`}</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: who */}
        {stage === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="mw-intro">
              <h2>Who are you measuring for?</h2>
              <p className="mw-lead">Choose a group to begin.</p>
            </div>
            <div className="mw-audGrid">
              {AUD.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.key} type="button" className="mw-aud" onClick={() => pickAudience(a.key)}>
                    <div className="mw-audPic">
                      <Img src={a.cover} alt="" w={600} />
                      <span className="mw-audBadge"><Icon size={18} /></span>
                    </div>
                    <h3>{a.label}</h3>
                    <span>Start measuring</span>
                    <p className="mw-audNote">{a.note}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STAGE 2: measure */}
        {stage === 2 && step && (
          <motion.div key={`step-${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="mw-topBar">
              <button type="button" className="mw-back" onClick={resetToStart}>
                <ChevronLeft size={18} /> {audLabel}
              </button>
              {unitToggle}
            </div>

            <div className="mw-pills">
              {guide.steps.map((s, idx) => {
                const hasVal = values[idx] && parseFloat(values[idx]) > 0;
                return (
                  <button key={idx} type="button" className={`mw-pill ${idx === currentStep ? 'mw-active' : ''} ${hasVal ? 'mw-filled' : ''}`} onClick={() => jumpToStep(idx)}>
                    <b>{hasVal && idx !== currentStep ? <Check size={14} /> : idx + 1}</b>
                    <span>{s.label}</span>
                    {hasVal && <em>{values[idx]}</em>}
                  </button>
                );
              })}
            </div>

            <div className="mw-stepGrid">
              <div className="mw-visual">
                <MeasurementGuideVisual
                  diagramKey={step.diagramKey || step.label}
                  label={step.label}
                  instruction={step.instruction}
                  tip={step.tip}
                  typicalRange={step.typicalRange}
                  unit={unit}
                  stepImage={step.image}
                />
              </div>

              <div className="mw-entry">
                <div>
                  <p className="mw-garment">{guide.title}</p>
                  <h2>{step.label}</h2>
                </div>
                {step.instruction && <p className="mw-instr">{step.instruction}</p>}

                <div className="mw-inputCard">
                  <label htmlFor="current-measure-input">Your {step.label} in {unit}</label>
                  <div className="mw-bigRow">
                    <input
                      id="current-measure-input"
                      className="mw-bigInput"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0.1"
                      autoFocus
                      required
                      value={values[currentStep] || ''}
                      onChange={(e) => { setErr(''); setValues({ ...values, [currentStep]: e.target.value }); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleNextStep(); } }}
                      placeholder="0.0"
                    />
                    <span className="mw-bigUnit">{unit}</span>
                  </div>

                  <div className="mw-steppers" aria-label="Quick adjust">
                    <button type="button" onClick={() => adjustValue(currentStep, -0.5)}>-0.5</button>
                    <button type="button" onClick={() => adjustValue(currentStep, -0.25)}>-0.25</button>
                    <button type="button" onClick={() => adjustValue(currentStep, 0.25)}>+0.25</button>
                    <button type="button" onClick={() => adjustValue(currentStep, 0.5)}>+0.5</button>
                  </div>

                  {err && <Alert>{err}</Alert>}

                  <div className="mw-nav">
                    {currentStep > 0 && (
                      <button type="button" className={`mw-btn mw-ghost`} onClick={handlePrevStep} aria-label="Previous">
                        <ChevronLeft size={18} />
                      </button>
                    )}
                    <button type="button" className="mw-btn" onClick={handleNextStep}>
                      {currentStep < guide.steps.length - 1 ? <>Next <ChevronRight size={18} /></> : <>Review sizes</>}
                    </button>
                  </div>
                </div>

                {currentStep > 0 && (
                  <div className="mw-recorded">
                    <h4>Recorded so far</h4>
                    <div className="mw-chips">
                      {guide.steps.slice(0, currentStep).map((s, i) => (
                        <button key={i} type="button" className="mw-chipBtn" onClick={() => jumpToStep(i)}>
                          {s.label}: <b>{values[i]} {unit}</b> <Edit3 size={12} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: review */}
        {stage === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="mw-topBar">
              <button type="button" className="mw-back" onClick={handlePrevStep}>
                <ChevronLeft size={18} /> Back
              </button>
              {unitToggle}
            </div>

            <div className="mw-intro">
              <h2>Review and send</h2>
              <p className="mw-lead">Tap Edit on any size to change it before sending.</p>
            </div>

            <form onSubmit={submit} className="mw-form">
              <div className="mw-card">
                <div className="mw-cardHead">
                  <h3>{guide.title}</h3>
                  <span className="mw-unitTag">{unit.toUpperCase()}</span>
                </div>
                <div className="mw-sheet">
                  {guide.steps.map((s, i) => (
                    <div key={i} className="mw-cell">
                      <span><small>{i + 1}</small><em>{s.label}</em></span>
                      <span className="mw-cellR">
                        <span><strong>{values[i] || '—'}</strong> {unit}</span>
                        <button type="button" className="mw-edit" onClick={() => jumpToStep(i)}><Edit3 size={13} /> Edit</button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: 12 }}>Fit preference</h3>
                <div className="mw-fits">
                  {FITS.map(([name, desc]) => (
                    <button key={name} type="button" className={`mw-fit ${form.fitPreference === name ? 'mw-fitOn' : ''}`} onClick={() => setForm({ ...form, fitPreference: name })}>
                      <b>{name}</b>
                      <span>{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mw-card">
                <h3 style={{ marginBottom: 16 }}>Your details</h3>
                <div className="mw-formGrid">
                  <div className="mw-field">
                    <label htmlFor="fn">Full name *</label>
                    <input id="fn" required value={form.customerName} onChange={setField('customerName')} placeholder="e.g. Karthik Sundaram" autoComplete="name" />
                  </div>
                  <div className="mw-field">
                    <label htmlFor="ph">WhatsApp number with country code *</label>
                    <input id="ph" required type="tel" value={form.phone} onChange={setField('phone')} placeholder="+91 98401 23456" autoComplete="tel" />
                  </div>
                  <div className="mw-field">
                    <label htmlFor="em">Email (optional)</label>
                    <input id="em" type="email" value={form.email} onChange={setField('email')} placeholder="name@example.com" autoComplete="email" />
                  </div>
                  <div className="mw-field">
                    <label htmlFor="co">Country *</label>
                    <input id="co" required value={form.country} onChange={setField('country')} placeholder="e.g. India, USA, UK" />
                  </div>
                  <div className="mw-field">
                    <label htmlFor="ci">City</label>
                    <input id="ci" value={form.city} onChange={setField('city')} placeholder="e.g. Chennai, London" />
                  </div>
                  <div className="mw-field">
                    <label htmlFor="occ">What is it for?</label>
                    <select id="occ" value={form.occasion} onChange={setField('occasion')}>
                      <option value="">Select occasion</option>
                      {categories.map((c) => (<option key={c._id || c.slug} value={c.name}>{c.name}</option>))}
                      {OCCASIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                  <div className="mw-field">
                    <label htmlFor="ed">Need-by date (optional)</label>
                    <input id="ed" type="date" value={form.eventDate} onChange={setField('eventDate')} />
                  </div>
                  <div className="mw-field">
                    <label htmlFor="ref">Piece you liked (optional)</label>
                    <input id="ref" value={form.reference} onChange={setField('reference')} placeholder="e.g. The Emerald Windsor 3-Piece Suit" />
                  </div>
                </div>

                <div className="mw-field">
                  <label htmlFor="no">Notes for the tailor</label>
                  <textarea id="no" value={form.notes} onChange={setField('notes')} placeholder="Collar style, embroidery, colour or any fit request" />
                </div>

                {err && <div style={{ marginTop: 14 }}><Alert>{err}</Alert></div>}

                <div className="mw-submit">
                  <button type="submit" className="mw-btn" disabled={busy}>
                    {busy ? 'Submitting...' : <><CheckCircle2 size={18} /> Submit measurements</>}
                  </button>
                  <p className="mw-note"><ShieldCheck size={15} /> Your measurements go straight to our studio. We will confirm fabric and dates on WhatsApp.</p>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}