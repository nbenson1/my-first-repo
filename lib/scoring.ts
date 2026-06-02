export interface ScoreResult {
  score: number;
  matchReasons: string[];
  missingKeywords: string[];
}

const PREFERRED_LOCATIONS = [
  'iowa', 'cedar rapids', 'ames', 'des moines', 'bellevue',
  'illinois', 'chicago', 'rockford',
  'minnesota', 'minneapolis', 'saint paul',
  'remote',
];

const TARGET_COMPANIES = [
  'collins', 'boeing', 'northrop', 'lockheed', 'ge aerospace', 'ge aviation',
  'honeywell', 'garmin', 'textron', 'raytheon', 'l3harris', 'spirit aerosystems',
  'parker hannifin', 'moog', 'ducommun', 'heico', 'transdigm',
];

const TARGET_TITLES = [
  'manufacturing engineer', 'industrial engineer', 'npi', 'new product introduction',
  'systems engineer', 'quality engineer', 'nde engineer', 'ndt engineer',
  'avionics engineer', 'mechanical engineer', 'test engineer',
  'aerospace engineer', 'process engineer', 'design engineer',
];

// Map: keyword to look for in job text → reason string shown to user
const SKILL_SIGNALS: [string, string][] = [
  ['solidworks', 'SOLIDWORKS proficiency (used daily at Collins co-op) matches requirement'],
  ['onshape', 'Onshape CAD experience (senior design project) matches requirement'],
  ['gd&t', 'GD&T expertise — verified manufacturability at Collins — matches requirement'],
  ['geometric dimensioning', 'GD&T expertise (Collins co-op) matches requirement'],
  ['lean', 'Lean Manufacturing experience (Collins co-op) matches requirement'],
  ['5s', '5S Methodology experience (Collins co-op) matches requirement'],
  ['nde', 'NDE Minor + hands-on ultrasonic inspection experience is a direct match'],
  ['nondestructive', 'NDE Minor + ultrasonic inspection (ASTM D7264) matches requirement'],
  ['non-destructive', 'NDE Minor + ultrasonic inspection experience matches requirement'],
  ['ultrasonic', 'Ultrasonic inspection experience from composite NDE project matches requirement'],
  ['avionics', 'Avionics manufacturing experience (8-month Collins co-op) matches requirement'],
  ['composite', 'Composite fabrication and NDE inspection experience matches requirement'],
  ['matlab', 'MATLAB proficiency matches requirement'],
  ['manufacturing', 'Manufacturing engineering background (Collins co-op) matches requirement'],
  ['tooling', 'Tooling & fixture design/installation experience from Collins co-op matches'],
  ['fixture', 'Fixture design and installation experience from Collins co-op matches'],
  ['process improvement', 'Process improvement experience (smart torque rollout at Collins) matches'],
  ['quality', 'Quality mindset developed in regulated AS9100 aerospace environment'],
  ['inspection', 'Inspection experience from NDE Minor and composite project matches'],
  ['aerospace', 'Aerospace Engineering degree and real aerospace industry experience match'],
  ['structures', 'Structural load path analysis experience (senior design project) matches'],
];

const GAP_SIGNALS: [string, string][] = [
  ['python', 'Python (not on resume — consider adding if you have any experience)'],
  ['labview', 'LabVIEW'],
  ['catia', 'CATIA V5 (SOLIDWORKS experience may partially offset this)'],
  ['simulink', 'Simulink (have MATLAB — Simulink is an add-on you could learn quickly)'],
  ['ndt level ii', 'NDT Level II Certification (your NDE Minor is strong prep for this)'],
  ['level ii', 'NDT Level II Certification (NDE Minor is strong preparation)'],
  ['security clearance', 'Security Clearance (many companies sponsor new hires — apply anyway)'],
  ['secret clearance', 'Security Clearance (many companies sponsor — still apply)'],
  ['six sigma', 'Six Sigma Certification (Green Belt recommended for manufacturing roles)'],
  ['as9100', 'AS9100 formal audit experience (you worked in an AS9100 environment at Collins)'],
  ['erp', 'ERP/MES Systems (SAP, Oracle)'],
  ['fea', 'Finite Element Analysis software (Abaqus, Nastran)'],
  ['doors', 'DOORS requirements management tool'],
  ['mbse', 'Model-Based Systems Engineering (MBSE)'],
];

export function scoreJob(
  title: string,
  company: string,
  location: string,
  description: string,
  requiredSkills: string[],
  isRemote: boolean,
): ScoreResult {
  const fullText = [title, company, description, ...requiredSkills].join(' ').toLowerCase();
  const titleLower = title.toLowerCase();
  const companyLower = company.toLowerCase();
  const locationLower = (location + (isRemote ? ' remote' : '')).toLowerCase();

  let score = 0;
  const matchReasons: string[] = [];
  const missingKeywords: string[] = [];

  // Title match — 0 to 25 pts
  const titleMatch = TARGET_TITLES.find(t => titleLower.includes(t));
  if (titleMatch) {
    score += 25;
    matchReasons.push(`Title "${title}" aligns with your target roles`);
  } else if (titleLower.includes('engineer')) {
    score += 12;
  }

  // Location match — 0 to 20 pts
  const locationMatch = PREFERRED_LOCATIONS.find(l => locationLower.includes(l));
  if (isRemote || locationLower.includes('remote')) {
    score += 15;
    matchReasons.push('Remote position — flexible work arrangement');
  } else if (locationMatch) {
    const label =
      locationLower.includes('iowa') || locationLower.includes('cedar rapids') || locationLower.includes('ames')
        ? 'Iowa (top preferred area)'
        : locationLower.includes('illinois') || locationLower.includes('chicago') || locationLower.includes('rockford')
        ? 'Illinois (preferred area)'
        : 'Minnesota (preferred area)';
    score += 20;
    matchReasons.push(`Location in ${label}`);
  }

  // Company match — 0 to 10 pts
  const companyMatch = TARGET_COMPANIES.find(c => companyLower.includes(c));
  if (companyMatch) {
    score += 10;
    matchReasons.push(`${company} is in your target company list`);
  }

  // Skills match — 0 to 35 pts, max 5 reasons
  let skillPts = 0;
  for (const [keyword, reason] of SKILL_SIGNALS) {
    if (fullText.includes(keyword)) {
      const pts = Math.min(7, 35 - skillPts);
      skillPts += pts;
      if (matchReasons.length < 7) matchReasons.push(reason);
      if (skillPts >= 35) break;
    }
  }
  score += skillPts;

  // Entry-level bonus — 0 to 10 pts
  if (
    fullText.includes('entry level') || fullText.includes('entry-level') ||
    fullText.includes('new grad') || fullText.includes('junior') ||
    fullText.includes('early career') || fullText.includes('associate engineer') ||
    /engineer i\b/.test(fullText) || fullText.includes('recent graduate')
  ) {
    score += 10;
    matchReasons.push('Entry-level / early career role fits your December 2026 graduation');
  }

  // Gap detection
  const seenGaps = new Set<string>();
  for (const [keyword, gap] of GAP_SIGNALS) {
    if (fullText.includes(keyword) && !seenGaps.has(gap)) {
      missingKeywords.push(gap);
      seenGaps.add(gap);
    }
  }

  return {
    score: Math.min(Math.max(score, 10), 98),
    matchReasons: matchReasons.slice(0, 6),
    missingKeywords: missingKeywords.slice(0, 5),
  };
}
