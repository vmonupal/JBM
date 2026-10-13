// ============================================================================
// COMPREHENSIVE BILINGUAL BIBLE BOOK & CHAPTER INFORMATION DATABASE (ALL 66 BOOKS)
// Authorized JBM Canonical Dataset
// ============================================================================

export interface BookDetailInfo {
  id: number;
  name_english: string;
  name_telugu: string;
  testament: 'OT' | 'NT';
  total_chapters: number;
  book_order: number;
  authorship: string;
  authorship_telugu?: string;
  date_written: string;
  date_written_telugu?: string;
  overview: string;
  overview_telugu?: string;
  background: string;
  background_telugu?: string;
  main_themes: string[];
  main_themes_telugu?: string[];
  key_people: string[];
  key_people_telugu?: string[];
  key_events: string[];
  key_events_telugu?: string[];
  key_chapters: { chapter: number; title: string; title_telugu?: string }[];
  related_books: string[];
}

export interface ChapterDetailInfo {
  chapter_number: number;
  title: string;
  title_telugu?: string;
  summary: string;
  summary_telugu?: string;
  main_events: string[];
  main_events_telugu?: string[];
  people_mentioned: string[];
  people_mentioned_telugu?: string[];
  main_themes: string[];
  main_themes_telugu?: string[];
  key_verses: string[];
  related_chapters: string[];
}

