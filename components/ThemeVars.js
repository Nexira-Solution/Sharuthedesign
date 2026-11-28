// Put once in app/layout.jsx, inside <body>:   <ThemeVars s={settings} />
// Feeds the admin colors into every page that uses the --t-* variables
// (home, collections, product detail, measurements, ...).
const HEX = /^#[0-9a-f]{3,8}$/i;

const MAP = {
  colorDark: '--t-dark',        // buttons, header bands, dark cards
  colorBg: '--t-bg',            // page background (cream)
  colorAccent: '--t-accent',    // dashed borders, highlights, hover
  colorPrimary: '--t-accent-text', // small accent text / icons
  colorCard: '--t-card',        // white cards (optional)
};

export default function ThemeVars({ s = {} }) {
  const decl = Object.entries(MAP)
    .filter(([k]) => HEX.test(String(s[k] || '').trim()))
    .map(([k, v]) => `${v}:${String(s[k]).trim()}`)
    .join(';');
  if (!decl) return null;
  return <style dangerouslySetInnerHTML={{ __html: `:root{${decl}}` }} />;
}