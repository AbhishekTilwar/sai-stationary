// Stationery catalog for Sai Gift, Stationery and Xerox.
//
// Products & prices are typical Indian retail (MRP) values for real brands
// (Classmate, Navneet, DOMS, Apsara, Nataraj, Cello, Reynolds, Camlin,
// Faber-Castell, Fevicol, Kangaro, Solo, Oddy…). Adjust to your shop's rates.
// In production this is replaced by Firestore `products` (same shape).

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

// Reusable image pool (generic stationery photos).
const IMG = {
  pen1: img('photo-1583485088034-697b5bc54ccd'),
  pen2: img('photo-1586953208448-b95a79798f07'),
  book1: img('photo-1531346878377-a5be20888e57'),
  book2: img('photo-1544816155-12df9643f363'),
  pencil: img('photo-1502691876148-a84978e59af8'),
  school: img('photo-1503676260728-1c00da094a0b'),
  books: img('photo-1456513080510-7bf3a84b82f8'),
  art: img('photo-1513364776144-60967b0f800f'),
  desk: img('photo-1497032628192-86f99bcd76bc'),
  office: img('photo-1524758631624-e2822e304c36'),
  paper: img('photo-1606722590583-6951b5ea92ad'),
  wrap: img('photo-1607344645866-009c320b63e0'),
  ribbon: img('photo-1513885535751-8b9238bd345a'),
};

// Keyword-matched product photos from the internet (LoremFlickr → Flickr CC).
// Each product gets an image matching its type. The owner can later replace
// these with real product photos via the admin image upload (Firebase Storage).
const pic = (q, seed) => `https://loremflickr.com/640/640/${q}?lock=${seed}`;

const inkVariants = [
  { id: 'blue', label: 'Blue', priceDelta: 0 },
  { id: 'black', label: 'Black', priceDelta: 0 },
];

