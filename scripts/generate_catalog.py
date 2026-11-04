#!/usr/bin/env python3
"""
Generates data/products.json and the SVG product imagery in public/products/.
Run: python3 scripts/generate_catalog.py  (or npm run generate:images)
The output is committed, so this only needs re-running after catalog edits.
"""
import json, math, os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_JSON = os.path.join(ROOT, "data", "products.json")
OUT_IMG = os.path.join(ROOT, "public", "products")

APPAREL = ["XS", "S", "M", "L", "XL", "XXL"]
WAIST = ["28", "30", "32", "34", "36", "38"]
SOCKS = ["S/M", "L/XL"]

BLACK = ("Black", "#1C1C1E")

def C(name, hx): return {"name": name, "hex": hx}

DETAILS = {
  "Hoodie": ["480gsm brushed-back cotton fleece", "Double-layer hood with flat drawcords", "Dropped shoulder, boxy fit: take your usual size", "Garment-dyed and pre-shrunk", "Machine wash cold, hang dry"],
  "Zip Hoodie": ["420gsm loopback cotton", "Two-way metal zip", "Split kangaroo pocket", "Ribbed cuffs and hem", "Machine wash cold"],
  "Sweatshirt": ["400gsm loopback cotton", "Raglan sleeve, relaxed fit", "Ribbed crew neck with V insert", "Machine wash cold"],
  "Oversized Tee": ["240gsm heavyweight combed cotton", "Oversized fit with dropped shoulder", "Tight 2cm ribbed collar", "Screen-printed with water-based inks", "Machine wash cold, inside out"],
  "Long Sleeve Tee": ["220gsm combed cotton jersey", "Regular fit, longer sleeve", "Printed sleeve hit", "Machine wash cold"],
  "Cargo Pants": ["Cotton ripstop, 280gsm", "Six pockets including bellowed thigh pockets", "Adjustable toggle hems", "Relaxed straight leg", "YKK zip fly"],
  "Joggers": ["380gsm brushed fleece", "Elastic waist with internal drawcord", "Zip back pocket", "Tapered leg with ribbed cuff"],
  "Shorts": ["Lightweight recycled nylon", "Mesh lining", "Elastic waist with drawcord", "7-inch inseam"],
  "Sweat Shorts": ["380gsm brushed fleece", "Raw-cut hem", "Side seam pockets", "8-inch inseam"],
  "Jacket": ["Water-resistant shell", "Snap front closure", "Lightweight mesh lining", "Relaxed fit for layering"],
  "Varsity Jacket": ["Wool-blend body with faux-leather sleeves", "Quilted satin lining", "Chenille patch on chest", "Striped rib collar, cuffs and hem"],
  "Cap": ["Six-panel unstructured crown", "Embroidered front logo", "Adjustable strap with metal clasp", "One size fits most"],
  "Bucket Hat": ["Cotton twill", "Stitched brim", "Embroidered detail", "One size fits most"],
  "Beanie": ["Soft acrylic-wool blend rib knit", "Fold-over cuff", "Woven label", "One size"],
  "Socks": ["Combed cotton blend", "Cushioned sole", "Arch support band", "Pack of three"],
  "Tote": ["14oz natural cotton canvas", "Inner zip pocket", "Long handles fit over a shoulder", "Holds a laptop up to 15 inches"],
  "Backpack": ["Recycled 600D polyester", "Padded laptop sleeve, fits 16 inches", "Water-resistant base", "Front quick-access pocket"],
  "Bag": ["Recycled nylon", "Adjustable crossbody strap", "Two zip compartments", "Fits a phone, keys and a notebook"],
  "Lanyard": ["Woven polyester strap", "Metal swivel clip", "Detachable keyring", "Printed both sides"],
  "Football Shirt": ["Lightweight recycled polyester", "Moisture-wicking knit", "Embroidered heritage badge (unofficial design)", "Regular fit", "Not affiliated with any club or federation"],
  "Training Top": ["Stretch performance fabric", "Quarter zip with chin guard", "Thumb loops", "Slim fit", "Not affiliated with any club or federation"],
  "Track Jacket": ["Tricot polyester", "Full zip with stand collar", "Contrast taped sleeves", "Zip side pockets", "Not affiliated with any club or federation"],
  "Scarf": ["Jacquard-knit acrylic", "Approx. 140 x 18 cm", "Tassel ends", "Not affiliated with any club or federation"],
  "Football Socks": ["Ribbed knit, over the calf", "Cushioned foot", "Fits over shin pads", "One pair"],
  "Dragon": ["Printed in one piece: joints move straight off the bed", "Silk PLA, made from plant starch", "Every segment flexes and rotates", "Printed to order in our studio"],
  "Octopus": ["Print-in-place articulated tentacles", "PLA, soft-touch finish", "Safe for ages 8+ (small parts)", "Printed to order in our studio"],
  "Fidget": ["Print-in-place moving parts", "Quiet action, no assembly", "PLA, pocket sized", "Printed to order in our studio"],
  "Flexi Animal": ["Articulated body, prints in one piece", "Matte PLA", "Approx. 18 cm long", "Printed to order in our studio"],
  "Stand": ["Weighted PETG for stability", "Rubber feet included", "No assembly needed", "Printed to order in our studio"],
  "Keychain": ["Two-colour PLA print", "Split ring included", "Approx. 5 cm", "Printed to order in our studio"],
  "Organizer": ["Modular compartments", "Matte PLA", "Fits pens, cables and phone", "Printed to order in our studio"],
  "Model": ["Low-poly display piece", "Matte PLA with silk accents", "Approx. 15 cm tall", "Printed to order in our studio"],
}

P = []
def add(**k): P.append(k)

# ---------------- CLOTHING ----------------
add(slug="bell-heavyweight-hoodie", name="Bell Heavyweight Hoodie", category="clothing", type="Hoodie", art="hoodie", price=3900,
    colors=[C("Chalk Green", "#2E4A3D"), C("Ballpoint", "#22308F"), C("Ash", "#B5B8AF"), C(*BLACK)], sizes=APPAREL, badge="Bestseller",
    description="Our heaviest fleece, cut boxy with a hood that holds its shape. The one people ask about first.",
    tags=["hoodie", "fleece", "heavyweight", "layering"], createdAt="2026-03-02")
add(slug="detention-zip-hoodie", name="Detention Zip Hoodie", category="clothing", type="Zip Hoodie", art="ziphoodie", price=4200,
    colors=[C("Charcoal", "#3A3B3D"), C("Oatmeal", "#D3CBB9"), C("Navy", "#1C2340")], sizes=APPAREL,
    description="A two-way zip hoodie that works open over a tee or zipped to the chin on the walk home.",
    tags=["hoodie", "zip", "layering"], createdAt="2026-02-11")
add(slug="prefect-crewneck", name="Prefect Crewneck Sweatshirt", category="clothing", type="Sweatshirt", art="sweatshirt", price=3500,
    colors=[C("Heather Grey", "#A9ABA6"), C("Forest", "#284033"), C("Burgundy", "#5C1F2A")], sizes=APPAREL,
    description="A clean raglan crew with a small embroidered crest on the chest. Easy to wear with everything.",
    tags=["sweatshirt", "crewneck", "fleece"], createdAt="2026-01-20")
add(slug="margin-oversized-tee", name="Margin Oversized Tee", category="clothing", type="Oversized Tee", art="tee", price=1900,
    colors=[C("White", "#F1F1EC"), C(*BLACK), C("Faded Red", "#B8483A"), C("Sage", "#9CAF95")], sizes=APPAREL, badge="Bestseller",
    description="Heavyweight cotton, wide body, short sleeves that hit just above the elbow. Small margin-line print on the back.",
    tags=["tee", "oversized", "cotton", "summer"], createdAt="2026-04-14")
