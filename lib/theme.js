// Fonts the admin can choose from. All support weights 400-700 on Google Fonts.
export const FONTS = ['Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Lora', 'Inter', 'Poppins', 'Montserrat', 'Raleway', 'Jost', 'Josefin Sans'];
const HEX = /^#[0-9a-f]{3,8}$/i;
const safeColor = (v, fb) => (HEX.test(v || '') ? v : fb);
const safeFont = (v, fb) => (FONTS.includes(v) ? v : fb);

export function themeVars(s) {
  return {
    primary: safeColor(s.colorPrimary, '#7a1f3d'), accent: safeColor(s.colorAccent, '#c9a24b'),
    bg: safeColor(s.colorBg, '#fbf7f2'), text: safeColor(s.colorText, '#2a1a1f'), dark: safeColor(s.colorDark, '#2b0f1a'),
    display: safeFont(s.fontDisplay, 'Playfair Display'), body: safeFont(s.fontBody, 'Inter'),
    overlay: Math.min(0.9, Math.max(0, parseFloat(s.heroOverlay) || 0.45)),
  };
}

export const fontsHref = (t) => {
  const fam = [...new Set([t.display, t.body])].map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`).join('&');
  return `https://fonts.googleapis.com/css2?${fam}&display=swap`;
};