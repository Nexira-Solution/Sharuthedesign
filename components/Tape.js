'use client';
import { motion } from 'framer-motion';

// Measuring-tape strip: the one signature motion on the site (draws in once on load)
export default function Tape() {
  return (
    <motion.div className="tape" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}>
      <i />
      {Array.from({ length: 24 }, (_, n) => <b key={n} style={{ left: n * 120 }}>{n}</b>)}
    </motion.div>
  );
}