add(slug="recess-graphic-tee", name="Recess Graphic Tee", category="clothing", type="Oversized Tee", art="tee", price=2200,
    colors=[C("Ink", "#14206B"), C("Bone", "#E6E0CF")], sizes=APPAREL, badge="New",
    description="Front print of a hand-drawn playground map, printed in three colours on heavyweight cotton.",
    tags=["tee", "graphic", "oversized"], createdAt="2026-09-18")
add(slug="study-hall-long-sleeve", name="Study Hall Long Sleeve", category="clothing", type="Long Sleeve Tee", art="longsleeve", price=2400,
    colors=[C("White", "#F1F1EC"), C("Navy", "#1C2340"), C("Olive", "#5E6B45")], sizes=APPAREL,
    description="A long sleeve tee with a timetable print running down the left arm.",
    tags=["tee", "long sleeve", "layering"], createdAt="2026-08-27")
add(slug="field-trip-cargo-pants", name="Field Trip Cargo Pants", category="clothing", type="Cargo Pants", art="cargo", price=4900,
    colors=[C("Olive", "#5E6B45"), C(*BLACK), C("Stone", "#B7AC92")], sizes=WAIST, badge="Bestseller",
    description="Ripstop cargos with deep thigh pockets and toggle hems, so you can wear them stacked or cinched.",
    tags=["cargo", "pants", "ripstop", "utility"], createdAt="2026-02-25")
add(slug="late-bus-joggers", name="Late Bus Joggers", category="clothing", type="Joggers", art="jogger", price=3500,
    colors=[C("Heather Grey", "#A9ABA6"), C(*BLACK), C("Navy", "#1C2340")], sizes=APPAREL,
    description="Brushed fleece joggers that match the Bell Hoodie. Tapered, with a zip back pocket for your bus pass.",
    tags=["joggers", "fleece", "pants", "loungewear"], createdAt="2026-01-09")
add(slug="lunch-break-nylon-shorts", name="Lunch Break Nylon Shorts", category="clothing", type="Shorts", art="shorts", price=1900, compareAt=2800,
    colors=[C(*BLACK), C("Royal", "#2A3FE0"), C("Highlighter", "#E3EC4F")], sizes=APPAREL, badge="Sale",
    description="Quick-dry nylon shorts with a mesh liner. Good for five-a-side, good for doing nothing.",
    tags=["shorts", "nylon", "summer", "sport"], createdAt="2026-05-03")
add(slug="free-period-sweat-shorts", name="Free Period Sweat Shorts", category="clothing", type="Sweat Shorts", art="shorts", price=2500,
    colors=[C("Heather Grey", "#A9ABA6"), C("Chalk Green", "#2E4A3D")], sizes=APPAREL,
    description="Fleece shorts with a raw-cut hem and deep pockets.",
    tags=["shorts", "fleece", "loungewear"], createdAt="2026-05-20")
add(slug="hall-pass-coach-jacket", name="Hall Pass Coach Jacket", category="clothing", type="Jacket", art="jacket", price=5500,
    colors=[C(*BLACK), C("Navy", "#1C2340"), C("Forest", "#284033")], sizes=APPAREL,
    description="A light snap-front coach jacket with a large embroidered back hit. Shower resistant.",
    tags=["jacket", "outerwear", "lightweight"], createdAt="2026-03-30")
add(slug="homeroom-varsity-jacket", name="Homeroom Varsity Jacket", category="clothing", type="Varsity Jacket", art="jacket", price=8500,
    colors=[C("Green and Cream", "#2B4A38"), C("Navy and Grey", "#1C2340")], sizes=APPAREL, badge="New",
    description="Wool-blend body, faux-leather sleeves and a chenille AS patch. Built to last more than one school year.",
    tags=["jacket", "varsity", "outerwear", "winter"], createdAt="2026-09-29")
add(slug="rain-day-windbreaker", name="Rain Day Windbreaker", category="clothing", type="Jacket", art="jacket", price=5200,
    colors=[C("Royal", "#2A3FE0"), C("Highlighter", "#E3EC4F"), C(*BLACK)], sizes=APPAREL,
    description="Packable windbreaker with a hidden hood in the collar. Folds into its own chest pocket.",
    tags=["jacket", "windbreaker", "outerwear", "packable"], createdAt="2026-04-02")
add(slug="chalk-logo-cap", name="Chalk Logo Cap", category="clothing", type="Cap", art="cap", price=1500,
    colors=[C("Chalk Green", "#2E4A3D"), C("Navy", "#1C2340"), C("Stone", "#B7AC92"), C(*BLACK)],
    description="Unstructured six-panel cap with the After School wordmark stitched in chalk white.",
    tags=["cap", "hat", "headwear"], createdAt="2026-02-02")
add(slug="corridor-nylon-cap", name="Corridor Nylon Cap", category="clothing", type="Cap", art="cap", price=1700,
    colors=[C(*BLACK), C("Royal", "#2A3FE0")],
    description="Lightweight nylon cap with a short brim and a tonal rubber patch.",
    tags=["cap", "hat", "headwear", "nylon"], createdAt="2026-06-11")
add(slug="snow-day-beanie", name="Snow Day Beanie", category="clothing", type="Beanie", art="beanie", price=1400,
    colors=[C("Highlighter", "#E3EC4F"), C("Ballpoint", "#22308F"), C(*BLACK), C("Ash", "#B5B8AF")], badge="New",
    description="Chunky rib beanie with a deep fold-over cuff.",
    tags=["beanie", "hat", "headwear", "winter"], createdAt="2026-09-22")
add(slug="bell-pom-beanie", name="Bell Pom Beanie", category="clothing", type="Beanie", art="pombeanie", price=1500,
    colors=[C("Burgundy", "#5C1F2A"), C("Forest", "#284033")],
    description="A classic bobble beanie with a jacquard After School band.",
    tags=["beanie", "hat", "headwear", "winter"], createdAt="2025-11-12")
add(slug="gym-kit-crew-socks", name="Gym Kit Crew Socks (3 pack)", category="clothing", type="Socks", art="socks", price=1000,
    colors=[C("White", "#F1F1EC"), C(*BLACK)], sizes=SOCKS,
    description="Three pairs of cushioned crew socks with a striped top. The pair you'll actually reach for.",
    tags=["socks", "accessories", "multipack"], createdAt="2026-01-15")
add(slug="locker-canvas-tote", name="Locker Canvas Tote", category="clothing", type="Tote", art="tote", price=1200,
    colors=[C("Natural", "#DDD3BC"), C(*BLACK)],
    description="Heavy canvas tote with an inner zip pocket for anything you can't lose.",
    tags=["bag", "tote", "accessories"], createdAt="2026-03-08")
add(slug="satchel-22l-backpack", name="Satchel 22L Backpack", category="clothing", type="Backpack", art="backpack", price=4200,
    colors=[C(*BLACK), C("Olive", "#5E6B45"), C("Navy", "#1C2340")],
    description="A clean 22-litre daypack with a padded laptop sleeve and a quick-grab front pocket.",
    tags=["bag", "backpack", "accessories"], createdAt="2026-07-17")
add(slug="pencil-case-crossbody", name="Pencil Case Crossbody Bag", category="clothing", type="Bag", art="pouch", price=1900,
    colors=[C("Highlighter", "#E3EC4F"), C(*BLACK), C("Royal", "#2A3FE0")],
    description="A small crossbody shaped like an oversized pencil case. Phone, keys, lip balm, done.",
    tags=["bag", "crossbody", "accessories"], createdAt="2026-06-30")
