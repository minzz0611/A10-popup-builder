// Simple unique id generator
window.uid = function uid(prefix){
  return (prefix || 'id') + '_' + Math.random().toString(36).slice(2,9);
};

window.deepClone = function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
};

// Returns the ordered component-id list for whichever screen is currently
// open (hero screen, a section, or a section's sub-tab) — the same list
// both the canvas and the right-side property panel render from.
window.getComponentList = function getComponentList(state, activeSectionId, activeTabId){
  if(activeSectionId === null) return state.heroComponents || [];
  const sec = (state.sidebar||[]).find(s => s.id === activeSectionId);
  if(!sec) return [];
  const tab = activeTabId ? (sec.tabs||[]).find(t => t.id === activeTabId) : null;
  return tab ? (tab.components||[]) : (sec.components || []);
};

// Icon set (inline SVG components)
const IconSvg = ({ path, size = 16, stroke = 'currentColor', fill = 'none', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const Icons = {
  Plus: (p) => <IconSvg {...p} path="M12 5v14 M5 12h14" />,
  Trash: (p) => <IconSvg {...p} path="M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />,
  Copy: (p) => <IconSvg {...p} path="M9 9h10v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z M5 15V5a2 2 0 0 1 2-2h10" />,
  Save: (p) => <IconSvg {...p} path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" />,
  Download: (p) => <IconSvg {...p} path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />,
  Upload: (p) => <IconSvg {...p} path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
  Eye: (p) => <IconSvg {...p} path="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  Edit: (p) => <IconSvg {...p} path="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />,
  Grid: (p) => <IconSvg {...p} path="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />,
  Layers: (p) => <IconSvg {...p} path="M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />,
  Type: (p) => <IconSvg {...p} path="M4 7V4h16v3 M9 20h6 M12 4v16" />,
  Image: (p) => <IconSvg {...p} path="M3 3h18v18H3z M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M21 15l-5-5L5 21" />,
  Video: (p) => <IconSvg {...p} path="M23 7l-7 5 7 5V7z M1 5h15v14H1z" />,
  Table: (p) => <IconSvg {...p} path="M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18" />,
  List: (p) => <IconSvg {...p} path="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" />,
  Flow: (p) => <IconSvg {...p} path="M6 3h4v4H6z M14 10h4v4h-4z M6 17h4v4H6z M8 7v10 M10 12h4" />,
  Star: (p) => <IconSvg {...p} path="M12 2l3 7 7 .5-5 5 2 7-7-4-7 4 2-7-5-5 7-.5 3-7z" />,
  User: (p) => <IconSvg {...p} path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  Quote: (p) => <IconSvg {...p} path="M3 21c3-3 3-9 3-9H3v-6h6v6c0 3 0 6-3 9z M15 21c3-3 3-9 3-9h-3v-6h6v6c0 3 0 6-3 9z" />,
  Heading: (p) => <IconSvg {...p} path="M6 4v16 M18 4v16 M6 12h12" />,
  ChevronUp: (p) => <IconSvg {...p} path="M6 15l6-6 6 6" />,
  ChevronDown: (p) => <IconSvg {...p} path="M6 9l6 6 6-6" />,
  X: (p) => <IconSvg {...p} path="M18 6L6 18 M6 6l12 12" />,
  Move: (p) => <IconSvg {...p} path="M5 9l-3 3 3 3 M9 5l3-3 3 3 M15 19l-3 3-3-3 M19 9l3 3-3 3 M2 12h20 M12 2v20" />,
  Settings: (p) => <IconSvg {...p} path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
  Zap: (p) => <IconSvg {...p} path="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  Target: (p) => <IconSvg {...p} path="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  MessageCircle: (p) => <IconSvg {...p} path="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  File: (p) => <IconSvg {...p} path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  Square: (p) => <IconSvg {...p} path="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />,
};
window.Icons = Icons;