export const BIBLE_BOOK_DETAILS_MAP: Record<number, BookDetailInfo> = {
  "1": {
    "id": 1,
    "name_english": "Genesis",
    "name_telugu": "ఆదికాండము",
    "testament": "OT",
    "total_chapters": 50,
    "book_order": 1,
    "authorship": "Traditionally attributed to Moses (Pentateuch / Torah)",
    "authorship_telugu": "మోషే ప్రవక్త (తోరా / పంచకాండములు - సాంప్రదాయిక అభిప్రాయం)",
    "date_written": "Approx. 1440–1400 B.C. (Exodus era)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1440–1400 (నిర్గమ కాలము)",
    "overview": "Genesis ('Origins') records the creation of the cosmos, the fall of humanity, the flood of Noah, the tower of Babel, and God's sovereign covenant with the Hebrew patriarchs: Abraham, Isaac, Jacob, and Joseph.",
    "overview_telugu": "ఆదికాండము అనగా 'ఆరంభము'. సృష్టి ఆరంభము, మానవ పతనము, నోవహు జలప్రళయము, బాబెలు గోపురము, మరియు అబ్రాహాము, ఇస్సాకు, యాకోబు, యోసేపులతో దేవుడు చేసిన నిబంధన చరిత్రను తెలియజేస్తుంది.",
    "background": "Written to give the redeemed nation of Israel their foundational history and demonstrate the eternal covenant faithfulness of Yahweh.",
    "background_telugu": "ఐగుప్తు దాస్యము నుండి విమోచింపబడిన ఇశ్రాయేలు ప్రజలకు వారి ఆరంభములను మరియు యెహోవా నిబంధన నమ్మకత్వాన్ని తెలియజేయుటకు వ్రాయబడినది.",
    "main_themes": [
      "Creation and Divine Sovereignty",
      "The Fall and First Promise of Redemption (Gen 3:15)",
      "The Abrahamic Covenant Grace",
      "God's Providential Care"
    ],
    "main_themes_telugu": [
      "దేవుని సృష్టి మరియు సార్వభౌమాధికారము",
      "మానవ పతనము మరియు మొదటి రక్షణ వాగ్దానము (ఆది 3:15)",
      "అబ్రాహాము నిబంధన కృప",
      "దేవుని సంరక్షణ మరియు నడిపింపు"
    ],
    "key_people": [
      "Adam & Eve",
      "Noah",
      "Abraham & Sarah",
      "Isaac",
      "Jacob",
      "Joseph"
    ],
    "key_people_telugu": [
      "ఆదాము & హవ్వ",
      "నోవహు",
      "అబ్రాహాము & శారా",
      "ఇస్సాకు",
      "యాకోబు",
      "యోసేపు"
    ],
    "key_events": [
      "Creation of Heaven & Earth",
      "The Fall",
      "The Flood",
      "Call of Abraham",
      "Offering of Isaac",
      "Joseph in Egypt"
    ],
    "key_events_telugu": [
      "సృష్టి కార్యము",
      "మానవ పతనము",
      "జలప్రళయము",
      "అబ్రాహాము పిలుపు",
      "ఇస్సాకు అర్పణ",
      "ఐగుప్తులో యోసేపు"
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Creation of the Heavens and the Earth",
        "title_telugu": "సృష్టి ఆరంభము"
      },
      {
        "chapter": 3,
        "title": "The Fall and Promise of the Seed",
        "title_telugu": "పాప ప్రవేశము మరియు రక్షణ వాగ్దానము"
      },
      {
        "chapter": 12,
        "title": "The Call of Abram and Covenant",
        "title_telugu": "అబ్రాహాము పిలుపు"
      },
      {
        "chapter": 50,
        "title": "God Meant It for Good (Joseph)",
        "title_telugu": "దేవుడు దానిని మేలుకే ఉద్దేశించెను"
      }
    ],
    "related_books": [
      "Exodus",
      "Romans",
      "Galatians",
      "Hebrews"
    ]
  },
  "2": {
    "id": 2,
    "name_english": "Exodus",
    "name_telugu": "నిర్గమకాండము",
    "testament": "OT",
    "total_chapters": 40,
    "book_order": 2,
    "authorship": "Traditionally attributed to Moses",
    "authorship_telugu": "మోషే ప్రవక్త (సాంప్రదాయిక అభిప్రాయం)",
    "date_written": "Approx. 1440–1400 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1440–1400",
    "overview": "Exodus ('Departure') narrates Israel's deliverance from Egyptian bondage, the crossing of the Red Sea, the giving of the Law at Mount Sinai, and the construction of the Tabernacle.",
    "overview_telugu": "నిర్గమకాండము అనగా 'బయలువెడలుట'. ఐగుప్తు బానిసత్వము నుండి ఇశ్రాయేలు విమోచన, ఎర్రసముద్రము పాయలగుట, సీనాయి పర్వతముపై ధర్మశాస్త్రము, మరియు ప్రత్యక్షపు గుడారము ప్రతిష్ఠించబడుట ఇందులో ఉన్నాయి.",
    "background": "Written during the 40-year wilderness wanderings to instruct Israel on divine holiness and worship.",
    "background_telugu": "అరణ్య ప్రయాణ కాలములో ఇశ్రాయేలు ప్రజలకు దేవుని పరిశుద్ధత, ఆరాధన మరియు ధర్మశాస్త్ర విధులను నేర్పించుటకు వ్రాయబడినది.",
    "main_themes": [
      "Divine Deliverance and Redemption",
      "God's Holiness and the Moral Law (Ten Commandments)",
      "The Blood of the Passover Lamb",
      "The Presence of God in the Tabernacle"
    ],
    "main_themes_telugu": [
      "దైవిక విమోచన మరియు రక్షణ",
      "దేవుని పరిశుద్ధత మరియు పది ఆజ్ఞలు",
      "పస్కా గొర్రెపిల్ల రక్తము",
      "ప్రత్యక్షపు గుడారములో దేవుని నివాసము"
    ],
    "key_people": [
      "Moses",
      "Aaron",
      "Miriam",
      "Pharaoh",
      "Jethro",
      "Joshua"
    ],
    "key_people_telugu": [
      "మోషే",
      "అహరోను",
      "మిర్యాము",
      "ఫరో",
      "యిత్రో",
      "యెహోషువ"
    ],
    "key_events": [
      "Burning Bush",
      "Ten Plagues of Egypt",
      "The First Passover",
      "Crossing of the Red Sea",
      "Giving of the Ten Commandments",
      "Erection of Tabernacle"
    ],
    "key_events_telugu": [
      "మండుచున్న పొద దర్శనము",
      "ఐగుప్తుపై పది తెగుళ్లు",
      "మొదటి పస్కా పండుగ",
      "ఎర్రసముద్రము దాటుట",
      "పది ఆజ్ఞల ప్రదానము",
      "ప్రత్యక్షపు గుడారము నిర్మాణం"
    ],
    "key_chapters": [
      {
        "chapter": 3,
        "title": "Moses and the Burning Bush ('I AM WHO I AM')",
        "title_telugu": "మండుచున్న పొద వద్ద మోషే పిలుపు"
      },
      {
        "chapter": 12,
        "title": "The Passover and Death of the Firstborn",
        "title_telugu": "పస్కా పండుగ మరియు విమోచన"
      },
      {
        "chapter": 20,
        "title": "The Giving of the Ten Commandments",
        "title_telugu": "పది ఆజ్ఞలు"
      },
      {
        "chapter": 40,
        "title": "The Glory of the Lord Fills the Tabernacle",
        "title_telugu": "గుడారమును నింపిన యెహోవా మహిమ"
      }
    ],
    "related_books": [
      "Genesis",
      "Leviticus",
      "Hebrews",
      "Revelation"
    ]
  },
  "3": {
    "id": 3,
    "name_english": "Leviticus",
    "name_telugu": "లేవీయకాండము",
    "testament": "OT",
    "total_chapters": 27,
    "book_order": 3,
    "authorship": "Traditionally attributed to Moses",
    "authorship_telugu": "మోషే ప్రవక్త",
    "date_written": "Approx. 1440–1400 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1440–1400",
    "overview": "Leviticus provides the sacred manual of priesthood, sacrifices, and ritual holiness, establishing the principle: 'You shall be holy, for I the Lord your God am holy.'",
    "overview_telugu": "లేవీయకాండము యాజకధర్మము, బలులు, మరియు పరిశుద్ధ జీవన విధానములను వివరిస్తుంది. 'నేను పరిశుద్ధుడనై యున్నాను గనుక మీరును పరిశుద్ధులై యుండుడి' అనేది దీని ముఖ్య వాక్యము.",
    "background": "Given at the foot of Mount Sinai to establish communion between a holy God and a sinful people through blood atonement.",
    "background_telugu": "సీనాయి పర్వత ప్రాంతములో పరిశుద్ధుడైన దేవునితో పాపులైన మనుష్యులు సహవాసము చేయుటకు రక్త ప్రాయశ్చిత్త బలులను నియమిస్తూ ఇవ్వబడినది.",
    "main_themes": [
      "Holiness of Yahweh",
      "Blood Atonement for Sins",
      "Priesthood and Intercession",
      "The Feast Days of the Lord"
    ],
    "main_themes_telugu": [
      "దేవుని పరిశుద్ధత",
      "పాప ప్రాయశ్చిత్త బలులు",
      "యాజకత్వము మరియు మధ్యవర్తిత్వము",
      "యెహోవా పరిశుద్ధ పండుగలు"
    ],
    "key_people": [
      "Moses",
      "Aaron",
      "Nadab & Abihu",
      "Eleazar"
    ],
    "key_people_telugu": [
      "మోషే",
      "అహరోను",
      "నాదాబు & అబీహు",
      "ఎలియాజరు"
    ],
    "key_events": [
      "Consecration of Aaron's Priesthood",
      "Death of Nadab & Abihu",
      "The Great Day of Atonement (Yom Kippur)",
      "Institution of Sabbath and Feasts"
    ],
    "key_events_telugu": [
      "యాజకుల ప్రతిష్ఠ",
      "నాదాబు అబీహుల మరణము",
      "పాప ప్రాయశ్చిత్త దినము (యోమ్ కిప్పూర్)",
      "విశ్రాంతిదినములు మరియు పండుగల నియమము"
    ],
    "key_chapters": [
      {
        "chapter": 16,
        "title": "The Day of Atonement (The Scapegoat)",
        "title_telugu": "మహా ప్రాయశ్చిత్త దినము"
      },
      {
        "chapter": 17,
        "title": "The Sanctity of Blood ('For the life is in the blood')",
        "title_telugu": "రక్తము యొక్క పవిత్రత"
      },
      {
        "chapter": 19,
        "title": "The Call to Holiness ('Love your neighbor as yourself')",
        "title_telugu": "పరిశుద్ధత కొరకు పిలుపు"
      }
    ],
    "related_books": [
      "Exodus",
      "Numbers",
      "Hebrews"
    ]
  },
  "4": {
    "id": 4,
    "name_english": "Numbers",
    "name_telugu": "సంఖ్యాకాండము",
    "testament": "OT",
    "total_chapters": 36,
    "book_order": 4,
    "authorship": "Traditionally attributed to Moses",
    "authorship_telugu": "మోషే ప్రవక్త",
    "date_written": "Approx. 1440–1400 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1440–1400",
    "overview": "Numbers ('In the Wilderness') records Israel's 40-year journey from Sinai to the plains of Moab, marked by census takings, rebellions, divine chastening, and God's persistent covenant fidelity.",
    "overview_telugu": "సంఖ్యాకాండము అనగా 'లెక్కించుట'. సీనాయి నుండి మోయాబు మైదానముల వరకు ఇశ్రాయేలీయుల 40 సంవత్సరముల అరణ్య ప్రయాణము, జనసంఖ్య గణన, అవిధేయత మరియు దేవుని నమ్మకత్వము ఇందులో ఉన్నాయి.",
    "background": "Chronicles the transition from the unbelieving older generation that perished in the desert to the new generation poised to enter Canaan.",
    "background_telugu": "అవిశ్వాసము వలన అరణ్యములో రాలిపోయిన పాత తరం నుండి వాగ్దాన భూమిని స్వతంత్రించుకొనబోవు నూతన తరం వరకు చరిత్రను వివరిస్తుంది.",
    "main_themes": [
      "God's Faithfulness Amid Human Unbelief",
      "Discipline of Rebellion",
      "The Bronze Serpent (Type of Christ)",
      "Guidance by Cloud and Fire"
    ],
    "main_themes_telugu": [
      "మానవ అవిశ్వాసములో దేవుని నమ్మకత్వము",
      "తిరుగుబాటుకు శిక్ష",
      "ఇత్తడి సర్పము (క్రీస్తు సాదృశ్యము)",
      "మేఘస్తంభము మరియు అగ్నిస్తంభపు నడిపింపు"
    ],
    "key_people": [
      "Moses",
      "Aaron",
      "Miriam",
      "Joshua",
      "Caleb",
      "Balaam"
    ],
    "key_people_telugu": [
      "మోషే",
      "అహరోను",
      "మిర్యాము",
      "యెహోషువ",
      "కాలేబు",
      "బిలాము"
    ],
    "key_events": [
      "Census at Sinai",
      "The Twelve Spies to Canaan",
      "Korah's Rebellion",
      "Water from the Rock at Meribah",
      "The Bronze Serpent",
      "Balaam's Donkey Speaks"
    ],
    "key_events_telugu": [
      "సీనాయి వద్ద జనగణన",
      "కనానుకు పన్నెండుమంది వేగులవారు",
      "కోరహు తిరుగుబాటు",
      "మెరీబా వద్ద బండనుండి నీరు",
      "ఇత్తడి సర్పము",
      "బిలాము గాడిద మాట్లాడుట"
    ],
    "key_chapters": [
      {
        "chapter": 13,
        "title": "Spies Sent into Canaan and the Bad Report",
        "title_telugu": "కనాను దేశపు వేగులవారు"
      },
      {
        "chapter": 14,
        "title": "Israel's Unbelief and the 40-Year Wandering",
        "title_telugu": "ఇశ్రాయేలు తిరుగుబాటు మరియు 40 ఏండ్ల తీర్పు"
      },
      {
        "chapter": 21,
        "title": "The Bronze Serpent Lifted Up",
        "title_telugu": "ఇత్తడి సర్పము ఎత్తబడుట"
      },
      {
        "chapter": 24,
        "title": "Balaam's Prophecy of the Star of Jacob",
        "title_telugu": "యాకోబు నుండి వచ్చు నక్షత్రము"
      }
    ],
    "related_books": [
      "Leviticus",
      "Deuteronomy",
      "1 Corinthians",
      "Hebrews"
    ]
  },
  "5": {
    "id": 5,
    "name_english": "Deuteronomy",
    "name_telugu": "ద్వితీయోపదేశకాండము",
    "testament": "OT",
    "total_chapters": 34,
    "book_order": 5,
    "authorship": "Traditionally attributed to Moses",
    "authorship_telugu": "మోషే ప్రవక్త",
    "date_written": "Approx. 1406 B.C. (Plains of Moab)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1406 (మోయాబు మైదానము)",
    "overview": "Deuteronomy ('Second Law') presents Moses' final farewell discourses on the verge of Jordan, renewing the covenant and pleading: 'Hear, O Israel: The Lord our God, the Lord is one! Love the Lord your God with all your heart.'",
    "overview_telugu": "ద్వితీయోపదేశకాండము అనగా 'రెండవసారి ఉపదేశించుట'. యొర్దాను నది దాటకముందు మోషే చేసిన తుది ప్రసంగములు, నిబంధన పునరుద్ధరణ, మరియు 'ఇశ్రాయేలూ వినుము, మన దేవుడైన యెహోవా అద్వితీయుడైన యెహోవా' అను హెచ్చరికలు ఇందులో ఉన్నాయి.",
    "background": "Delivered to the new generation of Israelites before Moses' death on Mount Nebo and their crossing into the Promised Land.",
    "background_telugu": "నెబో పర్వతముపై మోషే మరణించుటకు ముందు, వాగ్దాన దేశములో ప్రవేశింపబోవు నూతన తరమునకు ఇచ్చిన వీడ్కోలు ఉపదేశములు.",
    "main_themes": [
      "The Shema: Radical Monotheism and Love for God",
      "Covenant Blessings and Curses",
      "Remembering God's Wonders",
      "Passing Faith to the Next Generation"
    ],
    "main_themes_telugu": [
      "షెమా: అద్వితీయ దేవునిపై పూర్ణహృదయ ప్రేమ",
      "నిబంధన ఆశీర్వాదములు మరియు శాపములు",
      "దేవుని మేలులను జ్ఞాపకము చేసికొనుట",
      "తరువాతి తరమునకు విశ్వాసమును నేర్పుట"
    ],
    "key_people": [
      "Moses",
      "Joshua"
    ],
    "key_people_telugu": [
      "మోషే",
      "యెహోషువ"
    ],
    "key_events": [
      "Recounting Wilderness Journeys",
      "The Great Shema Proclamation",
      "Blessings at Gerizim and Curses at Ebal",
      "Commissioning of Joshua",
      "Death of Moses on Mount Nebo"
    ],
    "key_events_telugu": [
      "అరణ్య ప్రయాణములను గుర్తుచేయుట",
      "మహా షెమా ఉపదేశము",
      "గెరిజీము ఆశీర్వాదములు, ఏబాలు శాపములు",
      "యెహోషువ నాయకత్వ నియామకము",
      "నెబో పర్వతముపై మోషే మరణము"
    ],
    "key_chapters": [
      {
        "chapter": 6,
        "title": "The Great Shema: Love God with All Your Heart",
        "title_telugu": "మహా షెమా: దేవుని పూర్ణహృదయముతో ప్రేమించుట"
      },
      {
        "chapter": 18,
        "title": "The Prophet Like Moses Promised (Christ)",
        "title_telugu": "మోషేవంటి ప్రవక్త వాగ్దానము"
      },
      {
        "chapter": 28,
        "title": "Blessings for Obedience & Warnings of Curse",
        "title_telugu": "విధేయతకు ఆశీర్వాదములు, అవిధేయతకు శాపములు"
      },
      {
        "chapter": 34,
        "title": "The Death and Epitaph of Moses",
        "title_telugu": "మోషే మరణము మరియు సమాధి"
      }
    ],
    "related_books": [
      "Numbers",
      "Joshua",
      "Matthew",
      "Romans"
    ]
  },
  "6": {
    "id": 6,
    "name_english": "Joshua",
    "name_telugu": "యెహోషువ",
    "testament": "OT",
    "total_chapters": 24,
    "book_order": 6,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of Joshua (యెహోషువ) is the 6th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 24 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యెహోషువ (Joshua) గ్రంథము 6వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 24 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Joshua chapters 1 to 24."
    ],
    "key_events_telugu": [
      "యెహోషువ 1వ అధ్యాయము నుండి 24వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Joshua",
        "title_telugu": "యెహోషువ ఆరంభము"
      },
      {
        "chapter": 12,
        "title": "Joshua Chapter 12",
        "title_telugu": "యెహోషువ 12వ అధ్యాయము"
      },
      {
        "chapter": 24,
        "title": "Conclusion of Joshua",
        "title_telugu": "యెహోషువ ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "7": {
    "id": 7,
    "name_english": "Judges",
    "name_telugu": "న్యాయాధిపతులు",
    "testament": "OT",
    "total_chapters": 21,
    "book_order": 7,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of Judges (న్యాయాధిపతులు) is the 7th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 21 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి న్యాయాధిపతులు (Judges) గ్రంథము 7వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 21 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Judges chapters 1 to 21."
    ],
    "key_events_telugu": [
      "న్యాయాధిపతులు 1వ అధ్యాయము నుండి 21వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Judges",
        "title_telugu": "న్యాయాధిపతులు ఆరంభము"
      },
      {
        "chapter": 10,
        "title": "Judges Chapter 10",
        "title_telugu": "న్యాయాధిపతులు 10వ అధ్యాయము"
      },
      {
        "chapter": 21,
        "title": "Conclusion of Judges",
        "title_telugu": "న్యాయాధిపతులు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "8": {
    "id": 8,
    "name_english": "Ruth",
    "name_telugu": "రూతు",
    "testament": "OT",
    "total_chapters": 4,
    "book_order": 8,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of Ruth (రూతు) is the 8th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 4 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి రూతు (Ruth) గ్రంథము 8వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 4 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Ruth chapters 1 to 4."
    ],
    "key_events_telugu": [
      "రూతు 1వ అధ్యాయము నుండి 4వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Ruth",
        "title_telugu": "రూతు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "Ruth Chapter 2",
        "title_telugu": "రూతు 2వ అధ్యాయము"
      },
      {
        "chapter": 4,
        "title": "Conclusion of Ruth",
        "title_telugu": "రూతు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "9": {
    "id": 9,
    "name_english": "1 Samuel",
    "name_telugu": "1 సమూయేలు",
    "testament": "OT",
    "total_chapters": 31,
    "book_order": 9,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of 1 Samuel (1 సమూయేలు) is the 9th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 31 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 సమూయేలు (1 Samuel) గ్రంథము 9వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 31 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Samuel chapters 1 to 31."
    ],
    "key_events_telugu": [
      "1 సమూయేలు 1వ అధ్యాయము నుండి 31వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Samuel",
        "title_telugu": "1 సమూయేలు ఆరంభము"
      },
      {
        "chapter": 15,
        "title": "1 Samuel Chapter 15",
        "title_telugu": "1 సమూయేలు 15వ అధ్యాయము"
      },
      {
        "chapter": 31,
        "title": "Conclusion of 1 Samuel",
        "title_telugu": "1 సమూయేలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "10": {
    "id": 10,
    "name_english": "2 Samuel",
    "name_telugu": "2 సమూయేలు",
    "testament": "OT",
    "total_chapters": 24,
    "book_order": 10,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of 2 Samuel (2 సమూయేలు) is the 10th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 24 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 సమూయేలు (2 Samuel) గ్రంథము 10వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 24 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Samuel chapters 1 to 24."
    ],
    "key_events_telugu": [
      "2 సమూయేలు 1వ అధ్యాయము నుండి 24వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Samuel",
        "title_telugu": "2 సమూయేలు ఆరంభము"
      },
      {
        "chapter": 12,
        "title": "2 Samuel Chapter 12",
        "title_telugu": "2 సమూయేలు 12వ అధ్యాయము"
      },
      {
        "chapter": 24,
        "title": "Conclusion of 2 Samuel",
        "title_telugu": "2 సమూయేలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "11": {
    "id": 11,
    "name_english": "1 Kings",
    "name_telugu": "1 రాజులు",
    "testament": "OT",
    "total_chapters": 22,
    "book_order": 11,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of 1 Kings (1 రాజులు) is the 11th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 22 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 రాజులు (1 Kings) గ్రంథము 11వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 22 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Kings chapters 1 to 22."
    ],
    "key_events_telugu": [
      "1 రాజులు 1వ అధ్యాయము నుండి 22వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Kings",
        "title_telugu": "1 రాజులు ఆరంభము"
      },
      {
        "chapter": 11,
        "title": "1 Kings Chapter 11",
        "title_telugu": "1 రాజులు 11వ అధ్యాయము"
      },
      {
        "chapter": 22,
        "title": "Conclusion of 1 Kings",
        "title_telugu": "1 రాజులు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "12": {
    "id": 12,
    "name_english": "2 Kings",
    "name_telugu": "2 రాజులు",
    "testament": "OT",
    "total_chapters": 25,
    "book_order": 12,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of 2 Kings (2 రాజులు) is the 12th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 25 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 రాజులు (2 Kings) గ్రంథము 12వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 25 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Kings chapters 1 to 25."
    ],
    "key_events_telugu": [
      "2 రాజులు 1వ అధ్యాయము నుండి 25వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Kings",
        "title_telugu": "2 రాజులు ఆరంభము"
      },
      {
        "chapter": 12,
        "title": "2 Kings Chapter 12",
        "title_telugu": "2 రాజులు 12వ అధ్యాయము"
      },
      {
        "chapter": 25,
        "title": "Conclusion of 2 Kings",
        "title_telugu": "2 రాజులు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "13": {
    "id": 13,
    "name_english": "1 Chronicles",
    "name_telugu": "1 దినవృత్తాంతములు",
    "testament": "OT",
    "total_chapters": 29,
    "book_order": 13,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of 1 Chronicles (1 దినవృత్తాంతములు) is the 13th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 29 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 దినవృత్తాంతములు (1 Chronicles) గ్రంథము 13వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 29 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Chronicles chapters 1 to 29."
    ],
    "key_events_telugu": [
      "1 దినవృత్తాంతములు 1వ అధ్యాయము నుండి 29వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Chronicles",
        "title_telugu": "1 దినవృత్తాంతములు ఆరంభము"
      },
      {
        "chapter": 14,
        "title": "1 Chronicles Chapter 14",
        "title_telugu": "1 దినవృత్తాంతములు 14వ అధ్యాయము"
      },
      {
        "chapter": 29,
        "title": "Conclusion of 1 Chronicles",
        "title_telugu": "1 దినవృత్తాంతములు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "14": {
    "id": 14,
    "name_english": "2 Chronicles",
    "name_telugu": "2 దినవృత్తాంతములు",
    "testament": "OT",
    "total_chapters": 36,
    "book_order": 14,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of 2 Chronicles (2 దినవృత్తాంతములు) is the 14th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 36 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 దినవృత్తాంతములు (2 Chronicles) గ్రంథము 14వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 36 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Chronicles chapters 1 to 36."
    ],
    "key_events_telugu": [
      "2 దినవృత్తాంతములు 1వ అధ్యాయము నుండి 36వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Chronicles",
        "title_telugu": "2 దినవృత్తాంతములు ఆరంభము"
      },
      {
        "chapter": 18,
        "title": "2 Chronicles Chapter 18",
        "title_telugu": "2 దినవృత్తాంతములు 18వ అధ్యాయము"
      },
      {
        "chapter": 36,
        "title": "Conclusion of 2 Chronicles",
        "title_telugu": "2 దినవృత్తాంతములు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "15": {
    "id": 15,
    "name_english": "Ezra",
    "name_telugu": "ఎజ్రా",
    "testament": "OT",
    "total_chapters": 10,
    "book_order": 15,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of Ezra (ఎజ్రా) is the 15th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 10 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఎజ్రా (Ezra) గ్రంథము 15వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 10 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Ezra chapters 1 to 10."
    ],
    "key_events_telugu": [
      "ఎజ్రా 1వ అధ్యాయము నుండి 10వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Ezra",
        "title_telugu": "ఎజ్రా ఆరంభము"
      },
      {
        "chapter": 5,
        "title": "Ezra Chapter 5",
        "title_telugu": "ఎజ్రా 5వ అధ్యాయము"
      },
      {
        "chapter": 10,
        "title": "Conclusion of Ezra",
        "title_telugu": "ఎజ్రా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "16": {
    "id": 16,
    "name_english": "Nehemiah",
    "name_telugu": "నెహెమ్యా",
    "testament": "OT",
    "total_chapters": 13,
    "book_order": 16,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of Nehemiah (నెహెమ్యా) is the 16th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 13 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి నెహెమ్యా (Nehemiah) గ్రంథము 16వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 13 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Nehemiah chapters 1 to 13."
    ],
    "key_events_telugu": [
      "నెహెమ్యా 1వ అధ్యాయము నుండి 13వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Nehemiah",
        "title_telugu": "నెహెమ్యా ఆరంభము"
      },
      {
        "chapter": 6,
        "title": "Nehemiah Chapter 6",
        "title_telugu": "నెహెమ్యా 6వ అధ్యాయము"
      },
      {
        "chapter": 13,
        "title": "Conclusion of Nehemiah",
        "title_telugu": "నెహెమ్యా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "17": {
    "id": 17,
    "name_english": "Esther",
    "name_telugu": "ఎస్తేరు",
    "testament": "OT",
    "total_chapters": 10,
    "book_order": 17,
    "authorship": "Joshua, Samuel, Ezra & Hebrew Chroniclers",
    "authorship_telugu": "యెహోషువ, సమూయేలు, ఎజ్రా మరియు ఇశ్రాయేలు చరిత్రకారులు",
    "date_written": "Approx. 1400–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1400–430",
    "overview": "The Holy Scripture book of Esther (ఎస్తేరు) is the 17th canonical book, situated in the Old Testament (Historical Books (చరిత్ర గ్రంథములు)). It comprises 10 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఎస్తేరు (Esther) గ్రంథము 17వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 10 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Esther chapters 1 to 10."
    ],
    "key_events_telugu": [
      "ఎస్తేరు 1వ అధ్యాయము నుండి 10వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Esther",
        "title_telugu": "ఎస్తేరు ఆరంభము"
      },
      {
        "chapter": 5,
        "title": "Esther Chapter 5",
        "title_telugu": "ఎస్తేరు 5వ అధ్యాయము"
      },
      {
        "chapter": 10,
        "title": "Conclusion of Esther",
        "title_telugu": "ఎస్తేరు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "18": {
    "id": 18,
    "name_english": "Job",
    "name_telugu": "యోబు",
    "testament": "OT",
    "total_chapters": 42,
    "book_order": 18,
    "authorship": "David, Solomon, Job, Asaph, and Sons of Korah",
    "authorship_telugu": "దావీదు, సొలొమోను, యోబు, ఆసాపు మరియు కోరహు కుమారులు",
    "date_written": "Approx. 1000–930 B.C. (Job: Patriarchal Era)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1000–930 (యోబు: పితరుల కాలము)",
    "overview": "The Holy Scripture book of Job (యోబు) is the 18th canonical book, situated in the Old Testament (Poetry and Wisdom Literature (జ్ఞాన & కవితా గ్రంథములు)). It comprises 42 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యోబు (Job) గ్రంథము 18వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 42 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Job chapters 1 to 42."
    ],
    "key_events_telugu": [
      "యోబు 1వ అధ్యాయము నుండి 42వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Job",
        "title_telugu": "యోబు ఆరంభము"
      },
      {
        "chapter": 21,
        "title": "Job Chapter 21",
        "title_telugu": "యోబు 21వ అధ్యాయము"
      },
      {
        "chapter": 42,
        "title": "Conclusion of Job",
        "title_telugu": "యోబు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "19": {
    "id": 19,
    "name_english": "Psalms",
    "name_telugu": "కీర్తనలు",
    "testament": "OT",
    "total_chapters": 150,
    "book_order": 19,
    "authorship": "David, Solomon, Job, Asaph, and Sons of Korah",
    "authorship_telugu": "దావీదు, సొలొమోను, యోబు, ఆసాపు మరియు కోరహు కుమారులు",
    "date_written": "Approx. 1000–930 B.C. (Job: Patriarchal Era)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1000–930 (యోబు: పితరుల కాలము)",
    "overview": "The Holy Scripture book of Psalms (కీర్తనలు) is the 19th canonical book, situated in the Old Testament (Poetry and Wisdom Literature (జ్ఞాన & కవితా గ్రంథములు)). It comprises 150 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి కీర్తనలు (Psalms) గ్రంథము 19వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 150 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Psalms chapters 1 to 150."
    ],
    "key_events_telugu": [
      "కీర్తనలు 1వ అధ్యాయము నుండి 150వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Psalms",
        "title_telugu": "కీర్తనలు ఆరంభము"
      },
      {
        "chapter": 75,
        "title": "Psalms Chapter 75",
        "title_telugu": "కీర్తనలు 75వ అధ్యాయము"
      },
      {
        "chapter": 150,
        "title": "Conclusion of Psalms",
        "title_telugu": "కీర్తనలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "20": {
    "id": 20,
    "name_english": "Proverbs",
    "name_telugu": "సామెతలు",
    "testament": "OT",
    "total_chapters": 31,
    "book_order": 20,
    "authorship": "David, Solomon, Job, Asaph, and Sons of Korah",
    "authorship_telugu": "దావీదు, సొలొమోను, యోబు, ఆసాపు మరియు కోరహు కుమారులు",
    "date_written": "Approx. 1000–930 B.C. (Job: Patriarchal Era)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1000–930 (యోబు: పితరుల కాలము)",
    "overview": "The Holy Scripture book of Proverbs (సామెతలు) is the 20th canonical book, situated in the Old Testament (Poetry and Wisdom Literature (జ్ఞాన & కవితా గ్రంథములు)). It comprises 31 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి సామెతలు (Proverbs) గ్రంథము 20వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 31 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Proverbs chapters 1 to 31."
    ],
    "key_events_telugu": [
      "సామెతలు 1వ అధ్యాయము నుండి 31వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Proverbs",
        "title_telugu": "సామెతలు ఆరంభము"
      },
      {
        "chapter": 15,
        "title": "Proverbs Chapter 15",
        "title_telugu": "సామెతలు 15వ అధ్యాయము"
      },
      {
        "chapter": 31,
        "title": "Conclusion of Proverbs",
        "title_telugu": "సామెతలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "21": {
    "id": 21,
    "name_english": "Ecclesiastes",
    "name_telugu": "ప్రసంగి",
    "testament": "OT",
    "total_chapters": 12,
    "book_order": 21,
    "authorship": "David, Solomon, Job, Asaph, and Sons of Korah",
    "authorship_telugu": "దావీదు, సొలొమోను, యోబు, ఆసాపు మరియు కోరహు కుమారులు",
    "date_written": "Approx. 1000–930 B.C. (Job: Patriarchal Era)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1000–930 (యోబు: పితరుల కాలము)",
    "overview": "The Holy Scripture book of Ecclesiastes (ప్రసంగి) is the 21th canonical book, situated in the Old Testament (Poetry and Wisdom Literature (జ్ఞాన & కవితా గ్రంథములు)). It comprises 12 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ప్రసంగి (Ecclesiastes) గ్రంథము 21వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 12 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Ecclesiastes chapters 1 to 12."
    ],
    "key_events_telugu": [
      "ప్రసంగి 1వ అధ్యాయము నుండి 12వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Ecclesiastes",
        "title_telugu": "ప్రసంగి ఆరంభము"
      },
      {
        "chapter": 6,
        "title": "Ecclesiastes Chapter 6",
        "title_telugu": "ప్రసంగి 6వ అధ్యాయము"
      },
      {
        "chapter": 12,
        "title": "Conclusion of Ecclesiastes",
        "title_telugu": "ప్రసంగి ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "22": {
    "id": 22,
    "name_english": "Song of Solomon",
    "name_telugu": "పరమగీతము",
    "testament": "OT",
    "total_chapters": 8,
    "book_order": 22,
    "authorship": "David, Solomon, Job, Asaph, and Sons of Korah",
    "authorship_telugu": "దావీదు, సొలొమోను, యోబు, ఆసాపు మరియు కోరహు కుమారులు",
    "date_written": "Approx. 1000–930 B.C. (Job: Patriarchal Era)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 1000–930 (యోబు: పితరుల కాలము)",
    "overview": "The Holy Scripture book of Song of Solomon (పరమగీతము) is the 22th canonical book, situated in the Old Testament (Poetry and Wisdom Literature (జ్ఞాన & కవితా గ్రంథములు)). It comprises 8 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి పరమగీతము (Song of Solomon) గ్రంథము 22వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 8 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Song of Solomon chapters 1 to 8."
    ],
    "key_events_telugu": [
      "పరమగీతము 1వ అధ్యాయము నుండి 8వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Song of Solomon",
        "title_telugu": "పరమగీతము ఆరంభము"
      },
      {
        "chapter": 4,
        "title": "Song of Solomon Chapter 4",
        "title_telugu": "పరమగీతము 4వ అధ్యాయము"
      },
      {
        "chapter": 8,
        "title": "Conclusion of Song of Solomon",
        "title_telugu": "పరమగీతము ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "23": {
    "id": 23,
    "name_english": "Isaiah",
    "name_telugu": "యెషయా",
    "testament": "OT",
    "total_chapters": 66,
    "book_order": 23,
    "authorship": "Isaiah, Jeremiah, Ezekiel, Daniel",
    "authorship_telugu": "యెషయా, యిర్మీయా, యెహెజ్కేలు, దానియేలు",
    "date_written": "Approx. 740–530 B.C. (Monarchy & Exile)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 740–530 (రాజరికం & బబులోను చెర కాలము)",
    "overview": "The Holy Scripture book of Isaiah (యెషయా) is the 23th canonical book, situated in the Old Testament (Major Prophets (పెద్ద ప్రవక్తలు)). It comprises 66 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యెషయా (Isaiah) గ్రంథము 23వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 66 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Isaiah chapters 1 to 66."
    ],
    "key_events_telugu": [
      "యెషయా 1వ అధ్యాయము నుండి 66వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Isaiah",
        "title_telugu": "యెషయా ఆరంభము"
      },
      {
        "chapter": 33,
        "title": "Isaiah Chapter 33",
        "title_telugu": "యెషయా 33వ అధ్యాయము"
      },
      {
        "chapter": 66,
        "title": "Conclusion of Isaiah",
        "title_telugu": "యెషయా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "24": {
    "id": 24,
    "name_english": "Jeremiah",
    "name_telugu": "యిర్మియా",
    "testament": "OT",
    "total_chapters": 52,
    "book_order": 24,
    "authorship": "Isaiah, Jeremiah, Ezekiel, Daniel",
    "authorship_telugu": "యెషయా, యిర్మీయా, యెహెజ్కేలు, దానియేలు",
    "date_written": "Approx. 740–530 B.C. (Monarchy & Exile)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 740–530 (రాజరికం & బబులోను చెర కాలము)",
    "overview": "The Holy Scripture book of Jeremiah (యిర్మియా) is the 24th canonical book, situated in the Old Testament (Major Prophets (పెద్ద ప్రవక్తలు)). It comprises 52 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యిర్మియా (Jeremiah) గ్రంథము 24వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 52 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Jeremiah chapters 1 to 52."
    ],
    "key_events_telugu": [
      "యిర్మియా 1వ అధ్యాయము నుండి 52వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Jeremiah",
        "title_telugu": "యిర్మియా ఆరంభము"
      },
      {
        "chapter": 26,
        "title": "Jeremiah Chapter 26",
        "title_telugu": "యిర్మియా 26వ అధ్యాయము"
      },
      {
        "chapter": 52,
        "title": "Conclusion of Jeremiah",
        "title_telugu": "యిర్మియా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "25": {
    "id": 25,
    "name_english": "Lamentations",
    "name_telugu": "విలాపవాక్యములు",
    "testament": "OT",
    "total_chapters": 5,
    "book_order": 25,
    "authorship": "Isaiah, Jeremiah, Ezekiel, Daniel",
    "authorship_telugu": "యెషయా, యిర్మీయా, యెహెజ్కేలు, దానియేలు",
    "date_written": "Approx. 740–530 B.C. (Monarchy & Exile)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 740–530 (రాజరికం & బబులోను చెర కాలము)",
    "overview": "The Holy Scripture book of Lamentations (విలాపవాక్యములు) is the 25th canonical book, situated in the Old Testament (Major Prophets (పెద్ద ప్రవక్తలు)). It comprises 5 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి విలాపవాక్యములు (Lamentations) గ్రంథము 25వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 5 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Lamentations chapters 1 to 5."
    ],
    "key_events_telugu": [
      "విలాపవాక్యములు 1వ అధ్యాయము నుండి 5వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Lamentations",
        "title_telugu": "విలాపవాక్యములు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "Lamentations Chapter 2",
        "title_telugu": "విలాపవాక్యములు 2వ అధ్యాయము"
      },
      {
        "chapter": 5,
        "title": "Conclusion of Lamentations",
        "title_telugu": "విలాపవాక్యములు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "26": {
    "id": 26,
    "name_english": "Ezekiel",
    "name_telugu": "యెహెజ్కేలు",
    "testament": "OT",
    "total_chapters": 48,
    "book_order": 26,
    "authorship": "Isaiah, Jeremiah, Ezekiel, Daniel",
    "authorship_telugu": "యెషయా, యిర్మీయా, యెహెజ్కేలు, దానియేలు",
    "date_written": "Approx. 740–530 B.C. (Monarchy & Exile)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 740–530 (రాజరికం & బబులోను చెర కాలము)",
    "overview": "The Holy Scripture book of Ezekiel (యెహెజ్కేలు) is the 26th canonical book, situated in the Old Testament (Major Prophets (పెద్ద ప్రవక్తలు)). It comprises 48 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యెహెజ్కేలు (Ezekiel) గ్రంథము 26వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 48 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Ezekiel chapters 1 to 48."
    ],
    "key_events_telugu": [
      "యెహెజ్కేలు 1వ అధ్యాయము నుండి 48వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Ezekiel",
        "title_telugu": "యెహెజ్కేలు ఆరంభము"
      },
      {
        "chapter": 24,
        "title": "Ezekiel Chapter 24",
        "title_telugu": "యెహెజ్కేలు 24వ అధ్యాయము"
      },
      {
        "chapter": 48,
        "title": "Conclusion of Ezekiel",
        "title_telugu": "యెహెజ్కేలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "27": {
    "id": 27,
    "name_english": "Daniel",
    "name_telugu": "దానియేలు",
    "testament": "OT",
    "total_chapters": 12,
    "book_order": 27,
    "authorship": "Isaiah, Jeremiah, Ezekiel, Daniel",
    "authorship_telugu": "యెషయా, యిర్మీయా, యెహెజ్కేలు, దానియేలు",
    "date_written": "Approx. 740–530 B.C. (Monarchy & Exile)",
    "date_written_telugu": "సుమారు క్రీ.పూ. 740–530 (రాజరికం & బబులోను చెర కాలము)",
    "overview": "The Holy Scripture book of Daniel (దానియేలు) is the 27th canonical book, situated in the Old Testament (Major Prophets (పెద్ద ప్రవక్తలు)). It comprises 12 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి దానియేలు (Daniel) గ్రంథము 27వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 12 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Daniel chapters 1 to 12."
    ],
    "key_events_telugu": [
      "దానియేలు 1వ అధ్యాయము నుండి 12వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Daniel",
        "title_telugu": "దానియేలు ఆరంభము"
      },
      {
        "chapter": 6,
        "title": "Daniel Chapter 6",
        "title_telugu": "దానియేలు 6వ అధ్యాయము"
      },
      {
        "chapter": 12,
        "title": "Conclusion of Daniel",
        "title_telugu": "దానియేలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "28": {
    "id": 28,
    "name_english": "Hosea",
    "name_telugu": "హోషేయ",
    "testament": "OT",
    "total_chapters": 14,
    "book_order": 28,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Hosea (హోషేయ) is the 28th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 14 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి హోషేయ (Hosea) గ్రంథము 28వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 14 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Hosea chapters 1 to 14."
    ],
    "key_events_telugu": [
      "హోషేయ 1వ అధ్యాయము నుండి 14వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Hosea",
        "title_telugu": "హోషేయ ఆరంభము"
      },
      {
        "chapter": 7,
        "title": "Hosea Chapter 7",
        "title_telugu": "హోషేయ 7వ అధ్యాయము"
      },
      {
        "chapter": 14,
        "title": "Conclusion of Hosea",
        "title_telugu": "హోషేయ ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "29": {
    "id": 29,
    "name_english": "Joel",
    "name_telugu": "యోవేలు",
    "testament": "OT",
    "total_chapters": 3,
    "book_order": 29,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Joel (యోవేలు) is the 29th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యోవేలు (Joel) గ్రంథము 29వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Joel chapters 1 to 3."
    ],
    "key_events_telugu": [
      "యోవేలు 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Joel",
        "title_telugu": "యోవేలు ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Joel Chapter 1",
        "title_telugu": "యోవేలు 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of Joel",
        "title_telugu": "యోవేలు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "30": {
    "id": 30,
    "name_english": "Amos",
    "name_telugu": "ఆమోసు",
    "testament": "OT",
    "total_chapters": 9,
    "book_order": 30,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Amos (ఆమోసు) is the 30th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 9 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఆమోసు (Amos) గ్రంథము 30వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 9 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Amos chapters 1 to 9."
    ],
    "key_events_telugu": [
      "ఆమోసు 1వ అధ్యాయము నుండి 9వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Amos",
        "title_telugu": "ఆమోసు ఆరంభము"
      },
      {
        "chapter": 4,
        "title": "Amos Chapter 4",
        "title_telugu": "ఆమోసు 4వ అధ్యాయము"
      },
      {
        "chapter": 9,
        "title": "Conclusion of Amos",
        "title_telugu": "ఆమోసు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "31": {
    "id": 31,
    "name_english": "Obadiah",
    "name_telugu": "ఓబద్యా",
    "testament": "OT",
    "total_chapters": 1,
    "book_order": 31,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Obadiah (ఓబద్యా) is the 31th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 1 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఓబద్యా (Obadiah) గ్రంథము 31వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 1 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Obadiah chapters 1 to 1."
    ],
    "key_events_telugu": [
      "ఓబద్యా 1వ అధ్యాయము నుండి 1వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Obadiah",
        "title_telugu": "ఓబద్యా ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Obadiah Chapter 1",
        "title_telugu": "ఓబద్యా 1వ అధ్యాయము"
      },
      {
        "chapter": 1,
        "title": "Conclusion of Obadiah",
        "title_telugu": "ఓబద్యా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "32": {
    "id": 32,
    "name_english": "Jonah",
    "name_telugu": "యోనా",
    "testament": "OT",
    "total_chapters": 4,
    "book_order": 32,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Jonah (యోనా) is the 32th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 4 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యోనా (Jonah) గ్రంథము 32వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 4 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Jonah chapters 1 to 4."
    ],
    "key_events_telugu": [
      "యోనా 1వ అధ్యాయము నుండి 4వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Jonah",
        "title_telugu": "యోనా ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "Jonah Chapter 2",
        "title_telugu": "యోనా 2వ అధ్యాయము"
      },
      {
        "chapter": 4,
        "title": "Conclusion of Jonah",
        "title_telugu": "యోనా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "33": {
    "id": 33,
    "name_english": "Micah",
    "name_telugu": "మీకా",
    "testament": "OT",
    "total_chapters": 7,
    "book_order": 33,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Micah (మీకా) is the 33th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 7 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి మీకా (Micah) గ్రంథము 33వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 7 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Micah chapters 1 to 7."
    ],
    "key_events_telugu": [
      "మీకా 1వ అధ్యాయము నుండి 7వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Micah",
        "title_telugu": "మీకా ఆరంభము"
      },
      {
        "chapter": 3,
        "title": "Micah Chapter 3",
        "title_telugu": "మీకా 3వ అధ్యాయము"
      },
      {
        "chapter": 7,
        "title": "Conclusion of Micah",
        "title_telugu": "మీకా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "34": {
    "id": 34,
    "name_english": "Nahum",
    "name_telugu": "నహూము",
    "testament": "OT",
    "total_chapters": 3,
    "book_order": 34,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Nahum (నహూము) is the 34th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి నహూము (Nahum) గ్రంథము 34వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Nahum chapters 1 to 3."
    ],
    "key_events_telugu": [
      "నహూము 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Nahum",
        "title_telugu": "నహూము ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Nahum Chapter 1",
        "title_telugu": "నహూము 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of Nahum",
        "title_telugu": "నహూము ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "35": {
    "id": 35,
    "name_english": "Habakkuk",
    "name_telugu": "హబక్కూకు",
    "testament": "OT",
    "total_chapters": 3,
    "book_order": 35,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Habakkuk (హబక్కూకు) is the 35th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి హబక్కూకు (Habakkuk) గ్రంథము 35వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Habakkuk chapters 1 to 3."
    ],
    "key_events_telugu": [
      "హబక్కూకు 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Habakkuk",
        "title_telugu": "హబక్కూకు ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Habakkuk Chapter 1",
        "title_telugu": "హబక్కూకు 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of Habakkuk",
        "title_telugu": "హబక్కూకు ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "36": {
    "id": 36,
    "name_english": "Zephaniah",
    "name_telugu": "జెఫన్యా",
    "testament": "OT",
    "total_chapters": 3,
    "book_order": 36,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Zephaniah (జెఫన్యా) is the 36th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి జెఫన్యా (Zephaniah) గ్రంథము 36వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Zephaniah chapters 1 to 3."
    ],
    "key_events_telugu": [
      "జెఫన్యా 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Zephaniah",
        "title_telugu": "జెఫన్యా ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Zephaniah Chapter 1",
        "title_telugu": "జెఫన్యా 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of Zephaniah",
        "title_telugu": "జెఫన్యా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "37": {
    "id": 37,
    "name_english": "Haggai",
    "name_telugu": "హగ్గయి",
    "testament": "OT",
    "total_chapters": 2,
    "book_order": 37,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Haggai (హగ్గయి) is the 37th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 2 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి హగ్గయి (Haggai) గ్రంథము 37వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 2 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Haggai chapters 1 to 2."
    ],
    "key_events_telugu": [
      "హగ్గయి 1వ అధ్యాయము నుండి 2వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Haggai",
        "title_telugu": "హగ్గయి ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Haggai Chapter 1",
        "title_telugu": "హగ్గయి 1వ అధ్యాయము"
      },
      {
        "chapter": 2,
        "title": "Conclusion of Haggai",
        "title_telugu": "హగ్గయి ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "38": {
    "id": 38,
    "name_english": "Zechariah",
    "name_telugu": "జెకర్యా",
    "testament": "OT",
    "total_chapters": 14,
    "book_order": 38,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Zechariah (జెకర్యా) is the 38th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 14 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి జెకర్యా (Zechariah) గ్రంథము 38వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 14 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Zechariah chapters 1 to 14."
    ],
    "key_events_telugu": [
      "జెకర్యా 1వ అధ్యాయము నుండి 14వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Zechariah",
        "title_telugu": "జెకర్యా ఆరంభము"
      },
      {
        "chapter": 7,
        "title": "Zechariah Chapter 7",
        "title_telugu": "జెకర్యా 7వ అధ్యాయము"
      },
      {
        "chapter": 14,
        "title": "Conclusion of Zechariah",
        "title_telugu": "జెకర్యా ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "39": {
    "id": 39,
    "name_english": "Malachi",
    "name_telugu": "మలాకీ",
    "testament": "OT",
    "total_chapters": 4,
    "book_order": 39,
    "authorship": "Hosea to Malachi (Twelve Prophets)",
    "authorship_telugu": "హోషేయ నుండి మలాకీ వరకు (పన్నెండుగురు ప్రవక్తలు)",
    "date_written": "Approx. 800–430 B.C.",
    "date_written_telugu": "సుమారు క్రీ.పూ. 800–430",
    "overview": "The Holy Scripture book of Malachi (మలాకీ) is the 39th canonical book, situated in the Old Testament (Minor Prophets (చిన్న ప్రవక్తలు - 12 Books)). It comprises 4 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి మలాకీ (Malachi) గ్రంథము 39వ పరిశుద్ధ గ్రంథ భాగము. ఇది పాత నిబంధనలో 4 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Malachi chapters 1 to 4."
    ],
    "key_events_telugu": [
      "మలాకీ 1వ అధ్యాయము నుండి 4వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Malachi",
        "title_telugu": "మలాకీ ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "Malachi Chapter 2",
        "title_telugu": "మలాకీ 2వ అధ్యాయము"
      },
      {
        "chapter": 4,
        "title": "Conclusion of Malachi",
        "title_telugu": "మలాకీ ముగింపు"
      }
    ],
    "related_books": [
      "Genesis",
      "Psalms",
      "Isaiah"
    ]
  },
  "40": {
    "id": 40,
    "name_english": "Matthew",
    "name_telugu": "మత్తయి సువార్త",
    "testament": "NT",
    "total_chapters": 28,
    "book_order": 40,
    "authorship": "Apostles Matthew & John; Evangelists Mark & Luke",
    "authorship_telugu": "అపొస్తలులైన మత్తయి, యోహాను; సువార్తికులైన మార్కు, లూకా",
    "date_written": "Approx. A.D. 50–90",
    "date_written_telugu": "సుమారు క్రీ.శ. 50–90",
    "overview": "The Holy Scripture book of Matthew (మత్తయి సువార్త) is the 40th canonical book, situated in the New Testament (The Four Holy Gospels (సువార్తలు)). It comprises 28 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి మత్తయి సువార్త (Matthew) గ్రంథము 40వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 28 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Matthew chapters 1 to 28."
    ],
    "key_events_telugu": [
      "మత్తయి సువార్త 1వ అధ్యాయము నుండి 28వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Matthew",
        "title_telugu": "మత్తయి సువార్త ఆరంభము"
      },
      {
        "chapter": 14,
        "title": "Matthew Chapter 14",
        "title_telugu": "మత్తయి సువార్త 14వ అధ్యాయము"
      },
      {
        "chapter": 28,
        "title": "Conclusion of Matthew",
        "title_telugu": "మత్తయి సువార్త ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "41": {
    "id": 41,
    "name_english": "Mark",
    "name_telugu": "మార్కు సువార్త",
    "testament": "NT",
    "total_chapters": 16,
    "book_order": 41,
    "authorship": "Apostles Matthew & John; Evangelists Mark & Luke",
    "authorship_telugu": "అపొస్తలులైన మత్తయి, యోహాను; సువార్తికులైన మార్కు, లూకా",
    "date_written": "Approx. A.D. 50–90",
    "date_written_telugu": "సుమారు క్రీ.శ. 50–90",
    "overview": "The Holy Scripture book of Mark (మార్కు సువార్త) is the 41th canonical book, situated in the New Testament (The Four Holy Gospels (సువార్తలు)). It comprises 16 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి మార్కు సువార్త (Mark) గ్రంథము 41వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 16 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Mark chapters 1 to 16."
    ],
    "key_events_telugu": [
      "మార్కు సువార్త 1వ అధ్యాయము నుండి 16వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Mark",
        "title_telugu": "మార్కు సువార్త ఆరంభము"
      },
      {
        "chapter": 8,
        "title": "Mark Chapter 8",
        "title_telugu": "మార్కు సువార్త 8వ అధ్యాయము"
      },
      {
        "chapter": 16,
        "title": "Conclusion of Mark",
        "title_telugu": "మార్కు సువార్త ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "42": {
    "id": 42,
    "name_english": "Luke",
    "name_telugu": "లూకా సువార్త",
    "testament": "NT",
    "total_chapters": 24,
    "book_order": 42,
    "authorship": "Apostles Matthew & John; Evangelists Mark & Luke",
    "authorship_telugu": "అపొస్తలులైన మత్తయి, యోహాను; సువార్తికులైన మార్కు, లూకా",
    "date_written": "Approx. A.D. 50–90",
    "date_written_telugu": "సుమారు క్రీ.శ. 50–90",
    "overview": "The Holy Scripture book of Luke (లూకా సువార్త) is the 42th canonical book, situated in the New Testament (The Four Holy Gospels (సువార్తలు)). It comprises 24 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి లూకా సువార్త (Luke) గ్రంథము 42వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 24 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Luke chapters 1 to 24."
    ],
    "key_events_telugu": [
      "లూకా సువార్త 1వ అధ్యాయము నుండి 24వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Luke",
        "title_telugu": "లూకా సువార్త ఆరంభము"
      },
      {
        "chapter": 12,
        "title": "Luke Chapter 12",
        "title_telugu": "లూకా సువార్త 12వ అధ్యాయము"
      },
      {
        "chapter": 24,
        "title": "Conclusion of Luke",
        "title_telugu": "లూకా సువార్త ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "43": {
    "id": 43,
    "name_english": "John",
    "name_telugu": "యోహాను సువార్త",
    "testament": "NT",
    "total_chapters": 21,
    "book_order": 43,
    "authorship": "Apostles Matthew & John; Evangelists Mark & Luke",
    "authorship_telugu": "అపొస్తలులైన మత్తయి, యోహాను; సువార్తికులైన మార్కు, లూకా",
    "date_written": "Approx. A.D. 50–90",
    "date_written_telugu": "సుమారు క్రీ.శ. 50–90",
    "overview": "The Holy Scripture book of John (యోహాను సువార్త) is the 43th canonical book, situated in the New Testament (The Four Holy Gospels (సువార్తలు)). It comprises 21 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యోహాను సువార్త (John) గ్రంథము 43వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 21 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in John chapters 1 to 21."
    ],
    "key_events_telugu": [
      "యోహాను సువార్త 1వ అధ్యాయము నుండి 21వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of John",
        "title_telugu": "యోహాను సువార్త ఆరంభము"
      },
      {
        "chapter": 10,
        "title": "John Chapter 10",
        "title_telugu": "యోహాను సువార్త 10వ అధ్యాయము"
      },
      {
        "chapter": 21,
        "title": "Conclusion of John",
        "title_telugu": "యోహాను సువార్త ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "44": {
    "id": 44,
    "name_english": "Acts",
    "name_telugu": "అపొస్తలుల కార్యములు",
    "testament": "NT",
    "total_chapters": 28,
    "book_order": 44,
    "authorship": "Luke the Beloved Physician & Evangelist",
    "authorship_telugu": "వైద్యుడైన లూకా సువార్తికుడు",
    "date_written": "Approx. A.D. 62–64",
    "date_written_telugu": "సుమారు క్రీ.శ. 62–64",
    "overview": "The Holy Scripture book of Acts (అపొస్తలుల కార్యములు) is the 44th canonical book, situated in the New Testament (Apostolic History (అపొస్తలుల కార్యములు)). It comprises 28 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి అపొస్తలుల కార్యములు (Acts) గ్రంథము 44వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 28 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Acts chapters 1 to 28."
    ],
    "key_events_telugu": [
      "అపొస్తలుల కార్యములు 1వ అధ్యాయము నుండి 28వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Acts",
        "title_telugu": "అపొస్తలుల కార్యములు ఆరంభము"
      },
      {
        "chapter": 14,
        "title": "Acts Chapter 14",
        "title_telugu": "అపొస్తలుల కార్యములు 14వ అధ్యాయము"
      },
      {
        "chapter": 28,
        "title": "Conclusion of Acts",
        "title_telugu": "అపొస్తలుల కార్యములు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "45": {
    "id": 45,
    "name_english": "Romans",
    "name_telugu": "రోమీయులకు",
    "testament": "NT",
    "total_chapters": 16,
    "book_order": 45,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Romans (రోమీయులకు) is the 45th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 16 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి రోమీయులకు (Romans) గ్రంథము 45వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 16 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Romans chapters 1 to 16."
    ],
    "key_events_telugu": [
      "రోమీయులకు 1వ అధ్యాయము నుండి 16వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Romans",
        "title_telugu": "రోమీయులకు ఆరంభము"
      },
      {
        "chapter": 8,
        "title": "Romans Chapter 8",
        "title_telugu": "రోమీయులకు 8వ అధ్యాయము"
      },
      {
        "chapter": 16,
        "title": "Conclusion of Romans",
        "title_telugu": "రోమీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "46": {
    "id": 46,
    "name_english": "1 Corinthians",
    "name_telugu": "1 కొరింథీయులకు",
    "testament": "NT",
    "total_chapters": 16,
    "book_order": 46,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of 1 Corinthians (1 కొరింథీయులకు) is the 46th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 16 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 కొరింథీయులకు (1 Corinthians) గ్రంథము 46వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 16 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Corinthians chapters 1 to 16."
    ],
    "key_events_telugu": [
      "1 కొరింథీయులకు 1వ అధ్యాయము నుండి 16వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Corinthians",
        "title_telugu": "1 కొరింథీయులకు ఆరంభము"
      },
      {
        "chapter": 8,
        "title": "1 Corinthians Chapter 8",
        "title_telugu": "1 కొరింథీయులకు 8వ అధ్యాయము"
      },
      {
        "chapter": 16,
        "title": "Conclusion of 1 Corinthians",
        "title_telugu": "1 కొరింథీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "47": {
    "id": 47,
    "name_english": "2 Corinthians",
    "name_telugu": "2 కొరింథీయులకు",
    "testament": "NT",
    "total_chapters": 13,
    "book_order": 47,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of 2 Corinthians (2 కొరింథీయులకు) is the 47th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 13 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 కొరింథీయులకు (2 Corinthians) గ్రంథము 47వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 13 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Corinthians chapters 1 to 13."
    ],
    "key_events_telugu": [
      "2 కొరింథీయులకు 1వ అధ్యాయము నుండి 13వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Corinthians",
        "title_telugu": "2 కొరింథీయులకు ఆరంభము"
      },
      {
        "chapter": 6,
        "title": "2 Corinthians Chapter 6",
        "title_telugu": "2 కొరింథీయులకు 6వ అధ్యాయము"
      },
      {
        "chapter": 13,
        "title": "Conclusion of 2 Corinthians",
        "title_telugu": "2 కొరింథీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "48": {
    "id": 48,
    "name_english": "Galatians",
    "name_telugu": "గలతీయులకు",
    "testament": "NT",
    "total_chapters": 6,
    "book_order": 48,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Galatians (గలతీయులకు) is the 48th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 6 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి గలతీయులకు (Galatians) గ్రంథము 48వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 6 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Galatians chapters 1 to 6."
    ],
    "key_events_telugu": [
      "గలతీయులకు 1వ అధ్యాయము నుండి 6వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Galatians",
        "title_telugu": "గలతీయులకు ఆరంభము"
      },
      {
        "chapter": 3,
        "title": "Galatians Chapter 3",
        "title_telugu": "గలతీయులకు 3వ అధ్యాయము"
      },
      {
        "chapter": 6,
        "title": "Conclusion of Galatians",
        "title_telugu": "గలతీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "49": {
    "id": 49,
    "name_english": "Ephesians",
    "name_telugu": "ఎఫెసీయులకు",
    "testament": "NT",
    "total_chapters": 6,
    "book_order": 49,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Ephesians (ఎఫెసీయులకు) is the 49th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 6 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఎఫెసీయులకు (Ephesians) గ్రంథము 49వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 6 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Ephesians chapters 1 to 6."
    ],
    "key_events_telugu": [
      "ఎఫెసీయులకు 1వ అధ్యాయము నుండి 6వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Ephesians",
        "title_telugu": "ఎఫెసీయులకు ఆరంభము"
      },
      {
        "chapter": 3,
        "title": "Ephesians Chapter 3",
        "title_telugu": "ఎఫెసీయులకు 3వ అధ్యాయము"
      },
      {
        "chapter": 6,
        "title": "Conclusion of Ephesians",
        "title_telugu": "ఎఫెసీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "50": {
    "id": 50,
    "name_english": "Philippians",
    "name_telugu": "ఫిలిప్పీయులకు",
    "testament": "NT",
    "total_chapters": 4,
    "book_order": 50,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Philippians (ఫిలిప్పీయులకు) is the 50th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 4 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఫిలిప్పీయులకు (Philippians) గ్రంథము 50వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 4 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Philippians chapters 1 to 4."
    ],
    "key_events_telugu": [
      "ఫిలిప్పీయులకు 1వ అధ్యాయము నుండి 4వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Philippians",
        "title_telugu": "ఫిలిప్పీయులకు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "Philippians Chapter 2",
        "title_telugu": "ఫిలిప్పీయులకు 2వ అధ్యాయము"
      },
      {
        "chapter": 4,
        "title": "Conclusion of Philippians",
        "title_telugu": "ఫిలిప్పీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "51": {
    "id": 51,
    "name_english": "Colossians",
    "name_telugu": "కొలొస్సయులకు",
    "testament": "NT",
    "total_chapters": 4,
    "book_order": 51,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Colossians (కొలొస్సయులకు) is the 51th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 4 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి కొలొస్సయులకు (Colossians) గ్రంథము 51వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 4 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Colossians chapters 1 to 4."
    ],
    "key_events_telugu": [
      "కొలొస్సయులకు 1వ అధ్యాయము నుండి 4వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Colossians",
        "title_telugu": "కొలొస్సయులకు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "Colossians Chapter 2",
        "title_telugu": "కొలొస్సయులకు 2వ అధ్యాయము"
      },
      {
        "chapter": 4,
        "title": "Conclusion of Colossians",
        "title_telugu": "కొలొస్సయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "52": {
    "id": 52,
    "name_english": "1 Thessalonians",
    "name_telugu": "1 థెస్సలొనీకయులకు",
    "testament": "NT",
    "total_chapters": 5,
    "book_order": 52,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of 1 Thessalonians (1 థెస్సలొనీకయులకు) is the 52th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 5 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 థెస్సలొనీకయులకు (1 Thessalonians) గ్రంథము 52వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 5 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Thessalonians chapters 1 to 5."
    ],
    "key_events_telugu": [
      "1 థెస్సలొనీకయులకు 1వ అధ్యాయము నుండి 5వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Thessalonians",
        "title_telugu": "1 థెస్సలొనీకయులకు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "1 Thessalonians Chapter 2",
        "title_telugu": "1 థెస్సలొనీకయులకు 2వ అధ్యాయము"
      },
      {
        "chapter": 5,
        "title": "Conclusion of 1 Thessalonians",
        "title_telugu": "1 థెస్సలొనీకయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "53": {
    "id": 53,
    "name_english": "2 Thessalonians",
    "name_telugu": "2 థెస్సలొనీకయులకు",
    "testament": "NT",
    "total_chapters": 3,
    "book_order": 53,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of 2 Thessalonians (2 థెస్సలొనీకయులకు) is the 53th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 థెస్సలొనీకయులకు (2 Thessalonians) గ్రంథము 53వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Thessalonians chapters 1 to 3."
    ],
    "key_events_telugu": [
      "2 థెస్సలొనీకయులకు 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Thessalonians",
        "title_telugu": "2 థెస్సలొనీకయులకు ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "2 Thessalonians Chapter 1",
        "title_telugu": "2 థెస్సలొనీకయులకు 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of 2 Thessalonians",
        "title_telugu": "2 థెస్సలొనీకయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "54": {
    "id": 54,
    "name_english": "1 Timothy",
    "name_telugu": "1 తిమోతికి",
    "testament": "NT",
    "total_chapters": 6,
    "book_order": 54,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of 1 Timothy (1 తిమోతికి) is the 54th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 6 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 తిమోతికి (1 Timothy) గ్రంథము 54వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 6 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Timothy chapters 1 to 6."
    ],
    "key_events_telugu": [
      "1 తిమోతికి 1వ అధ్యాయము నుండి 6వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Timothy",
        "title_telugu": "1 తిమోతికి ఆరంభము"
      },
      {
        "chapter": 3,
        "title": "1 Timothy Chapter 3",
        "title_telugu": "1 తిమోతికి 3వ అధ్యాయము"
      },
      {
        "chapter": 6,
        "title": "Conclusion of 1 Timothy",
        "title_telugu": "1 తిమోతికి ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "55": {
    "id": 55,
    "name_english": "2 Timothy",
    "name_telugu": "2 తిమోతికి",
    "testament": "NT",
    "total_chapters": 4,
    "book_order": 55,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of 2 Timothy (2 తిమోతికి) is the 55th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 4 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 తిమోతికి (2 Timothy) గ్రంథము 55వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 4 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Timothy chapters 1 to 4."
    ],
    "key_events_telugu": [
      "2 తిమోతికి 1వ అధ్యాయము నుండి 4వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Timothy",
        "title_telugu": "2 తిమోతికి ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "2 Timothy Chapter 2",
        "title_telugu": "2 తిమోతికి 2వ అధ్యాయము"
      },
      {
        "chapter": 4,
        "title": "Conclusion of 2 Timothy",
        "title_telugu": "2 తిమోతికి ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "56": {
    "id": 56,
    "name_english": "Titus",
    "name_telugu": "తీతుకు",
    "testament": "NT",
    "total_chapters": 3,
    "book_order": 56,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Titus (తీతుకు) is the 56th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి తీతుకు (Titus) గ్రంథము 56వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Titus chapters 1 to 3."
    ],
    "key_events_telugu": [
      "తీతుకు 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Titus",
        "title_telugu": "తీతుకు ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Titus Chapter 1",
        "title_telugu": "తీతుకు 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of Titus",
        "title_telugu": "తీతుకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "57": {
    "id": 57,
    "name_english": "Philemon",
    "name_telugu": "ఫిలేమోనుకు",
    "testament": "NT",
    "total_chapters": 1,
    "book_order": 57,
    "authorship": "Apostle Paul",
    "authorship_telugu": "అపొస్తలుడైన పౌలు",
    "date_written": "Approx. A.D. 48–67",
    "date_written_telugu": "సుమారు క్రీ.శ. 48–67",
    "overview": "The Holy Scripture book of Philemon (ఫిలేమోనుకు) is the 57th canonical book, situated in the New Testament (Pauline Epistles (పౌలు పత్రికలు)). It comprises 1 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ఫిలేమోనుకు (Philemon) గ్రంథము 57వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 1 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Philemon chapters 1 to 1."
    ],
    "key_events_telugu": [
      "ఫిలేమోనుకు 1వ అధ్యాయము నుండి 1వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Philemon",
        "title_telugu": "ఫిలేమోనుకు ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Philemon Chapter 1",
        "title_telugu": "ఫిలేమోనుకు 1వ అధ్యాయము"
      },
      {
        "chapter": 1,
        "title": "Conclusion of Philemon",
        "title_telugu": "ఫిలేమోనుకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "58": {
    "id": 58,
    "name_english": "Hebrews",
    "name_telugu": "హెబ్రీయులకు",
    "testament": "NT",
    "total_chapters": 13,
    "book_order": 58,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of Hebrews (హెబ్రీయులకు) is the 58th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 13 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి హెబ్రీయులకు (Hebrews) గ్రంథము 58వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 13 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Hebrews chapters 1 to 13."
    ],
    "key_events_telugu": [
      "హెబ్రీయులకు 1వ అధ్యాయము నుండి 13వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Hebrews",
        "title_telugu": "హెబ్రీయులకు ఆరంభము"
      },
      {
        "chapter": 6,
        "title": "Hebrews Chapter 6",
        "title_telugu": "హెబ్రీయులకు 6వ అధ్యాయము"
      },
      {
        "chapter": 13,
        "title": "Conclusion of Hebrews",
        "title_telugu": "హెబ్రీయులకు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "59": {
    "id": 59,
    "name_english": "James",
    "name_telugu": "యాకోబు",
    "testament": "NT",
    "total_chapters": 5,
    "book_order": 59,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of James (యాకోబు) is the 59th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 5 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యాకోబు (James) గ్రంథము 59వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 5 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in James chapters 1 to 5."
    ],
    "key_events_telugu": [
      "యాకోబు 1వ అధ్యాయము నుండి 5వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of James",
        "title_telugu": "యాకోబు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "James Chapter 2",
        "title_telugu": "యాకోబు 2వ అధ్యాయము"
      },
      {
        "chapter": 5,
        "title": "Conclusion of James",
        "title_telugu": "యాకోబు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "60": {
    "id": 60,
    "name_english": "1 Peter",
    "name_telugu": "1 పేతురు",
    "testament": "NT",
    "total_chapters": 5,
    "book_order": 60,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of 1 Peter (1 పేతురు) is the 60th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 5 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 పేతురు (1 Peter) గ్రంథము 60వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 5 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 Peter chapters 1 to 5."
    ],
    "key_events_telugu": [
      "1 పేతురు 1వ అధ్యాయము నుండి 5వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 Peter",
        "title_telugu": "1 పేతురు ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "1 Peter Chapter 2",
        "title_telugu": "1 పేతురు 2వ అధ్యాయము"
      },
      {
        "chapter": 5,
        "title": "Conclusion of 1 Peter",
        "title_telugu": "1 పేతురు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "61": {
    "id": 61,
    "name_english": "2 Peter",
    "name_telugu": "2 పేతురు",
    "testament": "NT",
    "total_chapters": 3,
    "book_order": 61,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of 2 Peter (2 పేతురు) is the 61th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 3 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 పేతురు (2 Peter) గ్రంథము 61వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 3 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 Peter chapters 1 to 3."
    ],
    "key_events_telugu": [
      "2 పేతురు 1వ అధ్యాయము నుండి 3వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 Peter",
        "title_telugu": "2 పేతురు ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "2 Peter Chapter 1",
        "title_telugu": "2 పేతురు 1వ అధ్యాయము"
      },
      {
        "chapter": 3,
        "title": "Conclusion of 2 Peter",
        "title_telugu": "2 పేతురు ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "62": {
    "id": 62,
    "name_english": "1 John",
    "name_telugu": "1 యోహాను",
    "testament": "NT",
    "total_chapters": 5,
    "book_order": 62,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of 1 John (1 యోహాను) is the 62th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 5 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 1 యోహాను (1 John) గ్రంథము 62వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 5 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 1 John chapters 1 to 5."
    ],
    "key_events_telugu": [
      "1 యోహాను 1వ అధ్యాయము నుండి 5వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 1 John",
        "title_telugu": "1 యోహాను ఆరంభము"
      },
      {
        "chapter": 2,
        "title": "1 John Chapter 2",
        "title_telugu": "1 యోహాను 2వ అధ్యాయము"
      },
      {
        "chapter": 5,
        "title": "Conclusion of 1 John",
        "title_telugu": "1 యోహాను ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "63": {
    "id": 63,
    "name_english": "2 John",
    "name_telugu": "2 యోహాను",
    "testament": "NT",
    "total_chapters": 1,
    "book_order": 63,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of 2 John (2 యోహాను) is the 63th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 1 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 2 యోహాను (2 John) గ్రంథము 63వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 1 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 2 John chapters 1 to 1."
    ],
    "key_events_telugu": [
      "2 యోహాను 1వ అధ్యాయము నుండి 1వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 2 John",
        "title_telugu": "2 యోహాను ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "2 John Chapter 1",
        "title_telugu": "2 యోహాను 1వ అధ్యాయము"
      },
      {
        "chapter": 1,
        "title": "Conclusion of 2 John",
        "title_telugu": "2 యోహాను ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "64": {
    "id": 64,
    "name_english": "3 John",
    "name_telugu": "3 యోహాను",
    "testament": "NT",
    "total_chapters": 1,
    "book_order": 64,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of 3 John (3 యోహాను) is the 64th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 1 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి 3 యోహాను (3 John) గ్రంథము 64వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 1 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in 3 John chapters 1 to 1."
    ],
    "key_events_telugu": [
      "3 యోహాను 1వ అధ్యాయము నుండి 1వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of 3 John",
        "title_telugu": "3 యోహాను ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "3 John Chapter 1",
        "title_telugu": "3 యోహాను 1వ అధ్యాయము"
      },
      {
        "chapter": 1,
        "title": "Conclusion of 3 John",
        "title_telugu": "3 యోహాను ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "65": {
    "id": 65,
    "name_english": "Jude",
    "name_telugu": "యూదా",
    "testament": "NT",
    "total_chapters": 1,
    "book_order": 65,
    "authorship": "Hebrews author, James, Peter, John, Jude",
    "authorship_telugu": "యాకోబు, పేతురు, యోహాను, యూదా మరియు హెబ్రీ గ్రంథకర్త",
    "date_written": "Approx. A.D. 60–95",
    "date_written_telugu": "సుమారు క్రీ.శ. 60–95",
    "overview": "The Holy Scripture book of Jude (యూదా) is the 65th canonical book, situated in the New Testament (General / Catholic Epistles (సాధారణ పత్రికలు)). It comprises 1 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి యూదా (Jude) గ్రంథము 65వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 1 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Jude chapters 1 to 1."
    ],
    "key_events_telugu": [
      "యూదా 1వ అధ్యాయము నుండి 1వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Jude",
        "title_telugu": "యూదా ఆరంభము"
      },
      {
        "chapter": 1,
        "title": "Jude Chapter 1",
        "title_telugu": "యూదా 1వ అధ్యాయము"
      },
      {
        "chapter": 1,
        "title": "Conclusion of Jude",
        "title_telugu": "యూదా ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  },
  "66": {
    "id": 66,
    "name_english": "Revelation",
    "name_telugu": "ప్రకటన గ్రంథము",
    "testament": "NT",
    "total_chapters": 22,
    "book_order": 66,
    "authorship": "Apostle John (on the Isle of Patmos)",
    "authorship_telugu": "అపొస్తలుడైన యోహాను (పత్మాసు ద్వీపములో)",
    "date_written": "Approx. A.D. 95–96 (Reign of Domitian)",
    "date_written_telugu": "సుమారు క్రీ.శ. 95–96 (దొమీషియన్ చక్రవర్తి కాలము)",
    "overview": "The Holy Scripture book of Revelation (ప్రకటన గ్రంథము) is the 66th canonical book, situated in the New Testament (Apocalypse / Prophecy (ప్రకటన గ్రంథము)). It comprises 22 inspired chapters revealing God's holiness, righteousness, and redemptive grace.",
    "overview_telugu": "పరిశుద్ధ గ్రంథమందలి ప్రకటన గ్రంథము (Revelation) గ్రంథము 66వ పరిశుద్ధ గ్రంథ భాగము. ఇది క్రొత్త నిబంధనలో 22 అధ్యాయములను కలిగియుండి, దేవుని పరిశుద్ధత, నీతి, మరియు రక్షణ కృపను ప్రత్యక్షపరుస్తుంది.",
    "background": "Preserved faithfully within the Protestant biblical canon to guide believers in faith, holiness, and obedience to the Lord.",
    "background_telugu": "విశ్వాసులను దేవుని వాక్యమందు, భయభక్తులయందు, మరియు విధేయతయందు స్థిరపరచుటకై పరిశుద్ధాత్మ ప్రేరణతో వ్రాయబడిన దైవ గ్రంథము.",
    "main_themes": [
      "God's Sovereign Authority and Eternal Truth",
      "Salvation, Faith, and Repentance",
      "Living in Righteousness, Worship, and Prayer"
    ],
    "main_themes_telugu": [
      "దేవుని సార్వభౌమాధికారము మరియు సత్యవాక్యము",
      "రక్షణ, విశ్వాసము, మరియు పశ్చాత్తాపము",
      "నీతిగా జీవించుట, ఆరాధన, మరియు ప్రార్థనా జీవితము"
    ],
    "key_people": [
      "The Lord God",
      "Servants of the Lord",
      "Believers"
    ],
    "key_people_telugu": [
      "యెహోవా దేవుడు",
      "దేవుని సేవకులు",
      "విశ్వాసులు"
    ],
    "key_events": [
      "Inspired sacred accounts recorded in Revelation chapters 1 to 22."
    ],
    "key_events_telugu": [
      "ప్రకటన గ్రంథము 1వ అధ్యాయము నుండి 22వ అధ్యాయము వరకు గల పవిత్ర వృత్తాంతములు."
    ],
    "key_chapters": [
      {
        "chapter": 1,
        "title": "Beginning of Revelation",
        "title_telugu": "ప్రకటన గ్రంథము ఆరంభము"
      },
      {
        "chapter": 11,
        "title": "Revelation Chapter 11",
        "title_telugu": "ప్రకటన గ్రంథము 11వ అధ్యాయము"
      },
      {
        "chapter": 22,
        "title": "Conclusion of Revelation",
        "title_telugu": "ప్రకటన గ్రంథము ముగింపు"
      }
    ],
    "related_books": [
      "Romans",
      "John",
      "Ephesians"
    ]
  }
};