add(slug="hall-pass-lanyard", name="Hall Pass Lanyard", category="clothing", type="Lanyard", art="keychain", price=600,
    colors=[C("Ballpoint", "#22308F"), C("Highlighter", "#E3EC4F")],
    description="Woven lanyard with a swivel clip. Keys, travel card or ID, always in reach.",
    tags=["lanyard", "accessories", "keys"], createdAt="2026-04-22")

# ---------------- FOOTBALL ----------------
add(slug="samba-gold-retro-shirt", name="Samba Gold '94 Retro Shirt", category="football", type="Football Shirt", art="jersey", pattern="solid", trim="#1E7A3C", price=3200,
    colors=[C("Gold", "#F2D22E")], sizes=APPAREL, badge="Bestseller",
    description="Inspired by Brazil's golden summers. A canary yellow shirt with green collar and cuffs, in a relaxed retro cut.",
    tags=["shirt", "jersey", "national team", "retro", "brazil"], createdAt="2026-05-28")
add(slug="azzurri-classic-shirt", name="Azzurri Classic Home Shirt", category="football", type="Football Shirt", art="jersey", pattern="solid", trim="#F1F1EC", price=3200,
    colors=[C("Azzurro", "#1F5FB8")], sizes=APPAREL,
    description="An Italy-inspired shirt in deep sky blue with a white button collar. Clean, classic, no sponsor.",
    tags=["shirt", "jersey", "national team", "italy"], createdAt="2026-05-12")
add(slug="albiceleste-stripe-shirt", name="Albiceleste Stripe Shirt", category="football", type="Football Shirt", art="jersey", pattern="stripes", trim="#F1F1EC", price=3400,
    colors=[C("Sky and White", "#7FB7E6")], sizes=APPAREL, badge="New",
    description="Sky blue and white vertical stripes inspired by Argentina, with a black crew collar.",
    tags=["shirt", "jersey", "national team", "argentina", "stripes"], createdAt="2026-09-05")
add(slug="sixty-six-retro-shirt", name="Sixty-Six Retro Shirt", category="football", type="Football Shirt", art="jersey", pattern="solid", trim="#C8102E", price=3000,
    colors=[C("White", "#F1F1EC"), C("Red", "#C8102E")], sizes=APPAREL,
    description="A nod to England's 1966 summer: crew neck, long-staple cotton feel, and a single red trim line.",
    tags=["shirt", "jersey", "national team", "england", "retro"], createdAt="2026-04-30")
add(slug="oranje-fan-shirt", name="Oranje Fan Shirt", category="football", type="Football Shirt", art="jersey", pattern="halves", trim="#1C2340", price=2800, compareAt=3800,
    colors=[C("Orange", "#F27A1A")], sizes=APPAREL, badge="Sale",
    description="A loud orange shirt inspired by the Netherlands, with a tonal halves pattern you only see up close.",
    tags=["shirt", "jersey", "national team", "netherlands"], createdAt="2026-03-18")
add(slug="green-hoops-shirt", name="Green Hoops Shirt", category="football", type="Football Shirt", art="jersey", pattern="hoops", trim="#F1F1EC", price=3000,
    colors=[C("Green and White", "#178A4C")], sizes=APPAREL,
    description="Bold green and white hoops in the Glasgow tradition. Unbadged, lightweight and made for the stands.",
    tags=["shirt", "jersey", "club", "hoops", "glasgow"], createdAt="2026-08-08")
add(slug="milano-stripes-shirt", name="Milano Stripes Shirt", category="football", type="Football Shirt", art="jersey", pattern="stripes", trim="#1C1C1E", price=3400,
    colors=[C("Red and Black", "#C21F2E")], sizes=APPAREL,
    description="Red and black stripes inspired by Milan's football history. Slim retro cut, rib collar.",
    tags=["shirt", "jersey", "club", "stripes", "milan"], createdAt="2026-07-02")
add(slug="les-bleus-training-top", name="Les Bleus Training Top", category="football", type="Training Top", art="trainingtop", trim="#C8102E", price=2900,
    colors=[C("Navy", "#1B2A5E"), C("White", "#F1F1EC")], sizes=APPAREL,
    description="A France-inspired quarter-zip training top with a tricolour stripe on the collar.",
    tags=["training", "top", "national team", "france"], createdAt="2026-06-04")
add(slug="madrid-white-track-jacket", name="Madrid White Track Jacket", category="football", type="Track Jacket", art="trackjacket", trim="#C9A23B", price=3900,
    colors=[C("White", "#F1F1EC")], sizes=APPAREL,
    description="All-white track jacket with gold taped sleeves, inspired by the Spanish capital's most famous kit.",
    tags=["jacket", "track", "club", "madrid", "training"], createdAt="2026-08-21")
add(slug="northern-red-track-jacket", name="Northern Red Track Jacket", category="football", type="Track Jacket", art="trackjacket", trim="#F1F1EC", price=3800,
    colors=[C("Red", "#C8102E"), C("Black", "#1C1C1E")], sizes=APPAREL,
    description="A classic red tricot track jacket for cold away days up north.",
    tags=["jacket", "track", "club", "training"], createdAt="2026-02-17")
add(slug="matchday-bar-scarf", name="Matchday Bar Scarf", category="football", type="Scarf", art="scarf", price=1200,
    colors=[C("Red and White", "#C8102E"), C("Blue and White", "#1F5FB8"), C("Green and White", "#178A4C"), C("Black and White", "#1C1C1E")], badge="Bestseller",
    description="A thick knit bar scarf in classic two-colour blocks. Pick your colours, hold it up at kick off.",
    tags=["scarf", "matchday", "winter", "accessories"], createdAt="2025-10-28")
add(slug="nations-knit-scarf", name="Nations Knit Scarf", category="football", type="Scarf", art="scarf", price=1300,
    colors=[C("Gold and Green", "#F2D22E"), C("Orange and Navy", "#F27A1A"), C("Sky and White", "#7FB7E6")],
    description="Jacquard scarf in national-team-inspired colourways. Big tassels, soft hand-feel.",
    tags=["scarf", "national team", "winter", "accessories"], createdAt="2026-09-12")
add(slug="terrace-bucket-hat", name="Terrace Bucket Hat", category="football", type="Bucket Hat", art="bucket", price=1400,
    colors=[C("Red", "#C8102E"), C("Royal", "#2A3FE0"), C("Green", "#178A4C")],
    description="Cotton twill bucket hat with an embroidered ball motif. Made for summer tournaments.",
    tags=["hat", "bucket", "matchday", "headwear"], createdAt="2026-05-25")
add(slug="terrace-bobble-hat", name="Terrace Bobble Hat", category="football", type="Beanie", art="pombeanie", price=1300,
    colors=[C("Red and White", "#C8102E"), C("Blue and White", "#1F5FB8")],
    description="Striped bobble hat for winter evening kick-offs.",
    tags=["beanie", "hat", "matchday", "winter"], createdAt="2025-12-01")
add(slug="pitchside-backpack", name="Pitchside Boot Backpack", category="football", type="Backpack", art="backpack", price=3800,
    colors=[C(*BLACK), C("Navy", "#1C2340")],
    description="A 28L backpack with a vented boot compartment at the base and a fleece-lined phone pocket.",
    tags=["bag", "backpack", "training", "accessories"], createdAt="2026-07-24")
add(slug="matchday-football-socks", name="Matchday Football Socks", category="football", type="Football Socks", art="footballsocks", price=800,
    colors=[C("White", "#F1F1EC"), C("Black", "#1C1C1E"), C("Red", "#C8102E")], sizes=["Junior", "Adult"],
    description="Over-the-calf ribbed football socks. Fit over shin pads, stay up all ninety.",
    tags=["socks", "training", "accessories"], createdAt="2026-03-11")

