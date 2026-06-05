import { Job, UserProfile } from '@/types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'New Grad Systems Engineer',
    company: 'Collins Aerospace',
    location: 'Cedar Rapids, IA',
    remote: 'Hybrid',
    postedDate: '2026-05-30',
    salary: '$72,000 - $88,000',
    fitScore: 94,
    matchReasons: [
      'Cedar Rapids, IA is your top preferred location — Collins HQ is minutes away',
      'Your 8-month Collins Aerospace co-op at Bellevue, IA gives direct company familiarity',
      'Entry-level / new-grad role aligns with December 2026 graduation',
      'SOLIDWORKS modeling experience (tooling, fixtures, production layouts) matches CAD requirements',
      'GD&T proficiency — verified manufacturability and interface fit at Collins — is explicitly required',
      'Avionics integration background from co-op matches the avionics systems focus',
    ],
    missingKeywords: ['DO-178C', 'Model-Based Systems Engineering (MBSE)', 'Requirements Management Tools (DOORS)'],
    description:
      'Join Collins Aerospace as a New Graduate Systems Engineer working on next-generation avionics systems. You will collaborate with cross-functional teams to define system requirements, conduct trade studies, and support integration testing of flight-critical hardware and software.',
    requiredSkills: ['Systems Engineering', 'MATLAB', 'Technical Documentation', 'GD&T'],
    preferredSkills: ['SOLIDWORKS', 'DO-178C', 'MBSE', 'Avionics'],
    status: 'New',
    url: '#',
    department: 'Avionics Systems',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '2',
    title: 'Manufacturing Engineer I – New Product Introduction',
    company: 'GE Aerospace',
    location: 'Evendale, OH',
    remote: 'On-site',
    postedDate: '2026-05-29',
    salary: '$68,000 - $82,000',
    fitScore: 90,
    matchReasons: [
      'NPI focus directly matches your Collins co-op scope — tooling, fixture installation, process standardization',
      'SOLIDWORKS modeling for tooling and production layouts is a direct skill match',
      'Led Lean/5S-adjacent process improvements (smart torque tooling rollout) at Collins',
      'GD&T interpretation and manufacturability verification are core strengths from real aerospace work',
      'GE Aerospace is a top-10 target company',
    ],
    missingKeywords: ['AS9100 audit experience', 'ERP/MES Systems', 'Six Sigma Green Belt certification'],
    description:
      'GE Aerospace is seeking a Manufacturing Engineer I to support New Product Introduction (NPI) activities for commercial and military jet engine components. You will work with design teams to develop manufacturing processes, tooling, and production plans.',
    requiredSkills: ['SOLIDWORKS', 'Manufacturing Processes', 'Lean Manufacturing', 'NPI'],
    preferredSkills: ['AS9100', 'Six Sigma', 'ERP', 'GD&T'],
    status: 'Interested',
    url: '#',
    department: 'Manufacturing Engineering',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '3',
    title: 'Flight Controls Engineer – New Graduate',
    company: 'Boeing',
    location: 'St. Louis, MO',
    remote: 'Hybrid',
    postedDate: '2026-05-28',
    salary: '$74,000 - $91,000',
    fitScore: 72,
    matchReasons: [
      'Aerospace Engineering degree is required and directly matches',
      'MATLAB listed on your resume — required for simulation work',
      'New graduate program aligns with December 2026 graduation timeline',
    ],
    missingKeywords: ['Python (not on resume — frequently required)', 'Simulink', 'Control Systems coursework', 'Flight test experience'],
    description:
      'Boeing is hiring new graduate Flight Controls Engineers for our defense programs. You will develop and verify flight control laws, perform simulation studies, and support flight test activities. Must have strong analytical and programming skills.',
    requiredSkills: ['MATLAB', 'Python', 'Control Theory', 'Aerospace Engineering'],
    preferredSkills: ['Simulink', 'Flight Test', 'DO-178C', 'C++'],
    status: 'Applied',
    url: '#',
    department: 'Flight Systems',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '4',
    title: 'Quality Engineer – NDE Specialist',
    company: 'Honeywell',
    location: 'Minneapolis, MN',
    remote: 'On-site',
    postedDate: '2026-05-27',
    salary: '$65,000 - $79,000',
    fitScore: 95,
    matchReasons: [
      'NDE Minor at Iowa State is a rare, highly specific credential for this exact role',
      'Fabricated and inspected composite laminates using ultrasonic inspection (ASTM D7264) — real NDE lab experience',
      'Minneapolis, MN is a preferred location',
      'Collins co-op in regulated aerospace environment shows quality-mindset working background',
      'GD&T and engineering drawing interpretation are core NDE/quality competencies',
      'Lean Manufacturing and 5S experience directly supports quality engineering workflow',
    ],
    missingKeywords: ['NDT Level II Certification', 'CMM Operation', 'PPAP documentation', 'Radiographic Testing (RT)'],
    description:
      'Honeywell Aerospace is looking for a Quality Engineer specializing in Non-Destructive Evaluation (NDE) for aerospace components. You will develop inspection plans, analyze defects, and work with suppliers to maintain quality standards.',
    requiredSkills: ['NDE/NDT', 'Quality Systems', 'Technical Documentation', 'GD&T'],
    preferredSkills: ['AS9100', 'PPAP', 'CMM', 'Six Sigma'],
    status: 'New',
    url: '#',
    department: 'Quality Assurance',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '5',
    title: 'Avionics Systems Engineer',
    company: 'Garmin',
    location: 'Olathe, KS',
    remote: 'Hybrid',
    postedDate: '2026-05-26',
    salary: '$70,000 - $86,000',
    fitScore: 78,
    matchReasons: [
      'Avionics integration experience from 8-month Collins co-op is directly relevant',
      'SOLIDWORKS and Onshape CAD skills meet modeling requirements',
      'GD&T and manufacturability background supports hardware design work',
      'Garmin is a target company',
    ],
    missingKeywords: ['Python (not on resume)', 'DO-254 / DO-178 certification process', 'VHDL or embedded firmware', 'FAA regulatory knowledge'],
    description:
      'Garmin is seeking an Avionics Systems Engineer to support development of certified aircraft navigation and communication systems. You will define system requirements, coordinate with hardware and software teams, and support DO-254/DO-178 certification activities.',
    requiredSkills: ['Systems Engineering', 'Avionics', 'Python', 'MATLAB'],
    preferredSkills: ['DO-254', 'DO-178', 'FAA Regulations', 'VHDL'],
    status: 'New',
    url: '#',
    department: 'Aviation Systems',
    experienceLevel: 'Entry-Level',
    saved: false,
  },
  {
    id: '6',
    title: 'Test Engineer – Structural Systems',
    company: 'Northrop Grumman',
    location: 'Melbourne, FL',
    remote: 'On-site',
    postedDate: '2026-05-25',
    salary: '$76,000 - $94,000',
    fitScore: 74,
    matchReasons: [
      'Composite manufacturing and NDE testing project demonstrates hands-on test planning and execution',
      'Ultrasonic inspection experience (ASTM D7264) is directly applicable to structural test work',
      'Aerospace Engineering degree is required',
      'MATLAB listed — needed for data processing and test analysis',
    ],
    missingKeywords: ['LabVIEW', 'NI DAQ hardware', 'Formal structural test procedures', 'Security Clearance eligibility'],
    description:
      'Northrop Grumman seeks a Test Engineer to plan, execute, and analyze structural tests for next-generation defense aircraft programs. You will develop test plans, set up data acquisition systems, and generate test reports supporting airworthiness certification.',
    requiredSkills: ['Test Engineering', 'MATLAB', 'Aerospace Engineering', 'Data Analysis'],
    preferredSkills: ['LabVIEW', 'NI DAQ', 'Python', 'Structural Analysis'],
    status: 'New',
    url: '#',
    department: 'Structural Test',
    experienceLevel: 'Entry-Level',
    saved: false,
  },
  {
    id: '7',
    title: 'Mechanical Design Engineer – Early Career',
    company: 'Lockheed Martin',
    location: 'Fort Worth, TX',
    remote: 'On-site',
    postedDate: '2026-05-24',
    salary: '$78,000 - $96,000',
    fitScore: 82,
    matchReasons: [
      'SOLIDWORKS proficiency (production layouts, 3D models, fixture design) directly matches CAD requirement',
      'GD&T expertise — verified manufacturability and interface fit at Collins — is a key differentiator',
      'Structural load paths understanding from senior design and coursework applies here',
      'Aerospace Engineering degree is required',
      'Lockheed Martin is a target company',
    ],
    missingKeywords: ['CATIA V5 (Lockheed standard tool)', 'PDM/PLM Systems', 'Composite design experience beyond coursework', 'FEA software (Abaqus/Nastran)'],
    description:
      'Lockheed Martin is hiring an Early Career Mechanical Design Engineer for the F-35 program. You will design and analyze structural and mechanical components, create detailed drawings, and collaborate with manufacturing to ensure producibility.',
    requiredSkills: ['CATIA or SOLIDWORKS', 'GD&T', 'Mechanical Design', 'Structural Analysis'],
    preferredSkills: ['CATIA V5', 'Composite Materials', 'PDM', 'FEA'],
    status: 'New',
    url: '#',
    department: 'Airframe Design',
    experienceLevel: 'Entry-Level',
    saved: false,
  },
  {
    id: '8',
    title: 'Manufacturing Systems Engineer',
    company: 'Textron Aviation',
    location: 'Wichita, KS',
    remote: 'Hybrid',
    postedDate: '2026-05-23',
    salary: '$66,000 - $80,000',
    fitScore: 87,
    matchReasons: [
      'Led smart torque tooling rollout at Collins — direct process standardization experience',
      'Lean Manufacturing and 5S Methodology are listed skills used in a real aerospace environment',
      'SOLIDWORKS used for production layout design and fixture support',
      'Tooling and fixture design/installation experience from Collins co-op',
      'Textron is a target company',
    ],
    missingKeywords: ['Value Stream Mapping (formal VSM)', 'AutoCAD for facility layouts', 'MES/ERP systems', 'Six Sigma certification'],
    description:
      'Textron Aviation is looking for a Manufacturing Systems Engineer to optimize production systems for Cessna and Beechcraft aircraft. You will lead Lean/5S initiatives, analyze production data, and drive continuous improvement projects.',
    requiredSkills: ['Lean Manufacturing', '5S', 'Manufacturing Systems', 'Process Improvement'],
    preferredSkills: ['Value Stream Mapping', 'AutoCAD', 'ERP/MES', 'Six Sigma'],
    status: 'Interested',
    url: '#',
    department: 'Manufacturing Engineering',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '9',
    title: 'Systems Integration Engineer – Defense',
    company: 'Collins Aerospace',
    location: 'Rockford, IL',
    remote: 'Hybrid',
    postedDate: '2026-05-22',
    salary: '$71,000 - $87,000',
    fitScore: 88,
    matchReasons: [
      'Rockford, IL is in your preferred Illinois area',
      'Collins Aerospace is your #1 target company — you have real co-op experience there',
      'Avionics integration background from Bellevue co-op maps directly to this defense avionics role',
      'Cross-functional collaboration (engineering, manufacturing, quality) is a proven strength',
      'GD&T and engineering drawing skills meet documentation requirements',
    ],
    missingKeywords: ['DOORS requirements tool', 'MBSE methodology', 'Interface Control Document (ICD) development', 'DO-178C knowledge'],
    description:
      'Collins Aerospace seeks a Systems Integration Engineer to support defense avionics programs in Rockford, IL. You will lead system integration activities, manage interface definitions, and support lab and flight testing.',
    requiredSkills: ['Systems Integration', 'Avionics', 'Technical Documentation', 'Testing'],
    preferredSkills: ['DOORS', 'MBSE', 'Python', 'ICD'],
    status: 'New',
    url: '#',
    department: 'Defense Systems',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '10',
    title: 'Propulsion Test Engineer – New Grad',
    company: 'GE Aerospace',
    location: 'Peebles, OH',
    remote: 'On-site',
    postedDate: '2026-05-21',
    salary: '$70,000 - $85,000',
    fitScore: 65,
    matchReasons: [
      'Aerospace Engineering degree is required and directly matches',
      'MATLAB listed on resume — needed for data processing',
      'NDE/testing mindset from composite inspection project is broadly applicable',
    ],
    missingKeywords: ['Propulsion systems coursework', 'LabVIEW', 'NI DAQ hardware', 'Combustion or thermodynamics focus'],
    description:
      'GE Aerospace is hiring a Propulsion Test Engineer at the world-class Peebles Test Operations facility. You will plan and execute jet engine tests, develop test procedures, and analyze performance data for next-generation propulsion systems.',
    requiredSkills: ['Test Engineering', 'MATLAB', 'Data Analysis', 'Aerospace Engineering'],
    preferredSkills: ['LabVIEW', 'Propulsion', 'Python', 'NI DAQ'],
    status: 'New',
    url: '#',
    department: 'Propulsion Test',
    experienceLevel: 'Entry-Level',
    saved: false,
  },
  {
    id: '11',
    title: 'Avionics Manufacturing Engineer',
    company: 'Collins Aerospace',
    location: 'Cedar Rapids, IA',
    remote: 'On-site',
    postedDate: '2026-05-20',
    salary: '$67,000 - $82,000',
    fitScore: 98,
    matchReasons: [
      'You literally did this job — 8-month Industrial Engineer Co-op at Collins Avionics Manufacturing',
      'Cedar Rapids, IA is your #1 preferred location',
      'SOLIDWORKS used daily at Collins for tooling, fixtures, and production layouts',
      'NDE Minor adds formal inspection credentials to real hands-on experience',
      'Led smart torque tooling rollout — direct NPI/process standardization achievement',
      'Lean Manufacturing and 5S Methodology applied in regulated aerospace environment',
      'GD&T used to verify manufacturability and interface fit in production context',
    ],
    missingKeywords: ['IPC-A-610 soldering standards', 'J-STD-001', 'AOI (Automated Optical Inspection) systems'],
    description:
      'Collins Aerospace Cedar Rapids is seeking an Avionics Manufacturing Engineer to support production of advanced avionics products. You will develop manufacturing processes, support NPI activities, and drive quality improvements on the production floor.',
    requiredSkills: ['Manufacturing Engineering', 'Avionics', 'NDE', 'Process Improvement'],
    preferredSkills: ['IPC Standards', 'Lean', 'SOLIDWORKS', 'GD&T'],
    status: 'Interviewing',
    url: '#',
    department: 'Avionics Manufacturing',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
  {
    id: '12',
    title: 'NDE / Quality Inspector – Aerospace Structures',
    company: 'Northrop Grumman',
    location: 'Palmdale, CA',
    remote: 'On-site',
    postedDate: '2026-05-19',
    salary: '$68,000 - $84,000',
    fitScore: 89,
    matchReasons: [
      'NDE Minor at Iowa State is a direct credential match — rare at entry level',
      'Ultrasonic inspection experience from composite NDE project (ASTM D7264)',
      'Hand layup and epoxy infusion composite fabrication — understands what you\'re inspecting',
      'NDE fundamentals listed as a core engineering skill on your resume',
      'Collins Aerospace co-op experience in regulated aerospace inspection environment',
    ],
    missingKeywords: ['NDT Level II Certification (UT/PT/MT)', 'Radiographic Testing (RT)', 'Phased Array UT (PAUT)', 'NADCAP audit familiarity'],
    description:
      'Northrop Grumman seeks an NDE/Quality Inspector for advanced composite and metallic aerospace structures on classified defense programs. You will perform ultrasonic, dye-penetrant, and visual inspections, interpret results, and write nonconformance reports.',
    requiredSkills: ['Ultrasonic Testing', 'NDE Methods', 'Composite Structures', 'Quality Documentation'],
    preferredSkills: ['NDT Level II', 'PAUT', 'Radiography', 'AS9100'],
    status: 'New',
    url: '#',
    department: 'Quality / NDE',
    experienceLevel: 'Entry-Level',
    saved: true,
  },
];