export function getBookDetails(book: { id: number; name_english: string; name_telugu: string; testament: 'OT' | 'NT'; total_chapters: number; book_order: number }): BookDetailInfo {
  const existing = BIBLE_BOOK_DETAILS_MAP[book.id];
  if (existing) return existing;

  return {
    id: book.id,
    name_english: book.name_english,
    name_telugu: book.name_telugu,
    testament: book.testament,
    total_chapters: book.total_chapters,
    book_order: book.book_order,
    authorship: "Traditional Biblical Authorship",
    authorship_telugu: "సాంప్రదాయిక గ్రంథకర్తృత్వము",
    date_written: "Biblical Antiquity",
    date_written_telugu: "ప్రాచీన బైబిల్ కాలము",
    overview: `The Holy Scripture book of ${book.name_english} (${book.name_telugu}) comprises ${book.total_chapters} inspired chapters in the ${book.testament === 'OT' ? 'Old Testament' : 'New Testament'}.`,
    overview_telugu: `పరిశుద్ధ గ్రంథమందలి ${book.name_telugu} (${book.name_english}) గ్రంథము ${book.total_chapters} అధ్యాయములను కలిగియున్నది.`,
    background: "Preserved faithfully within the Protestant biblical canon.",
    background_telugu: "పరిశుద్ధ గ్రంథమందు భద్రపరచబడిన దైవ వాక్యము.",
    main_themes: ["God's Holiness", "Redemption in Christ", "Faith and Obedience"],
    main_themes_telugu: ["దేవుని పరిశుద్ధత", "క్రీస్తునందలి రక్షణ", "విశ్వాసము మరియు విధేయత"],
    key_people: ["The Lord", "Prophets & Apostles"],
    key_people_telugu: ["యెహోవా దేవుడు", "ప్రవక్తలు & అపొస్తలులు"],
    key_events: [`Narratives of ${book.name_english}`],
    key_events_telugu: [`${book.name_telugu} పవిత్ర వృత్తాంతములు`],
    key_chapters: [{ chapter: 1, title: `${book.name_english} Chapter 1`, title_telugu: `1వ అధ్యాయము` }],
    related_books: book.testament === 'OT' ? ["Genesis", "Psalms"] : ["Romans", "John"]
  };
}

