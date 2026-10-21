import { ServiceItem } from '../types';

export const SERVICE_CATEGORIES = [
  { 
    id: 'all', 
    label: 'All Services',
    description: 'Explore our complete salon and academy treatment catalogue in Satara' 
  },
  { 
    id: 'hair-treatments', 
    label: 'Hair Treatments & Science',
    description: 'Advanced hair smoothing, split-end care, keratin botox, and precision haircuts' 
  },
  { 
    id: 'facials-skin', 
    label: 'Facials & Skin Treatments',
    description: 'Clinical Hydra facials, Korean glass skin, BB Glow, and crystal diamond polishing' 
  },
  { 
    id: 'makeup-bridal', 
    label: 'Makeup & Bridal Artistry',
    description: 'Bespoke bridal packages, HD 3D makeup, sweat-resistant looks, and saree draping' 
  },
  { 
    id: 'permanent-makeup', 
    label: 'Permanent Makeup (PMU)',
    description: 'Microblading, powder brows, lip blush, neutralization, and precision mapping' 
  },
  { 
    id: 'equipment-machines', 
    label: 'Aesthetic Machines & Tech',
    description: '7-in-1 Hydra machine, OxyGeneo, LED phototherapy, and microdermabrasion' 
  },
] as const;

export const SERVICES: ServiceItem[] = [
  // =========================================================================
  // 1. HAIR TREATMENTS & HAIR SCIENCE
  // =========================================================================
  {
    id: 'split-ends-repair',
    title: 'Split Ends Care & Micro-Dusting',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Precision dusting technique that trims split ends without sacrificing overall length.',
    description: 'A targeted mechanical technique removing damaged, frayed split ends along the hair shaft while completely preserving your existing length, followed by deep protein serum infusion.',
    image: '/images/services/long-layer-haircut.jpg',
    features: ['Zero length loss', 'Eliminates brittle, split ends', 'Cuticle-smoothing blowout', 'At-home serum recommendations'],
    confirmed: true
  },
  {
    id: 'dandruff-scalp-clarifying',
    title: 'Dandruff & Scalp Clarifying Treatment',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Gentle exfoliating scalp cleanse to clear buildup, flakes, and excess sebum.',
    description: 'A purifying salon ritual combining botanical anti-dandruff formulations, gentle scalp exfoliation, and soothing hydration to rebalance scalp comfort without stripping moisture.',
    image: '/images/services/hair-color-treatment.jpg',
    features: ['Gentle scalp exfoliation', 'Removes dead skin & product buildup', 'Soothes scalp dryness & itching', 'Cooling botanical rinse'],
    confirmed: true
  },
  {
    id: 'hair-fall-strengthening',
    title: 'Hair-Fall Strengthening & Nourishing Ritual',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Cosmetic hair fiber fortifying ritual designed to reinforce fragile roots and minimize breakage.',
    description: 'A non-medical, cosmetic hair care ritual focusing on peptide-enriched root nourishment, gentle follicular stimulation, and strand-fortifying keratin wraps to support resilient, fuller-feeling hair.',
    image: '/images/services/hair-styling-curls.jpg',
    features: ['Root strengthening peptides', 'Reduces brushing breakage', 'Stimulating gentle scalp massage', 'Cosmetic strand fortification'],
    confirmed: true
  },
  {
    id: 'scalp-detox-rejuvenation',
    title: 'Deep Scalp Detox & Follicle Rejuvenation',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Deep-pore scalp cleansing to dissolve sebum plugs and refresh the hair follicle environment.',
    description: 'Combines micro-steaming, purifying scalp clay, and nutrient tonic application to clarify congested scalps, leaving your head feeling light, refreshed, and energized.',
    image: '/images/services/hero-back-layer.jpg',
    features: ['Pore detoxifying steam', 'Nutrient tonic massage', 'Improves scalp breathability', 'Clean salon fragrance finish'],
    confirmed: true
  },
  {
    id: 'hair-science-anatomy',
    title: 'Hair Science & Hair Anatomy Consultation',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Educational structural diagnosis evaluating porosity, elasticity, and cuticle integrity.',
    description: 'An educational consultation analyzing your hair’s cuticle, cortex, moisture-protein balance, and curl pattern to recommend the exact chemical treatments suitable for your hair health.',
    image: '/images/services/face-framing.jpg',
    features: ['Microscopic strand inspection', 'Porosity & elasticity assessment', 'Chemical suitability evaluation', 'Personalized treatment roadmap'],
    isEducational: true,
    confirmed: true
  },
  {
    id: 'smoothing-rebonding',
    title: 'Permanent Hair Smoothing & Rebonding',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Silky, pin-straight hair transformation with moisture-retention chemical formulas.',
    description: 'Advanced structural thermal realignment that tames resistant curls, stubborn frizz, and uneven texture into high-shine, velvety straight hair with lasting manageability.',
    image: '/images/services/long-layer-haircut.jpg',
    features: ['Pin-straight sleek finish', 'Lasting humidity resistance', 'Thermal heat shield protection', 'Post-rebonding wash guide'],
    confirmed: true
  },
  {
    id: 'keratin-treatment',
    title: 'Keratin Protein Smoothing Therapy',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Intense protein replenishment delivering frizz-free, mirror-gloss shine for up to 4 months.',
    description: 'Infuses hydro-active keratin into porous cuticles, restructuring sensitized hair while drastically reducing blow-dry times and eliminating unruly weather-induced frizz.',
    image: '/images/services/hair-color-treatment.jpg',
    videoUrl: '/videos/treatments/client-hair-service.mp4',
    features: ['Watch real client video demo', 'Eliminates 90% of frizz', 'Smooths without losing natural body', 'High-gloss reflective shine'],
    isSignature: true,
    badge: 'Video Available',
    confirmed: true
  },
  {
    id: 'hair-botox',
    title: 'Hair Botox & Cuticle Filling Treatment',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Deep conditioning cuticle filler that repairs hollow fibers with collagen and peptides.',
    description: 'Non-chemical, intensive restorative therapy that fills gaps in damaged, color-treated, or bleached hair cuticles, restoring softness, elasticity, and youthful bounce.',
    image: '/images/services/hair-styling-curls.jpg',
    features: ['Fills damaged cuticle gaps', 'Deep collagen & peptide infusion', 'Formaldehyde-free formula', 'Weightless natural volume'],
    isSignature: true,
    confirmed: true
  },
  {
    id: 'aqua-treatment',
    title: 'Aqua Deep Hydration Moisture Shield',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Hydro-infusion therapy quenching parched, brittle strands with long-lasting moisture.',
    description: 'Uses micro-mist hydration technology and botanical humectants to saturate dry hair with water molecules, sealing the cuticles for silky touch and flexible strength.',
    image: '/images/services/hair-styling-curls.jpg',
    features: ['Ultrasonic micro-mist steam', 'Intense moisture lock', 'Silky tangle-free touch', 'Ideal for sun & heat-exposed hair'],
    confirmed: true
  },
  {
    id: 'nanoplasty',
    title: 'Nanoplasty Organic Hair Realignment',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Organic amino acid smoothing that straightens and nourishes without harsh fumes.',
    description: 'An advanced salon system driven by nanotech amino acids and organic oils that penetrate the hair cortex to smooth, align, and reconstruct fibers with exceptional softness.',
    image: '/images/treatments/treatment-client-3.jpg',
    features: ['Organic amino acid formulation', 'No harsh odor or smoke', 'Deep fiber realignment', 'Intense glossy finish'],
    confirmed: true
  },
  {
    id: 'hair-product-knowledge',
    title: 'Professional Hair Product & Formulation Science',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Educational module on shampoos, masks, bonding serums, and chemical pH levels.',
    description: 'Learn the chemistry behind sulfates, silicones, bonding agents (Olaplex/K18 types), and post-treatment maintenance directly from SK Relax academy educators.',
    image: '/images/services/hair-color-treatment.jpg',
    features: ['pH balance understanding', 'Active ingredient analysis', 'Sulfate vs gentle surfactants', 'Salon vs retail formulations'],
    isEducational: true,
    confirmed: true
  },
  {
    id: 'butterfly-haircut',
    title: 'Butterfly Haircut & Dynamic Layers',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Signature layered cut featuring short cascading crown layers and face-framing bounce.',
    description: 'Our most requested haircut in Satara. Short feathery layers crown the head, while longer lengths cascade gracefully over the shoulders for supreme movement.',
    image: '/images/services/butterfly-haircut.jpg',
    features: ['Face-flattering crown layers', 'Dynamic volume & bounce', 'Professional blow-dry finish', 'Personalized sectioning'],
    isSignature: true,
    badge: 'Masterclass Special',
    confirmed: true
  },
  {
    id: 'hair-cutting-seminar',
    title: 'Advanced Hair Cutting Seminar & Live Demo',
    category: 'hair-treatments',
    categoryLabel: 'Hair Treatments & Science',
    shortDescription: 'Live cutting demonstration covering elevation degrees, sectioning, and modern textures.',
    description: 'A signature presentation showcasing precision geometry, finger angles, slide cutting, and textured graduation techniques performed live by senior stylists.',
    image: '/images/treatments/hair-cutting-seminar-frame.jpg',
    videoUrl: '/videos/treatments/hair-cutting-seminar.mp4',
    features: ['Watch seminar highlight video', 'Elevation degree breakdown', 'Mannequin & live client demos', 'Texture feathering techniques'],
    badge: 'Seminar Video',
    confirmed: true
  },

  // =========================================================================
  // 2. FACIALS & SKIN TREATMENTS
  // =========================================================================
  {
    id: 'hydra-facial',
    title: '7-in-1 Clinical Hydra Facial',
    category: 'facials-skin',
    categoryLabel: 'Facials & Skin Treatments',
    shortDescription: 'Multi-step vortex deep cleansing, gentle pore extraction, and peptide serum infusion.',
    description: 'Powered by our in-house multifunction hydra aesthetic equipment in Satara. Gently removes blackheads and impurities while infusing skin with hyaluronic acid, antioxidants, and glow boosters.',
    image: '/images/treatments/hydra-facial-frame.jpg',
    videoUrl: '/videos/treatments/hydra-facial.mp4',
    features: ['Watch real treatment video', 'Vacuum vortex pore extraction', 'Oxygen infusion & cold hammer', 'Immediate radiant dewy finish'],
    isSignature: true,
    badge: 'Video Available',
    confirmed: true
  },
  {
    id: 'korean-glass-facial',
    title: 'Korean Glass Skin Facial',
    category: 'facials-skin',
    categoryLabel: 'Facials & Skin Treatments',
    shortDescription: 'High-hydration, multi-essence ritual achieving an ultra-smooth, translucent porcelain glow.',
    description: 'Inspired by modern Korean aesthetic routines. Involves double enzymatic cleansing, multi-layer toner damping, peptide ampoule micro-infusion, and soothing sheet masking.',
    image: '/images/treatments/korean-glass-skin-glow.jpg',
    videoUrl: '/videos/treatments/client-treatment-transformation.mp4',
    features: ['Watch transformation video', 'Double enzymatic exfoliation', 'Translucent reflective glow', 'Intense moisture barrier support'],
    isSignature: true,
    badge: 'Video Available',
    confirmed: true
  },
  {
    id: 'bollywood-facial',
    title: 'Bollywood Red Carpet Radiance Facial',
    category: 'facials-skin',
    categoryLabel: 'Facials & Skin Treatments',
    shortDescription: 'Luxury photo-ready facial combining lymphatic drainage massage and gold collagen masking.',
    description: 'Designed for wedding celebrations, galas, and photography events. Tightens tired contours, eliminates facial puffiness through lymphatic massage, and bestows an illuminated bridal glow.',
    image: '/images/services/skincare-facial.jpg',
    features: ['Lymphatic contour massage', 'Gold collagen sheet mask', 'Photo-ready instant brightness', 'Silky smooth makeup base'],
    confirmed: true
  },
  {
    id: 'crystal-polishing',
    title: 'Crystal Microdermabrasion Polishing',
    category: 'facials-skin',
    categoryLabel: 'Facials & Skin Treatments',
    shortDescription: 'Gentle micro-crystal spray exfoliation that buffs away dead dull surface skin.',
    description: 'Fine aluminum oxide crystals gently abrade the stratum corneum while vacuum suction lifts away cellular debris, leaving your face baby-soft and dramatically smoothed.',
    image: '/images/treatments/facial-treatment-frame.jpg',
    features: ['Fine micro-crystal exfoliation', 'Smooths rough texture', 'Brightens dull patches', 'Promotes cellular renewal'],
    confirmed: true
  },
  {
    id: 'diamond-polishing',
    title: 'Diamond Tip Microdermabrasion Polishing',
    category: 'facials-skin',
    categoryLabel: 'Facials & Skin Treatments',
    shortDescription: 'Diamond-encrusted vacuum wand resurfacing that refines pores and fine lines.',
    description: 'Crystal-free mechanical exfoliation using precision diamond abrasive wands to buff delicate areas like the nose, forehead, and jawline with total control and cleanliness.',
    image: '/images/treatments/facial-machine-treatment.jpg',
    features: ['Diamond-encrusted precision tip', 'Zero chemical irritation', 'Refines enlarged pores', 'Smooth makeup application'],
    confirmed: true
  },
  {
    id: 'mask-knowledge-application',
    title: 'Therapeutic Face Masks & Mask Science',
    category: 'facials-skin',
    categoryLabel: 'Facials & Skin Treatments',
    shortDescription: 'Custom alginate, hydrojelly, clay, and collagen mask formulations for every skin need.',
    description: 'An educational and customized service applying targeted peel-off hydrojelly and alginate rubber masks based on skin moisture, sensitivity, and oil production.',
    image: '/images/services/skincare-facial.jpg',
    features: ['Hydrojelly & alginate masks', 'Electrolyte hydration', 'Post-extraction calming', 'Custom blended botanical actives'],
    confirmed: true
  },

  // =========================================================================
  // 3. MAKEUP & BRIDAL ARTISTRY
  // =========================================================================
  {
    id: 'bridal-bespoke-package',
    title: 'Signature Bridal Makeover & Couture Package',
    category: 'makeup-bridal',
    categoryLabel: 'Makeup & Bridal Artistry',
    shortDescription: 'Complete royal bridal transformation tailored to your skin tone, wedding attire, and style.',
    description: 'Our flagship bridal experience. Includes pre-wedding consultation, flawless HD base, waterproof eye artistry, customized lip contouring, jewelry placement, and traditional saree draping.',
    image: '/images/services/bridal-beauty.jpg',
    imagePosition: 'center 15%',
    features: ['In-depth bridal consultation', 'Waterproof & sweat-resistant formulation', 'Intricate bridal hair couture', 'Saree & dupatta draping included'],
    isSignature: true,
    badge: 'Enquiry Based',
    confirmed: true
  },

  // =========================================================================
  // 4. PERMANENT MAKEUP (PMU)
  // =========================================================================
  {
    id: 'microblading-eyebrows',
    title: 'Precision Eyebrow Microblading',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Ultra-fine hair-like strokes etched with sterile micro-blades for realistic fuller brows.',
    description: 'A semi-permanent cosmetic tattooing technique that mimics natural brow hair direction and thickness. Uses sterile, disposable micro-blades and medical-grade hypoallergenic pigments.',
    image: '/images/gallery/pmu-eyebrow-result.jpg',
    features: ['Natural hair-stroke simulation', 'Facial symmetry golden-ratio mapping', 'Topical numbing for comfort', 'Lasts 12 to 18 months'],
    isSignature: true,
    confirmed: true
  },
  {
    id: 'powder-brows',
    title: 'Ombré Powder Brows',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Soft misty powder finish resembling freshly filled eyebrow makeup with an ombré gradient.',
    description: 'Created with a digital rotary machine depositing hundreds of tiny pigment dots. Soft at the front bulb and darker towards the tail for an elegant, groomed appearance.',
    image: '/images/gallery/pmu-eyebrow-result.jpg',
    features: ['Soft powdered makeup look', 'Gentle on all skin types', 'Flawless ombré gradient', 'Longer lasting than blading alone'],
    confirmed: true
  },
  {
    id: 'combination-brows',
    title: 'Combination Brows (Hybrid 3D Technique)',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Microbladed front strokes blended seamlessly into powdered density through the arch and tail.',
    description: 'The best of both worlds. Delivers natural hair-like definition at the inner brow while providing rich, sculpted density where natural hair is sparse.',
    image: '/images/gallery/pmu-eyebrow-result.jpg',
    features: ['Hair strokes + powder shading', 'Ideal for sparse or patchy brows', '3D realistic dimension', 'Custom pigment color match'],
    confirmed: true
  },
  {
    id: 'lip-blush',
    title: 'Lip Blush Semi-Permanent Tint',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Translucent pixelated lip tint that defines the vermilion border and boosts natural color.',
    description: 'A delicate cosmetic tattoo imparting a soft wash of rosy, peach, or berry pigment. Restores uneven borders and gives lips a youthful, tinted balm appearance.',
    image: '/images/services/makeup-styling.jpg',
    features: ['Restores faded lip borders', 'Natural tinted lip glow', 'Visual fullness enhancement', 'Custom blended shades'],
    confirmed: true
  },
  {
    id: 'lip-neutralization',
    title: 'Lip Color Neutralization & Tone Correction',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Color theory neutralization for cool-toned or dark lips using warm corrective pigments.',
    description: 'Targeted correction for hyperpigmented or cool, purple-toned lips. Uses specialized warm orange and peach pigments to balance dark undertones before applying desired blush colors.',
    image: '/images/services/makeup-styling.jpg',
    features: ['Color theory dark lip balancing', 'Warm corrective base pigments', 'Multiple session guidance', 'Even, healthy natural tone'],
    confirmed: true
  },
  {
    id: 'mapping-numbing-techniques',
    title: 'PMU Golden Ratio Mapping & Topical Numbing',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Educational training module on caliper measurement, symmetry mapping, and skin numbing.',
    description: 'Detailed academy module teaching prospective PMU artists string mapping, caliper measurements, facial bone analysis, and secondary topical numbing protocols for painless procedures.',
    image: '/images/gallery/pmu-eyebrow-result.jpg',
    features: ['Golden ratio calipers & string mapping', 'Skin depth & blood vessel safety', 'Topical lidocaine protocols', 'Client consent & patch testing'],
    isEducational: true,
    confirmed: true
  },
  {
    id: 'scalp-micropigmentation',
    title: 'Scalp Micropigmentation (SMP Hairline Density)',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    shortDescription: 'Precision dot pigmentation replicating natural hair follicles for thinning hairlines.',
    description: 'A specialized cosmetic tattooing method where micro-dots of carbon pigment are placed into the upper dermis to recreate the visual impression of fuller hair density along partings and hairlines.',
    image: '/images/services/hero-back-layer.jpg',
    features: ['Replicates follicle density', 'Camouflages thinning partings', 'Custom hairline design', 'Non-surgical cosmetic procedure'],
    confirmed: true
  },

  // =========================================================================
  // 5. EQUIPMENT & MACHINE KNOWLEDGE
  // =========================================================================
  {
    id: 'hydra-facial-machine-7-in-1',
    title: '7-in-1 / 10-in-1 Multifunction Hydra Aesthetic Station',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Our flagship studio and academy workstation featuring vortex extraction, spray, and ultrasound.',
    description: 'The core aesthetic powerhouse at SK Relax Satara. Integrates hydro-microdermabrasion, bipolar RF, ultrasound handle, cold hammer, oxygen spray, and skin scrubber in one clinical console.',
    image: '/images/machines/hydra-facial-machine.jpg',
    videoUrl: '/videos/treatments/hydra-facial.mp4',
    features: ['Multi-probe functionality', 'Negative pressure vacuum suction', 'Ultrasonic product penetration', 'Cryo cold hammer skin tightening'],
    isSignature: true,
    badge: 'Equipment Showcase',
    confirmed: true
  },
  {
    id: 'derma-roller-microneedling',
    title: 'Precision Derma Roller Needling',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Manual medical-grade micro-needle roller promoting collagen induction and product absorption.',
    description: 'Teaches and implements controlled micro-channels across the epidermis, stimulating the skin’s natural healing response and dramatically increasing serum absorption.',
    image: '/images/treatments/facial-treatment-frame.jpg',
    features: ['Titanium 540 needle technology', 'Collagen induction stimulation', 'Enhances serum penetration by 80%', 'Sterile single-use hygiene'],
    confirmed: true
  },
  {
    id: 'derma-pen-microneedling',
    title: 'Motorized Electronic Derma Pen',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'High-speed vertical micro-needling with adjustable depth for acne scars and fine lines.',
    description: 'Advanced automated needling wand allowing precise needle depth adjustment (0.25mm to 2.5mm) with minimal epidermal trauma for targeted scar and texture refining.',
    image: '/images/treatments/facial-machine-treatment.jpg',
    features: ['Adjustable needle depths', 'Vertical micro-puncture speed', 'Targeted scar revision', 'Minimal downtime compared to rollers'],
    confirmed: true
  },
  {
    id: 'crystal-ball-cryotherapy',
    title: 'Cryo Ice Globe & Crystal Ball Therapy',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Chilled glass spheres filled with antifreeze liquid for soothing lymphatic facial massage.',
    description: 'A cooling salon ritual that constricts dilated blood vessels, reduces post-facial redness, tightens pores, and relieves facial tension with calming cold therapy.',
    image: '/images/treatments/korean-glass-skin-glow.jpg',
    features: ['Chilled temperature therapy', 'Soothes inflammation & redness', 'Stimulates lymphatic drainage', 'Relaxing sensory experience'],
    confirmed: true
  },
  {
    id: 'oxygeneo-skin-oxygenation',
    title: 'OxyGeneo 3-in-1 Super Facial Technology',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Patented Bohr effect technology that oxygenates skin from within while infusing nutrients.',
    description: 'Combines exfoliation, nutrient infusion, and internal oxygenation via the Bohr effect, triggering a surge of oxygen to the skin surface for unrivaled brightness.',
    image: '/images/treatments/hydra-facial-frame.jpg',
    features: ['Internal oxygenation (Bohr effect)', 'Simultaneous gentle exfoliation', 'Plumps and brightens instantly', 'Gentle on all complexions'],
    confirmed: true
  },
  {
    id: 'crystal-diamond-microdermabrasion',
    title: 'Dual Crystal & Diamond Microdermabrasion',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Professional resurfacing unit with adjustable vacuum suction and crystal/diamond tips.',
    description: 'Used for both client skin polishing and student training. Explains pressure calibrating, hygienic filter changes, and abrasive grading for safe resurfacing.',
    image: '/images/services/hair-styling-curls.jpg',
    features: ['Dual crystal & diamond mechanisms', 'Adjustable vacuum levels', 'Safe exfoliation on sensitive zones', 'Hands-on training provided'],
    confirmed: true
  },
  {
    id: 'omega-led-light-therapy',
    title: 'Omega 7-Color LED Phototherapy Dome',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Narrow-band LED light frequencies targeting acne bacteria (blue) and collagen (red).',
    description: 'A non-thermal light therapy canopy providing clinical waveband illumination: Red (collagen and repair), Blue (acne bacteria control), and Green (hyperpigmentation calming).',
    image: '/images/treatments/treatment-client-2.jpg',
    features: ['7 therapeutic wavelengths', 'Red light collagen stimulation', 'Blue light P.acnes reduction', 'Relaxing hands-free treatment'],
    confirmed: true
  },
  {
    id: 'high-frequency-equipment',
    title: 'High-Frequency Neon & Argon Glass Electrodes',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Ozone-producing electrical current for scalp stimulation and anti-bacterial acne drying.',
    description: 'A staple beauty academy tool generating mild thermal currents through argon/neon gas tubes, creating ozone to sterilize skin following extractions and awaken hair roots.',
    image: '/images/treatments/facial-treatment-frame.jpg',
    features: ['Natural germicidal ozone action', 'Drying effect on active blemishes', 'Scalp rake for hair follicle health', 'Fundamental academy curriculum tool'],
    confirmed: true
  },
  {
    id: 'mole-removal-equipment',
    title: 'Aesthetic Spot & Mole Plasma Pen Tech',
    category: 'equipment-machines',
    categoryLabel: 'Aesthetic Machines & Tech',
    shortDescription: 'Low-temperature plasma arc technology for benign cosmetic skin tags and spots.',
    description: 'Covers the theory, sanitization, and precise carbonization technique of surface cosmetic spots, skin tags, and minor moles under strict sterile guidelines.',
    image: '/images/services/hair-styling-curls.jpg',
    features: ['Micro-plasma arc technology', 'Strict sterile hygiene protocol', 'Skin tag & spot removal technique', 'Detailed post-care healing guidance'],
    confirmed: true
  }
];