# ---------------- 3D PRINTED ----------------
add(slug="articulated-crystal-dragon", name="Articulated Crystal Dragon (60 cm)", category="3d-printed", type="Dragon", art="dragon", price=2900,
    colors=[C("Galaxy Purple", "#5B3D9E"), C("Emerald", "#1E8C5A"), C("Silk Gold", "#C9A23B"), C("Fire Red", "#C8352B")], badge="Bestseller",
    description="Our biggest dragon: 60 cm of fully articulated silk PLA. Every segment moves, printed in one piece with no assembly.",
    tags=["dragon", "articulated", "collectible", "large"], createdAt="2026-01-30")
add(slug="mini-articulated-dragon", name="Mini Articulated Dragon (25 cm)", category="3d-printed", type="Dragon", art="dragon", price=1000,
    colors=[C("Rainbow Silk", "#D0459B"), C("Ocean Blue", "#1F6FB8"), C("Glow Green", "#7DDC5A")],
    description="The pocket version of our bestseller. Wiggles, coils and sits on a monitor.",
    tags=["dragon", "articulated", "fidget", "small"], createdAt="2026-03-21")
add(slug="skeleton-dragon", name="Skeleton Dragon", category="3d-printed", type="Dragon", art="dragon", price=2100,
    colors=[C("Bone White", "#E6E0CF"), C("Glow in the Dark", "#9BE06B")], badge="New",
    description="A bony, spine-ridged dragon with a skull head. The glow version charges under a desk lamp.",
    tags=["dragon", "articulated", "collectible", "halloween"], createdAt="2026-09-25")
add(slug="articulated-octopus", name="Articulated Octopus", category="3d-printed", type="Octopus", art="octopus", price=1000,
    colors=[C("Silk Pink", "#E46A9A"), C("Teal", "#1E9C9A"), C("Purple", "#6E46B8")], badge="Bestseller",
    description="Eight flexing tentacles, big googly eyes and a weighted body that sits upright on a desk.",
    tags=["octopus", "articulated", "fidget", "sea creature"], createdAt="2026-02-08")
add(slug="baby-octopus-keyring", name="Baby Octopus Keyring", category="3d-printed", type="Keychain", art="octopus", price=500,
    colors=[C("Coral", "#EE6A4E"), C("Lilac", "#A88AD8"), C("Mint", "#7DD3B4")],
    description="A tiny articulated octopus on a split ring. Fidget on the go.",
    tags=["octopus", "keychain", "fidget", "small"], createdAt="2026-06-19")
add(slug="infinity-fidget-cube", name="Infinity Fidget Cube", category="3d-printed", type="Fidget", art="cube", price=700,
    colors=[C("Black and Yellow", "#1C1C1E"), C("White and Blue", "#F1F1EC")],
    description="Eight linked cubes that fold endlessly in your hand. Quiet enough for class.",
    tags=["fidget", "cube", "desk toy"], createdAt="2026-04-09")
add(slug="gear-fidget-spinner", name="Gear Fidget Spinner", category="3d-printed", type="Fidget", art="spinner", price=600, compareAt=900,
    colors=[C("Silk Copper", "#B8683B"), C("Silk Silver", "#A8ADB4")], badge="Sale",
    description="A three-gear spinner with interlocking teeth that turn together as it spins.",
    tags=["fidget", "spinner", "desk toy", "gears"], createdAt="2026-05-06")
add(slug="flexi-axolotl", name="Flexi Axolotl", category="3d-printed", type="Flexi Animal", art="axolotl", price=800,
    colors=[C("Pink", "#F2A1B8"), C("Wild Brown", "#7A5B45"), C("Gold", "#E2B84A")], badge="Bestseller",
    description="A wiggly articulated axolotl with feathery gills and a permanent smile.",
    tags=["flexi", "axolotl", "articulated", "animal"], createdAt="2026-02-28")
add(slug="flexi-shark", name="Flexi Shark", category="3d-printed", type="Flexi Animal", art="shark", price=800,
    colors=[C("Ocean Grey", "#6F8494"), C("Great White", "#DADDE0")],
    description="A segmented shark that swims across your desk. Tail flicks side to side.",
    tags=["flexi", "shark", "articulated", "animal", "sea creature"], createdAt="2026-07-07")
add(slug="flexi-lizard", name="Flexi Lizard", category="3d-printed", type="Flexi Animal", art="lizard", price=700,
    colors=[C("Leaf Green", "#4E9A3A"), C("Sand", "#C9AF7A")],
    description="A long-tailed lizard with articulated legs. Drapes over a pencil pot.",
    tags=["flexi", "lizard", "articulated", "animal"], createdAt="2026-08-14")
add(slug="desk-phone-stand", name="Desk Phone Stand", category="3d-printed", type="Stand", art="phonestand", price=1000,
    colors=[C("Matte Black", "#1C1C1E"), C("Chalk White", "#ECEDE8"), C("Ballpoint", "#22308F")],
    description="Holds your phone at a readable angle, portrait or landscape, with a slot for the charging cable.",
    tags=["stand", "phone", "desk", "organiser"], createdAt="2026-03-03")
add(slug="dual-controller-stand", name="Dual Controller Stand", category="3d-printed", type="Stand", art="controllerstand", price=1600,
    colors=[C("Matte Black", "#1C1C1E"), C("Chalk White", "#ECEDE8")], badge="New",
    description="Stacks two game controllers neatly, with a cable channel at the back. Fits most console pads.",
    tags=["stand", "gaming", "controller", "desk"], createdAt="2026-09-15")
add(slug="headphone-stand", name="Arc Headphone Stand", category="3d-printed", type="Stand", art="headphonestand", price=1700,
    colors=[C("Matte Black", "#1C1C1E"), C("Stone Grey", "#8C8E88"), C("Highlighter", "#E3EC4F")],
    description="A curved headphone stand with a weighted base so it won't tip when you grab your headset.",
    tags=["stand", "headphones", "gaming", "desk"], createdAt="2026-04-26")
add(slug="modular-desk-organizer", name="Modular Desk Organiser", category="3d-printed", type="Organizer", art="organizer", price=1600,
    colors=[C("Chalk White", "#ECEDE8"), C("Sage", "#9CAF95"), C("Matte Black", "#1C1C1E")],
    description="Three clip-together trays for pens, cables and your phone. Rearrange them however your desk needs.",
    tags=["organiser", "desk", "storage"], createdAt="2026-01-26")
add(slug="initial-keychain", name="Initial Keychain", category="3d-printed", type="Keychain", art="keychain", price=400,
    colors=[C("Ballpoint", "#22308F"), C("Highlighter", "#E3EC4F"), C("Red", "#C8352B"), C("Black", "#1C1C1E")],
    sizes=list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
    description="A chunky two-colour keychain with your initial. Pick a letter as the size option.",
    tags=["keychain", "personalised", "gift", "small"], createdAt="2026-06-08")
add(slug="low-poly-planet", name="Low-Poly Ringed Planet", category="3d-printed", type="Model", art="planet", price=1200,
    colors=[C("Saturn Sand", "#D7B577"), C("Neptune Blue", "#3A66C8")],
    description="A faceted ringed planet on a slim stand. Looks good on a shelf next to the dragon.",
    tags=["model", "decor", "space", "collectible"], createdAt="2026-07-29")