export const RESUME_TEXT = `Nolan A. Benson
(815)-761-3406 | nbenson1@iastate.edu

PERSONAL STATEMENT
Aerospace Engineering student at Iowa State University with hands-on experience in avionics manufacturing, CAD modeling, structures, manufacturability, and systems-level problem solving. Seeking an engineering role where I can apply my technical design, manufacturing, analytical, and cross-functional collaboration skills to support practical, high-impact solutions across aerospace, defense, manufacturing, or related engineering industries.

EDUCATION
Iowa State University — Aug 2021 – Dec 2026
Bachelor of Science, Aerospace Engineering | Minor: Nondestructive Evaluation — Ames, Iowa
GPA: 2.98/4.00
Achievements: Dean's List (Spring 2022, Spring 2026), Journey Scholarship Award, Expedition Scholarship Award

RELEVANT WORK EXPERIENCE

Collins Aerospace — Jan 2024 – Aug 2024
Industrial Engineer Co-op | Avionics Manufacturing — Bellevue, Iowa
• Collaborated with engineering, manufacturing, and quality teams to document and improve avionics manufacturing processes in a regulated aerospace environment.
• Designed and modified 3D models and production layouts in SOLIDWORKS to support tooling, fixtures, machine guarding, and continuous avionics production.
• Managed design and installation of manufacturing fixtures and safety equipment, ensuring alignment between design intent, GD&T requirements, and shop-floor execution.
• Led rollout of smart torque tooling systems to improve process standardization, traceability, and assembly quality checks.
• Applied GD&T and interpreted engineering drawings to verify manufacturability and interface fit, ensuring compliance with aerospace documentation standards and preventing downstream design errors.

Enterpl.ai — May 2025 – Aug 2025
AI Automation Engineering Intern — Remote
• Designed and tested AI chatbot workflows in n8n and ElevenLabs, emphasizing reliability, edge-case handling, and predictable system behavior.
• Verified automation performance against functional expectations, refining logic to improve response consistency, workflow reliability, and repeatability.

ENGINEERING PROJECTS

ARC Aerial Relay Communications — Senior Design Project, 2026
• Created and refined aircraft CAD geometry in Onshape for a fixed-wing sUAS with a swappable avionics bay, 54-inch wingspan limit, and compact hard-case stowage requirement.
• Developed stowage and packing configurations for wing sections, rear fuselage, avionics bay, and tail components to support field assembly and mission case-size objectives.
• Contributed structures and manufacturing input for detachable components, boom/spar layout, fuselage integration, structural load paths, and low-cost replacement airframe requirements.

Composite Manufacturing & Nondestructive Evaluation Testing — 2026
• Fabricated woven fiberglass/epoxy composite laminates to evaluate manufacturing defects using ultrasonic inspection and ASTM D7264 flexural testing.
• Manufactured baseline, fiber-damaged, resin-starved, and void-rich laminate conditions using hand layup and epoxy infusion processes.
• Supported ultrasonic inspection planning and coupon preparation to compare defect location, flexural modulus, strength, density, and failure behavior.

COLLEGIATE LEADERSHIP
Alpha Tau Omega Fraternity — 2021–2025
Alumni Relations / Historian, Elected Executive Board Member
• Strengthened alumni engagement by leading communication efforts and coordinating a 300+ member alumni event in Fall 2023.
• Collaborated with the executive team to make pivotal decisions contributing to the fraternity's growth and success.

SKILLS
CAD & Design: SOLIDWORKS, Onshape, Creo (exposure), engineering layouts
Engineering: GD&T, structural load paths, manufacturability, avionics integration, nondestructive evaluation fundamentals
Manufacturing: Lean Manufacturing, 5S Methodology, tooling and fixture support, process improvement
Technical Tools: MATLAB, Microsoft Office, CORE`;

