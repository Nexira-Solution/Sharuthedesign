import { themeVars, fontsHref } from '@/lib/theme';

// Server component: turns admin settings into CSS variables + Google Font link.
export default function ThemeStyle({ s }) {
  const t = themeVars(s);
  const css = `
.theme{--c-primary:${t.primary};--c-accent:${t.accent};--c-bg:${t.bg};--c-text:${t.text};--c-dark:${t.dark};
--font-display:'${t.display}',Georgia,serif;--font-body:'${t.body}',system-ui,sans-serif;--hero-overlay:${t.overlay};
background:var(--c-bg);color:var(--c-text);font-family:var(--font-body)}
.theme h1,.theme h2,.theme h3{font-family:var(--font-display)}
.theme [class*="home_btn__"]{background:var(--c-primary);border-color:var(--c-primary);color:#fff}
.theme [class*="home_btnGhost__"]{background:transparent;color:var(--c-primary)}
.theme [class*="home_dark__"]{background:var(--c-dark);color:#fff}
.theme [class*="home_dark__"] [class*="home_btnGhost__"]{color:#fff;border-color:#fff}
.theme [class*="home_tape__"]{background:var(--c-accent);color:var(--c-dark)}
.theme [class*="home_heroBg__"]::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,var(--hero-overlay))}
.theme a{color:inherit}`;
  return (
    <>
      <link rel="stylesheet" href={fontsHref(t)} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}