add(slug="faceted-crystal-ornament", name="Faceted Crystal Ornament", category="3d-printed", type="Model", art="gem", price=900,
    colors=[C("Amethyst", "#7D52C2"), C("Emerald", "#1E8C5A"), C("Ruby", "#B8233A")],
    description="An oversized gemstone printed in translucent silk PLA. Catches window light beautifully.",
    tags=["model", "decor", "collectible", "gift"], createdAt="2026-05-15")
add(slug="moonshot-rocket-model", name="Moonshot Rocket Model", category="3d-printed", type="Model", art="rocket", price=1300,
    colors=[C("White and Red", "#ECEDE8"), C("Black and Gold", "#1C1C1E")],
    description="A retro rocket model with a removable nose cone that doubles as a tiny stash box.",
    tags=["model", "decor", "space", "storage"], createdAt="2026-08-30")

# ---------------- helpers ----------------
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def tohex(t): return '#%02x%02x%02x' % tuple(max(0, min(255, int(v))) for v in t)
def shade(h, f):
    r, g, b = hx(h)
    if f < 0: return tohex((r*(1+f), g*(1+f), b*(1+f)))
    return tohex((r+(255-r)*f, g+(255-g)*f, b+(255-b)*f))
def lum(h):
    r, g, b = hx(h); return (0.299*r + 0.587*g + 0.114*b) / 255

BG = {
    "clothing": ("#46474D", "#111214"),
    "football": ("#24402F", "#0B140F"),
    "3d-printed": ("#2B3140", "#0F1117"),
}

def backdrop(cat, alt=False):
    center, edge = BG[cat]
    cy = "40%" if not alt else "50%"
    s = (f'<defs><radialGradient id="bg" cx="50%" cy="{cy}" r="75%"><stop offset="0" stop-color="{center}"/>'
         f'<stop offset="1" stop-color="{edge}"/></radialGradient></defs><rect width="600" height="750" fill="url(#bg)"/>')
    if cat == "football":
        s += '<g fill="none" stroke="#ffffff" stroke-opacity=".05" stroke-width="2"><circle cx="300" cy="375" r="150"/><line x1="0" y1="375" x2="600" y2="375"/><rect x="150" y="-2" width="300" height="120"/><rect x="150" y="632" width="300" height="120"/></g>'
    elif cat == "3d-printed":
        s += '<g stroke="#ffffff" stroke-opacity=".035" stroke-width="1">' + ''.join(f'<line x1="{x}" y1="0" x2="{x}" y2="750"/>' for x in range(0, 601, 30)) + ''.join(f'<line x1="0" y1="{y}" x2="600" y2="{y}"/>' for y in range(0, 751, 30)) + '</g>'
    s += '<ellipse cx="300" cy="690" rx="210" ry="20" fill="#000" fill-opacity=".45"/>'
    return s

def sleeve_body(c, d, long=True):
    if long:
        return f'<path d="M150 290 L215 228 Q300 205 385 228 L450 290 L525 540 L470 558 L425 420 L425 650 L175 650 L175 420 L130 558 L75 540 Z" fill="{c}"/><rect x="72" y="532" width="58" height="34" rx="6" transform="rotate(-16 100 549)" fill="{d}"/><rect x="470" y="532" width="58" height="34" rx="6" transform="rotate(16 500 549)" fill="{d}"/><rect x="175" y="620" width="250" height="30" fill="{d}"/>'
    return f'<path d="M170 250 L240 212 Q300 238 360 212 L430 250 L525 345 L462 405 L425 365 L425 650 L175 650 L175 365 L138 405 L75 345 Z" fill="{c}"/>'