export function getChapterDetails(bookNameEn: string, bookNameTe: string, chapterNum: number, totalVerses: number): ChapterDetailInfo {
  // Special curated outlines for notable chapters
  const norm = bookNameEn.toLowerCase();
  if (norm === 'john' && chapterNum === 3) {
    return {
      chapter_number: 3,
      title: "The New Birth & The Love of God (John 3:16)",
      title_telugu: "క్రొత్త జన్మ & దేవుని ప్రేమ (యోహాను 3:16)",
      summary: "Nicodemus visits Jesus by night. Jesus reveals that one must be born again of water and Spirit, proclaiming God's sacrificial love in sending His only begotten Son.",
      summary_telugu: "రాత్రివేళ నికోదేము యేసునొద్దకు వచ్చెను. ఒకడు నీటిమూలముగాను ఆత్మమూలముగాను జన్మించితేనే గాని దేవుని రాజ్యములో ప్రవేశింపలేడని ప్రభువు బోధించెను. దేవుడు లోకమును ఎంతో ప్రేమించెను.",
      main_events: [
        "Nicodemus visits Jesus by night (v. 1-2)",
        "The necessity of the New Birth (v. 3-8)",
        "The Bronze Serpent lifted up (v. 14-15)",
        "God so loved the world (v. 16-17)",
        "John the Baptist: 'He must increase, but I must decrease' (v. 22-36)"
      ],
      main_events_telugu: [
        "రాత్రివేళ నికోదేము యేసునొద్దకు వచ్చుట (వ. 1-2)",
        "క్రొత్త జన్మ ఆవశ్యకత (వ. 3-8)",
        "ఎత్తబడిన ఇత్తడి సర్పము సాదృశ్యము (వ. 14-15)",
        "దేవుని అపరిమిత ప్రేమ (వ. 16-17)",
        "బాప్తిస్మమిచ్చు యోహాను సాక్ష్యము (వ. 22-36)"
      ],
      people_mentioned: ["Jesus Christ", "Nicodemus", "John the Baptist", "Moses"],
      people_mentioned_telugu: ["యేసు క్రీస్తు", "నికోదేము", "బాప్తిస్మమిచ్చు యోహాను", "మోషే"],
      main_themes: ["Regeneration / New Birth", "Divine Love and Atonement", "Faith versus Condemnation"],
      main_themes_telugu: ["ఆత్మీయ పునర్జన్మ", "దైవిక ప్రేమ మరియు ప్రాయశ్చిత్తము", "విశ్వాసము మరియు రక్షణ"],
      key_verses: ["John 3:3", "John 3:16", "John 3:17", "John 3:30"],
      related_chapters: ["John 1", "Romans 8", "Titus 3"]
    };
  }

  if (norm === 'acts' && chapterNum === 2) {
    return {
      chapter_number: 2,
      title: "The Day of Pentecost & Birth of the Church",
      title_telugu: "పెంతెకొస్తు దినము & పరిశుద్ధాత్మ ఆగమనము",
      summary: "The Holy Spirit descends with the sound of a rushing mighty wind and tongues of fire. Peter preaches the resurrected Christ with power, resulting in about 3,000 souls being saved and baptized.",
      summary_telugu: "పెంతెకొస్తు దినమున బలమైన గాలివంటి ధ్వనితో మరియు అగ్నిజ్వాలలవంటి నాలుకలతో పరిశుద్ధాత్మ దిగివచ్చెను. పేతురు ధైర్యముగా క్రీస్తు పునరుత్థానమును ప్రకటించెను. మూడువేలమంది మారుమనస్సు పొంది బాప్తిస్మము తీసికొనిరి.",
      main_events: [
        "Outpouring of the Holy Spirit at Pentecost (v. 1-4)",
        "Speaking in other tongues as the Spirit gave utterance (v. 5-13)",
        "Peter's Pentecost sermon quoting Joel and David (v. 14-36)",
        "Repentance and baptism of 3,000 souls (v. 37-41)",
        "The fellowship of the early Jerusalem church (v. 42-47)"
      ],
      main_events_telugu: [
        "పరిశుద్ధాత్మ దిగివచ్చుట (వ. 1-4)",
        "అన్యభాషలతో మాట్లాడుట (వ. 5-13)",
        "పేతురు ప్రసంగము - యోవేలు ప్రవచన నెరవేర్పు (వ. 14-36)",
        "మారుమనస్సు, బాప్తిస్మము, 3,000 మంది రక్షణ (వ. 37-41)",
        "ఆదిమ సంఘ సహవాసము మరియు ప్రార్థన (వ. 42-47)"
      ],
      people_mentioned: ["Holy Spirit", "Apostle Peter", "The Eleven Apostles", "David", "Joel"],
      people_mentioned_telugu: ["పరిశుద్ధాత్మ దేవుడు", "అపొస్తలుడైన పేతురు", "పదకొండుమంది అపొస్తలులు", "దావీదు", "యోవేలు ప్రవక్త"],
      main_themes: ["Empowerment of the Holy Spirit", "The Risen and Exalted Christ", "Repentance, Baptism, and Church Fellowship"],
      main_themes_telugu: ["పరిశుద్ధాత్మాభిషేకము", "పునరుత్థానుడైన యేసు క్రీస్తు", "మారుమనస్సు, బాప్తిస్మము, సంఘ సహవాసము"],
      key_verses: ["Acts 2:4", "Acts 2:21", "Acts 2:38", "Acts 2:42"],
      related_chapters: ["Luke 24", "Joel 2", "Acts 1", "Acts 4"]
    };
  }

  // Standard chapter outline
  return {
    chapter_number: chapterNum,
    title: `${bookNameEn} Chapter ${chapterNum}`,
    title_telugu: `${bookNameTe} ${chapterNum}వ అధ్యాయము`,
    summary: `Chapter ${chapterNum} of the Holy Book of ${bookNameEn} contains ${totalVerses} inspired verses of Holy Scripture, revealing God's truth, divine promises, and spiritual wisdom for the church.`,
    summary_telugu: `${bookNameTe} ${chapterNum}వ అధ్యాయములో ${totalVerses} పరిశుద్ధ వచనములు కలవు. ఇది దేవుని వాక్యమును, పరిశుద్ధ సత్యములను, మరియు దైవిక వాగ్దానములను తెలియజేస్తుంది.`,
    main_events: [
      `Sacred scripture narrative recorded in ${bookNameEn} ${chapterNum}:1 through ${chapterNum}:${totalVerses}.`
    ],
    main_events_telugu: [
      `${bookNameTe} ${chapterNum}:1 నుండి ${chapterNum}:${totalVerses} వరకు గల పరిశుద్ధ వాక్య వృత్తాంతములు.`
    ],
    people_mentioned: ["The Lord God", "Servants of the Lord"],
    people_mentioned_telugu: ["యెహోవా దేవుడు", "దేవుని సేవకులు"],
    main_themes: ["Faithfulness to God's Word", "Prayer and Worship", "Righteous Living"],
    main_themes_telugu: ["దైవవాక్యమునకు విధేయత", "ప్రార్థన మరియు ఆరాధన", "పరిశుద్ధ జీవితము"],
    key_verses: [`${bookNameEn} ${chapterNum}:1`],
    related_chapters: chapterNum > 1 ? [`${bookNameEn} ${chapterNum - 1}`, `${bookNameEn} ${chapterNum + 1}`] : [`${bookNameEn} 2`]
  };
}