export const defaultUserProfile: UserProfile = {
  name: 'Nolan A. Benson',
  email: 'nbenson1@iastate.edu',
  degree: 'B.S. Aerospace Engineering | Minor: Nondestructive Evaluation',
  graduationDate: 'December 2026',
  university: 'Iowa State University',
  skills: [
    'SOLIDWORKS', 'Onshape', 'Creo (exposure)', 'GD&T',
    'Structural Load Paths', 'Manufacturability', 'Avionics Integration',
    'Nondestructive Evaluation', 'Lean Manufacturing', '5S Methodology',
    'Tooling & Fixture Design', 'Process Improvement', 'MATLAB',
    'Microsoft Office', 'CORE', 'n8n', 'ElevenLabs',
    'Composite Manufacturing', 'Ultrasonic Inspection', 'Hand Layup / Epoxy Infusion',
  ],
  targetTitles: [
    'Manufacturing Engineer', 'Industrial Engineer', 'NPI Engineer',
    'Systems Engineer', 'Quality Engineer', 'NDE Engineer',
    'Avionics Manufacturing Engineer', 'Mechanical Design Engineer',
    'Test Engineer',
  ],
  targetCompanies: [
    'Collins Aerospace', 'Boeing', 'Northrop Grumman', 'Lockheed Martin',
    'GE Aerospace', 'Honeywell', 'Garmin', 'Textron',
  ],
  preferredLocations: [
    'Iowa', 'Illinois', 'Minnesota', 'Cedar Rapids, IA',
    'Chicago, IL', 'Minneapolis, MN', 'Ames, IA',
  ],
  remotePreference: ['Remote', 'Hybrid', 'On-site'],
  resumeText: RESUME_TEXT,
};