def art(kind, c, p):
    d = shade(c, -0.22); l = shade(c, 0.25)
    ink = "#1C1C1E" if lum(c) > 0.6 else "#F1F1EC"
    trim = p.get("trim", d)
    if kind in ("hoodie", "ziphoodie"):
        s = sleeve_body(c, d)
        s += f'<path d="M210 238 Q212 135 300 130 Q388 135 390 238 Q300 285 210 238 Z" fill="{c}"/><path d="M248 236 Q252 172 300 168 Q348 172 352 236 Q300 262 248 236 Z" fill="{d}"/>'
        if kind == "ziphoodie":
            s += f'<line x1="300" y1="258" x2="300" y2="650" stroke="{d}" stroke-width="6"/><line x1="300" y1="258" x2="300" y2="650" stroke="{l}" stroke-width="2" stroke-dasharray="4 4"/><path d="M200 500 L285 500 L285 590 L190 590 Z M315 500 L400 500 L410 590 L315 590 Z" fill="none" stroke="{d}" stroke-width="4"/>'
        else:
            s += f'<path d="M210 500 L390 500 L410 592 L190 592 Z" fill="none" stroke="{d}" stroke-width="4"/><path d="M282 255 L278 340 M318 255 L322 340" stroke="{l}" stroke-width="5" stroke-linecap="round"/>'
            s += f'<text x="300" y="420" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="34" fill="{ink}" opacity=".85">AFTER SCHOOL</text>'
        return s
    if kind == "sweatshirt":
        s = sleeve_body(c, d) + f'<path d="M245 222 Q300 262 355 222" fill="none" stroke="{d}" stroke-width="16"/><path d="M290 250 L300 268 L310 250" fill="{d}"/><circle cx="360" cy="330" r="18" fill="none" stroke="{ink}" stroke-width="4" opacity=".8"/>'
        return s
    if kind in ("tee", "longsleeve"):
        if kind == "tee":
            s = sleeve_body(c, d, long=False)
        else:
            s = sleeve_body(c, d, long=True) + f'<line x1="98" y1="470" x2="140" y2="330" stroke="{ink}" stroke-width="3" stroke-dasharray="10 8" opacity=".6"/>'
        s += f'<path d="M243 220 Q300 262 357 220" fill="none" stroke="{d}" stroke-width="12"/>'
        s += f'<text x="300" y="400" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="40" fill="{ink}" opacity=".85">AS</text><line x1="235" y1="420" x2="365" y2="420" stroke="#E2412E" stroke-width="3"/>'
        return s
    if kind in ("jacket", "trackjacket", "trainingtop"):
        s = sleeve_body(c, d)
        if kind == "trackjacket":
            s += f'<path d="M150 290 L75 540 M450 290 L525 540" stroke="{trim}" stroke-width="14"/><path d="M262 214 L300 236 L338 214 L338 190 L262 190 Z" fill="{c}" stroke="{d}" stroke-width="3"/><line x1="300" y1="236" x2="300" y2="650" stroke="{d}" stroke-width="6"/><rect x="335" y="300" width="22" height="22" fill="none" stroke="{trim}" stroke-width="3"/>'
        elif kind == "trainingtop":
            s += f'<path d="M262 214 L300 232 L338 214 L338 186 L262 186 Z" fill="{c}" stroke="{d}" stroke-width="3"/><rect x="262" y="186" width="76" height="8" fill="{trim}"/><line x1="300" y1="232" x2="300" y2="360" stroke="{d}" stroke-width="6"/><path d="M175 430 L425 470" stroke="{trim}" stroke-width="8" opacity=".8"/>'
        else:
            s += f'<path d="M232 222 L300 285 L368 222 L352 196 L300 236 L248 196 Z" fill="{d}"/><line x1="300" y1="285" x2="300" y2="650" stroke="{d}" stroke-width="4"/>'
            s += ''.join(f'<circle cx="312" cy="{y}" r="5" fill="{l}"/>' for y in (330, 400, 470, 540, 610))
            s += f'<path d="M200 520 L270 520 L270 580 L200 580 Z M330 520 L400 520 L400 580 L330 580 Z" fill="none" stroke="{d}" stroke-width="4"/>'
        return s
    if kind in ("cargo", "jogger"):
        s = f'<path d="M200 150 L400 150 L425 660 L318 660 L300 330 L282 660 L175 660 Z" fill="{c}"/><rect x="198" y="150" width="204" height="30" fill="{d}"/><line x1="300" y1="180" x2="300" y2="300" stroke="{d}" stroke-width="3"/>'
        if kind == "cargo":
            s += f'<rect x="188" y="390" width="62" height="92" rx="6" fill="{d}"/><rect x="350" y="390" width="62" height="92" rx="6" fill="{d}"/><rect x="188" y="390" width="62" height="22" fill="{shade(c,-.35)}"/><rect x="350" y="390" width="62" height="22" fill="{shade(c,-.35)}"/><path d="M180 640 L280 640 M320 640 L420 640" stroke="{d}" stroke-width="5" stroke-dasharray="6 6"/>'
        else:
            s += f'<rect x="176" y="630" width="106" height="30" fill="{d}"/><rect x="318" y="630" width="106" height="30" fill="{d}"/><path d="M285 180 L282 250 M315 180 L318 250" stroke="{l}" stroke-width="5" stroke-linecap="round"/>'
        return s
    if kind == "shorts":
        return f'<path d="M185 230 L415 230 L445 500 L318 500 L300 345 L282 500 L155 500 Z" fill="{c}"/><rect x="183" y="230" width="234" height="32" fill="{d}"/><path d="M290 262 L286 320 M310 262 L314 320" stroke="{l}" stroke-width="5" stroke-linecap="round"/><line x1="160" y1="470" x2="282" y2="470" stroke="{d}" stroke-width="3"/><line x1="318" y1="470" x2="440" y2="470" stroke="{d}" stroke-width="3"/>'
    if kind == "cap":
        return f'<path d="M165 430 Q165 230 300 222 Q435 230 435 430 Z" fill="{c}"/><path d="M300 224 L300 430 M232 240 Q205 330 215 430 M368 240 Q395 330 385 430" stroke="{d}" stroke-width="3" fill="none"/><circle cx="300" cy="226" r="10" fill="{d}"/><path d="M160 425 Q320 395 485 440 Q535 480 470 492 Q320 462 160 450 Z" fill="{d}"/><text x="300" y="370" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="38" fill="{ink}">AS</text>'
    if kind == "bucket":
        return f'<path d="M200 430 L222 260 Q300 236 378 260 L400 430 Z" fill="{c}"/><path d="M120 470 Q300 400 480 470 Q490 500 460 505 Q300 455 140 505 Q110 500 120 470 Z" fill="{d}"/><path d="M200 430 Q300 412 400 430" stroke="{d}" stroke-width="5" fill="none"/><circle cx="300" cy="340" r="26" fill="none" stroke="{ink}" stroke-width="4"/><path d="M300 314 L300 366 M274 340 L326 340" stroke="{ink}" stroke-width="3"/>'
    if kind in ("beanie", "pombeanie"):
        s = f'<path d="M175 480 Q175 240 300 232 Q425 240 425 480 Z" fill="{c}"/>'
        s += ''.join(f'<line x1="{x}" y1="270" x2="{x}" y2="470" stroke="{d}" stroke-width="3" opacity=".5"/>' for x in range(205, 400, 22))
        s += f'<rect x="165" y="450" width="270" height="110" rx="18" fill="{d}"/>' + ''.join(f'<line x1="{x}" y1="458" x2="{x}" y2="552" stroke="{shade(c,-.38)}" stroke-width="3"/>' for x in range(180, 430, 14))
        if kind == "pombeanie":
            s += f'<rect x="175" y="360" width="250" height="40" fill="{"#F1F1EC" if lum(c) < .7 else "#1C1C1E"}" opacity=".9"/><circle cx="300" cy="215" r="58" fill="{l}"/>'
        else:
            s += f'<rect x="262" y="490" width="76" height="30" rx="3" fill="{ink}"/>'
        return s
    if kind in ("socks", "footballsocks"):
        def sock(dx, rot):
            top = 140 if kind == "footballsocks" else 220
            return f'<g transform="translate({dx} 0) rotate({rot} 300 400)"><path d="M250 {top} L340 {top} L340 520 Q340 590 400 600 L430 606 Q470 615 462 650 Q455 680 410 676 L300 664 Q250 656 250 590 Z" fill="{c}"/><rect x="250" y="{top}" width="90" height="46" fill="{d}"/><rect x="250" y="{top+60}" width="90" height="10" fill="{"#E2412E" if kind=="socks" else d}"/><rect x="250" y="{top+78}" width="90" height="10" fill="{"#2A3FE0" if kind=="socks" else d}"/><path d="M410 676 Q455 680 462 650 Q470 615 430 606 Z" fill="{d}"/></g>'
        return sock(-70, -6) + sock(60, 4)
    if kind == "tote":
        return f'<path d="M230 300 Q230 150 300 150 Q370 150 370 300" fill="none" stroke="{d}" stroke-width="18"/><path d="M160 290 L440 290 L460 660 L140 660 Z" fill="{c}"/><text x="300" y="480" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="44" fill="{ink}">AFTER</text><text x="300" y="530" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="44" fill="{ink}">SCHOOL</text>'
    if kind == "backpack":
        return f'<path d="M262 170 Q262 128 300 128 Q338 128 338 170" fill="none" stroke="{d}" stroke-width="14"/><rect x="175" y="165" width="250" height="490" rx="70" fill="{c}"/><rect x="215" y="420" width="170" height="180" rx="30" fill="{d}"/><line x1="215" y1="450" x2="385" y2="450" stroke="{l}" stroke-width="4"/><rect x="270" y="240" width="60" height="18" rx="9" fill="{d}"/><path d="M175 230 Q140 400 175 600 M425 230 Q460 400 425 600" stroke="{d}" stroke-width="16" fill="none"/>'
    if kind == "pouch":
        return f'<path d="M140 400 Q300 140 470 300" fill="none" stroke="{d}" stroke-width="12"/><rect x="120" y="380" width="360" height="180" rx="80" fill="{c}"/><line x1="160" y1="410" x2="440" y2="410" stroke="{d}" stroke-width="8"/><rect x="420" y="398" width="18" height="38" rx="4" fill="{"#1C1C1E" if lum(c)>.5 else "#E3EC4F"}"/><text x="300" y="505" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="36" fill="{ink}">AS</text>'
    if kind == "keychain":
        ch = p.get("letter", "A")
        return f'<circle cx="300" cy="210" r="70" fill="none" stroke="#9AA0A6" stroke-width="12"/><rect x="290" y="270" width="20" height="60" rx="6" fill="#9AA0A6"/><rect x="190" y="320" width="220" height="300" rx="46" fill="{c}"/><circle cx="300" cy="360" r="16" fill="#16171A"/><text x="300" y="560" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="170" fill="{ink}">{ch}</text>'
    if kind == "jersey":
        pat = p.get("pattern", "solid")
        body = sleeve_body(c, d, long=False)
        s = f'<defs><clipPath id="jc"><path d="M170 250 L240 212 Q300 238 360 212 L430 250 L525 345 L462 405 L425 365 L425 650 L175 650 L175 365 L138 405 L75 345 Z"/></clipPath></defs>' + body
        s += '<g clip-path="url(#jc)">'
        if pat == "stripes":
            s += ''.join(f'<rect x="{x}" y="180" width="38" height="480" fill="{trim}"/>' for x in range(98, 520, 76))
        elif pat == "hoops":
            s += ''.join(f'<rect x="60" y="{y}" width="480" height="44" fill="{trim}"/>' for y in range(240, 660, 88))
        elif pat == "halves":
            s += f'<rect x="300" y="180" width="240" height="480" fill="{d}" opacity=".35"/>'
        s += '</g>'
        s += f'<path d="M243 220 Q300 262 357 220" fill="none" stroke="{trim if pat=="solid" else d}" stroke-width="14"/><path d="M75 345 L138 405 M525 345 L462 405" stroke="{trim}" stroke-width="10"/>'
        s += f'<path d="M352 290 L384 290 L384 318 Q368 338 352 318 Z" fill="{ink if pat=="solid" else "#F1F1EC"}" opacity=".9"/>'
        return s
    if kind == "scarf":
        cols = [c, "#F1F1EC" if lum(c) < .75 else "#1C2340"]
        if "Green" in p.get("_colorname", "") and "Gold" in p.get("_colorname", ""): cols = [c, "#1E7A3C"]
        if "Navy" in p.get("_colorname", ""): cols = [c, "#1C2340"]
        s = '<g transform="rotate(-28 300 375)">'
        for i in range(10):
            s += f'<rect x="240" y="{70+i*62}" width="120" height="62" fill="{cols[i%2]}"/>'
        s += ''.join(f'<line x1="{x}" y1="690" x2="{x}" y2="740" stroke="{c}" stroke-width="6"/><line x1="{x}" y1="10" x2="{x}" y2="70" stroke="{c}" stroke-width="6"/>' for x in range(248, 360, 14))
        return s + '</g>'
    if kind == "dragon":
        s = ''
        n = 16
        pts = []
        for i in range(n):
            t = i / (n-1)
            x = 130 + t*360
            y = 330 + math.sin(t*math.pi*1.6 + .3)*150
            pts.append((x, y, 46 - t*30))
        for i in range(n-1, -1, -1):
            x, y, r = pts[i]
            col = c if i % 2 == 0 else l
            s += f'<polygon points="{x},{y-r*1.9} {x-r*.45},{y-r*.6} {x+r*.45},{y-r*.6}" fill="{d}"/>'
            s += f'<rect x="{x-r*.7}" y="{y-r*.7}" width="{r*1.4}" height="{r*1.4}" rx="{r*.35}" fill="{col}" stroke="{d}" stroke-width="3"/>'
            if i in (4, 9):
                s += f'<path d="M{x} {y} L{x-26} {y+75} L{x-10} {y+70} M{x} {y} L{x+26} {y+75} L{x+40} {y+70}" stroke="{d}" stroke-width="7" fill="none" stroke-linecap="round"/>'
        hx0, hy0, _ = pts[0]
        s += f'<path d="M{hx0+30} {hy0-40} L{hx0-70} {hy0-30} L{hx0-95} {hy0+5} L{hx0-60} {hy0+35} L{hx0+30} {hy0+40} Z" fill="{c}" stroke="{d}" stroke-width="3"/><path d="M{hx0+10} {hy0-38} L{hx0+50} {hy0-95} L{hx0+28} {hy0-36} M{hx0-20} {hy0-36} L{hx0-5} {hy0-90} L{hx0-36} {hy0-34}" fill="{d}" stroke="{d}" stroke-width="4"/><circle cx="{hx0-35}" cy="{hy0-8}" r="9" fill="#F7E86A"/><circle cx="{hx0-35}" cy="{hy0-8}" r="4" fill="#1C1C1E"/>'
        return s
    if kind == "octopus":
        s = ''
        for i in range(8):
            a = math.pi * (0.1 + i * 0.8/7)
            x0, y0 = 300 + math.cos(a)*90, 400 + math.sin(a)*40
            x1, y1 = 300 + math.cos(a)*230, 470 + math.sin(a)*170
            cx, cy = (x0+x1)/2 + (40 if i % 2 else -40), (y0+y1)/2 + 60
            s += f'<path d="M{x0:.0f} {y0:.0f} Q{cx:.0f} {cy:.0f} {x1:.0f} {y1:.0f}" stroke="{c if i%2 else d}" stroke-width="34" fill="none" stroke-linecap="round"/><circle cx="{x1:.0f}" cy="{y1-28:.0f}" r="20" fill="none" stroke="{c if i%2 else d}" stroke-width="16"/>'
        s += f'<ellipse cx="300" cy="320" rx="140" ry="135" fill="{c}"/><ellipse cx="260" cy="275" rx="40" ry="30" fill="{l}" opacity=".5"/><circle cx="255" cy="350" r="30" fill="#fff"/><circle cx="345" cy="350" r="30" fill="#fff"/><circle cx="262" cy="356" r="14" fill="#1C1C1E"/><circle cx="338" cy="356" r="14" fill="#1C1C1E"/><path d="M285 395 Q300 410 315 395" stroke="#1C1C1E" stroke-width="5" fill="none" stroke-linecap="round"/>'
        return s
    if kind == "cube":
        acc = "#E3EC4F" if lum(c) < .5 else "#2A3FE0"
        s = ''
        for r in range(2):
            for q in range(4):
                x, y = 140 + q*82, 260 + r*82
                s += f'<rect x="{x}" y="{y}" width="76" height="76" rx="10" fill="{c if (q+r)%2==0 else acc}" stroke="{d}" stroke-width="3"/>'
        s += f'<rect x="200" y="440" width="76" height="76" rx="10" fill="{acc}" stroke="{d}" stroke-width="3" transform="rotate(18 238 478)"/><rect x="300" y="460" width="76" height="76" rx="10" fill="{c}" stroke="{d}" stroke-width="3" transform="rotate(-12 338 498)"/>'
        return s
    if kind == "spinner":
        s = ''
        for i, (cx, cy) in enumerate([(300, 270), (210, 430), (390, 430)]):
            teeth = ''.join(f'<rect x="{cx-10}" y="{cy-92}" width="20" height="24" fill="{c}" transform="rotate({k*30} {cx} {cy})"/>' for k in range(12))
            s += teeth + f'<circle cx="{cx}" cy="{cy}" r="72" fill="{c}" stroke="{d}" stroke-width="4"/><circle cx="{cx}" cy="{cy}" r="34" fill="{d}"/><circle cx="{cx}" cy="{cy}" r="12" fill="{l}"/>'
        return s
    if kind in ("axolotl", "shark", "lizard"):
        s = ''
        n = 9
        for i in range(n, 0, -1):
            x = 160 + i*36
            y = 400 + math.sin(i*.7)*16
            r = 54 - i*3.5
            s += f'<ellipse cx="{x}" cy="{y}" rx="{r*.75:.0f}" ry="{r:.0f}" fill="{c if i%2 else l}" stroke="{d}" stroke-width="3"/>'
        if kind == "shark":
            s += f'<path d="M300 352 L330 260 L360 360 Z" fill="{d}"/><path d="M490 400 L560 330 L540 410 L560 480 Z" fill="{d}"/><path d="M120 400 Q130 340 200 345 L230 400 L200 455 Q130 460 120 400 Z" fill="{c}" stroke="{d}" stroke-width="3"/><circle cx="165" cy="385" r="6" fill="#1C1C1E"/><path d="M140 420 L175 425" stroke="#1C1C1E" stroke-width="3"/>'
        else:
            for x in (220, 300, 380):
                s += f'<path d="M{x} 440 L{x-18} 500 L{x-36} 506 M{x+10} 440 L{x+24} 500 L{x+40} 506" stroke="{d}" stroke-width="10" stroke-linecap="round" fill="none"/>' if kind == "lizard" or x != 300 else ''
            s += f'<ellipse cx="160" cy="395" rx="72" ry="58" fill="{c}" stroke="{d}" stroke-width="3"/><circle cx="140" cy="378" r="8" fill="#1C1C1E"/><circle cx="185" cy="378" r="8" fill="#1C1C1E"/><path d="M145 410 Q162 422 180 410" stroke="#1C1C1E" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M490 400 Q560 380 570 420" stroke="{c}" stroke-width="22" fill="none" stroke-linecap="round"/>'
            if kind == "axolotl":
                for k, (dx, dy) in enumerate([(-70, -60), (-82, -20), (-74, 22), (70, -60), (82, -20), (74, 22)]):
                    s += f'<path d="M160 395 L{160+dx} {395+dy}" stroke="{shade(c,-.3)}" stroke-width="12" stroke-linecap="round"/>'
        return s
    if kind == "phonestand":
        return f'<path d="M160 600 L440 600 L440 640 L160 640 Z" fill="{d}"/><path d="M220 600 L330 260 L360 270 L270 600 Z" fill="{c}" stroke="{d}" stroke-width="3"/><path d="M330 600 L370 520 L390 528 L360 600 Z" fill="{c}"/><rect x="300" y="200" width="120" height="240" rx="16" fill="#1C1C1E" transform="rotate(18 360 320)"/><rect x="310" y="214" width="100" height="208" rx="10" fill="#2A3FE0" transform="rotate(18 360 320)" opacity=".85"/>'
    if kind == "controllerstand":
        pad = lambda y: f'<path d="M200 {y} Q300 {y-30} 400 {y} Q450 {y+20} 440 {y+70} Q430 {y+100} 400 {y+80} L370 {y+55} L230 {y+55} L200 {y+80} Q170 {y+100}160 {y+70} Q150 {y+20} 200 {y} Z" fill="#2B2D33"/><circle cx="240" cy="{y+25}" r="12" fill="#E3EC4F"/><circle cx="360" cy="{y+25}" r="12" fill="#E2412E"/>'
        return f'<rect x="150" y="610" width="300" height="34" rx="8" fill="{d}"/><rect x="282" y="230" width="36" height="390" fill="{c}" stroke="{d}" stroke-width="3"/><rect x="200" y="330" width="200" height="18" rx="6" fill="{c}" stroke="{d}" stroke-width="3"/><rect x="200" y="520" width="200" height="18" rx="6" fill="{c}" stroke="{d}" stroke-width="3"/>' + pad(250) + pad(440)
    if kind == "headphonestand":
        return f'<ellipse cx="300" cy="640" rx="130" ry="26" fill="{d}"/><rect x="286" y="280" width="28" height="360" fill="{c}" stroke="{d}" stroke-width="3"/><path d="M190 300 Q300 200 410 300" stroke="{c}" stroke-width="28" fill="none" stroke-linecap="round"/><path d="M185 330 Q190 150 300 145 Q410 150 415 330" stroke="#2B2D33" stroke-width="20" fill="none"/><rect x="155" y="310" width="60" height="110" rx="24" fill="#2B2D33"/><rect x="385" y="310" width="60" height="110" rx="24" fill="#2B2D33"/>'
    if kind == "organizer":
        return f'<rect x="120" y="420" width="360" height="200" rx="14" fill="{c}" stroke="{d}" stroke-width="4"/><line x1="240" y1="420" x2="240" y2="620" stroke="{d}" stroke-width="4"/><line x1="360" y1="420" x2="360" y2="620" stroke="{d}" stroke-width="4"/><rect x="150" y="260" width="12" height="190" fill="#2A3FE0" transform="rotate(-8 156 355)"/><rect x="180" y="240" width="12" height="210" fill="#E2412E" transform="rotate(6 186 345)"/><rect x="205" y="280" width="12" height="170" fill="#E3EC4F"/><rect x="380" y="290" width="70" height="140" rx="10" fill="#1C1C1E"/><path d="M270 430 Q290 360 330 400" stroke="#1C1C1E" stroke-width="6" fill="none"/>'
    if kind == "planet":
        return f'<rect x="290" y="520" width="20" height="110" fill="#8C8E88"/><ellipse cx="300" cy="640" rx="90" ry="18" fill="#6E706B"/><polygon points="300,200 400,260 420,370 360,470 240,470 180,370 200,260" fill="{c}"/><polygon points="300,200 400,260 300,330" fill="{l}"/><polygon points="180,370 300,330 240,470" fill="{d}"/><polygon points="300,330 420,370 360,470" fill="{shade(c,-.1)}"/><ellipse cx="300" cy="350" rx="210" ry="48" fill="none" stroke="{l}" stroke-width="16" transform="rotate(-14 300 350)"/>'
    if kind == "gem":
        return f'<polygon points="300,180 430,320 300,640 170,320" fill="{c}"/><polygon points="300,180 430,320 300,350" fill="{l}"/><polygon points="170,320 300,350 300,640" fill="{d}"/><polygon points="230,250 300,180 370,250 300,300" fill="{shade(c,.45)}" opacity=".7"/><line x1="170" y1="320" x2="430" y2="320" stroke="{shade(c,.5)}" stroke-width="2"/>'
    if kind == "rocket":
        acc = "#E2412E" if lum(c) > .5 else "#C9A23B"
        return f'<path d="M300 140 Q380 240 370 470 L230 470 Q220 240 300 140 Z" fill="{c}" stroke="{d}" stroke-width="3"/><path d="M300 140 Q340 190 352 240 L248 240 Q260 190 300 140 Z" fill="{acc}"/><circle cx="300" cy="320" r="34" fill="#2A3FE0" stroke="{d}" stroke-width="6"/><path d="M230 400 L170 520 L232 490 Z M370 400 L430 520 L368 490 Z" fill="{acc}"/><rect x="255" y="470" width="90" height="40" fill="{d}"/><path d="M270 510 Q300 600 330 510" fill="#F2A33A"/>'
    return f'<circle cx="300" cy="375" r="150" fill="{c}"/>'