export const products = [
  // ---------------- PENS ----------------
  {
    id: 'pen-cello-butterflow', name: 'Cello Butterflow Ball Pen (Pack of 5)', slug: 'cello-butterflow-ball-pen',
    category: 'pens', brand: 'Cello', price: 50, mrp: 60, rating: 4.4, reviewCount: 512, stock: 200,
    images: [IMG.pen1, IMG.pen2], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Smooth, fast-drying ball pens for everyday writing.',
    description: 'Cello Butterflow ball pens glide smoothly with fast-drying ink and a comfortable grip. Pack of 5.',
    variants: inkVariants,
  },
  {
    id: 'pen-reynolds-045', name: 'Reynolds 045 Fine Carbure Ball Pen (Pack of 5)', slug: 'reynolds-045-ball-pen',
    category: 'pens', brand: 'Reynolds', price: 50, mrp: 50, rating: 4.5, reviewCount: 890, stock: 300,
    images: [IMG.pen2, IMG.pen1], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'The classic fine-tip pen loved by students.',
    description: 'Reynolds 045 — India\'s favourite fine-tip ball pen with consistent ink flow. Pack of 5.',
    variants: inkVariants,
  },
  {
    id: 'pen-reynolds-trimax', name: 'Reynolds Trimax Gel Pen', slug: 'reynolds-trimax-gel-pen',
    category: 'pens', brand: 'Reynolds', price: 25, mrp: 25, rating: 4.4, reviewCount: 340, stock: 250,
    images: [IMG.pen1, IMG.pen2], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Free-flowing gel pen for neat handwriting.',
    description: 'Reynolds Trimax gel pen with a needle tip for smooth, precise writing.',
    variants: inkVariants,
  },
  {
    id: 'pen-linc-pentonic', name: 'Linc Pentonic Ball Pen (Pack of 5)', slug: 'linc-pentonic-ball-pen',
    category: 'pens', brand: 'Linc', price: 50, mrp: 50, rating: 4.6, reviewCount: 610, stock: 180,
    images: [IMG.pen2, IMG.pen1], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Ultra-smooth 0.7mm tip, vibrant body colours.',
    description: 'Linc Pentonic — trendy, smooth-writing ball pens at a great price. Pack of 5.',
    variants: inkVariants,
  },
  {
    id: 'pen-doms-neon', name: 'DOMS Neon Ball Pen (Pack of 10)', slug: 'doms-neon-ball-pen',
    category: 'pens', brand: 'DOMS', price: 60, mrp: 60, rating: 4.3, reviewCount: 220, stock: 160,
    images: [IMG.pen1, IMG.pen2], badges: [], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Comfortable grip, low-cost bulk pack of 10.',
    description: 'DOMS Neon ball pens with soft grip — economical pack of 10 for school and office.',
    variants: inkVariants,
  },
  {
    id: 'pen-uniball-eye', name: 'Uniball Eye Roller Ball Pen', slug: 'uniball-eye-roller-pen',
    category: 'pens', brand: 'Uniball', price: 80, mrp: 90, rating: 4.7, reviewCount: 145, stock: 90,
    images: [IMG.pen2, IMG.pen1], badges: ['premium'], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Liquid-ink roller for a premium writing feel.',
    description: 'Uniball Eye — smooth liquid-ink rollerball with fade-proof, water-resistant ink.',
    variants: inkVariants,
  },
  {
    id: 'pen-pilot-v5', name: 'Pilot V5 Hi-Tecpoint Pen', slug: 'pilot-v5-hi-tecpoint',
    category: 'pens', brand: 'Pilot', price: 40, mrp: 40, rating: 4.6, reviewCount: 410, stock: 130,
    images: [IMG.pen1, IMG.pen2], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Precise 0.5mm needle-point liquid ink pen.',
    description: 'Pilot V5 Hi-Tecpoint delivers crisp, smudge-free lines with its fine needle tip.',
    variants: inkVariants,
  },

  // ---------------- NOTEBOOKS ----------------
  {
    id: 'nb-classmate-172', name: 'Classmate Single Line Notebook (172 Pages)', slug: 'classmate-single-line-172',
    category: 'notebooks', brand: 'Classmate', price: 55, mrp: 60, rating: 4.6, reviewCount: 980, stock: 400,
    images: [IMG.book1, IMG.book2], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Everyday single-line notebook, 172 pages.',
    description: 'Classmate single-line notebook with smooth, bright paper. 172 pages, soft cover.',
    variants: [],
  },
  {
    id: 'nb-classmate-200', name: 'Classmate Notebook 200 Pages (Soft Cover)', slug: 'classmate-notebook-200',
    category: 'notebooks', brand: 'Classmate', price: 68, mrp: 75, rating: 4.5, reviewCount: 540, stock: 300,
    images: [IMG.book2, IMG.book1], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Thicker 200-page notebook for longer subjects.',
    description: 'Classmate 200-page soft-cover notebook. Available in single-line and four-line ruling.',
    variants: [
      { id: 'single', label: 'Single Line', priceDelta: 0 },
      { id: 'four', label: 'Four Line', priceDelta: 0 },
    ],
  },
  {
    id: 'nb-classmate-spiral', name: 'Classmate Spiral Notebook (300 Pages)', slug: 'classmate-spiral-300',
    category: 'notebooks', brand: 'Classmate', price: 199, mrp: 240, rating: 4.5, reviewCount: 430, stock: 120,
    images: [IMG.book1, IMG.book2], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: '300 pages, lay-flat spiral binding.',
    description: 'Classmate 5-subject spiral notebook, 300 pages with sturdy binding and subject dividers.',
    variants: [],
  },
  {
    id: 'nb-navneet-long', name: 'Navneet Youva Long Book (172 Pages)', slug: 'navneet-youva-long-172',
    category: 'notebooks', brand: 'Navneet', price: 60, mrp: 65, rating: 4.5, reviewCount: 360, stock: 260,
    images: [IMG.book2, IMG.book1], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Long-size notebook, 172 pages, superior paper.',
    description: 'Navneet Youva long book with bright, smooth paper. 172 pages, single line.',
    variants: [],
  },
  {
    id: 'nb-navneet-160', name: 'Navneet Youva Notebook (160 Pages)', slug: 'navneet-youva-160',
    category: 'notebooks', brand: 'Navneet', price: 50, mrp: 55, rating: 4.4, reviewCount: 300, stock: 280,
    images: [IMG.book1, IMG.book2], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Regular notebook for daily class work.',
    description: 'Navneet Youva 160-page notebook, ideal for school and college notes.',
    variants: [],
  },
  {
    id: 'nb-long-register', name: 'Hard Bound Register (300 Pages)', slug: 'hard-bound-register-300',
    category: 'notebooks', brand: 'Local', price: 120, mrp: 140, rating: 4.3, reviewCount: 120, stock: 90,
    images: [IMG.books, IMG.book1], badges: [], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Durable hard-bound register for accounts/records.',
    description: 'Hard-bound 300-page register, perfect for shops, offices and record-keeping.',
    variants: [],
  },

  // ---------------- PENCILS & ERASERS ----------------
  {
    id: 'pc-apsara-platinum', name: 'Apsara Platinum Extra Dark Pencils (Pack of 10)', slug: 'apsara-platinum-pencils',
    category: 'pencils', brand: 'Apsara', price: 45, mrp: 50, rating: 4.7, reviewCount: 1200, stock: 350,
    images: [IMG.pencil, IMG.school], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Extra-dark, break-resistant writing pencils.',
    description: 'Apsara Platinum extra-dark pencils write smooth and dark, with strong, break-resistant leads. Pack of 10.',
    variants: [],
  },
  {
    id: 'pc-nataraj-621', name: 'Nataraj 621 Bold Pencils (Pack of 10)', slug: 'nataraj-621-pencils',
    category: 'pencils', brand: 'Nataraj', price: 40, mrp: 45, rating: 4.6, reviewCount: 860, stock: 320,
    images: [IMG.pencil, IMG.school], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'The iconic red-black striped school pencil.',
    description: 'Nataraj 621 bold pencils — a school classic with dark, smooth leads. Pack of 10.',
    variants: [],
  },
  {
    id: 'pc-doms-y1', name: 'DOMS Y1+ Pencils (Pack of 10)', slug: 'doms-y1-pencils',
    category: 'pencils', brand: 'DOMS', price: 50, mrp: 55, rating: 4.6, reviewCount: 540, stock: 240,
    images: [IMG.school, IMG.pencil], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Bonded lead pencils with a free eraser & sharpener.',
    description: 'DOMS Y1+ pencils feature extra-dark bonded leads and come with a free eraser and sharpener.',
    variants: [],
  },
  {
    id: 'pc-apsara-eraser', name: 'Apsara Non-Dust Erasers (Pack of 3)', slug: 'apsara-non-dust-erasers',
    category: 'pencils', brand: 'Apsara', price: 15, mrp: 18, rating: 4.5, reviewCount: 430, stock: 500,
    images: [IMG.pencil, IMG.school], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Clean, dust-free erasing that won\'t tear paper.',
    description: 'Apsara non-dust erasers remove pencil marks cleanly without smudging. Pack of 3.',
    variants: [],
  },
  {
    id: 'pc-doms-sharpener', name: 'DOMS Long Point Sharpeners (Pack of 3)', slug: 'doms-sharpeners',
    category: 'pencils', brand: 'DOMS', price: 30, mrp: 33, rating: 4.4, reviewCount: 260, stock: 300,
    images: [IMG.school, IMG.pencil], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Sharp, long-point sharpeners with shaving tray.',
    description: 'DOMS long-point sharpeners give a fine, long tip. Comes with a container to catch shavings. Pack of 3.',
    variants: [],
  },
  {
    id: 'pc-faber-trigrip', name: 'Faber-Castell Tri-Grip Pencils (Pack of 10)', slug: 'faber-castell-tri-grip-pencils',
    category: 'pencils', brand: 'Faber-Castell', price: 70, mrp: 80, rating: 4.7, reviewCount: 210, stock: 150,
    images: [IMG.pencil, IMG.art], badges: ['newarrival'], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Triangular grip pencils for a comfortable hold.',
    description: 'Faber-Castell triangular pencils help kids grip correctly and write comfortably. Pack of 10.',
    variants: [],
  },

  // ---------------- CHART PAPER & SHEETS (₹6–15) ----------------
  {
    id: 'ch-white', name: 'White Chart Paper (Full Size Sheet)', slug: 'white-chart-paper',
    category: 'chart-paper', brand: 'Local', price: 8, mrp: 10, rating: 4.4, reviewCount: 320, stock: 1000,
    images: [IMG.paper, IMG.books], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Standard white chart paper for projects & posters.',
    description: 'Full-size white chart paper — perfect for school projects, charts and posters. Priced per sheet.',
    variants: [],
  },
  {
    id: 'ch-colour', name: 'Colour Chart Paper (Assorted, per Sheet)', slug: 'colour-chart-paper',
    category: 'chart-paper', brand: 'Local', price: 10, mrp: 12, rating: 4.4, reviewCount: 290, stock: 1000,
    images: [IMG.paper, IMG.art], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Bright colour chart paper — tell us the shade.',
    description: 'Full-size colour chart paper in assorted shades (red, blue, green, yellow, pink and more). Priced per sheet.',
    variants: [
      { id: 'red', label: 'Red', priceDelta: 0 },
      { id: 'blue', label: 'Blue', priceDelta: 0 },
      { id: 'green', label: 'Green', priceDelta: 0 },
      { id: 'yellow', label: 'Yellow', priceDelta: 0 },
    ],
  },
  {
    id: 'ch-neon', name: 'Fluorescent Neon Chart Paper (per Sheet)', slug: 'neon-chart-paper',
    category: 'chart-paper', brand: 'Local', price: 15, mrp: 18, rating: 4.3, reviewCount: 150, stock: 700,
    images: [IMG.art, IMG.paper], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Eye-catching neon sheets for standout displays.',
    description: 'Fluorescent neon chart paper for posters, decorations and project highlights. Priced per sheet.',
    variants: [],
  },
  {
    id: 'ch-pastel', name: 'Pastel Sheet A4 (per Sheet)', slug: 'pastel-sheet-a4',
    category: 'chart-paper', brand: 'Local', price: 6, mrp: 8, rating: 4.2, reviewCount: 110, stock: 900,
    images: [IMG.paper, IMG.book2], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Soft pastel A4 sheets for craft & assignments.',
    description: 'Light pastel A4 sheets, great for craft work, greeting bases and assignments. Priced per sheet.',
    variants: [],
  },
  {
    id: 'ch-glazed', name: 'Glazed / Origami Colour Paper (100 Sheets)', slug: 'glazed-origami-paper',
    category: 'chart-paper', brand: 'Local', price: 40, mrp: 50, rating: 4.5, reviewCount: 180, stock: 400,
    images: [IMG.art, IMG.paper], badges: ['newarrival'], bestSeller: false, newArrival: true, festival: null,
    shortDescription: '100 assorted glazed sheets for craft & origami.',
    description: 'Pack of 100 assorted glazed colour sheets for origami, collage and craft projects.',
    variants: [],
  },

  // ---------------- ART & CRAFT ----------------
  {
    id: 'ar-doms-crayons', name: 'DOMS Wax Crayons (12 Shades)', slug: 'doms-wax-crayons-12',
    category: 'art-craft', brand: 'DOMS', price: 40, mrp: 45, rating: 4.6, reviewCount: 620, stock: 300,
    images: [IMG.art, IMG.pencil], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Bright, smooth wax crayons for kids.',
    description: 'DOMS wax crayons in 12 vibrant shades — smooth laydown and easy to hold. Ideal for young artists.',
    variants: [],
  },
  {
    id: 'ar-faber-pastels', name: 'Faber-Castell Oil Pastels (25 Shades)', slug: 'faber-castell-oil-pastels-25',
    category: 'art-craft', brand: 'Faber-Castell', price: 135, mrp: 160, rating: 4.7, reviewCount: 340, stock: 140,
    images: [IMG.art, IMG.pencil], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Creamy, blendable oil pastels — 25 shades.',
    description: 'Faber-Castell oil pastels with rich pigment and smooth blending. Set of 25 shades.',
    variants: [],
  },
  {
    id: 'ar-camel-watercolour', name: 'Camel Student Water Colour Cakes (12)', slug: 'camel-water-colour-cakes-12',
    category: 'art-craft', brand: 'Camel', price: 80, mrp: 90, rating: 4.5, reviewCount: 410, stock: 180,
    images: [IMG.art, IMG.paper], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: '12 vivid, easy-to-blend watercolour cakes.',
    description: 'Camel (Camlin) student water colour cakes — 12 bright shades with a free brush.',
    variants: [],
  },
  {
    id: 'ar-camlin-sketch', name: 'Camlin Sketch Pens (12 Shades)', slug: 'camlin-sketch-pens-12',
    category: 'art-craft', brand: 'Camlin', price: 75, mrp: 85, rating: 4.6, reviewCount: 520, stock: 220,
    images: [IMG.art, IMG.pencil], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Long-lasting, bright sketch pens — 12 colours.',
    description: 'Camlin sketch pens with vivid, quick-drying ink. Set of 12 washable colours.',
    variants: [],
  },
  {
    id: 'ar-doms-sketch-24', name: 'DOMS Sketch Pens (24 Shades)', slug: 'doms-sketch-pens-24',
    category: 'art-craft', brand: 'DOMS', price: 110, mrp: 125, rating: 4.5, reviewCount: 260, stock: 160,
    images: [IMG.pencil, IMG.art], badges: ['newarrival'], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Big 24-shade set for detailed colouring.',
    description: 'DOMS sketch pens in 24 bright shades — great value for art and colouring projects.',
    variants: [],
  },
  {
    id: 'ar-fevicryl', name: 'Fevicryl Acrylic Colours (Set)', slug: 'fevicryl-acrylic-colours',
    category: 'art-craft', brand: 'Fevicryl', price: 150, mrp: 175, rating: 4.6, reviewCount: 190, stock: 120,
    images: [IMG.art, IMG.paper], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Rich acrylic colours for canvas & craft.',
    description: 'Fevicryl acrylic colour set with bright, long-lasting pigments for canvas, fabric and craft.',
    variants: [],
  },

  // ---------------- FILES & FOLDERS ----------------
  {
    id: 'fl-solo-report', name: 'Solo Report File (Pack of 5)', slug: 'solo-report-file-5',
    category: 'files-folders', brand: 'Solo', price: 60, mrp: 70, rating: 4.4, reviewCount: 230, stock: 260,
    images: [IMG.desk, IMG.office], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'A4 report files for projects & submissions.',
    description: 'Solo report files with spring clip and transparent cover. Pack of 5, A4 size.',
    variants: [],
  },
  {
    id: 'fl-clip-file', name: 'Plastic Clip File (A4)', slug: 'plastic-clip-file-a4',
    category: 'files-folders', brand: 'Solo', price: 30, mrp: 35, rating: 4.3, reviewCount: 180, stock: 300,
    images: [IMG.office, IMG.desk], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Sturdy clip file to hold loose sheets.',
    description: 'Durable A4 plastic clip file with a strong clamp — keeps documents neat.',
    variants: [],
  },
  {
    id: 'fl-display-book', name: 'Display Book File (20 Pockets)', slug: 'display-book-20',
    category: 'files-folders', brand: 'Solo', price: 90, mrp: 105, rating: 4.5, reviewCount: 140, stock: 150,
    images: [IMG.desk, IMG.office], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: '20 clear pockets to organise & present.',
    description: 'Display book with 20 clear pockets — ideal for certificates, presentations and records.',
    variants: [],
  },
  {
    id: 'fl-box-file', name: 'Box File (Foolscap)', slug: 'box-file-foolscap',
    category: 'files-folders', brand: 'Worldone', price: 120, mrp: 140, rating: 4.4, reviewCount: 110, stock: 130,
    images: [IMG.office, IMG.desk], badges: [], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Heavy-duty box file for offices & shops.',
    description: 'Foolscap box file with lever-arch mechanism to store large volumes of paperwork.',
    variants: [],
  },

  // ---------------- OFFICE SUPPLIES ----------------
  {
    id: 'of-kangaro-stapler', name: 'Kangaro Stapler HP-45', slug: 'kangaro-stapler-hp45',
    category: 'office', brand: 'Kangaro', price: 95, mrp: 110, rating: 4.6, reviewCount: 380, stock: 160,
    images: [IMG.office, IMG.desk], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Reliable stapler with a box of pins.',
    description: 'Kangaro HP-45 stapler — smooth stapling for up to 12 sheets. Includes a box of staple pins.',
    variants: [],
  },
  {
    id: 'of-fevicol', name: 'Fevicol MR (100g)', slug: 'fevicol-mr-100g',
    category: 'office', brand: 'Fevicol', price: 45, mrp: 50, rating: 4.7, reviewCount: 720, stock: 400,
    images: [IMG.office, IMG.art], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'The trusted white adhesive for paper & craft.',
    description: 'Fevicol MR multipurpose white glue — strong bond for paper, card and craft. 100g bottle.',
    variants: [],
  },
  {
    id: 'of-fevistick', name: 'Fevistick Glue Stick (15g)', slug: 'fevistick-glue-15g',
    category: 'office', brand: 'Fevicol', price: 35, mrp: 40, rating: 4.5, reviewCount: 300, stock: 350,
    images: [IMG.art, IMG.office], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Clean, no-mess glue stick for quick sticking.',
    description: 'Fevistick glue stick — washable, non-toxic and easy to apply. 15g.',
    variants: [],
  },
  {
    id: 'of-cellotape', name: 'Cello Tape (Transparent, 1 inch)', slug: 'cello-tape-1inch',
    category: 'office', brand: 'Local', price: 25, mrp: 30, rating: 4.3, reviewCount: 260, stock: 500,
    images: [IMG.office, IMG.desk], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Everyday transparent adhesive tape.',
    description: '1-inch transparent adhesive tape for packing, sealing and repairs.',
    variants: [],
  },
  {
    id: 'of-oddy-sticky', name: 'Oddy Sticky Notes (Pastel Pack)', slug: 'oddy-sticky-notes',
    category: 'office', brand: 'Oddy', price: 50, mrp: 60, rating: 4.4, reviewCount: 210, stock: 300,
    images: [IMG.office, IMG.paper], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Self-stick notes for reminders & planning.',
    description: 'Oddy self-adhesive sticky notes in pastel shades — strong stick, clean removal.',
    variants: [],
  },
  {
    id: 'of-highlighter', name: 'Camlin Highlighters (Pack of 4)', slug: 'camlin-highlighters-4',
    category: 'office', brand: 'Camlin', price: 80, mrp: 90, rating: 4.5, reviewCount: 190, stock: 220,
    images: [IMG.pen1, IMG.office], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Bright fluorescent highlighters, 4 colours.',
    description: 'Camlin highlighters with quick-drying fluorescent ink and a chisel tip. Pack of 4.',
    variants: [],
  },
  {
    id: 'of-geometry-box', name: 'Nataraj Geometry Box', slug: 'nataraj-geometry-box',
    category: 'office', brand: 'Nataraj', price: 120, mrp: 140, rating: 4.5, reviewCount: 340, stock: 180,
    images: [IMG.school, IMG.desk], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Complete maths set: compass, scale, protractor.',
    description: 'Nataraj geometry box with compass, divider, scale, set squares, protractor, pencil and sharpener.',
    variants: [],
  },
  {
    id: 'of-scale', name: 'Steel Ruler / Scale (30 cm)', slug: 'steel-scale-30cm',
    category: 'office', brand: 'Local', price: 20, mrp: 25, rating: 4.3, reviewCount: 150, stock: 400,
    images: [IMG.desk, IMG.school], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Durable 30cm steel scale with clear markings.',
    description: 'Flexible 30cm stainless-steel ruler with precise millimetre and centimetre markings.',
    variants: [],
  },
  {
    id: 'of-scissors', name: 'Stationery Scissors (Medium)', slug: 'stationery-scissors',
    category: 'office', brand: 'Local', price: 40, mrp: 50, rating: 4.4, reviewCount: 130, stock: 250,
    images: [IMG.office, IMG.art], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Sharp, comfortable scissors for paper & craft.',
    description: 'Medium stainless-steel scissors with comfortable grip — for paper, craft and general use.',
    variants: [],
  },

  // ---------------- WRAPPING, RIBBON & STICKERS ----------------
  {
    id: 'wr-wrapping-paper', name: 'Gift Wrapping Paper (Pack of 5 Sheets)', slug: 'gift-wrapping-paper-5',
    category: 'wrapping', brand: 'Local', price: 50, mrp: 60, rating: 4.5, reviewCount: 280, stock: 300,
    images: [IMG.wrap, IMG.ribbon], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Assorted printed wrapping sheets for any occasion.',
    description: 'Pack of 5 assorted printed gift wrapping paper sheets — florals, dots, birthday and festive prints.',
    variants: [],
  },
  {
    id: 'wr-wrapping-roll', name: 'Printed Wrapping Paper Roll', slug: 'printed-wrapping-roll',
    category: 'wrapping', brand: 'Local', price: 60, mrp: 75, rating: 4.4, reviewCount: 160, stock: 200,
    images: [IMG.ribbon, IMG.wrap], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Large roll of glossy printed wrapping paper.',
    description: 'A generous roll of glossy printed wrapping paper — enough to wrap several gifts.',
    variants: [],
  },
  {
    id: 'wr-curling-ribbon', name: 'Decorative Curling Ribbon Roll', slug: 'curling-ribbon-roll',
    category: 'wrapping', brand: 'Local', price: 30, mrp: 35, rating: 4.3, reviewCount: 140, stock: 350,
    images: [IMG.ribbon, IMG.wrap], badges: [], bestSeller: false, newArrival: false, festival: null,
    shortDescription: 'Shiny curling ribbon to finish any wrap.',
    description: 'Glossy curling ribbon roll for gift wraps, balloons and decorations. Assorted colours.',
    variants: [
      { id: 'red', label: 'Red', priceDelta: 0 },
      { id: 'gold', label: 'Gold', priceDelta: 0 },
      { id: 'silver', label: 'Silver', priceDelta: 0 },
    ],
  },
  {
    id: 'wr-satin-ribbon', name: 'Satin Ribbon Roll', slug: 'satin-ribbon-roll',
    category: 'wrapping', brand: 'Local', price: 40, mrp: 50, rating: 4.4, reviewCount: 120, stock: 260,
    images: [IMG.ribbon, IMG.wrap], badges: [], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Smooth satin ribbon for premium wrapping.',
    description: 'Soft satin ribbon roll for bows, hampers and decoration. Assorted colours.',
    variants: [],
  },
  {
    id: 'wr-kids-stickers', name: 'Kids Fancy Stickers (Assorted Sheets)', slug: 'kids-fancy-stickers',
    category: 'wrapping', brand: 'Local', price: 20, mrp: 25, rating: 4.6, reviewCount: 340, stock: 500,
    images: [IMG.paper, IMG.art], badges: ['bestseller'], bestSeller: true, newArrival: false, festival: null,
    shortDescription: 'Fun sticker sheets kids love — cartoons, emojis & more.',
    description: 'Assorted fancy sticker sheets — cartoons, animals, emojis and stars. Great for kids and craft.',
    variants: [],
  },
  {
    id: 'wr-glitter-stickers', name: 'Glitter Foam Stickers Pack', slug: 'glitter-foam-stickers',
    category: 'wrapping', brand: 'Local', price: 35, mrp: 45, rating: 4.4, reviewCount: 160, stock: 300,
    images: [IMG.art, IMG.paper], badges: ['newarrival'], bestSeller: false, newArrival: true, festival: null,
    shortDescription: 'Sparkly foam stickers for craft & decoration.',
    description: 'Glitter foam stickers in assorted shapes — perfect for craft projects, cards and decoration.',
    variants: [],
  },
];