export function getVerseCrossReferences(bookNameEn: string, chapter: number, verse: number): string[] {
  const ref = `${bookNameEn.toLowerCase()} ${chapter}:${verse}`;
  if (ref.includes('john 3:16')) {
    return [
      "Romans 5:8 - But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",
      "1 John 4:9 - In this was manifested the love of God toward us, because that God sent his only begotten Son into the world, that we might live through him.",
      "John 1:12 - But as many as received him, to them gave he power to become the sons of God.",
      "Ephesians 2:4-5 - But God, who is rich in mercy, for his great love wherewith he loved us, even when we were dead in sins, hath quickened us together with Christ."
    ];
  }
  if (ref.includes('acts 2:38')) {
    return [
      "Mark 16:16 - He that believeth and is baptized shall be saved.",
      "Acts 3:19 - Repent ye therefore, and be converted, that your sins may be blotted out.",
      "Acts 10:47 - Can any man forbid water, that these should not be baptized, which have received the Holy Ghost as well as we?"
    ];
  }
  if (ref.includes('genesis 1:1')) {
    return [
      "John 1:1-3 - In the beginning was the Word, and the Word was with God, and the Word was God.",
      "Colossians 1:16 - For by him were all things created, that are in heaven, and that are in earth.",
      "Hebrews 11:3 - Through faith we understand that the worlds were framed by the word of God.",
      "Psalm 102:25 - Of old hast thou laid the foundation of the earth: and the heavens are the work of thy hands."
    ];
  }
  return [
    "Psalm 119:105 - Thy word is a lamp unto my feet, and a light unto my path.",
    "2 Timothy 3:16 - All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness."
  ];
}