def svg(prod, color, alt=False):
    p = dict(prod); p["_colorname"] = color["name"]
    if prod["art"] == "keychain" and prod["slug"] == "initial-keychain":
        p["letter"] = "A"
    if prod["art"] == "keychain" and prod["slug"] != "initial-keychain":
        p["letter"] = "AS"[0]
    inner = art(prod["art"], color["hex"], p)
    if prod["art"] == "dragon":
        inner = f'<g transform="translate(300 400) scale(1.15) translate(-285 -390)">{inner}</g>'
    elif prod["art"] in ("axolotl", "shark", "lizard"):
        inner = f'<g transform="translate(300 400) scale(1.1) translate(-330 -400)">{inner}</g>'
    bg = backdrop(prod["category"], alt)
    if alt:
        body = f'<g transform="translate(300 360) scale(1.75) translate(-300 -380)">{inner}</g>'
    else:
        body = inner
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750" role="img" aria-label="{prod["name"]} in {color["name"]}">{bg}{body}</svg>'

def main():
    if os.path.isdir(OUT_IMG): shutil.rmtree(OUT_IMG)
    os.makedirs(OUT_IMG, exist_ok=True)
    out = []
    for prod in P:
        d = os.path.join(OUT_IMG, prod["slug"]); os.makedirs(d, exist_ok=True)
        for i, col in enumerate(prod["colors"]):
            for alt in (False, True):
                with open(os.path.join(d, f"{i}-{'b' if alt else 'a'}.svg"), "w") as f:
                    f.write(svg(prod, col, alt))
        rec = {k: v for k, v in prod.items() if k not in ("trim",)}
        rec["details"] = DETAILS[prod["type"]]
        rec.setdefault("sizes", [])
        out.append(rec)
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w") as f: json.dump(out, f, indent=1)
    cats = {}
    for p in out: cats[p["category"]] = cats.get(p["category"], 0) + 1
    print(len(out), "products", cats)

if __name__ == "__main__":
    main()