// Per-product image keyword so each product shows a matching photo.
// Tags are chosen to be reliable on LoremFlickr (some high-volume tags error out).
const IMAGE_KEYWORDS = {
  'pen-cello-butterflow': 'ballpen', 'pen-reynolds-045': 'ballpen', 'pen-reynolds-trimax': 'ballpen',
  'pen-linc-pentonic': 'ballpen', 'pen-doms-neon': 'ballpen', 'pen-uniball-eye': 'ballpen', 'pen-pilot-v5': 'ballpen',
  'nb-classmate-172': 'notebook', 'nb-classmate-200': 'notebook', 'nb-classmate-spiral': 'notebook',
  'nb-navneet-long': 'notebook', 'nb-navneet-160': 'notebook', 'nb-long-register': 'ledger',
  'pc-apsara-platinum': 'pencil', 'pc-nataraj-621': 'pencil', 'pc-doms-y1': 'pencil',
  'pc-apsara-eraser': 'eraser', 'pc-doms-sharpener': 'sharpener', 'pc-faber-trigrip': 'pencil',
  'ch-white': 'sheets', 'ch-colour': 'colorpaper', 'ch-neon': 'colorpaper', 'ch-pastel': 'colorpaper', 'ch-glazed': 'origami',
  'ar-doms-crayons': 'crayon', 'ar-faber-pastels': 'crayon', 'ar-camel-watercolour': 'watercolour',
  'ar-camlin-sketch': 'markers', 'ar-doms-sketch-24': 'markers', 'ar-fevicryl': 'painting',
  'fl-solo-report': 'documents', 'fl-clip-file': 'clipboard', 'fl-display-book': 'documents', 'fl-box-file': 'documents',
  'of-kangaro-stapler': 'staples', 'of-fevicol': 'glue', 'of-fevistick': 'glue', 'of-cellotape': 'tape',
  'of-oddy-sticky': 'notepad', 'of-highlighter': 'markers', 'of-geometry-box': 'compass',
  'of-scale': 'ruler', 'of-scissors': 'scissors',
  'wr-wrapping-paper': 'giftbox', 'wr-wrapping-roll': 'giftbox', 'wr-curling-ribbon': 'ribbon',
  'wr-satin-ribbon': 'ribbon', 'wr-kids-stickers': 'sticker', 'wr-glitter-stickers': 'sticker',
};

// Fallback (used if a keyword photo ever fails to load) — a verified, always-on
// stationery flat-lay from Unsplash. Referenced by the image components' onError.
export const PRODUCT_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80';

// Override the placeholder images with keyword-matched photos (2 per product,
// distinct seeds so the gallery shows different shots of the same item type).
products.forEach((p, i) => {
  const q = IMAGE_KEYWORDS[p.id] || 'stationery';
  p.images = [pic(q, i * 2 + 1), pic(q, i * 2 + 2)];
});

export const findProductBySlug = (slug) => products.find((p) => p.slug === slug);
export const findProductById = (id) => products.find((p) => p.id === id);
