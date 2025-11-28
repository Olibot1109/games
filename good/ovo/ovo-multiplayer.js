(function () {
  'use strict';

  function _mergeNamespaces(n, m) {
    m.forEach(function (e) {
      e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
        if (k !== 'default' && !(k in n)) {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    });
    return Object.freeze(n);
  }

  // Constants for OvO multiplayer

  // Version of the mod
  const VERSION = "2.0";

  // ID for prompt warning
  const THIS_PROMPT_ID = "beta-multiplayer-prompt";

  // Message types for network communication
  const DATA_TYPES = {
    PLAYER_DATA: "PLAYER_DATA",
    HOST_DATA: "HOST_DATA",
    CHAT: "CHAT",
    PLAYER_JOIN: "PLAYER_JOIN",
    PLAYER_LEAVE: "PLAYER_LEAVE",
    SERVER_FULL: "SERVER_FULL", // Added for handling full server scenarios
    HOST_DISCONNECT: "HOST_DISCONNECT",
  };

  // Profanity filter utility

  // Lists of profane words and phrases to filter
  // These would be imported from constants.js in a real implementation
  // But for brevity in this refactoring, we'll define them here

  let filterArrSpaces = [
    "2 girls 1 cup",
    "alabama hot pocket",
    "alaskan pipeline",
    "ass hole",
    "auto erotic",
    "baby batter",
    "baby juice",
    "ball gag",
    "ball gravy",
    "ball kicking",
    "ball licking",
    "ball sack",
    "ball sucking",
    "barely legal",
    "beaver cleaver",
    "beaver lips",
    "big black",
    "big breasts",
    "big knockers",
    "big tits",
    "black cock",
    "blonde action",
    "blonde on blonde action",
    "blow job",
    "blow your load",
    "blue waffle",
    "booty call",
    "brown showers",
    "brunette action",
    "bull shit",
    "bullet vibe",
    "bung hole",
    "bunny fucker",
    "butt fuck",
    "butt plug",
    "camel toe",
    "carpet muncher",
    "chocolate rosebuds",
    "cleveland steamer",
    "clover clamps",
    "cock sucker",
    "date rape",
    "deep throat",
    "dirty pillows",
    "dirty sanchez",
    "dog style",
    "doggie style",
    "doggy style",
    "donkey punch",
    "double dong",
    "double penetration",
    "dp action",
    "dry hump",
    "dumb ass",
    "eat my ass",
    "f u c k",
    "f u c k e r",
    "female squirting",
    "foot fetish",
    "fuck buttons",
    "fuck off",
    "fudge packer",
    "gang bang",
    "gay sex",
    "giant cock",
    "girl on",
    "girl on top",
    "girls gone wild",
    "god damn",
    "golden shower",
    "goo girl",
    "group sex",
    "hand job",
    "hard core",
    "hard on",
    "hot carl",
    "hot chick",
    "how to kill",
    "how to murder",
    "huge fat",
    "jack Off",
    "jail bait",
    "jelly donut",
    "jerk off",
    "jungle bunny",
    "leather restraint",
    "leather straight jacket",
    "lemon party",
    "make me come",
    "male squirting",
    "menage a trois",
    "missionary position",
    "mother fucker",
    "mound of venus",
    "mr hands",
    "muff diver",
    "nig nog",
    "nob jokey",
    "nsfw images",
    "nut sack",
    "one cup two girls",
    "one guy one jar",
    "phone sex",
    "piece of shit",
    "piss pig",
    "pissed off",
    "pleasure chest",
    "pole smoker",
    "poop chute",
    "porch monkey",
    "prince albert piercing",
    "raging boner",
    "reverse cowgirl",
    "rosy palm",
    "rosy palm and her 5 sisters",
    "rusty trombone",
    "s hit",
    "sand nigger",
    "shaved beaver",
    "shaved pussy",
    "splooge moose",
    "spread legs",
    "strap on",
    "strip club",
    "style doggy",
    "suicide girls",
    "sultry women",
    "tainted love",
    "taste my",
    "tea bagging",
    "tied up",
    "tight white",
    "tongue in a",
    "tub girl",
    "two girls one cup",
    "urethra play",
    "venus mound",
    "violet wand",
    "wet dream",
    "white power",
    "wrapping men",
    "wrinkled starfish",
    "yellow showers",
  ];
  let filterArrNoSpaces = [
    "2g1c",
    "4r5e",
    "5h1t",
    "5hit",
    "a_s_s",
    "a55",
    "a55hole",
    "acrotomophilia",
    "aeolus",
    "ahole",
    "anal",
    "analprobe",
    "anilingus",
    "anus",
    "apeshit",
    "ar5e",
    "areola",
    "areole",
    "arian",
    "arrse",
    "arse",
    "arsehole",
    "aryan",
    "ass",
    "assbag",
    "assbandit",
    "assbang",
    "assbanged",
    "assbanger",
    "assbangs",
    "assbite",
    "assclown",
    "asscock",
    "asscracker",
    "asses",
    "assface",
    "assfuck",
    "assfucker",
    "ass-fucker",
    "assfukka",
    "assgoblin",
    "assh0le",
    "asshat",
    "ass-hat",
    "asshead",
    "assho1e",
    "asshole",
    "assholes",
    "asshopper",
    "ass-jabber",
    "assjacker",
    "asslick",
    "asslicker",
    "assmaster",
    "assmonkey",
    "assmunch",
    "assmuncher",
    "assnigger",
    "asspirate",
    "ass-pirate",
    "assshit",
    "assshole",
    "asssucker",
    "asswad",
    "asswhole",
    "asswipe",
    "asswipes",
    "autoerotic",
    "axwound",
    "azazel",
    "azz",
    "b!tch",
    "b00bs",
    "b17ch",
    "b1tch",
    "babe",
    "babeland",
    "babes",
    "balls",
    "ballbag",
    "ballsack",
    "bampot",
    "bang",
    "bangbros",
    "banger",
    "bareback",
    "barenaked",
    "barf",
    "bastard",
    "bastardo",
    "bastards",
    "bastinado",
    "bawdy",
    "bbw",
    "bdsm",
    "beaner",
    "beaners",
    "beardedclam",
    "beastial",
    "beastiality",
    "beatch",
    "beater",
    "beeyotch",
    "bellend",
    "beotch",
    "bestial",
    "bestiality",
    "bi+ch",
    "biatch",
    "bigtits",
    "bimbo",
    "bimbos",
    "birdlock",
    "bitch",
    "bitchass",
    "bitched",
    "bitcher",
    "bitchers",
    "bitches",
    "bitchin",
    "bitching",
    "bitchtits",
    "bitchy",
    "blowjob",
    "blowjobs",
    "blumpkin",
    "bod",
    "bodily",
    "boink",
    "boiolas",
    "bollock",
    "bollocks",
    "bollok",
    "bollox",
    "bondage",
    "boned",
    "boner",
    "boners",
    "bong",
    "boob",
    "boobies",
    "boobs",
    "booby",
    "booger",
    "bookie",
    "booobs",
    "boooobs",
    "booooobs",
    "booooooobs",
    "bootee",
    "bootie",
    "booty",
    "booze",
    "boozer",
    "boozy",
    "bosom",
    "bosomy",
    "bra",
    "brassiere",
    "breast",
    "breasts",
    "breeder",
    "brotherfucker",
    "buceta",
    "bugger",
    "bukkake",
    "bulldyke",
    "bullshit",
    "bullshits",
    "bullshitted",
    "bullturds",
    "bum",
    "bumblefuck",
    "bung",
    "bunghole",
    "busty",
    "butt",
    "buttcheeks",
    "buttfuck",
    "buttfucka",
    "buttfucker",
    "butthole",
    "buttmuch",
    "butt-pirate",
    "buttplug",
    "c.0.c.k",
    "c.o.c.k.",
    "c.u.n.t",
    "c0ck",
    "c-0-c-k",
    "c0cksucker",
    "caca",
    "cahone",
    "cameltoe",
    "camgirl",
    "camslut",
    "camwhore",
    "carpetmuncher",
    "cawk",
    "cervix",
    "chesticle",
    "chinc",
    "chincs",
    "chink",
    "choad",
    "chode",
    "chodes",
    "cipa",
    "circlejerk",
    "cl1t",
    "climax",
    "clit",
    "clitface",
    "clitfuck",
    "clitoris",
    "clitorus",
    "clits",
    "clitty",
    "clusterfuck",
    "cnut",
    "cocain",
    "cocaine",
    "cock",
    "c-o-c-k",
    "cockass",
    "cockbite",
    "cockblock",
    "cockburger",
    "cockeye",
    "cockface",
    "cockfucker",
    "cockhead",
    "cockholster",
    "cockjockey",
    "cockknocker",
    "cockknoker",
    "cocklump",
    "cockmaster",
    "cockmongler",
    "cockmongruel",
    "cockmonkey",
    "cockmunch",
    "cockmuncher",
    "cocknose",
    "cocknugget",
    "cocks",
    "cockshit",
    "cocksmith",
    "cocksmoke",
    "cocksmoker",
    "cocksniffer",
    "cocksuck",
    "cocksucked",
    "cocksucker",
    "cock-sucker",
    "cocksucking",
    "cocksucks",
    "cocksuka",
    "cocksukka",
    "cockwaffle",
    "coital",
    "cok",
    "cokmuncher",
    "coksucka",
    "commie",
    "condom",
    "coochie",
    "coochy",
    "coon",
    "coons",
    "cooter",
    "coprolagnia",
    "coprophilia",
    "corksucker",
    "cornhole",
    "cox",
    "crabs",
    "crack",
    "crackwhore",
    "crap",
    "crappy",
    "creampie",
    "crotte",
    "cum",
    "cumbubble",
    "cumdumpster",
    "cumguzzler",
    "cumjockey",
    "cummer",
    "cummin",
    "cumming",
    "cums",
    "cumshot",
    "cumshots",
    "cumslut",
    "cumstain",
    "cumtart",
    "cunilingus",
    "cunillingus",
    "cunnie",
    "cunnilingus",
    "cunny",
    "cunt",
    "c-u-n-t",
    "cuntass",
    "cuntface",
    "cunthole",
    "cunthunter",
    "cuntlick",
    "cuntlicker",
    "cuntlicking",
    "cuntrag",
    "cunts",
    "cuntslut",
    "cyalis",
    "cyberfuc",
    "cyberfuck",
    "cyberfucked",
    "cyberfucker",
    "cyberfuckers",
    "cyberfucking",
    "d0ng",
    "d0uch3",
    "d0uche",
    "d1ck",
    "d1ld0",
    "d1ldo",
    "dago",
    "dagos",
    "darkie",
    "damn",
    "damned",
    "dammit",
    "daterape",
    "dawgie-style",
    "deepthroat",
    "deggo",
    "dendrophilia",
    "dick",
    "dickbag",
    "dickbeaters",
    "dickdipper",
    "dickface",
    "dickflipper",
    "dickfuck",
    "dickfucker",
    "dickhead",
    "dickheads",
    "dickhole",
    "dickish",
    "dick-ish",
    "dickjuice",
    "dickmilk ",
    "dickmonger",
    "dickripper",
    "dicks",
    "dicksipper",
    "dickslap",
    "dick-sneeze",
    "dicksucker",
    "dicksucking",
    "dicktickler",
    "dickwad",
    "dickweasel",
    "dickweed",
    "dickwhipper",
    "dickwod",
    "dickzipper",
    "diddle",
    "dike",
    "dildo",
    "dildos",
    "diligaf",
    "dillweed",
    "dimwit",
    "dingle",
    "dingleberries",
    "dingleberry",
    "dink",
    "dinks",
    "dipship",
    "dipshit",
    "dirsa",
    "dlck",
    "dog-fucker",
    "doggiestyle",
    "doggie-style",
    "doggin",
    "dogging",
    "doggystyle",
    "doggy-style",
    "dolcett",
    "domination",
    "dominatrix",
    "dommes",
    "dong",
    "donkeyribber",
    "doochbag",
    "doofus",
    "dookie",
    "doosh",
    "dopey",
    "doublelift",
    "douch3",
    "douche",
    "douchebag",
    "douchebags",
    "douche-fag",
    "douchewaffle",
    "douchey",
    "drunk",
    "duche",
    "dumass",
    "dumbass",
    "dumbasses",
    "dumbcunt",
    "dumbfuck",
    "dumbshit",
    "dummy",
    "dumshit",
    "dvda",
    "dyke",
    "dykes",
    "ecchi",
    "ejaculate",
    "ejaculated",
    "ejaculates",
    "ejaculating",
    "ejaculatings",
    "ejaculation",
    "ejakulate",
    "enlargement",
    "erect",
    "erection",
    "erotic",
    "erotism",
    "escort",
    "essohbee",
    "eunuch",
    "extacy",
    "extasy",
    "f.u.c.k",
    "f_u_c_k",
    "f4nny",
    "fack",
    "fag",
    "fagbag",
    "fagfucker",
    "fagg",
    "fagged",
    "fagging",
    "faggit",
    "faggitt",
    "faggot",
    "faggotcock",
    "faggs",
    "fagot",
    "fagots",
    "fags",
    "fagtard",
    "faig",
    "faigt",
    "fanny",
    "fannybandit",
    "fannyflaps",
    "fannyfucker",
    "fanyy",
    "fartknocker",
    "fatass",
    "fcuk",
    "fcuker",
    "fcuking",
    "fecal",
    "feck",
    "fecker",
    "felch",
    "felcher",
    "felching",
    "fellate",
    "fellatio",
    "feltch",
    "feltcher",
    "femdom",
    "figging",
    "fingerbang",
    "fingerfuck",
    "fingerfucked",
    "fingerfucker",
    "fingerfuckers",
    "fingerfucking",
    "fingerfucks",
    "fingering",
    "fisted",
    "fistfuck",
    "fistfucked",
    "fistfucker",
    "fistfuckers",
    "fistfucking",
    "fistfuckings",
    "fistfucks",
    "fisting",
    "fisty",
    "flamer",
    "flange",
    "floozy",
    "foad",
    "foah",
    "fondle",
    "foobar",
    "fook",
    "fooker",
    "footjob",
    "foreskin",
    "freex",
    "frigg",
    "frigga",
    "frotting",
    "fubar",
    "fuck",
    "f-u-c-k",
    "fucka",
    "fuckass",
    "fuckbag",
    "fuckboy",
    "fuckbrain",
    "fuckbutt",
    "fuckbutter",
    "fucked",
    "fucker",
    "fuckers",
    "fuckersucker",
    "fuckface",
    "fuckhead",
    "fuckheads",
    "fuckhole",
    "fuckin",
    "fucking",
    "fuckings",
    "fuckingshitmotherfucker",
    "fuckme",
    "fucknugget",
    "fucknut",
    "fucknutt",
    "fuckoff",
    "fucks",
    "fuckstick",
    "fucktard",
    "fuck-tard",
    "fucktards",
    "fucktart",
    "fucktwat",
    "fuckup",
    "fuckwad",
    "fuckwhit",
    "fuckwit",
    "fuckwitt",
    "fudgepacker",
    "fuk",
    "fuker",
    "fukker",
    "fukkin",
    "fuks",
    "fukwhit",
    "fukwit",
    "futanari",
    "fux",
    "fux0r",
    "fvck",
    "fxck",
    "gae",
    "gai",
    "gangbang",
    "gangbanged",
    "gangbangs",
    "ganja",
    "gay",
    "gayass",
    "gaybob",
    "gaydo",
    "gayfuck",
    "gayfuckist",
    "gaylord",
    "gays",
    "gaysex",
    "gaytard",
    "gaywad",
    "genitals",
    "gey",
    "gfy",
    "ghay",
    "ghey",
    "gigolo",
    "glans",
    "goatcx",
    "goatse",
    "godamn",
    "godamnit",
    "goddam",
    "god-dam",
    "goddammit",
    "goddamn",
    "goddamned",
    "god-damned",
    "goddamnit",
    "gokkun",
    "goldenshower",
    "gonad",
    "gonads",
    "gooch",
    "goodpoop",
    "gook",
    "gooks",
    "goregasm",
    "gringo",
    "grope",
    "gspot",
    "g-spot",
    "gtfo",
    "guido",
    "guro",
    "h0m0",
    "h0mo",
    "handjob",
    "hardcore",
    "hardcoresex",
    "he11",
    "heeb",
    "hemp",
    "hentai",
    "heroin",
    "herp",
    "herpes",
    "herpy",
    "heshe",
    "hitler",
    "hiv",
    "ho",
    "hoar",
    "hoare",
    "hobag",
    "hoe",
    "hoer",
    "hom0",
    "homey",
    "homo",
    "homodumbshit",
    "homoerotic",
    "homoey",
    "honkey",
    "honky",
    "hooch",
    "hookah",
    "hooker",
    "hoor",
    "hootch",
    "hooter",
    "hooters",
    "hore",
    "horniest",
    "horny",
    "hotsex",
    "hump",
    "humped",
    "humping",
    "hussy",
    "hymen",
    "inbred",
    "incest",
    "injun",
    "intercourse",
    "j3rk0ff",
    "jackass",
    "jackhole",
    "jackoff",
    "jack-off",
    "jaggi",
    "jagoff",
    "jailbait",
    "jap",
    "japs",
    "jerk",
    "jerk0ff",
    "jerkass",
    "jerked",
    "jerkoff",
    "jerk-off",
    "jigaboo",
    "jiggaboo",
    "jiggerboo",
    "jism",
    "jiz",
    "jizm",
    "jizz",
    "jizzed",
    "juggs",
    "junglebunny",
    "junkie",
    "junky",
    "kawk",
    "kike",
    "kikes",
    "kinbaku",
    "kinkster",
    "kinky",
    "kkk",
    "knob",
    "knobbing",
    "knobead",
    "knobed",
    "knobend",
    "knobhead",
    "knobjocky",
    "knobjokey",
    "kock",
    "kondum",
    "kondums",
    "kooch",
    "kooches",
    "kootch",
    "kraut",
    "kum",
    "kummer",
    "kumming",
    "kums",
    "kunilingus",
    "kunja",
    "kunt",
    "kyke",
    "l3i+ch",
    "l3itch",
    "labia",
    "lameass",
    "lardass",
    "lech",
    "leper",
    "lesbian",
    "lesbians",
    "lesbo",
    "lesbos",
    "lez",
    "lezbian",
    "lezbians",
    "lezbo",
    "lezbos",
    "lezzie",
    "lezzies",
    "lezzy",
    "lmao",
    "lmfao",
    "loin",
    "loins",
    "lolita",
    "lovemaking",
    "lube",
    "lust",
    "lusting",
    "lusty",
    "m0f0",
    "m0fo",
    "m45terbate",
    "ma5terb8",
    "ma5terbate",
    "mams",
    "masochist",
    "massa",
    "masterb8",
    "masterbat",
    "masterbat3",
    "masterbate",
    "master-bate",
    "masterbating",
    "masterbation",
    "masterbations",
    "masturbate",
    "masturbating",
    "masturbation",
    "maxi",
    "mcfagget",
    "menses",
    "menstruate",
    "menstruation",
    "meth",
    "m-fucking",
    "mick",
    "milf",
    "minge",
    "mof0",
    "mofo",
    "mo-fo",
    "molest",
    "moolie",
    "moron",
    "mothafuck",
    "mothafucka",
    "mothafuckas",
    "mothafuckaz",
    "mothafucked",
    "mothafucker",
    "mothafuckers",
    "mothafuckin",
    "mothafucking",
    "mothafuckings",
    "mothafucks",
    "motherfuck",
    "motherfucka",
    "motherfucked",
    "motherfucker",
    "motherfuckers",
    "motherfuckin",
    "motherfucking",
    "motherfuckings",
    "motherfuckka",
    "motherfucks",
    "mtherfucker",
    "mthrfucker",
    "mthrfucking",
    "muff",
    "muffdiver",
    "muffdiving",
    "munging",
    "murder",
    "mutha",
    "muthafecker",
    "muthafuckaz",
    "muthafucker",
    "muthafuckker",
    "muther",
    "mutherfucker",
    "mutherfucking",
    "muthrfucking",
    "n1gga",
    "n1gger",
    "nad",
    "nads",
    "naked",
    "nambla",
    "napalm",
    "nappy",
    "nawashi",
    "nazi",
    "nazism",
    "negro",
    "neonazi",
    "nigaboo",
    "nigg3r",
    "nigg4h",
    "nigga",
    "niggah",
    "niggas",
    "niggaz",
    "nigger",
    "niggers",
    "niggle",
    "niglet",
    "nimphomania",
    "nimrod",
    "ninny",
    "nipple",
    "nipples",
    "nob",
    "nobhead",
    "nobjocky",
    "nobjokey",
    "nooky",
    "nude",
    "nudity",
    "numbnuts",
    "nutsack",
    "nympho",
    "nymphomania",
    "octopussy",
    "omorashi",
    "opiate",
    "opium",
    "oral",
    "orally",
    "organ",
    "orgasim",
    "orgasims",
    "orgasm",
    "orgasmic",
    "orgasms",
    "orgies",
    "orgy",
    "ovary",
    "ovum",
    "ovums",
    "p.u.s.s.y.",
    "p0rn",
    "paddy",
    "paedophile",
    "paki",
    "panooch",
    "pantie",
    "panties",
    "panty",
    "pastie",
    "pasty",
    "pawn",
    "pcp",
    "pecker",
    "peckerhead",
    "pedo",
    "pedobear",
    "pedophile",
    "pedophilia",
    "pedophiliac",
    "peepee",
    "pegging",
    "penetrate",
    "penetration",
    "penial",
    "penile",
    "penis",
    "penisbanger",
    "penisfucker",
    "penispuffer",
    "perversion",
    "peyote",
    "phalli",
    "phallic",
    "phonesex",
    "phuck",
    "phuk",
    "phuked",
    "phuking",
    "phukked",
    "phukking",
    "phuks",
    "phuq",
    "pigfucker",
    "pillowbiter",
    "pimp",
    "pimpis",
    "pinko",
    "pissed",
    "pisser",
    "pissers",
    "pisses",
    "pissflaps",
    "pissin",
    "pissing",
    "pissoff",
    "piss-off",
    "pisspig",
    "playboy",
    "pms",
    "polack",
    "polesmoker",
    "pollock",
    "ponyplay",
    "poof",
    "poon",
    "poonani",
    "poonany",
    "poontang",
    "poop",
    "poopchute",
    "poopuncher",
    "porchmonkey",
    "porn",
    "porno",
    "pornography",
    "pornos",
    "potty",
    "prick",
    "pricks",
    "prig",
    "pron",
    "prostitute",
    "prude",
    "pthc",
    "pube",
    "pubes",
    "pubic",
    "pubis",
    "punanny",
    "punany",
    "punkass",
    "punky",
    "punta",
    "puss",
    "pusse",
    "pussi",
    "pussies",
    "pussy",
    "pussylicking",
    "pussypounder",
    "pussys",
    "pust",
    "puto",
    "queaf",
    "queef",
    "queer",
    "queerbait",
    "queerhole",
    "queero",
    "queers",
    "quicky",
    "quim",
    "racy",
    "raghead",
    "rape",
    "raped",
    "raper",
    "raping",
    "rapist",
    "raunch",
    "rectal",
    "rectum",
    "rectus",
    "reefer",
    "reetard",
    "reich",
    "renob",
    "retard",
    "retarded",
    "revue",
    "rimjaw",
    "rimjob",
    "rimming",
    "ritard",
    "rtard",
    "r-tard",
    "rump",
    "rumprammer",
    "ruski",
    "s&m",
    "s.h.i.t.",
    "s.o.b.",
    "s_h_i_t",
    "s0b",
    "sadism",
    "sadist",
    "sandler",
    "sandnigger",
    "sanger",
    "santorum",
    "scag",
    "scantily",
    "scat",
    "schizo",
    "schlong",
    "scissoring",
    "screw",
    "screwed",
    "screwing",
    "scroat",
    "scrog",
    "scrot",
    "scrote",
    "scrotum",
    "scrud",
    "scum",
    "seaman",
    "seamen",
    "seduce",
    "seks",
    "semen",
    "sex",
    "sexo",
    "sexual",
    "sexy",
    "sh!+",
    "sh!t",
    "sh1t",
    "s-h-1-t",
    "shag",
    "shagger",
    "shaggin",
    "shagging",
    "shamedame",
    "shemale",
    "shi+",
    "shibari",
    "shit",
    "s-h-i-t",
    "shitass",
    "shitbag",
    "shitbagger",
    "shitblimp",
    "shitbrains",
    "shitbreath",
    "shitcanned",
    "shitcunt",
    "shitdick",
    "shite",
    "shiteater",
    "shited",
    "shitey",
    "shitface",
    "shitfaced",
    "shitfuck",
    "shitfull",
    "shithead",
    "shithole",
    "shithouse",
    "shiting",
    "shitings",
    "shits",
    "shitspitter",
    "shitstain",
    "shitt",
    "shitted",
    "shitter",
    "shitters",
    "shittiest",
    "shitting",
    "shittings",
    "shitty",
    "shiz",
    "shiznit",
    "shota",
    "shrimping",
    "sissy",
    "skag",
    "skank",
    "skeet",
    "skullfuck",
    "slag",
    "slanteye",
    "slave",
    "sleaze",
    "sleazy",
    "slut",
    "slutbag",
    "slutdumper",
    "slutkiss",
    "sluts",
    "smeg",
    "smegma",
    "smut",
    "smutty",
    "snatch",
    "snowballing",
    "snuff",
    "s-o-b",
    "sodom",
    "sodomize",
    "sodomy",
    "son-of-a-bitch",
    "souse",
    "soused",
    "spac",
    "sperm",
    "spic",
    "spick",
    "spik",
    "spiks",
    "splooge",
    "spooge",
    "spook",
    "spunk",
    "steamy",
    "stfu",
    "stiffy",
    "stoned",
    "strapon",
    "strappado",
    "strip",
    "stroke",
    "stupid",
    "suck",
    "suckass",
    "sucked",
    "sucking",
    "sucks",
    "sumofabiatch",
    "swastika",
    "swinger",
    "t1t",
    "t1tt1e5",
    "t1tties",
    "tampon",
    "tard",
    "tawdry",
    "teabagging",
    "teat",
    "teets",
    "teez",
    "terd",
    "teste",
    "testee",
    "testes",
    "testical",
    "testicle",
    "testis",
    "threesome",
    "throating",
    "thrust",
    "thug",
    "thundercunt",
    "tinkle",
    "tit",
    "titfuck",
    "titi",
    "tits",
    "titt",
    "tittie5",
    "tittiefucker",
    "titties",
    "titty",
    "tittyfuck",
    "tittyfucker",
    "tittywank",
    "titwank",
    "toke",
    "toots",
    "topless",
    "tosser",
    "towelhead",
    "tramp",
    "tranny",
    "transsexual",
    "trashy",
    "tribadism",
    "tubgirl",
    "turd",
    "tush",
    "tushy",
    "tw4t",
    "twat",
    "twathead",
    "twatlips",
    "twats",
    "twatty",
    "twatwaffle",
    "twink",
    "twinkie",
    "twunt",
    "twunter",
    "ugly",
    "unclefucker",
    "undies",
    "undressing",
    "unwed",
    "upskirt",
    "urinal",
    "urine",
    "urophilia",
    "uterus",
    "uzi",
    "v14gra",
    "v1gra",
    "vag",
    "vagina",
    "vajayjay",
    "va-j-j",
    "valium",
    "viagra",
    "vibrator",
    "virgin",
    "vixen",
    "vjayjay",
    "vodka",
    "vomit",
    "vorarephilia",
    "voyeur",
    "vulgar",
    "vulva",
    "w00se",
    "wad",
    "wang",
    "wank",
    "wanker",
    "wankjob",
    "wanky",
    "wazoo",
    "wedgie",
    "weed",
    "weenie",
    "weewee",
    "weiner",
    "weirdo",
    "wench",
    "wetback",
    "wh0re",
    "wh0reface",
    "whitey",
    "whiz",
    "whoar",
    "whoralicious",
    "whore",
    "whorealicious",
    "whorebag",
    "whored",
    "whoreface",
    "whorehopper",
    "whorehouse",
    "whores",
    "whoring",
    "wigger",
    "willies",
    "willy",
    "womb",
    "woody",
    "wop",
    "wtf",
    "xrated",
    "x-rated",
    "xxx",
    "yaoi",
    "yeasty",
    "yiffy",
    "yobbo",
    "zoophile",
    "zoophilia",
    "zubb",
  ];

  /**
   * Remove profanity from text
   * @param {string} text - Text to filter
   * @param {string[]} listWords - List of profane words (no spaces)
   * @param {string[]} listSentences - List of profane phrases (with spaces)
   * @returns {string} Filtered text
   */
  function removeProfanity(
    text,
    listWords = filterArrNoSpaces,
    listSentences = filterArrSpaces
  ) {
    let newText = "";
    text = text.toLowerCase();

    // Check for sentences first
    listSentences.forEach((sentence) => {
      if (text.includes(sentence)) {
        // Replace letters with *
        text = text.replace(sentence, sentence.replace(/[^\s]/g, "*"));
      }
    });

    // Then check individual words
    let words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      if (listWords.includes(words[i])) {
        newText += "*".repeat(words[i].length) + " ";
      } else {
        newText += words[i] + (i == words.length - 1 ? "" : " ");
      }
    }

    return newText;
  }

  // DOM manipulation utilities

  /**
   * Disable clickable elements in the game
   * @returns {Object} Map of disabled elements to restore later
   */
  function disableClick() {
    console.warn("Disabling clickable elements");
    let map = [];
    let mapUI = [];

    if (globalThis.___lastDisableClickElements) {
      console.warn("Already disabled clickable elements");
      enableClick(
        globalThis.___lastDisableClickElements.map,
        globalThis.___lastDisableClickElements.mapUI
      );
      globalThis.___lastDisableClickElements = null;
    }

    // Find button types
    let types = state.runtime.types_by_index.filter((x) =>
      x.behaviors.some((y) => y.behavior instanceof cr.behaviors.aekiro_button)
    );

    // Disable buttons
    types.forEach((type) => {
      type.instances.forEach((inst) => {
        let behavior = inst.behavior_insts.find(
          (x) => x.behavior instanceof cr.behaviors.aekiro_button
        );
        map.push({
          inst,
          oldState: behavior.isEnabled,
        });
        behavior.isEnabled = 0;
      });
    });

    // Hide UI layer
    let layer = state.runtime.running_layout.layers.find((x) => x.name == "UI");
    if (layer) {
      layer.instances.forEach((inst) => {
        // Save state to mapUI
        mapUI.push({
          inst,
          oldState: {
            width: inst.width,
            height: inst.height,
          },
        });
        // Set size to 0
        inst.width = 0;
        inst.height = 0;
        inst.set_bbox_changed();
      });
    }

    globalThis.___lastDisableClickElements = {
      map,
      mapUI,
    };

    return { map, mapUI };
  }

  function getClickState() {
    let map = [];
    let mapUI = [];
    // Find button types
    let types = state.runtime.types_by_index.filter((x) =>
      x.behaviors.some((y) => y.behavior instanceof cr.behaviors.aekiro_button)
    );

    // Disable buttons
    types.forEach((type) => {
      type.instances.forEach((inst) => {
        let behavior = inst.behavior_insts.find(
          (x) => x.behavior instanceof cr.behaviors.aekiro_button
        );
        map.push({
          inst,
          oldState: behavior.isEnabled,
        });
      });
    });

    // Hide UI layer
    let layer = state.runtime.running_layout.layers.find((x) => x.name == "UI");
    if (layer) {
      layer.instances.forEach((inst) => {
        // Save state to mapUI
        mapUI.push({
          inst,
          oldState: {
            width: inst.width,
            height: inst.height,
          },
        });
      });
    }

    return { map, mapUI };
  }

  globalThis.getClickState = getClickState;

  /**
   * Re-enable clickable elements that were disabled
   * @param {Object} state - State map from disableClick
   */
  function enableClick({ map, mapUI }) {
    console.warn("Enabling clickable elements");
    // Check if map and mapUI are valid to prevent errors
    if (!map || !mapUI) {
      console.warn("enableClick called with invalid state");
      return;
    }

    // Re-enable buttons
    map.forEach((x) => {
      // Check if the instance still exists (might have been destroyed)
      if (!x.inst || !x.inst.behavior_insts) return;

      // Find the button behavior
      let inst = x.inst.behavior_insts.find(
        (behavior) =>
          behavior && behavior.behavior instanceof cr.behaviors.aekiro_button
      );

      // Only proceed if we found the behavior
      if (inst) {
        inst.isEnabled = x.oldState !== undefined ? x.oldState : 1;
      }
    });

    // Restore UI layer
    mapUI.forEach((x) => {
      // Check if the instance still exists
      if (!x.inst || !x.oldState) return;

      // Restore original dimensions
      x.inst.width = x.oldState.width;
      x.inst.height = x.oldState.height;
      x.inst.set_bbox_changed();
    });

    // Force a tick of the game engine to update UI visibility
    // if (state.runtime && typeof state.runtime.tick === "function") {
    //   state.runtime.tick(true);
    // }
    if (globalThis.___lastDisableClickElements) {
      globalThis.___lastDisableClickElements = null;
    }
  }

  /**
   * Get query string parameters
   * @param {string} url - URL to parse (optional, uses window.location if not provided)
   * @returns {Object} Query string parameters as an object
   */
  function getQueryString(url) {
    let queryString = "";
    let result = {};

    // If url is given, get query string from url, else use location.search
    if (url) {
      queryString = url.indexOf("?") != -1 ? url.split("?")[1] : "";
    } else {
      queryString = location.search.substring(1);
    }

    let re = /([^&=]+)=([^&]*)/g;
    let m;

    while ((m = re.exec(queryString)) !== null) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
  }

  // Custom dialog system for OvO Multiplayer

  // Pending callbacks for dialog system initialization
  let dialogPending = [];
  let gotToMainMenuOnce = false;
  function notifyGotToMainMenu() {
    if (gotToMainMenuOnce) return;
    setTimeout(() => {
      gotToMainMenuOnce = true;
      maybeRunPendingCallbacks();
    }, 1000);
  }

  function dialogIsReady() {
    return gotToMainMenuOnce && window.ovoDialog;
  }

  function maybeRunPendingCallbacks() {
    if (dialogIsReady()) {
      dialogPending.forEach((func) => func());
      dialogPending = [];
    }
  }

  /**
   * Wait for dialog system to be available
   * @param {Function} fn - Function to call when dialog system is loaded
   */
  function waitForNotie(fn) {
    // Kept the function name for backward compatibility
    if (dialogIsReady()) fn();
    else dialogPending.push(fn);
  }

  /**
   * Initialize the custom dialog system
   */
  function initDialogSystem() {
    // Create Dialog System
    const ovoDialog = {
      // Alert dialog
      force: (options, callback) => {
        createAlertDialog(options, callback);
      },
      // Confirm dialog
      confirm: (options, confirmCallback, cancelCallback) => {
        createConfirmDialog(options, confirmCallback, cancelCallback);
      },
      // Input dialog
      input: (options, submitCallback, cancelCallback) => {
        createInputDialog(options, submitCallback, cancelCallback);
      },
    };

    // Add styles
    addDialogStyles();

    // Make dialog system globally available
    window.ovoDialog = ovoDialog;
    window.notie = ovoDialog; // For backward compatibility

    maybeRunPendingCallbacks();
  }

  /**
   * Add dialog styles to the document
   */
  function addDialogStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .ovo-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--dialog-overlay-bg);
      z-index: 9999999998;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: all;
    }
    
    .ovo-dialog {
      background-color: var(--modal-bg);
      border: 4px solid var(--modal-border);
      border-radius: 0px;
      max-width: 90%;
      width: 400px;
      font-family: Retron2000, monospace;
      color: var(--modal-text);
      padding: 20px;
      box-shadow: 0 0 20px var(--dialog-shadow);
      position: relative;
      text-align: center;
      pointer-events: all;
    }
    
    .ovo-dialog.success {
      border-color: var(--dialog-confirm-button-bg);
    }
    
    .ovo-dialog.error {
      border-color: var(--dialog-cancel-button-bg);
    }
    
    .ovo-dialog.warning {
      border-color: #ffcc00;
    }
    
    .ovo-dialog-text {
      font-size: 18px;
      margin-bottom: 20px;
      word-wrap: break-word;
    }
    
    .ovo-dialog-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    
    .ovo-dialog-button {
      background-color: var(--button-bg);
      border: 3px solid var(--dialog-button-border);
      padding: 8px 16px;
      font-family: Retron2000, monospace;
      font-size: 16px;
      color: var(--button-text);
      cursor: pointer;
      min-width: 100px;
      transition: all 0.2s;
      pointer-events: all;
    }
    
    .ovo-dialog-button:hover {
      background-color: var(--button-hover-bg);
      transform: translateY(-2px);
    }
    
    .ovo-dialog-button.confirm {
      border-color: var(--dialog-confirm-button-bg);
      background-color: var(--dialog-confirm-button-bg);
    }
    
    .ovo-dialog-button.confirm:hover {
      background-color: var(--dialog-confirm-button-hover-bg);
      border-color: var(--dialog-confirm-button-hover-bg);
    }
    
    .ovo-dialog-button.cancel {
      border-color: var(--dialog-cancel-button-bg);
      background-color: var(--dialog-cancel-button-bg);
    }
    
    .ovo-dialog-button.cancel:hover {
      background-color: var(--dialog-cancel-button-hover-bg);
      border-color: var(--dialog-cancel-button-hover-bg);
    }
    
    .ovo-dialog-input {
      width: calc(100% - 40px);
      padding: 10px;
      margin-bottom: 20px;
      background-color: var(--input-bg);
      border: 3px solid var(--dialog-input-border);
      color: var(--input-text);
      font-family: Retron2000, monospace;
      font-size: 16px;
      pointer-events: all;
      cursor: text;
      text-align: left;
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
    }
    
    .ovo-dialog-contenteditable {
      min-height: 20px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    /* Ensure selected text is visible with appropriate styling */
    .ovo-dialog-input::selection {
      background-color: var(--primary-color);
      color: var(--bg-color);
    }
    
    /* Special styling for Microsoft browsers */
    .ovo-dialog-input::-ms-selection {
      background-color: var(--primary-color);
      color: var(--bg-color);
    }
    
    .ovo-dialog-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    
    /* Animation */
    @keyframes ovoDialogFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .ovo-dialog {
      animation: ovoDialogFadeIn 0.3s ease forwards;
    }
  `;
    document.head.appendChild(style);
  }

  /**
   * Create an alert dialog
   * @param {Object} options - Dialog options
   * @param {Function} callback - Callback function when dialog is closed
   */
  function createAlertDialog(options, callback) {
    const { text, type = "info", buttonText = "Ok" } = options;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "ovo-dialog-overlay";

    // Create dialog
    const dialog = document.createElement("div");
    dialog.className = `ovo-dialog ${type}`;

    // Add text
    const textEl = document.createElement("div");
    textEl.className = "ovo-dialog-text";
    textEl.textContent = text;
    dialog.appendChild(textEl);

    // Add button
    const buttons = document.createElement("div");
    buttons.className = "ovo-dialog-buttons";

    const button = document.createElement("button");
    button.className = "ovo-dialog-button confirm";
    button.textContent = buttonText;
    button.onclick = () => {
      closeDialogAndRestoreUI(overlay, callback);
    };

    buttons.appendChild(button);
    dialog.appendChild(buttons);

    // Add to DOM
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Focus button
    setTimeout(() => button.focus(), 50);
  }

  /**
   * Create a confirmation dialog
   * @param {Object} options - Dialog options
   * @param {Function} confirmCallback - Callback function when confirmed
   * @param {Function} cancelCallback - Callback function when canceled
   */
  function createConfirmDialog(options, confirmCallback, cancelCallback) {
    const {
      text,
      type = "info",
      buttonText = "Confirm",
      cancelText = "Cancel",
    } = options;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "ovo-dialog-overlay";

    // Create dialog
    const dialog = document.createElement("div");
    dialog.className = `ovo-dialog ${type}`;

    // Add text
    const textEl = document.createElement("div");
    textEl.className = "ovo-dialog-text";
    textEl.textContent = text;
    dialog.appendChild(textEl);

    // Add buttons
    const buttons = document.createElement("div");
    buttons.className = "ovo-dialog-buttons";

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "ovo-dialog-button confirm";
    confirmBtn.textContent = buttonText;
    confirmBtn.onclick = () => {
      closeDialogAndRestoreUI(overlay, confirmCallback);
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "ovo-dialog-button cancel";
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      closeDialogAndRestoreUI(overlay, cancelCallback);
    };

    buttons.appendChild(confirmBtn);
    buttons.appendChild(cancelBtn);
    dialog.appendChild(buttons);

    // Add to DOM
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Focus confirm button
    setTimeout(() => confirmBtn.focus(), 50);
  }

  /**
   * Create an input dialog
   * @param {Object} options - Dialog options
   * @param {Function} submitCallback - Callback function when submitted with value
   * @param {Function} cancelCallback - Callback function when canceled
   */
  function createInputDialog(options, submitCallback, cancelCallback) {
    const {
      text,
      type = "text",
      submitText = "Submit",
      cancelText = "Cancel",
      value = "",
    } = options;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "ovo-dialog-overlay";

    // Create dialog
    const dialog = document.createElement("div");
    dialog.className = "ovo-dialog info";

    // Add text
    const textEl = document.createElement("div");
    textEl.className = "ovo-dialog-text";
    textEl.textContent = text;
    dialog.appendChild(textEl);

    // Use a contenteditable div instead of an input for better text selection
    const useContentEditable = type === "text";

    let input;
    if (useContentEditable) {
      // Create contenteditable div for better text selection
      input = document.createElement("div");
      input.className = "ovo-dialog-input ovo-dialog-contenteditable";
      input.contentEditable = "true";
      input.textContent = value;
      input.setAttribute("spellcheck", "false");

      // Set caret to end of text on focus
      input.addEventListener("focus", function () {
        // Create range at end of content
        const range = document.createRange();
        range.selectNodeContents(input);
        range.collapse(false); // collapse to end

        // Apply the range selection
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
    } else {
      // Use standard input for other types (password, etc.)
      input = document.createElement("input");
      input.className = "ovo-dialog-input";
      input.type = type;
      input.value = value;
      input.setAttribute("spellcheck", "false");
    }

    // Common styling and event handling
    input.style.pointerEvents = "all";
    input.style.cursor = "text";
    input.style.userSelect = "text";

    input.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    input.addEventListener("mousemove", (e) => {
      e.stopPropagation();
    });

    input.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      // Ensure input maintains focus
      setTimeout(() => {
        if (useContentEditable) input.focus();
        else input.focus();
      }, 0);
    });

    input.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    dialog.appendChild(input);

    // Add buttons
    const buttons = document.createElement("div");
    buttons.className = "ovo-dialog-buttons";

    const submitBtn = document.createElement("button");
    submitBtn.className = "ovo-dialog-button confirm";
    submitBtn.textContent = submitText;
    submitBtn.onclick = () => {
      closeDialogAndRestoreUI(overlay, () => {
        // Get value differently depending on input type
        const finalValue = useContentEditable
          ? input.textContent.trim()
          : input.value;
        if (submitCallback) submitCallback(finalValue);
      });
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "ovo-dialog-button cancel";
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      closeDialogAndRestoreUI(overlay, cancelCallback);
    };

    // Handle keyboard events
    const keyHandler = (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevent adding a new line in contenteditable
        submitBtn.click();
      } else if (e.key === "Escape") {
        cancelBtn.click();
        e.preventDefault(); // Prevent default escape behavior
      }
    };

    input.addEventListener("keydown", keyHandler);

    buttons.appendChild(submitBtn);
    buttons.appendChild(cancelBtn);
    dialog.appendChild(buttons);

    // Add to DOM
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Focus input
    setTimeout(() => input.focus(), 50);
  }

  /**
   * Show a prompt dialog
   * @param {Object} options - Dialog options
   * @param {string} options.type - Input type (text, email, password, etc)
   * @param {string} options.text - Dialog text
   * @param {string} options.submitText - Submit button text
   * @param {string} options.cancelText - Cancel button text
   * @param {string} options.position - Dialog position (top, bottom)
   * @param {string} options.value - Default input value
   * @returns {Promise<string>} User input or null if canceled
   */
  async function getDialogPrompt({
    type = "text",
    text = "Enter your name",
    submitText = "Ok",
    cancelText = "Cancel",
    position = "top",
    value = "",
  } = {}) {
    return new Promise((resolve) => {
      waitForNotie(() => {
        let map = disableClick();

        window.ovoDialog.input(
          {
            type,
            text,
            submitText,
            cancelText,
            position,
            value,
          },
          (value) => {
            enableClick(map);
            resolve(value);
          },
          () => {
            enableClick(map);
            resolve(null);
          }
        );
      });
    });
  }

  /**
   * Show an alert dialog
   * @param {Object} options - Dialog options
   * @param {string} options.text - Dialog text
   * @param {string} options.type - Dialog type (info, success, error, warning)
   * @param {string} options.position - Dialog position (top, bottom)
   * @param {string} options.buttonText - Button text
   * @returns {Promise<void>} Resolves when dialog is closed
   */
  async function getDialogAlert({
    text = "",
    type = "info",
    position = "top",
    buttonText = "Ok",
  } = {}) {
    return new Promise((resolve) => {
      waitForNotie(() => {
        let map = disableClick();

        window.ovoDialog.force(
          {
            text,
            type,
            position,
            buttonText,
          },
          () => {
            enableClick(map);
            resolve();
          }
        );
      });
    });
  }

  /**
   * Show a confirmation dialog
   * @param {Object} options - Dialog options
   * @param {string} options.text - Dialog text
   * @param {string} options.type - Dialog type (info, success, error, warning)
   * @param {string} options.position - Dialog position (top, bottom)
   * @param {string} options.buttonText - Confirm button text
   * @param {string} options.cancelText - Cancel button text
   * @returns {Promise<boolean>} True if confirmed, false if canceled
   */
  async function getDialogConfirm({
    text = "",
    type = "info",
    position = "top",
    buttonText = "Ok",
    cancelText = "Cancel",
  } = {}) {
    return new Promise((resolve) => {
      waitForNotie(() => {
        let map = disableClick();

        window.ovoDialog.confirm(
          {
            text,
            type,
            position,
            buttonText,
            cancelText,
          },
          () => {
            enableClick(map);
            resolve(true);
          },
          () => {
            enableClick(map);
            resolve(false);
          }
        );
      });
    });
  }

  // Enhanced dialog closing helper function
  function closeDialogAndRestoreUI(overlay, callback) {
    // Remove dialog from DOM
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }

    // Run callback if provided
    if (callback) {
      callback();
    }

    // Force game tick to update UI visibility
    // if (state.runtime && typeof state.runtime.tick === "function") {
    //   // Schedule the tick after the current event loop to ensure UI is updated
    //   setTimeout(() => {
    //     state.runtime.tick(true);
    //   }, 0);
    // }
  }

  // Game-specific utility functions

  /**
   * Get current layout name
   * @returns {string} Layout name
   */
  function getCurLayout() {
    return state.runtime.running_layout.name;
  }

  function goToLayout(layoutName) {
    if (state.runtime.running_layout.name === layoutName) return;

    let layout = state.runtime.layouts[layoutName];
    if (!layout) {
      console.error(`Layout "${layoutName}" not found`);
      return;
    }

    if (state.runtime.isloading) return; // cannot change layout while loading on loader layout
    if (state.runtime.changelayout) return; // already changing to a different layout
    state.runtime.changelayout = layout;
  }

  /**
   * Get the player instance
   * @returns {Object} Player instance
   */
  function getPlayer() {
    return state.playerType.instances.filter(
      (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
    )[0];
  }

  /**
   * Get end flag instance
   * @returns {Object} Flag instance
   */
  function getFlag() {
    return state.runtime.types_by_index.find(
      (x) =>
        x.name === "EndFlag" ||
        (x.plugin instanceof cr.plugins_.Sprite &&
          x.all_frames &&
          x.all_frames[0].texture_file.includes("endflag"))
    ).instances[0];
  }

  /**
   * Check if the device has internet connectivity
   * @returns {Promise<boolean>} True if internet is available
   */
  async function checkInternetConnectivity() {
    return true;
  }

  /**
   * Show a notification for no internet connection
   */
  function showNoInternetMessage() {
    notify(
      "No Internet Connection",
      "Please check your connection and try again",
      "./no-wifi.png"
    );
  }

  /**
   * Show a notification
   * @param {string} title - Notification title
   * @param {string} text - Notification text
   * @param {string} image - Notification image URL
   */
  function notify(title, text, image = "./speedrunner.png") {
    cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
      state.runtime.types_by_index.find(
        (type) => type.plugin instanceof cr.plugins_.sirg_notifications
      ).instances[0],
      title,
      text,
      image
    );
  }

  /**
   * Global cache for skin data
   */
  let skinsDataCache = [];

  /**
   * Load skin data from server
   * @returns {Promise<Array>} Array of skin data objects
   */
  async function loadSkinsData() {
    if (skinsDataCache.length > 0) {
      return skinsDataCache;
    }

    try {
      const response = await fetch("./skins.json");
      const data = await response.json();
      skinsDataCache = data;
      return data;
    } catch (e) {
      console.error("Failed to load skins data:", e);
      return [];
    }
  }

  /**
   * Initialize skins data globally
   */
  async function initializeSkinsData() {
    const data = await loadSkinsData();
    globalThis.skinsData = data;
    return data;
  }

  /**
   * Get skin icon path from skin name
   * @param {string} skinName - Skin name
   * @returns {string} Skin icon path
   */
  function getSkinIconFromSkinName$1(skinName = "") {
    let skinsData = globalThis.skinsData || skinsDataCache;
    let skin = skinsData.find((skin) => skin.skin === skinName);

    if (skin) {
      return "./" + skin.icon;
    } else {
      return "./default.png";
    }
  }

  // Moderation functionality for OvO multiplayer


  // Check if user is muted
  function userIsMuted(UID) {
    return state.mutedUsers.includes(UID);
  }

  // Toggle mute for a user
  function toggleMuteUser(UID) {
    if (state.mutedUsers.includes(UID)) {
      state.mutedUsers.splice(state.mutedUsers.indexOf(UID), 1);
    } else {
      state.mutedUsers.push(UID);
    }
    // No need to save preferences for mute, it's session-based
    // Update relevant UI lists
    updateUserList(true); // Update main UI list
    populateSettingsUserList(); // Update settings UI list
  }

  // Kick a user from the room
  async function kickUser(user, connection, force = false) {
    if (!connection || !user) return; // Safety check

    if (!force) {
      if (
        await getDialogConfirm({
          text: `Are you sure you want to kick ${user.username}? This will remove them from the room.`,
          buttonText: "Yes",
          cancelText: "No",
        })
      ) {
        kickUser(user, connection, true); // Call again with force=true
      }
    } else {
      // Force close connection
      if (connection.conn) { // Check if conn exists (might be null if called on self somehow)
          connection.conn.close();
      }
      // Note: The 'close' event handler in network.js will handle UI updates and cleanup
    }
  }

  // Ban a user from the room (Session Ban)
  async function banUser(user, connection) {
    if (!connection || !user) return; // Safety check

    if (
      !(await getDialogConfirm({
        text: `Are you sure you want to ban ${user.username}? This will ban them from this room for this session.`,
        buttonText: "Yes",
        cancelText: "No",
      }))
    ) {
      return;
    }

    // Add to session banned list (make sure it's a copy, not reference)
    if (!state.bannedUsers.some(banned => banned.UID === user.UID)) {
        state.bannedUsers.push(JSON.parse(JSON.stringify(user)));
    }

    // Kick user
    kickUser(user, connection, true);

    // Update ban list UI
    updateBanlist(); // Update main UI ban list
    populateSettingsBanList(); // Update settings UI ban list
  }

  // Permanently ban a user
  async function permaBanUser(user, connection) {
    if (!connection || !user) return; // Safety check

    if (
      !(await getDialogConfirm({
        text: `Are you sure you want to permanently ban ${user.username}? This will ban them from all future rooms you create.`,
        buttonText: "Yes",
        cancelText: "No",
      }))
    ) {
      return;
    }

     // Add to permanent banned list (make sure it's a copy)
    if (!state.permaBannedUsers.some(banned => banned.UID === user.UID)) {
        state.permaBannedUsers.push(JSON.parse(JSON.stringify(user)));
    }

    // Kick user
    kickUser(user, connection, true);

    // Update ban list UI and save preferences
    updateBanlist(); // Update main UI ban list
    populateSettingsBanList(); // Update settings UI ban list
    savePreferences();
  }

  // Unban a user
  async function unbanUser(user) {
    if (!user) return; // Safety check

    if (
      !(await getDialogConfirm({
        text: `Are you sure you want to unban ${user.username}?`,
        buttonText: "Yes",
        cancelText: "No",
      }))
    ) {
      return;
    }

    // Remove user from both banned lists
    state.bannedUsers = state.bannedUsers.filter((bannedUser) => {
      return bannedUser.UID !== user.UID;
    });

    state.permaBannedUsers = state.permaBannedUsers.filter((bannedUser) => {
      return bannedUser.UID !== user.UID;
    });

    // Update ban list UI and save preferences
    updateBanlist(); // Update main UI ban list
    populateSettingsBanList(); // Update settings UI ban list
    savePreferences();
  }

  // Update the MAIN ban list UI (previously named updateBanlist)
  function updateBanlist() {
    // Get the main UI ban list element (which is inside the settingsTab content)
    const settingsElement = document.getElementById("ovo-multiplayer-settings");
    if (!settingsElement) return;

    settingsElement.innerHTML = ""; // Clear previous content

    const combinedBanList = [
      ...state.bannedUsers.map(user => ({ ...user, banType: "Session" })),
      ...state.permaBannedUsers.map(user => ({ ...user, banType: "Permanent" }))
    ];

    if (combinedBanList.length === 0) {
      settingsElement.innerHTML = "No banned users (yet).";
      return;
    }

    // --- Create Ban Element Helper (Main UI Style) ---
    let createBanElementMain = () => {
      let userElement = document.createElement("div");
      userElement.className = "ovo-multiplayer-user-element"; // Main UI style

      let userIcon = document.createElement("img");
      userIcon.className = "ovo-multiplayer-user-icon"; // Main UI style
      userElement.appendChild(userIcon);

      let userSubElement = document.createElement("div");
      userSubElement.className = "ovo-multiplayer-user-sub-element"; // Main UI style
      userElement.appendChild(userSubElement);

      let userUsername = document.createElement("div");
      userUsername.className = "ovo-multiplayer-user-username"; // Main UI style
      userSubElement.appendChild(userUsername);

      let userSubSubElement = document.createElement("div");
      // Use banlist specific class if needed, otherwise reuse user list class
      userSubSubElement.className = "ovo-multiplayer-banlist-sub-sub-element"; // Main UI style
      userSubElement.appendChild(userSubSubElement);

      let userExtraData = document.createElement("div");
      userExtraData.className = "ovo-multiplayer-user-extra"; // Main UI style
      userSubSubElement.appendChild(userExtraData);

      let userButtonsDiv = document.createElement("div");
      userButtonsDiv.className = "ovo-multiplayer-banlist-buttons"; // Main UI style
      userSubSubElement.appendChild(userButtonsDiv);

      // Add unban button (Main UI Style)
      let unbanButton = document.createElement("button");
      unbanButton.className = "ovo-multiplayer-user-button"; // Main UI style
      unbanButton.innerHTML = "Unban";
      userButtonsDiv.appendChild(unbanButton);

      return {
        elementDiv: userElement,
        usernameDiv: userUsername,
        extraDataDiv: userExtraData,
        unbanButton: unbanButton,
        iconElement: userIcon,
      };
    };

    // --- Populate List (Main UI) ---
    combinedBanList.forEach((bannedUser) => {
      let banElement = createBanElementMain();

      banElement.usernameDiv.textContent = bannedUser.username;
      banElement.extraDataDiv.textContent =
        (bannedUser.username !== bannedUser.initialUsername ? `(${bannedUser.initialUsername}) ` : "") +
        `(${bannedUser.banType}) - ${bannedUser.UID}`;
      banElement.iconElement.src = getSkinIconFromSkinName$1(bannedUser.skin);
      banElement.unbanButton.onclick = async () => {
        await unbanUser(bannedUser);
        // UI update is handled within unbanUser
      };

      settingsElement.appendChild(banElement.elementDiv);
    });

    // Also update the settings modal ban list if it's open and active
    let settingsModal = document.getElementById("ovo-multiplayer-settings-modal");
    let banListTabButton = document.getElementById("ovo-multiplayer-settings-ban-list-tab-button");
    if (settingsModal && settingsModal.style.display === 'block' && banListTabButton && banListTabButton.classList.contains('active')) {
        populateSettingsBanList();
    }
  }


  // Initialize moderation
  function init$7() {
    // state.bannedUsers = []; // Don't clear session bans on init, load from prefs
    state.mutedUsers = []; // Mutes are session-based, clear on init
  }

  // Chat functionality for OvO multiplayer

  // Initialize chat
  function init$6() {
    state.chat = [];
  }

  // Send a chat message
  function sendChat(data) {
    if (!state.connectedToRoom || data.message.trim() === "") return;

    pushChat(
      {
        username: state.username,
        initialUsername: state.initialUsername,
        message: data.message,
        timestamp: Date.now(),
        id: state.peer.id,
        skin: state.globalType.instances[0].instance_vars[8],
      },
      true
    );
  }

  // Process and add a message to the chat
  function pushChat(data, transmit = false) {
    // Clean message text
    data.message = data.message.toString().replace(/<[^>]*>/g, "");
    data.message = removeProfanity(data.message);

    let chatData = {
      username: data.username,
      initialUsername: data.initialUsername,
      message: data.message,
      id: data.id,
      skin: data.skin,
      timestamp: data.timestamp,
    };

    // Forward chat if host
    if (state.isHost) {
      if (!userIsMuted(data.id)) {
        state.chat.push(chatData);
        updateChatBox();
        maybeNotifyChat(data);
      }

      state.connections.forEach((connection) => {
        connection.conn.send({
          type: DATA_TYPES.CHAT,
          payload: data,
        });
      });
    } else if (transmit) {
      state.conn.send({
        type: DATA_TYPES.CHAT,
        payload: data,
      });
    } else {
      // If user is muted, ignore
      if (userIsMuted(data.id)) return;

      state.chat.push(chatData);
      updateChatBox();
      maybeNotifyChat(data);
    }
  }

  // Send notification for chat if needed
  function maybeNotifyChat(data) {
    // Don't notify about my own messages
    if (data.id === state.peer.id) return;

    // Only notify if chat is hidden or not selected
    if (
      (!state.hideChat &&
        document.getElementById("ovo-multiplayer-container").style.display ===
          "none") ||
      state.selectedTab !== 0
    ) {
      notify(
        data.username + " sent:",
        data.message,
        getSkinIconFromSkinName(data.skin)
      );
    }
  }

  // Clear chat history
  function clearChat() {
    state.chat = [];
    updateChatBox();
  }

  class $e8379818650e2442$export$93654d4f2d6cd524 {
      constructor(){
          this.encoder = new TextEncoder();
          this._pieces = [];
          this._parts = [];
      }
      append_buffer(data) {
          this.flush();
          this._parts.push(data);
      }
      append(data) {
          this._pieces.push(data);
      }
      flush() {
          if (this._pieces.length > 0) {
              const buf = new Uint8Array(this._pieces);
              this._parts.push(buf);
              this._pieces = [];
          }
      }
      toArrayBuffer() {
          const buffer = [];
          for (const part of this._parts)buffer.push(part);
          return $e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
      }
  }
  function $e8379818650e2442$var$concatArrayBuffers(bufs) {
      let size = 0;
      for (const buf of bufs)size += buf.byteLength;
      const result = new Uint8Array(size);
      let offset = 0;
      for (const buf of bufs){
          const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
          result.set(view, offset);
          offset += buf.byteLength;
      }
      return result;
  }


  function $0cfd7828ad59115f$export$417857010dc9287f(data) {
      const unpacker = new $0cfd7828ad59115f$var$Unpacker(data);
      return unpacker.unpack();
  }
  function $0cfd7828ad59115f$export$2a703dbb0cb35339(data) {
      const packer = new $0cfd7828ad59115f$export$b9ec4b114aa40074();
      const res = packer.pack(data);
      if (res instanceof Promise) return res.then(()=>packer.getBuffer());
      return packer.getBuffer();
  }
  class $0cfd7828ad59115f$var$Unpacker {
      constructor(data){
          this.index = 0;
          this.dataBuffer = data;
          this.dataView = new Uint8Array(this.dataBuffer);
          this.length = this.dataBuffer.byteLength;
      }
      unpack() {
          const type = this.unpack_uint8();
          if (type < 0x80) return type;
          else if ((type ^ 0xe0) < 0x20) return (type ^ 0xe0) - 0x20;
          let size;
          if ((size = type ^ 0xa0) <= 0x0f) return this.unpack_raw(size);
          else if ((size = type ^ 0xb0) <= 0x0f) return this.unpack_string(size);
          else if ((size = type ^ 0x90) <= 0x0f) return this.unpack_array(size);
          else if ((size = type ^ 0x80) <= 0x0f) return this.unpack_map(size);
          switch(type){
              case 0xc0:
                  return null;
              case 0xc1:
                  return undefined;
              case 0xc2:
                  return false;
              case 0xc3:
                  return true;
              case 0xca:
                  return this.unpack_float();
              case 0xcb:
                  return this.unpack_double();
              case 0xcc:
                  return this.unpack_uint8();
              case 0xcd:
                  return this.unpack_uint16();
              case 0xce:
                  return this.unpack_uint32();
              case 0xcf:
                  return this.unpack_uint64();
              case 0xd0:
                  return this.unpack_int8();
              case 0xd1:
                  return this.unpack_int16();
              case 0xd2:
                  return this.unpack_int32();
              case 0xd3:
                  return this.unpack_int64();
              case 0xd4:
                  return undefined;
              case 0xd5:
                  return undefined;
              case 0xd6:
                  return undefined;
              case 0xd7:
                  return undefined;
              case 0xd8:
                  size = this.unpack_uint16();
                  return this.unpack_string(size);
              case 0xd9:
                  size = this.unpack_uint32();
                  return this.unpack_string(size);
              case 0xda:
                  size = this.unpack_uint16();
                  return this.unpack_raw(size);
              case 0xdb:
                  size = this.unpack_uint32();
                  return this.unpack_raw(size);
              case 0xdc:
                  size = this.unpack_uint16();
                  return this.unpack_array(size);
              case 0xdd:
                  size = this.unpack_uint32();
                  return this.unpack_array(size);
              case 0xde:
                  size = this.unpack_uint16();
                  return this.unpack_map(size);
              case 0xdf:
                  size = this.unpack_uint32();
                  return this.unpack_map(size);
          }
      }
      unpack_uint8() {
          const byte = this.dataView[this.index] & 0xff;
          this.index++;
          return byte;
      }
      unpack_uint16() {
          const bytes = this.read(2);
          const uint16 = (bytes[0] & 0xff) * 256 + (bytes[1] & 0xff);
          this.index += 2;
          return uint16;
      }
      unpack_uint32() {
          const bytes = this.read(4);
          const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
          this.index += 4;
          return uint32;
      }
      unpack_uint64() {
          const bytes = this.read(8);
          const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
          this.index += 8;
          return uint64;
      }
      unpack_int8() {
          const uint8 = this.unpack_uint8();
          return uint8 < 0x80 ? uint8 : uint8 - 256;
      }
      unpack_int16() {
          const uint16 = this.unpack_uint16();
          return uint16 < 0x8000 ? uint16 : uint16 - 65536;
      }
      unpack_int32() {
          const uint32 = this.unpack_uint32();
          return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
      }
      unpack_int64() {
          const uint64 = this.unpack_uint64();
          return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
      }
      unpack_raw(size) {
          if (this.length < this.index + size) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
          const buf = this.dataBuffer.slice(this.index, this.index + size);
          this.index += size;
          return buf;
      }
      unpack_string(size) {
          const bytes = this.read(size);
          let i = 0;
          let str = "";
          let c;
          let code;
          while(i < size){
              c = bytes[i];
              // The length of a UTF-8 sequence is specified in the first byte:
              // 0xxxxxxx means length 1,
              // 110xxxxx means length 2,
              // 1110xxxx means length 3,
              // 11110xxx means length 4.
              // 10xxxxxx is for non-initial bytes.
              if (c < 0xa0) {
                  // One-byte sequence: bits 0xxxxxxx
                  code = c;
                  i++;
              } else if ((c ^ 0xc0) < 0x20) {
                  // Two-byte sequence: bits 110xxxxx 10xxxxxx
                  code = (c & 0x1f) << 6 | bytes[i + 1] & 0x3f;
                  i += 2;
              } else if ((c ^ 0xe0) < 0x10) {
                  // Three-byte sequence: bits 1110xxxx 10xxxxxx 10xxxxxx
                  code = (c & 0x0f) << 12 | (bytes[i + 1] & 0x3f) << 6 | bytes[i + 2] & 0x3f;
                  i += 3;
              } else {
                  // Four-byte sequence: bits 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                  code = (c & 0x07) << 18 | (bytes[i + 1] & 0x3f) << 12 | (bytes[i + 2] & 0x3f) << 6 | bytes[i + 3] & 0x3f;
                  i += 4;
              }
              str += String.fromCodePoint(code);
          }
          this.index += size;
          return str;
      }
      unpack_array(size) {
          const objects = new Array(size);
          for(let i = 0; i < size; i++)objects[i] = this.unpack();
          return objects;
      }
      unpack_map(size) {
          const map = {};
          for(let i = 0; i < size; i++){
              const key = this.unpack();
              map[key] = this.unpack();
          }
          return map;
      }
      unpack_float() {
          const uint32 = this.unpack_uint32();
          const sign = uint32 >> 31;
          const exp = (uint32 >> 23 & 0xff) - 127;
          const fraction = uint32 & 0x7fffff | 0x800000;
          return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
      }
      unpack_double() {
          const h32 = this.unpack_uint32();
          const l32 = this.unpack_uint32();
          const sign = h32 >> 31;
          const exp = (h32 >> 20 & 0x7ff) - 1023;
          const hfrac = h32 & 0xfffff | 0x100000;
          const frac = hfrac * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
          return (sign === 0 ? 1 : -1) * frac;
      }
      read(length) {
          const j = this.index;
          if (j + length <= this.length) return this.dataView.subarray(j, j + length);
          else throw new Error("BinaryPackFailure: read index out of range");
      }
  }
  class $0cfd7828ad59115f$export$b9ec4b114aa40074 {
      getBuffer() {
          return this._bufferBuilder.toArrayBuffer();
      }
      pack(value) {
          if (typeof value === "string") this.pack_string(value);
          else if (typeof value === "number") {
              if (Math.floor(value) === value) this.pack_integer(value);
              else this.pack_double(value);
          } else if (typeof value === "boolean") {
              if (value === true) this._bufferBuilder.append(0xc3);
              else if (value === false) this._bufferBuilder.append(0xc2);
          } else if (value === undefined) this._bufferBuilder.append(0xc0);
          else if (typeof value === "object") {
              if (value === null) this._bufferBuilder.append(0xc0);
              else {
                  const constructor = value.constructor;
                  if (value instanceof Array) {
                      const res = this.pack_array(value);
                      if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                  } else if (value instanceof ArrayBuffer) this.pack_bin(new Uint8Array(value));
                  else if ("BYTES_PER_ELEMENT" in value) {
                      const v = value;
                      this.pack_bin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
                  } else if (value instanceof Date) this.pack_string(value.toString());
                  else if (value instanceof Blob) return value.arrayBuffer().then((buffer)=>{
                      this.pack_bin(new Uint8Array(buffer));
                      this._bufferBuilder.flush();
                  });
                  else if (constructor == Object || constructor.toString().startsWith("class")) {
                      const res = this.pack_object(value);
                      if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                  } else throw new Error(`Type "${constructor.toString()}" not yet supported`);
              }
          } else throw new Error(`Type "${typeof value}" not yet supported`);
          this._bufferBuilder.flush();
      }
      pack_bin(blob) {
          const length = blob.length;
          if (length <= 0x0f) this.pack_uint8(0xa0 + length);
          else if (length <= 0xffff) {
              this._bufferBuilder.append(0xda);
              this.pack_uint16(length);
          } else if (length <= 0xffffffff) {
              this._bufferBuilder.append(0xdb);
              this.pack_uint32(length);
          } else throw new Error("Invalid length");
          this._bufferBuilder.append_buffer(blob);
      }
      pack_string(str) {
          const encoded = this._textEncoder.encode(str);
          const length = encoded.length;
          if (length <= 0x0f) this.pack_uint8(0xb0 + length);
          else if (length <= 0xffff) {
              this._bufferBuilder.append(0xd8);
              this.pack_uint16(length);
          } else if (length <= 0xffffffff) {
              this._bufferBuilder.append(0xd9);
              this.pack_uint32(length);
          } else throw new Error("Invalid length");
          this._bufferBuilder.append_buffer(encoded);
      }
      pack_array(ary) {
          const length = ary.length;
          if (length <= 0x0f) this.pack_uint8(0x90 + length);
          else if (length <= 0xffff) {
              this._bufferBuilder.append(0xdc);
              this.pack_uint16(length);
          } else if (length <= 0xffffffff) {
              this._bufferBuilder.append(0xdd);
              this.pack_uint32(length);
          } else throw new Error("Invalid length");
          const packNext = (index)=>{
              if (index < length) {
                  const res = this.pack(ary[index]);
                  if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                  return packNext(index + 1);
              }
          };
          return packNext(0);
      }
      pack_integer(num) {
          if (num >= -32 && num <= 0x7f) this._bufferBuilder.append(num & 0xff);
          else if (num >= 0x00 && num <= 0xff) {
              this._bufferBuilder.append(0xcc);
              this.pack_uint8(num);
          } else if (num >= -128 && num <= 0x7f) {
              this._bufferBuilder.append(0xd0);
              this.pack_int8(num);
          } else if (num >= 0x0000 && num <= 0xffff) {
              this._bufferBuilder.append(0xcd);
              this.pack_uint16(num);
          } else if (num >= -32768 && num <= 0x7fff) {
              this._bufferBuilder.append(0xd1);
              this.pack_int16(num);
          } else if (num >= 0x00000000 && num <= 0xffffffff) {
              this._bufferBuilder.append(0xce);
              this.pack_uint32(num);
          } else if (num >= -2147483648 && num <= 0x7fffffff) {
              this._bufferBuilder.append(0xd2);
              this.pack_int32(num);
          } else if (num >= -9223372036854776000 && num <= 0x7fffffffffffffff) {
              this._bufferBuilder.append(0xd3);
              this.pack_int64(num);
          } else if (num >= 0x0000000000000000 && num <= 0xffffffffffffffff) {
              this._bufferBuilder.append(0xcf);
              this.pack_uint64(num);
          } else throw new Error("Invalid integer");
      }
      pack_double(num) {
          let sign = 0;
          if (num < 0) {
              sign = 1;
              num = -num;
          }
          const exp = Math.floor(Math.log(num) / Math.LN2);
          const frac0 = num / 2 ** exp - 1;
          const frac1 = Math.floor(frac0 * 2 ** 52);
          const b32 = 2 ** 32;
          const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 0x0fffff;
          const l32 = frac1 % b32;
          this._bufferBuilder.append(0xcb);
          this.pack_int32(h32);
          this.pack_int32(l32);
      }
      pack_object(obj) {
          const keys = Object.keys(obj);
          const length = keys.length;
          if (length <= 0x0f) this.pack_uint8(0x80 + length);
          else if (length <= 0xffff) {
              this._bufferBuilder.append(0xde);
              this.pack_uint16(length);
          } else if (length <= 0xffffffff) {
              this._bufferBuilder.append(0xdf);
              this.pack_uint32(length);
          } else throw new Error("Invalid length");
          const packNext = (index)=>{
              if (index < keys.length) {
                  const prop = keys[index];
                  // eslint-disable-next-line no-prototype-builtins
                  if (obj.hasOwnProperty(prop)) {
                      this.pack(prop);
                      const res = this.pack(obj[prop]);
                      if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                  }
                  return packNext(index + 1);
              }
          };
          return packNext(0);
      }
      pack_uint8(num) {
          this._bufferBuilder.append(num);
      }
      pack_uint16(num) {
          this._bufferBuilder.append(num >> 8);
          this._bufferBuilder.append(num & 0xff);
      }
      pack_uint32(num) {
          const n = num & 0xffffffff;
          this._bufferBuilder.append((n & 0xff000000) >>> 24);
          this._bufferBuilder.append((n & 0x00ff0000) >>> 16);
          this._bufferBuilder.append((n & 0x0000ff00) >>> 8);
          this._bufferBuilder.append(n & 0x000000ff);
      }
      pack_uint64(num) {
          const high = num / 2 ** 32;
          const low = num % 2 ** 32;
          this._bufferBuilder.append((high & 0xff000000) >>> 24);
          this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
          this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
          this._bufferBuilder.append(high & 0x000000ff);
          this._bufferBuilder.append((low & 0xff000000) >>> 24);
          this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
          this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
          this._bufferBuilder.append(low & 0x000000ff);
      }
      pack_int8(num) {
          this._bufferBuilder.append(num & 0xff);
      }
      pack_int16(num) {
          this._bufferBuilder.append((num & 0xff00) >> 8);
          this._bufferBuilder.append(num & 0xff);
      }
      pack_int32(num) {
          this._bufferBuilder.append(num >>> 24 & 0xff);
          this._bufferBuilder.append((num & 0x00ff0000) >>> 16);
          this._bufferBuilder.append((num & 0x0000ff00) >>> 8);
          this._bufferBuilder.append(num & 0x000000ff);
      }
      pack_int64(num) {
          const high = Math.floor(num / 2 ** 32);
          const low = num % 2 ** 32;
          this._bufferBuilder.append((high & 0xff000000) >>> 24);
          this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
          this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
          this._bufferBuilder.append(high & 0x000000ff);
          this._bufferBuilder.append((low & 0xff000000) >>> 24);
          this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
          this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
          this._bufferBuilder.append(low & 0x000000ff);
      }
      constructor(){
          this._bufferBuilder = new ($e8379818650e2442$export$93654d4f2d6cd524)();
          this._textEncoder = new TextEncoder();
      }
  }

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  let logDisabled_ = true;
  let deprecationWarnings_ = true;

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  function extractVersion(uastring, expr, pos) {
    const match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  }

  // Wraps the peerconnection event eventNameToWrap in a function
  // which returns the modified event object (or false to prevent
  // the event).
  function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
    if (!window.RTCPeerConnection) {
      return;
    }
    const proto = window.RTCPeerConnection.prototype;
    const nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function(nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap) {
        return nativeAddEventListener.apply(this, arguments);
      }
      const wrappedCallback = (e) => {
        const modifiedEvent = wrapper(e);
        if (modifiedEvent) {
          if (cb.handleEvent) {
            cb.handleEvent(modifiedEvent);
          } else {
            cb(modifiedEvent);
          }
        }
      };
      this._eventMap = this._eventMap || {};
      if (!this._eventMap[eventNameToWrap]) {
        this._eventMap[eventNameToWrap] = new Map();
      }
      this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
      return nativeAddEventListener.apply(this, [nativeEventName,
        wrappedCallback]);
    };

    const nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function(nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap || !this._eventMap
          || !this._eventMap[eventNameToWrap]) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (!this._eventMap[eventNameToWrap].has(cb)) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
      this._eventMap[eventNameToWrap].delete(cb);
      if (this._eventMap[eventNameToWrap].size === 0) {
        delete this._eventMap[eventNameToWrap];
      }
      if (Object.keys(this._eventMap).length === 0) {
        delete this._eventMap;
      }
      return nativeRemoveEventListener.apply(this, [nativeEventName,
        unwrappedCb]);
    };

    Object.defineProperty(proto, 'on' + eventNameToWrap, {
      get() {
        return this['_on' + eventNameToWrap];
      },
      set(cb) {
        if (this['_on' + eventNameToWrap]) {
          this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
          delete this['_on' + eventNameToWrap];
        }
        if (cb) {
          this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
        }
      },
      enumerable: true,
      configurable: true
    });
  }

  function disableLog(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
      'adapter.js logging enabled';
  }

  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  function disableWarnings(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  }

  function log() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  }

  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  function deprecated(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
        ' instead.');
  }

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  function detectBrowser(window) {
    // Returned result object.
    const result = {browser: null, version: null};

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator ||
        !window.navigator.userAgent) {
      result.browser = 'Not a browser.';
      return result;
    }

    const {navigator} = window;

    // Prefer navigator.userAgentData.
    if (navigator.userAgentData && navigator.userAgentData.brands) {
      const chromium = navigator.userAgentData.brands.find((brand) => {
        return brand.brand === 'Chromium';
      });
      if (chromium) {
        return {browser: 'chrome', version: parseInt(chromium.version, 10)};
      }
    }

    if (navigator.mozGetUserMedia) { // Firefox.
      result.browser = 'firefox';
      result.version = extractVersion(navigator.userAgent,
        /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia ||
        (window.isSecureContext === false && window.webkitRTCPeerConnection)) {
      // Chrome, Chromium, Webview, Opera.
      // Version matches Chrome/WebRTC version.
      // Chrome 74 removed webkitGetUserMedia on http as well so we need the
      // more complicated fallback to webkitRTCPeerConnection.
      result.browser = 'chrome';
      result.version = extractVersion(navigator.userAgent,
        /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (window.RTCPeerConnection &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
      result.browser = 'safari';
      result.version = extractVersion(navigator.userAgent,
        /AppleWebKit\/(\d+)\./, 1);
      result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
          'currentDirection' in window.RTCRtpTransceiver.prototype;
    } else { // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  }

  /**
   * Checks if something is an object.
   *
   * @param {*} val The something you want to check.
   * @return true if val is an object, false otherwise.
   */
  function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  /**
   * Remove all empty objects and undefined values
   * from a nested object -- an enhanced and vanilla version
   * of Lodash's `compact`.
   */
  function compactObject(data) {
    if (!isObject(data)) {
      return data;
    }

    return Object.keys(data).reduce(function(accumulator, key) {
      const isObj = isObject(data[key]);
      const value = isObj ? compactObject(data[key]) : data[key];
      const isEmptyObject = isObj && !Object.keys(value).length;
      if (value === undefined || isEmptyObject) {
        return accumulator;
      }
      return Object.assign(accumulator, {[key]: value});
    }, {});
  }

  /* iterates the stats graph recursively. */
  function walkStats(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) {
      return;
    }
    resultSet.set(base.id, base);
    Object.keys(base).forEach(name => {
      if (name.endsWith('Id')) {
        walkStats(stats, stats.get(base[name]), resultSet);
      } else if (name.endsWith('Ids')) {
        base[name].forEach(id => {
          walkStats(stats, stats.get(id), resultSet);
        });
      }
    });
  }

  /* filter getStats for a sender/receiver track. */
  function filterStats(result, track, outbound) {
    const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
    const filteredResult = new Map();
    if (track === null) {
      return filteredResult;
    }
    const trackStats = [];
    result.forEach(value => {
      if (value.type === 'track' &&
          value.trackIdentifier === track.id) {
        trackStats.push(value);
      }
    });
    trackStats.forEach(trackStat => {
      result.forEach(stats => {
        if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
          walkStats(result, stats, filteredResult);
        }
      });
    });
    return filteredResult;
  }

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  const logging = log;

  function shimGetUserMedia$2(window, browserDetails) {
    const navigator = window && window.navigator;

    if (!navigator.mediaDevices) {
      return;
    }

    const constraintsToChrome_ = function(c) {
      if (typeof c !== 'object' || c.mandatory || c.optional) {
        return c;
      }
      const cc = {};
      Object.keys(c).forEach(key => {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
        if (r.exact !== undefined && typeof r.exact === 'number') {
          r.min = r.max = r.exact;
        }
        const oldname_ = function(prefix, name) {
          if (prefix) {
            return prefix + name.charAt(0).toUpperCase() + name.slice(1);
          }
          return (name === 'deviceId') ? 'sourceId' : name;
        };
        if (r.ideal !== undefined) {
          cc.optional = cc.optional || [];
          let oc = {};
          if (typeof r.ideal === 'number') {
            oc[oldname_('min', key)] = r.ideal;
            cc.optional.push(oc);
            oc = {};
            oc[oldname_('max', key)] = r.ideal;
            cc.optional.push(oc);
          } else {
            oc[oldname_('', key)] = r.ideal;
            cc.optional.push(oc);
          }
        }
        if (r.exact !== undefined && typeof r.exact !== 'number') {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname_('', key)] = r.exact;
        } else {
          ['min', 'max'].forEach(mix => {
            if (r[mix] !== undefined) {
              cc.mandatory = cc.mandatory || {};
              cc.mandatory[oldname_(mix, key)] = r[mix];
            }
          });
        }
      });
      if (c.advanced) {
        cc.optional = (cc.optional || []).concat(c.advanced);
      }
      return cc;
    };

    const shimConstraints_ = function(constraints, func) {
      if (browserDetails.version >= 61) {
        return func(constraints);
      }
      constraints = JSON.parse(JSON.stringify(constraints));
      if (constraints && typeof constraints.audio === 'object') {
        const remap = function(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };
        constraints = JSON.parse(JSON.stringify(constraints));
        remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
        remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
        constraints.audio = constraintsToChrome_(constraints.audio);
      }
      if (constraints && typeof constraints.video === 'object') {
        // Shim facingMode for mobile & surface pro.
        let face = constraints.video.facingMode;
        face = face && ((typeof face === 'object') ? face : {ideal: face});
        const getSupportedFacingModeLies = browserDetails.version < 66;

        if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                      face.ideal === 'user' || face.ideal === 'environment')) &&
            !(navigator.mediaDevices.getSupportedConstraints &&
              navigator.mediaDevices.getSupportedConstraints().facingMode &&
              !getSupportedFacingModeLies)) {
          delete constraints.video.facingMode;
          let matches;
          if (face.exact === 'environment' || face.ideal === 'environment') {
            matches = ['back', 'rear'];
          } else if (face.exact === 'user' || face.ideal === 'user') {
            matches = ['front'];
          }
          if (matches) {
            // Look for matches in label, or use last cam for back (typical).
            return navigator.mediaDevices.enumerateDevices()
              .then(devices => {
                devices = devices.filter(d => d.kind === 'videoinput');
                let dev = devices.find(d => matches.some(match =>
                  d.label.toLowerCase().includes(match)));
                if (!dev && devices.length && matches.includes('back')) {
                  dev = devices[devices.length - 1]; // more likely the back cam
                }
                if (dev) {
                  constraints.video.deviceId = face.exact
                    ? {exact: dev.deviceId}
                    : {ideal: dev.deviceId};
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging('chrome: ' + JSON.stringify(constraints));
                return func(constraints);
              });
          }
        }
        constraints.video = constraintsToChrome_(constraints.video);
      }
      logging('chrome: ' + JSON.stringify(constraints));
      return func(constraints);
    };

    const shimError_ = function(e) {
      if (browserDetails.version >= 64) {
        return e;
      }
      return {
        name: {
          PermissionDeniedError: 'NotAllowedError',
          PermissionDismissedError: 'NotAllowedError',
          InvalidStateError: 'NotAllowedError',
          DevicesNotFoundError: 'NotFoundError',
          ConstraintNotSatisfiedError: 'OverconstrainedError',
          TrackStartError: 'NotReadableError',
          MediaDeviceFailedDueToShutdown: 'NotAllowedError',
          MediaDeviceKillSwitchOn: 'NotAllowedError',
          TabCaptureError: 'AbortError',
          ScreenCaptureError: 'AbortError',
          DeviceCaptureError: 'AbortError'
        }[e.name] || e.name,
        message: e.message,
        constraint: e.constraint || e.constraintName,
        toString() {
          return this.name + (this.message && ': ') + this.message;
        }
      };
    };

    const getUserMedia_ = function(constraints, onSuccess, onError) {
      shimConstraints_(constraints, c => {
        navigator.webkitGetUserMedia(c, onSuccess, e => {
          if (onError) {
            onError(shimError_(e));
          }
        });
      });
    };
    navigator.getUserMedia = getUserMedia_.bind(navigator);

    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    if (navigator.mediaDevices.getUserMedia) {
      const origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function(cs) {
        return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(track => {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, e => Promise.reject(shimError_(e))));
      };
    }
  }

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  function shimMediaStream(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  }

  function shimOnTrack$1(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get() {
          return this._ontrack;
        },
        set(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
          }
          this.addEventListener('track', this._ontrack = f);
        },
        enumerable: true,
        configurable: true
      });
      const origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription =
        function setRemoteDescription() {
          if (!this._ontrackpoly) {
            this._ontrackpoly = (e) => {
              // onaddstream does not fire when a track is added to an existing
              // stream. But stream.onaddtrack is implemented so we use that.
              e.stream.addEventListener('addtrack', te => {
                let receiver;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = this.getReceivers()
                    .find(r => r.track && r.track.id === te.track.id);
                } else {
                  receiver = {track: te.track};
                }

                const event = new Event('track');
                event.track = te.track;
                event.receiver = receiver;
                event.transceiver = {receiver};
                event.streams = [e.stream];
                this.dispatchEvent(event);
              });
              e.stream.getTracks().forEach(track => {
                let receiver;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = this.getReceivers()
                    .find(r => r.track && r.track.id === track.id);
                } else {
                  receiver = {track};
                }
                const event = new Event('track');
                event.track = track;
                event.receiver = receiver;
                event.transceiver = {receiver};
                event.streams = [e.stream];
                this.dispatchEvent(event);
              });
            };
            this.addEventListener('addstream', this._ontrackpoly);
          }
          return origSetRemoteDescription.apply(this, arguments);
        };
    } else {
      // even if RTCRtpTransceiver is in window, it is only used and
      // emitted in unified-plan. Unfortunately this means we need
      // to unconditionally wrap the event.
      wrapPeerConnectionEvent(window, 'track', e => {
        if (!e.transceiver) {
          Object.defineProperty(e, 'transceiver',
            {value: {receiver: e.receiver}});
        }
        return e;
      });
    }
  }

  function shimGetSendersWithDtmf(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === 'object' && window.RTCPeerConnection &&
        !('getSenders' in window.RTCPeerConnection.prototype) &&
        'createDTMFSender' in window.RTCPeerConnection.prototype) {
      const shimSenderWithDtmf = function(pc, track) {
        return {
          track,
          get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === 'audio') {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };

      // augment addTrack when getSenders is not available.
      if (!window.RTCPeerConnection.prototype.getSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          this._senders = this._senders || [];
          return this._senders.slice(); // return a copy of the internal state.
        };
        const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addTrack =
          function addTrack(track, stream) {
            let sender = origAddTrack.apply(this, arguments);
            if (!sender) {
              sender = shimSenderWithDtmf(this, track);
              this._senders.push(sender);
            }
            return sender;
          };

        const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
        window.RTCPeerConnection.prototype.removeTrack =
          function removeTrack(sender) {
            origRemoveTrack.apply(this, arguments);
            const idx = this._senders.indexOf(sender);
            if (idx !== -1) {
              this._senders.splice(idx, 1);
            }
          };
      }
      const origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._senders = this._senders || [];
        origAddStream.apply(this, [stream]);
        stream.getTracks().forEach(track => {
          this._senders.push(shimSenderWithDtmf(this, track));
        });
      };

      const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          this._senders = this._senders || [];
          origRemoveStream.apply(this, [stream]);

          stream.getTracks().forEach(track => {
            const sender = this._senders.find(s => s.track === track);
            if (sender) { // remove sender
              this._senders.splice(this._senders.indexOf(sender), 1);
            }
          });
        };
    } else if (typeof window === 'object' && window.RTCPeerConnection &&
               'getSenders' in window.RTCPeerConnection.prototype &&
               'createDTMFSender' in window.RTCPeerConnection.prototype &&
               window.RTCRtpSender &&
               !('dtmf' in window.RTCRtpSender.prototype)) {
      const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };

      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  }

  function shimSenderReceiverGetStats(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection &&
        window.RTCRtpSender && window.RTCRtpReceiver)) {
      return;
    }

    // shim sender stats.
    if (!('getStats' in window.RTCRtpSender.prototype)) {
      const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach(sender => sender._pc = this);
          return senders;
        };
      }

      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          const sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        const sender = this;
        return this._pc.getStats().then(result =>
          /* Note: this will include stats of all senders that
           *   send a track with the same id as sender.track as
           *   it is not possible to identify the RTCRtpSender.
           */
          filterStats(result, sender.track, true));
      };
    }

    // shim receiver stats.
    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
      const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers =
          function getReceivers() {
            const receivers = origGetReceivers.apply(this, []);
            receivers.forEach(receiver => receiver._pc = this);
            return receivers;
          };
      }
      wrapPeerConnectionEvent(window, 'track', e => {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        const receiver = this;
        return this._pc.getStats().then(result =>
          filterStats(result, receiver.track, false));
      };
    }

    if (!('getStats' in window.RTCRtpSender.prototype &&
        'getStats' in window.RTCRtpReceiver.prototype)) {
      return;
    }

    // shim RTCPeerConnection.getStats(track).
    const origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
      if (arguments.length > 0 &&
          arguments[0] instanceof window.MediaStreamTrack) {
        const track = arguments[0];
        let sender;
        let receiver;
        let err;
        this.getSenders().forEach(s => {
          if (s.track === track) {
            if (sender) {
              err = true;
            } else {
              sender = s;
            }
          }
        });
        this.getReceivers().forEach(r => {
          if (r.track === track) {
            if (receiver) {
              err = true;
            } else {
              receiver = r;
            }
          }
          return r.track === track;
        });
        if (err || (sender && receiver)) {
          return Promise.reject(new DOMException(
            'There are more than one sender or receiver for the track.',
            'InvalidAccessError'));
        } else if (sender) {
          return sender.getStats();
        } else if (receiver) {
          return receiver.getStats();
        }
        return Promise.reject(new DOMException(
          'There is no sender or receiver for the track.',
          'InvalidAccessError'));
      }
      return origGetStats.apply(this, arguments);
    };
  }

  function shimAddTrackRemoveTrackWithNative(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams)
          .map(streamId => this._shimmedLocalStreams[streamId][0]);
      };

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track, stream) {
        if (!stream) {
          return origAddTrack.apply(this, arguments);
        }
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

        const sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) {
          this._shimmedLocalStreams[stream.id] = [stream, sender];
        } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
          this._shimmedLocalStreams[stream.id].push(sender);
        }
        return sender;
      };

    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      stream.getTracks().forEach(track => {
        const alreadyExists = this.getSenders().find(s => s.track === track);
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
            'InvalidAccessError');
        }
      });
      const existingSenders = this.getSenders();
      origAddStream.apply(this, arguments);
      const newSenders = this.getSenders()
        .filter(newSender => existingSenders.indexOf(newSender) === -1);
      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
      };

    const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack =
      function removeTrack(sender) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) {
          Object.keys(this._shimmedLocalStreams).forEach(streamId => {
            const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) {
              this._shimmedLocalStreams[streamId].splice(idx, 1);
            }
            if (this._shimmedLocalStreams[streamId].length === 1) {
              delete this._shimmedLocalStreams[streamId];
            }
          });
        }
        return origRemoveTrack.apply(this, arguments);
      };
  }

  function shimAddTrackRemoveTrack(window, browserDetails) {
    if (!window.RTCPeerConnection) {
      return;
    }
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack &&
        browserDetails.version >= 65) {
      return shimAddTrackRemoveTrackWithNative(window);
    }

    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    const origGetLocalStreams = window.RTCPeerConnection.prototype
      .getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        const nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map(stream => this._reverseStreams[stream.id]);
      };

    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};

      stream.getTracks().forEach(track => {
        const alreadyExists = this.getSenders().find(s => s.track === track);
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
            'InvalidAccessError');
        }
      });
      // Add identity mapping for consistency with addTrack.
      // Unless this is being used with a stream from addTrack.
      if (!this._reverseStreams[stream.id]) {
        const newStream = new window.MediaStream(stream.getTracks());
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(this, [stream]);
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};

        origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
        delete this._reverseStreams[(this._streams[stream.id] ?
          this._streams[stream.id].id : stream.id)];
        delete this._streams[stream.id];
      };

    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track, stream) {
        if (this.signalingState === 'closed') {
          throw new DOMException(
            'The RTCPeerConnection\'s signalingState is \'closed\'.',
            'InvalidStateError');
        }
        const streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 ||
            !streams[0].getTracks().find(t => t === track)) {
          // this is not fully correct but all we can manage without
          // [[associated MediaStreams]] internal slot.
          throw new DOMException(
            'The adapter.js addTrack polyfill only supports a single ' +
            ' stream which is associated with the specified track.',
            'NotSupportedError');
        }

        const alreadyExists = this.getSenders().find(s => s.track === track);
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
            'InvalidAccessError');
        }

        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        const oldStream = this._streams[stream.id];
        if (oldStream) {
          // this is using odd Chrome behaviour, use with caution:
          // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
          // Note: we rely on the high-level addTrack/dtmf shim to
          // create the sender with a dtmf sender.
          oldStream.addTrack(track);

          // Trigger ONN async.
          Promise.resolve().then(() => {
            this.dispatchEvent(new Event('negotiationneeded'));
          });
        } else {
          const newStream = new window.MediaStream([track]);
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          this.addStream(newStream);
        }
        return this.getSenders().find(s => s.track === track);
      };

    // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
      let sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(internalId => {
        const externalStream = pc._reverseStreams[internalId];
        const internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
          externalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp
      });
    }
    function replaceExternalStreamId(pc, description) {
      let sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(internalId => {
        const externalStream = pc._reverseStreams[internalId];
        const internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
          internalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp
      });
    }
    ['createOffer', 'createAnswer'].forEach(function(method) {
      const nativeMethod = window.RTCPeerConnection.prototype[method];
      const methodObj = {[method]() {
        const args = arguments;
        const isLegacyCall = arguments.length &&
            typeof arguments[0] === 'function';
        if (isLegacyCall) {
          return nativeMethod.apply(this, [
            (description) => {
              const desc = replaceInternalStreamId(this, description);
              args[0].apply(null, [desc]);
            },
            (err) => {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]
          ]);
        }
        return nativeMethod.apply(this, arguments)
          .then(description => replaceInternalStreamId(this, description));
      }};
      window.RTCPeerConnection.prototype[method] = methodObj[method];
    });

    const origSetLocalDescription =
        window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription =
      function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) {
          return origSetLocalDescription.apply(this, arguments);
        }
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
      };

    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

    const origLocalDescription = Object.getOwnPropertyDescriptor(
      window.RTCPeerConnection.prototype, 'localDescription');
    Object.defineProperty(window.RTCPeerConnection.prototype,
      'localDescription', {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });

    window.RTCPeerConnection.prototype.removeTrack =
      function removeTrack(sender) {
        if (this.signalingState === 'closed') {
          throw new DOMException(
            'The RTCPeerConnection\'s signalingState is \'closed\'.',
            'InvalidStateError');
        }
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) {
          throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
              'does not implement interface RTCRtpSender.', 'TypeError');
        }
        const isLocal = sender._pc === this;
        if (!isLocal) {
          throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
        }

        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        let stream;
        Object.keys(this._streams).forEach(streamid => {
          const hasTrack = this._streams[streamid].getTracks()
            .find(track => sender.track === track);
          if (hasTrack) {
            stream = this._streams[streamid];
          }
        });

        if (stream) {
          if (stream.getTracks().length === 1) {
            // if this is the last track of the stream, remove the stream. This
            // takes care of any shimmed _senders.
            this.removeStream(this._reverseStreams[stream.id]);
          } else {
            // relying on the same odd chrome behaviour as above.
            stream.removeTrack(sender.track);
          }
          this.dispatchEvent(new Event('negotiationneeded'));
        }
      };
  }

  function shimPeerConnection$1(window, browserDetails) {
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
      // very basic support for old versions.
      window.RTCPeerConnection = window.webkitRTCPeerConnection;
    }
    if (!window.RTCPeerConnection) {
      return;
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    if (browserDetails.version < 53) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
              window.RTCIceCandidate :
              window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
    }
  }

  // Attempt to fix ONN in plan-b mode.
  function fixNegotiationNeeded(window, browserDetails) {
    wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
      const pc = e.target;
      if (browserDetails.version < 72 || (pc.getConfiguration &&
          pc.getConfiguration().sdpSemantics === 'plan-b')) {
        if (pc.signalingState !== 'stable') {
          return;
        }
      }
      return e;
    });
  }

  var chromeShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shimMediaStream: shimMediaStream,
    shimOnTrack: shimOnTrack$1,
    shimGetSendersWithDtmf: shimGetSendersWithDtmf,
    shimSenderReceiverGetStats: shimSenderReceiverGetStats,
    shimAddTrackRemoveTrackWithNative: shimAddTrackRemoveTrackWithNative,
    shimAddTrackRemoveTrack: shimAddTrackRemoveTrack,
    shimPeerConnection: shimPeerConnection$1,
    fixNegotiationNeeded: fixNegotiationNeeded,
    shimGetUserMedia: shimGetUserMedia$2
  });

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  function shimGetUserMedia$1(window, browserDetails) {
    const navigator = window && window.navigator;
    const MediaStreamTrack = window && window.MediaStreamTrack;

    navigator.getUserMedia = function(constraints, onSuccess, onError) {
      // Replace Firefox 44+'s deprecation warning with unprefixed version.
      deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };

    if (!(browserDetails.version > 55 &&
        'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };

      const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function(c) {
        if (typeof c === 'object' && typeof c.audio === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
          remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeGetUserMedia(c);
      };

      if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
        const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
        MediaStreamTrack.prototype.getSettings = function() {
          const obj = nativeGetSettings.apply(this, arguments);
          remap(obj, 'mozAutoGainControl', 'autoGainControl');
          remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
          return obj;
        };
      }

      if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
        const nativeApplyConstraints =
          MediaStreamTrack.prototype.applyConstraints;
        MediaStreamTrack.prototype.applyConstraints = function(c) {
          if (this.kind === 'audio' && typeof c === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c, 'autoGainControl', 'mozAutoGainControl');
            remap(c, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeApplyConstraints.apply(this, [c]);
        };
      }
    }
  }

  /*
   *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  function shimGetDisplayMedia(window, preferredMediaSource) {
    if (window.navigator.mediaDevices &&
      'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    if (!(window.navigator.mediaDevices)) {
      return;
    }
    window.navigator.mediaDevices.getDisplayMedia =
      function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
          const err = new DOMException('getDisplayMedia without video ' +
              'constraints is undefined');
          err.name = 'NotFoundError';
          // from https://heycam.github.io/webidl/#idl-DOMException-error-names
          err.code = 8;
          return Promise.reject(err);
        }
        if (constraints.video === true) {
          constraints.video = {mediaSource: preferredMediaSource};
        } else {
          constraints.video.mediaSource = preferredMediaSource;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
      };
  }

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  function shimOnTrack(window) {
    if (typeof window === 'object' && window.RTCTrackEvent &&
        ('receiver' in window.RTCTrackEvent.prototype) &&
        !('transceiver' in window.RTCTrackEvent.prototype)) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get() {
          return {receiver: this.receiver};
        }
      });
    }
  }

  function shimPeerConnection(window, browserDetails) {
    if (typeof window !== 'object' ||
        !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
      // very basic support for old versions.
      window.RTCPeerConnection = window.mozRTCPeerConnection;
    }

    if (browserDetails.version < 53) {
      // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
              window.RTCIceCandidate :
              window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
    }

    const modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };

    const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
      const [selector, onSucc, onErr] = arguments;
      return nativeGetStats.apply(this, [selector || null])
        .then(stats => {
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(stat => {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach((stat, i) => {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        })
        .then(onSucc, onErr);
    };
  }

  function shimSenderGetStats(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection &&
        window.RTCRtpSender)) {
      return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
      return;
    }
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };
    }

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      return this.track ? this._pc.getStats(this.track) :
        Promise.resolve(new Map());
    };
  }

  function shimReceiverGetStats(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection &&
        window.RTCRtpSender)) {
      return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
      return;
    }
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach(receiver => receiver._pc = this);
        return receivers;
      };
    }
    wrapPeerConnectionEvent(window, 'track', e => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      return this._pc.getStats(this.track);
    };
  }

  function shimRemoveStream(window) {
    if (!window.RTCPeerConnection ||
        'removeStream' in window.RTCPeerConnection.prototype) {
      return;
    }
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        deprecated('removeStream', 'removeTrack');
        this.getSenders().forEach(sender => {
          if (sender.track && stream.getTracks().includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
  }

  function shimRTCDataChannel(window) {
    // rename DataChannel to RTCDataChannel (native fix in FF60):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
    if (window.DataChannel && !window.RTCDataChannel) {
      window.RTCDataChannel = window.DataChannel;
    }
  }

  function shimAddTransceiver(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) {
      return;
    }
    const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) {
      window.RTCPeerConnection.prototype.addTransceiver =
        function addTransceiver() {
          this.setParametersPromises = [];
          // WebIDL input coercion and validation
          let sendEncodings = arguments[1] && arguments[1].sendEncodings;
          if (sendEncodings === undefined) {
            sendEncodings = [];
          }
          sendEncodings = [...sendEncodings];
          const shouldPerformCheck = sendEncodings.length > 0;
          if (shouldPerformCheck) {
            // If sendEncodings params are provided, validate grammar
            sendEncodings.forEach((encodingParam) => {
              if ('rid' in encodingParam) {
                const ridRegex = /^[a-z0-9]{0,16}$/i;
                if (!ridRegex.test(encodingParam.rid)) {
                  throw new TypeError('Invalid RID value provided.');
                }
              }
              if ('scaleResolutionDownBy' in encodingParam) {
                if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                  throw new RangeError('scale_resolution_down_by must be >= 1.0');
                }
              }
              if ('maxFramerate' in encodingParam) {
                if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                  throw new RangeError('max_framerate must be >= 0.0');
                }
              }
            });
          }
          const transceiver = origAddTransceiver.apply(this, arguments);
          if (shouldPerformCheck) {
            // Check if the init options were applied. If not we do this in an
            // asynchronous way and save the promise reference in a global object.
            // This is an ugly hack, but at the same time is way more robust than
            // checking the sender parameters before and after the createOffer
            // Also note that after the createoffer we are not 100% sure that
            // the params were asynchronously applied so we might miss the
            // opportunity to recreate offer.
            const {sender} = transceiver;
            const params = sender.getParameters();
            if (!('encodings' in params) ||
                // Avoid being fooled by patched getParameters() below.
                (params.encodings.length === 1 &&
                 Object.keys(params.encodings[0]).length === 0)) {
              params.encodings = sendEncodings;
              sender.sendEncodings = sendEncodings;
              this.setParametersPromises.push(sender.setParameters(params)
                .then(() => {
                  delete sender.sendEncodings;
                }).catch(() => {
                  delete sender.sendEncodings;
                })
              );
            }
          }
          return transceiver;
        };
    }
  }

  function shimGetParameters(window) {
    if (!(typeof window === 'object' && window.RTCRtpSender)) {
      return;
    }
    const origGetParameters = window.RTCRtpSender.prototype.getParameters;
    if (origGetParameters) {
      window.RTCRtpSender.prototype.getParameters =
        function getParameters() {
          const params = origGetParameters.apply(this, arguments);
          if (!('encodings' in params)) {
            params.encodings = [].concat(this.sendEncodings || [{}]);
          }
          return params;
        };
    }
  }

  function shimCreateOffer(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) {
      return;
    }
    const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer() {
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises)
          .then(() => {
            return origCreateOffer.apply(this, arguments);
          })
          .finally(() => {
            this.setParametersPromises = [];
          });
      }
      return origCreateOffer.apply(this, arguments);
    };
  }

  function shimCreateAnswer(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) {
      return;
    }
    const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
    window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises)
          .then(() => {
            return origCreateAnswer.apply(this, arguments);
          })
          .finally(() => {
            this.setParametersPromises = [];
          });
      }
      return origCreateAnswer.apply(this, arguments);
    };
  }

  var firefoxShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shimOnTrack: shimOnTrack,
    shimPeerConnection: shimPeerConnection,
    shimSenderGetStats: shimSenderGetStats,
    shimReceiverGetStats: shimReceiverGetStats,
    shimRemoveStream: shimRemoveStream,
    shimRTCDataChannel: shimRTCDataChannel,
    shimAddTransceiver: shimAddTransceiver,
    shimGetParameters: shimGetParameters,
    shimCreateOffer: shimCreateOffer,
    shimCreateAnswer: shimCreateAnswer,
    shimGetUserMedia: shimGetUserMedia$1,
    shimGetDisplayMedia: shimGetDisplayMedia
  });

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  function shimLocalStreamsAPI(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getLocalStreams =
        function getLocalStreams() {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          return this._localStreams;
        };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
      const _addTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (!this._localStreams.includes(stream)) {
          this._localStreams.push(stream);
        }
        // Try to emulate Chrome's behaviour of adding in audio-video order.
        // Safari orders by track id.
        stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
          stream));
        stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
          stream));
      };

      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, ...streams) {
          if (streams) {
            streams.forEach((stream) => {
              if (!this._localStreams) {
                this._localStreams = [stream];
              } else if (!this._localStreams.includes(stream)) {
                this._localStreams.push(stream);
              }
            });
          }
          return _addTrack.apply(this, arguments);
        };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          const index = this._localStreams.indexOf(stream);
          if (index === -1) {
            return;
          }
          this._localStreams.splice(index, 1);
          const tracks = stream.getTracks();
          this.getSenders().forEach(sender => {
            if (tracks.includes(sender.track)) {
              this.removeTrack(sender);
            }
          });
        };
    }
  }

  function shimRemoteStreamsAPI(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getRemoteStreams =
        function getRemoteStreams() {
          return this._remoteStreams ? this._remoteStreams : [];
        };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
        get() {
          return this._onaddstream;
        },
        set(f) {
          if (this._onaddstream) {
            this.removeEventListener('addstream', this._onaddstream);
            this.removeEventListener('track', this._onaddstreampoly);
          }
          this.addEventListener('addstream', this._onaddstream = f);
          this.addEventListener('track', this._onaddstreampoly = (e) => {
            e.streams.forEach(stream => {
              if (!this._remoteStreams) {
                this._remoteStreams = [];
              }
              if (this._remoteStreams.includes(stream)) {
                return;
              }
              this._remoteStreams.push(stream);
              const event = new Event('addstream');
              event.stream = stream;
              this.dispatchEvent(event);
            });
          });
        }
      });
      const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription =
        function setRemoteDescription() {
          const pc = this;
          if (!this._onaddstreampoly) {
            this.addEventListener('track', this._onaddstreampoly = function(e) {
              e.streams.forEach(stream => {
                if (!pc._remoteStreams) {
                  pc._remoteStreams = [];
                }
                if (pc._remoteStreams.indexOf(stream) >= 0) {
                  return;
                }
                pc._remoteStreams.push(stream);
                const event = new Event('addstream');
                event.stream = stream;
                pc.dispatchEvent(event);
              });
            });
          }
          return origSetRemoteDescription.apply(pc, arguments);
        };
    }
  }

  function shimCallbacksAPI(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    const prototype = window.RTCPeerConnection.prototype;
    const origCreateOffer = prototype.createOffer;
    const origCreateAnswer = prototype.createAnswer;
    const setLocalDescription = prototype.setLocalDescription;
    const setRemoteDescription = prototype.setRemoteDescription;
    const addIceCandidate = prototype.addIceCandidate;

    prototype.createOffer =
      function createOffer(successCallback, failureCallback) {
        const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
        const promise = origCreateOffer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };

    prototype.createAnswer =
      function createAnswer(successCallback, failureCallback) {
        const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
        const promise = origCreateAnswer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };

    let withCallback = function(description, successCallback, failureCallback) {
      const promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;

    withCallback = function(description, successCallback, failureCallback) {
      const promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;

    withCallback = function(candidate, successCallback, failureCallback) {
      const promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  }

  function shimGetUserMedia(window) {
    const navigator = window && window.navigator;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // shim not needed in Safari 12.1
      const mediaDevices = navigator.mediaDevices;
      const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
      navigator.mediaDevices.getUserMedia = (constraints) => {
        return _getUserMedia(shimConstraints(constraints));
      };
    }

    if (!navigator.getUserMedia && navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia) {
      navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
        navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
      }.bind(navigator);
    }
  }

  function shimConstraints(constraints) {
    if (constraints && constraints.video !== undefined) {
      return Object.assign({},
        constraints,
        {video: compactObject(constraints.video)}
      );
    }

    return constraints;
  }

  function shimRTCIceServerUrls(window) {
    if (!window.RTCPeerConnection) {
      return;
    }
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    const OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection =
      function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          const newIceServers = [];
          for (let i = 0; i < pcConfig.iceServers.length; i++) {
            let server = pcConfig.iceServers[i];
            if (server.urls === undefined && server.url) {
              deprecated('RTCIceServer.url', 'RTCIceServer.urls');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              delete server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ('generateCertificate' in OrigPeerConnection) {
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }
  }

  function shimTrackEventTransceiver(window) {
    // Add event.transceiver member over deprecated event.receiver
    if (typeof window === 'object' && window.RTCTrackEvent &&
        'receiver' in window.RTCTrackEvent.prototype &&
        !('transceiver' in window.RTCTrackEvent.prototype)) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get() {
          return {receiver: this.receiver};
        }
      });
    }
  }

  function shimCreateOfferLegacy(window) {
    const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer =
      function createOffer(offerOptions) {
        if (offerOptions) {
          if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveAudio =
              !!offerOptions.offerToReceiveAudio;
          }
          const audioTransceiver = this.getTransceivers().find(transceiver =>
            transceiver.receiver.track.kind === 'audio');
          if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
            if (audioTransceiver.direction === 'sendrecv') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('sendonly');
              } else {
                audioTransceiver.direction = 'sendonly';
              }
            } else if (audioTransceiver.direction === 'recvonly') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('inactive');
              } else {
                audioTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveAudio === true &&
              !audioTransceiver) {
            this.addTransceiver('audio', {direction: 'recvonly'});
          }

          if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveVideo =
              !!offerOptions.offerToReceiveVideo;
          }
          const videoTransceiver = this.getTransceivers().find(transceiver =>
            transceiver.receiver.track.kind === 'video');
          if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
            if (videoTransceiver.direction === 'sendrecv') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('sendonly');
              } else {
                videoTransceiver.direction = 'sendonly';
              }
            } else if (videoTransceiver.direction === 'recvonly') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('inactive');
              } else {
                videoTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveVideo === true &&
              !videoTransceiver) {
            this.addTransceiver('video', {direction: 'recvonly'});
          }
        }
        return origCreateOffer.apply(this, arguments);
      };
  }

  function shimAudioContext(window) {
    if (typeof window !== 'object' || window.AudioContext) {
      return;
    }
    window.AudioContext = window.webkitAudioContext;
  }

  var safariShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shimLocalStreamsAPI: shimLocalStreamsAPI,
    shimRemoteStreamsAPI: shimRemoteStreamsAPI,
    shimCallbacksAPI: shimCallbacksAPI,
    shimGetUserMedia: shimGetUserMedia,
    shimConstraints: shimConstraints,
    shimRTCIceServerUrls: shimRTCIceServerUrls,
    shimTrackEventTransceiver: shimTrackEventTransceiver,
    shimCreateOfferLegacy: shimCreateOfferLegacy,
    shimAudioContext: shimAudioContext
  });

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var sdp$1 = {exports: {}};

  /* eslint-env node */
  sdp$1.exports;

  var hasRequiredSdp;

  function requireSdp () {
  	if (hasRequiredSdp) return sdp$1.exports;
  	hasRequiredSdp = 1;
  	(function (module) {

  		// SDP helpers.
  		const SDPUtils = {};

  		// Generate an alphanumeric identifier for cname or mids.
  		// TODO: use UUIDs instead? https://gist.github.com/jed/982883
  		SDPUtils.generateIdentifier = function() {
  		  return Math.random().toString(36).substring(2, 12);
  		};

  		// The RTCP CNAME used by all peerconnections from the same JS.
  		SDPUtils.localCName = SDPUtils.generateIdentifier();

  		// Splits SDP into lines, dealing with both CRLF and LF.
  		SDPUtils.splitLines = function(blob) {
  		  return blob.trim().split('\n').map(line => line.trim());
  		};
  		// Splits SDP into sessionpart and mediasections. Ensures CRLF.
  		SDPUtils.splitSections = function(blob) {
  		  const parts = blob.split('\nm=');
  		  return parts.map((part, index) => (index > 0 ?
  		    'm=' + part : part).trim() + '\r\n');
  		};

  		// Returns the session description.
  		SDPUtils.getDescription = function(blob) {
  		  const sections = SDPUtils.splitSections(blob);
  		  return sections && sections[0];
  		};

  		// Returns the individual media sections.
  		SDPUtils.getMediaSections = function(blob) {
  		  const sections = SDPUtils.splitSections(blob);
  		  sections.shift();
  		  return sections;
  		};

  		// Returns lines that start with a certain prefix.
  		SDPUtils.matchPrefix = function(blob, prefix) {
  		  return SDPUtils.splitLines(blob).filter(line => line.indexOf(prefix) === 0);
  		};

  		// Parses an ICE candidate line. Sample input:
  		// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
  		// rport 55996"
  		// Input can be prefixed with a=.
  		SDPUtils.parseCandidate = function(line) {
  		  let parts;
  		  // Parse both variants.
  		  if (line.indexOf('a=candidate:') === 0) {
  		    parts = line.substring(12).split(' ');
  		  } else {
  		    parts = line.substring(10).split(' ');
  		  }

  		  const candidate = {
  		    foundation: parts[0],
  		    component: {1: 'rtp', 2: 'rtcp'}[parts[1]] || parts[1],
  		    protocol: parts[2].toLowerCase(),
  		    priority: parseInt(parts[3], 10),
  		    ip: parts[4],
  		    address: parts[4], // address is an alias for ip.
  		    port: parseInt(parts[5], 10),
  		    // skip parts[6] == 'typ'
  		    type: parts[7],
  		  };

  		  for (let i = 8; i < parts.length; i += 2) {
  		    switch (parts[i]) {
  		      case 'raddr':
  		        candidate.relatedAddress = parts[i + 1];
  		        break;
  		      case 'rport':
  		        candidate.relatedPort = parseInt(parts[i + 1], 10);
  		        break;
  		      case 'tcptype':
  		        candidate.tcpType = parts[i + 1];
  		        break;
  		      case 'ufrag':
  		        candidate.ufrag = parts[i + 1]; // for backward compatibility.
  		        candidate.usernameFragment = parts[i + 1];
  		        break;
  		      default: // extension handling, in particular ufrag. Don't overwrite.
  		        if (candidate[parts[i]] === undefined) {
  		          candidate[parts[i]] = parts[i + 1];
  		        }
  		        break;
  		    }
  		  }
  		  return candidate;
  		};

  		// Translates a candidate object into SDP candidate attribute.
  		// This does not include the a= prefix!
  		SDPUtils.writeCandidate = function(candidate) {
  		  const sdp = [];
  		  sdp.push(candidate.foundation);

  		  const component = candidate.component;
  		  if (component === 'rtp') {
  		    sdp.push(1);
  		  } else if (component === 'rtcp') {
  		    sdp.push(2);
  		  } else {
  		    sdp.push(component);
  		  }
  		  sdp.push(candidate.protocol.toUpperCase());
  		  sdp.push(candidate.priority);
  		  sdp.push(candidate.address || candidate.ip);
  		  sdp.push(candidate.port);

  		  const type = candidate.type;
  		  sdp.push('typ');
  		  sdp.push(type);
  		  if (type !== 'host' && candidate.relatedAddress &&
  		      candidate.relatedPort) {
  		    sdp.push('raddr');
  		    sdp.push(candidate.relatedAddress);
  		    sdp.push('rport');
  		    sdp.push(candidate.relatedPort);
  		  }
  		  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
  		    sdp.push('tcptype');
  		    sdp.push(candidate.tcpType);
  		  }
  		  if (candidate.usernameFragment || candidate.ufrag) {
  		    sdp.push('ufrag');
  		    sdp.push(candidate.usernameFragment || candidate.ufrag);
  		  }
  		  return 'candidate:' + sdp.join(' ');
  		};

  		// Parses an ice-options line, returns an array of option tags.
  		// Sample input:
  		// a=ice-options:foo bar
  		SDPUtils.parseIceOptions = function(line) {
  		  return line.substring(14).split(' ');
  		};

  		// Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
  		// a=rtpmap:111 opus/48000/2
  		SDPUtils.parseRtpMap = function(line) {
  		  let parts = line.substring(9).split(' ');
  		  const parsed = {
  		    payloadType: parseInt(parts.shift(), 10), // was: id
  		  };

  		  parts = parts[0].split('/');

  		  parsed.name = parts[0];
  		  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  		  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  		  // legacy alias, got renamed back to channels in ORTC.
  		  parsed.numChannels = parsed.channels;
  		  return parsed;
  		};

  		// Generates a rtpmap line from RTCRtpCodecCapability or
  		// RTCRtpCodecParameters.
  		SDPUtils.writeRtpMap = function(codec) {
  		  let pt = codec.payloadType;
  		  if (codec.preferredPayloadType !== undefined) {
  		    pt = codec.preferredPayloadType;
  		  }
  		  const channels = codec.channels || codec.numChannels || 1;
  		  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
  		      (channels !== 1 ? '/' + channels : '') + '\r\n';
  		};

  		// Parses a extmap line (headerextension from RFC 5285). Sample input:
  		// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
  		// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
  		SDPUtils.parseExtmap = function(line) {
  		  const parts = line.substring(9).split(' ');
  		  return {
  		    id: parseInt(parts[0], 10),
  		    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
  		    uri: parts[1],
  		    attributes: parts.slice(2).join(' '),
  		  };
  		};

  		// Generates an extmap line from RTCRtpHeaderExtensionParameters or
  		// RTCRtpHeaderExtension.
  		SDPUtils.writeExtmap = function(headerExtension) {
  		  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
  		      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
  		        ? '/' + headerExtension.direction
  		        : '') +
  		      ' ' + headerExtension.uri +
  		      (headerExtension.attributes ? ' ' + headerExtension.attributes : '') +
  		      '\r\n';
  		};

  		// Parses a fmtp line, returns dictionary. Sample input:
  		// a=fmtp:96 vbr=on;cng=on
  		// Also deals with vbr=on; cng=on
  		SDPUtils.parseFmtp = function(line) {
  		  const parsed = {};
  		  let kv;
  		  const parts = line.substring(line.indexOf(' ') + 1).split(';');
  		  for (let j = 0; j < parts.length; j++) {
  		    kv = parts[j].trim().split('=');
  		    parsed[kv[0].trim()] = kv[1];
  		  }
  		  return parsed;
  		};

  		// Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
  		SDPUtils.writeFmtp = function(codec) {
  		  let line = '';
  		  let pt = codec.payloadType;
  		  if (codec.preferredPayloadType !== undefined) {
  		    pt = codec.preferredPayloadType;
  		  }
  		  if (codec.parameters && Object.keys(codec.parameters).length) {
  		    const params = [];
  		    Object.keys(codec.parameters).forEach(param => {
  		      if (codec.parameters[param] !== undefined) {
  		        params.push(param + '=' + codec.parameters[param]);
  		      } else {
  		        params.push(param);
  		      }
  		    });
  		    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  		  }
  		  return line;
  		};

  		// Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
  		// a=rtcp-fb:98 nack rpsi
  		SDPUtils.parseRtcpFb = function(line) {
  		  const parts = line.substring(line.indexOf(' ') + 1).split(' ');
  		  return {
  		    type: parts.shift(),
  		    parameter: parts.join(' '),
  		  };
  		};

  		// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
  		SDPUtils.writeRtcpFb = function(codec) {
  		  let lines = '';
  		  let pt = codec.payloadType;
  		  if (codec.preferredPayloadType !== undefined) {
  		    pt = codec.preferredPayloadType;
  		  }
  		  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
  		    // FIXME: special handling for trr-int?
  		    codec.rtcpFeedback.forEach(fb => {
  		      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
  		      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
  		          '\r\n';
  		    });
  		  }
  		  return lines;
  		};

  		// Parses a RFC 5576 ssrc media attribute. Sample input:
  		// a=ssrc:3735928559 cname:something
  		SDPUtils.parseSsrcMedia = function(line) {
  		  const sp = line.indexOf(' ');
  		  const parts = {
  		    ssrc: parseInt(line.substring(7, sp), 10),
  		  };
  		  const colon = line.indexOf(':', sp);
  		  if (colon > -1) {
  		    parts.attribute = line.substring(sp + 1, colon);
  		    parts.value = line.substring(colon + 1);
  		  } else {
  		    parts.attribute = line.substring(sp + 1);
  		  }
  		  return parts;
  		};

  		// Parse a ssrc-group line (see RFC 5576). Sample input:
  		// a=ssrc-group:semantics 12 34
  		SDPUtils.parseSsrcGroup = function(line) {
  		  const parts = line.substring(13).split(' ');
  		  return {
  		    semantics: parts.shift(),
  		    ssrcs: parts.map(ssrc => parseInt(ssrc, 10)),
  		  };
  		};

  		// Extracts the MID (RFC 5888) from a media section.
  		// Returns the MID or undefined if no mid line was found.
  		SDPUtils.getMid = function(mediaSection) {
  		  const mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  		  if (mid) {
  		    return mid.substring(6);
  		  }
  		};

  		// Parses a fingerprint line for DTLS-SRTP.
  		SDPUtils.parseFingerprint = function(line) {
  		  const parts = line.substring(14).split(' ');
  		  return {
  		    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
  		    value: parts[1].toUpperCase(), // the definition is upper-case in RFC 4572.
  		  };
  		};

  		// Extracts DTLS parameters from SDP media section or sessionpart.
  		// FIXME: for consistency with other functions this should only
  		//   get the fingerprint line as input. See also getIceParameters.
  		SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  		  const lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
  		    'a=fingerprint:');
  		  // Note: a=setup line is ignored since we use the 'auto' role in Edge.
  		  return {
  		    role: 'auto',
  		    fingerprints: lines.map(SDPUtils.parseFingerprint),
  		  };
  		};

  		// Serializes DTLS parameters to SDP.
  		SDPUtils.writeDtlsParameters = function(params, setupType) {
  		  let sdp = 'a=setup:' + setupType + '\r\n';
  		  params.fingerprints.forEach(fp => {
  		    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  		  });
  		  return sdp;
  		};

  		// Parses a=crypto lines into
  		//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
  		SDPUtils.parseCryptoLine = function(line) {
  		  const parts = line.substring(9).split(' ');
  		  return {
  		    tag: parseInt(parts[0], 10),
  		    cryptoSuite: parts[1],
  		    keyParams: parts[2],
  		    sessionParams: parts.slice(3),
  		  };
  		};

  		SDPUtils.writeCryptoLine = function(parameters) {
  		  return 'a=crypto:' + parameters.tag + ' ' +
  		    parameters.cryptoSuite + ' ' +
  		    (typeof parameters.keyParams === 'object'
  		      ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
  		      : parameters.keyParams) +
  		    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
  		    '\r\n';
  		};

  		// Parses the crypto key parameters into
  		//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
  		SDPUtils.parseCryptoKeyParams = function(keyParams) {
  		  if (keyParams.indexOf('inline:') !== 0) {
  		    return null;
  		  }
  		  const parts = keyParams.substring(7).split('|');
  		  return {
  		    keyMethod: 'inline',
  		    keySalt: parts[0],
  		    lifeTime: parts[1],
  		    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
  		    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
  		  };
  		};

  		SDPUtils.writeCryptoKeyParams = function(keyParams) {
  		  return keyParams.keyMethod + ':'
  		    + keyParams.keySalt +
  		    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
  		    (keyParams.mkiValue && keyParams.mkiLength
  		      ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
  		      : '');
  		};

  		// Extracts all SDES parameters.
  		SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
  		  const lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
  		    'a=crypto:');
  		  return lines.map(SDPUtils.parseCryptoLine);
  		};

  		// Parses ICE information from SDP media section or sessionpart.
  		// FIXME: for consistency with other functions this should only
  		//   get the ice-ufrag and ice-pwd lines as input.
  		SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  		  const ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
  		    'a=ice-ufrag:')[0];
  		  const pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
  		    'a=ice-pwd:')[0];
  		  if (!(ufrag && pwd)) {
  		    return null;
  		  }
  		  return {
  		    usernameFragment: ufrag.substring(12),
  		    password: pwd.substring(10),
  		  };
  		};

  		// Serializes ICE parameters to SDP.
  		SDPUtils.writeIceParameters = function(params) {
  		  let sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
  		      'a=ice-pwd:' + params.password + '\r\n';
  		  if (params.iceLite) {
  		    sdp += 'a=ice-lite\r\n';
  		  }
  		  return sdp;
  		};

  		// Parses the SDP media section and returns RTCRtpParameters.
  		SDPUtils.parseRtpParameters = function(mediaSection) {
  		  const description = {
  		    codecs: [],
  		    headerExtensions: [],
  		    fecMechanisms: [],
  		    rtcp: [],
  		  };
  		  const lines = SDPUtils.splitLines(mediaSection);
  		  const mline = lines[0].split(' ');
  		  description.profile = mline[2];
  		  for (let i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
  		    const pt = mline[i];
  		    const rtpmapline = SDPUtils.matchPrefix(
  		      mediaSection, 'a=rtpmap:' + pt + ' ')[0];
  		    if (rtpmapline) {
  		      const codec = SDPUtils.parseRtpMap(rtpmapline);
  		      const fmtps = SDPUtils.matchPrefix(
  		        mediaSection, 'a=fmtp:' + pt + ' ');
  		      // Only the first a=fmtp:<pt> is considered.
  		      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
  		      codec.rtcpFeedback = SDPUtils.matchPrefix(
  		        mediaSection, 'a=rtcp-fb:' + pt + ' ')
  		        .map(SDPUtils.parseRtcpFb);
  		      description.codecs.push(codec);
  		      // parse FEC mechanisms from rtpmap lines.
  		      switch (codec.name.toUpperCase()) {
  		        case 'RED':
  		        case 'ULPFEC':
  		          description.fecMechanisms.push(codec.name.toUpperCase());
  		          break;
  		      }
  		    }
  		  }
  		  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(line => {
  		    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  		  });
  		  const wildcardRtcpFb = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:* ')
  		    .map(SDPUtils.parseRtcpFb);
  		  description.codecs.forEach(codec => {
  		    wildcardRtcpFb.forEach(fb=> {
  		      const duplicate = codec.rtcpFeedback.find(existingFeedback => {
  		        return existingFeedback.type === fb.type &&
  		          existingFeedback.parameter === fb.parameter;
  		      });
  		      if (!duplicate) {
  		        codec.rtcpFeedback.push(fb);
  		      }
  		    });
  		  });
  		  // FIXME: parse rtcp.
  		  return description;
  		};

  		// Generates parts of the SDP media section describing the capabilities /
  		// parameters.
  		SDPUtils.writeRtpDescription = function(kind, caps) {
  		  let sdp = '';

  		  // Build the mline.
  		  sdp += 'm=' + kind + ' ';
  		  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  		  sdp += ' ' + (caps.profile || 'UDP/TLS/RTP/SAVPF') + ' ';
  		  sdp += caps.codecs.map(codec => {
  		    if (codec.preferredPayloadType !== undefined) {
  		      return codec.preferredPayloadType;
  		    }
  		    return codec.payloadType;
  		  }).join(' ') + '\r\n';

  		  sdp += 'c=IN IP4 0.0.0.0\r\n';
  		  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  		  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  		  caps.codecs.forEach(codec => {
  		    sdp += SDPUtils.writeRtpMap(codec);
  		    sdp += SDPUtils.writeFmtp(codec);
  		    sdp += SDPUtils.writeRtcpFb(codec);
  		  });
  		  let maxptime = 0;
  		  caps.codecs.forEach(codec => {
  		    if (codec.maxptime > maxptime) {
  		      maxptime = codec.maxptime;
  		    }
  		  });
  		  if (maxptime > 0) {
  		    sdp += 'a=maxptime:' + maxptime + '\r\n';
  		  }

  		  if (caps.headerExtensions) {
  		    caps.headerExtensions.forEach(extension => {
  		      sdp += SDPUtils.writeExtmap(extension);
  		    });
  		  }
  		  // FIXME: write fecMechanisms.
  		  return sdp;
  		};

  		// Parses the SDP media section and returns an array of
  		// RTCRtpEncodingParameters.
  		SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  		  const encodingParameters = [];
  		  const description = SDPUtils.parseRtpParameters(mediaSection);
  		  const hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  		  const hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  		  // filter a=ssrc:... cname:, ignore PlanB-msid
  		  const ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  		    .map(line => SDPUtils.parseSsrcMedia(line))
  		    .filter(parts => parts.attribute === 'cname');
  		  const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  		  let secondarySsrc;

  		  const flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  		    .map(line => {
  		      const parts = line.substring(17).split(' ');
  		      return parts.map(part => parseInt(part, 10));
  		    });
  		  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
  		    secondarySsrc = flows[0][1];
  		  }

  		  description.codecs.forEach(codec => {
  		    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
  		      let encParam = {
  		        ssrc: primarySsrc,
  		        codecPayloadType: parseInt(codec.parameters.apt, 10),
  		      };
  		      if (primarySsrc && secondarySsrc) {
  		        encParam.rtx = {ssrc: secondarySsrc};
  		      }
  		      encodingParameters.push(encParam);
  		      if (hasRed) {
  		        encParam = JSON.parse(JSON.stringify(encParam));
  		        encParam.fec = {
  		          ssrc: primarySsrc,
  		          mechanism: hasUlpfec ? 'red+ulpfec' : 'red',
  		        };
  		        encodingParameters.push(encParam);
  		      }
  		    }
  		  });
  		  if (encodingParameters.length === 0 && primarySsrc) {
  		    encodingParameters.push({
  		      ssrc: primarySsrc,
  		    });
  		  }

  		  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  		  let bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  		  if (bandwidth.length) {
  		    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
  		      bandwidth = parseInt(bandwidth[0].substring(7), 10);
  		    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
  		      // use formula from JSEP to convert b=AS to TIAS value.
  		      bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1000 * 0.95
  		          - (50 * 40 * 8);
  		    } else {
  		      bandwidth = undefined;
  		    }
  		    encodingParameters.forEach(params => {
  		      params.maxBitrate = bandwidth;
  		    });
  		  }
  		  return encodingParameters;
  		};

  		// parses http://draft.ortc.org/#rtcrtcpparameters*
  		SDPUtils.parseRtcpParameters = function(mediaSection) {
  		  const rtcpParameters = {};

  		  // Gets the first SSRC. Note that with RTX there might be multiple
  		  // SSRCs.
  		  const remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  		    .map(line => SDPUtils.parseSsrcMedia(line))
  		    .filter(obj => obj.attribute === 'cname')[0];
  		  if (remoteSsrc) {
  		    rtcpParameters.cname = remoteSsrc.value;
  		    rtcpParameters.ssrc = remoteSsrc.ssrc;
  		  }

  		  // Edge uses the compound attribute instead of reducedSize
  		  // compound is !reducedSize
  		  const rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  		  rtcpParameters.reducedSize = rsize.length > 0;
  		  rtcpParameters.compound = rsize.length === 0;

  		  // parses the rtcp-mux attrіbute.
  		  // Note that Edge does not support unmuxed RTCP.
  		  const mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  		  rtcpParameters.mux = mux.length > 0;

  		  return rtcpParameters;
  		};

  		SDPUtils.writeRtcpParameters = function(rtcpParameters) {
  		  let sdp = '';
  		  if (rtcpParameters.reducedSize) {
  		    sdp += 'a=rtcp-rsize\r\n';
  		  }
  		  if (rtcpParameters.mux) {
  		    sdp += 'a=rtcp-mux\r\n';
  		  }
  		  if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) {
  		    sdp += 'a=ssrc:' + rtcpParameters.ssrc +
  		      ' cname:' + rtcpParameters.cname + '\r\n';
  		  }
  		  return sdp;
  		};


  		// parses either a=msid: or a=ssrc:... msid lines and returns
  		// the id of the MediaStream and MediaStreamTrack.
  		SDPUtils.parseMsid = function(mediaSection) {
  		  let parts;
  		  const spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  		  if (spec.length === 1) {
  		    parts = spec[0].substring(7).split(' ');
  		    return {stream: parts[0], track: parts[1]};
  		  }
  		  const planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  		    .map(line => SDPUtils.parseSsrcMedia(line))
  		    .filter(msidParts => msidParts.attribute === 'msid');
  		  if (planB.length > 0) {
  		    parts = planB[0].value.split(' ');
  		    return {stream: parts[0], track: parts[1]};
  		  }
  		};

  		// SCTP
  		// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
  		// to draft-ietf-mmusic-sctp-sdp-05
  		SDPUtils.parseSctpDescription = function(mediaSection) {
  		  const mline = SDPUtils.parseMLine(mediaSection);
  		  const maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  		  let maxMessageSize;
  		  if (maxSizeLine.length > 0) {
  		    maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
  		  }
  		  if (isNaN(maxMessageSize)) {
  		    maxMessageSize = 65536;
  		  }
  		  const sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
  		  if (sctpPort.length > 0) {
  		    return {
  		      port: parseInt(sctpPort[0].substring(12), 10),
  		      protocol: mline.fmt,
  		      maxMessageSize,
  		    };
  		  }
  		  const sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
  		  if (sctpMapLines.length > 0) {
  		    const parts = sctpMapLines[0]
  		      .substring(10)
  		      .split(' ');
  		    return {
  		      port: parseInt(parts[0], 10),
  		      protocol: parts[1],
  		      maxMessageSize,
  		    };
  		  }
  		};

  		// SCTP
  		// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
  		// support by now receiving in this format, unless we originally parsed
  		// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
  		// protocol of DTLS/SCTP -- without UDP/ or TCP/)
  		SDPUtils.writeSctpDescription = function(media, sctp) {
  		  let output = [];
  		  if (media.protocol !== 'DTLS/SCTP') {
  		    output = [
  		      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
  		      'c=IN IP4 0.0.0.0\r\n',
  		      'a=sctp-port:' + sctp.port + '\r\n',
  		    ];
  		  } else {
  		    output = [
  		      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
  		      'c=IN IP4 0.0.0.0\r\n',
  		      'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n',
  		    ];
  		  }
  		  if (sctp.maxMessageSize !== undefined) {
  		    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  		  }
  		  return output.join('');
  		};

  		// Generate a session ID for SDP.
  		// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
  		// recommends using a cryptographically random +ve 64-bit value
  		// but right now this should be acceptable and within the right range
  		SDPUtils.generateSessionId = function() {
  		  return Math.random().toString().substr(2, 22);
  		};

  		// Write boiler plate for start of SDP
  		// sessId argument is optional - if not supplied it will
  		// be generated randomly
  		// sessVersion is optional and defaults to 2
  		// sessUser is optional and defaults to 'thisisadapterortc'
  		SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
  		  let sessionId;
  		  const version = sessVer !== undefined ? sessVer : 2;
  		  if (sessId) {
  		    sessionId = sessId;
  		  } else {
  		    sessionId = SDPUtils.generateSessionId();
  		  }
  		  const user = sessUser || 'thisisadapterortc';
  		  // FIXME: sess-id should be an NTP timestamp.
  		  return 'v=0\r\n' +
  		      'o=' + user + ' ' + sessionId + ' ' + version +
  		        ' IN IP4 127.0.0.1\r\n' +
  		      's=-\r\n' +
  		      't=0 0\r\n';
  		};

  		// Gets the direction from the mediaSection or the sessionpart.
  		SDPUtils.getDirection = function(mediaSection, sessionpart) {
  		  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  		  const lines = SDPUtils.splitLines(mediaSection);
  		  for (let i = 0; i < lines.length; i++) {
  		    switch (lines[i]) {
  		      case 'a=sendrecv':
  		      case 'a=sendonly':
  		      case 'a=recvonly':
  		      case 'a=inactive':
  		        return lines[i].substring(2);
  		        // FIXME: What should happen here?
  		    }
  		  }
  		  if (sessionpart) {
  		    return SDPUtils.getDirection(sessionpart);
  		  }
  		  return 'sendrecv';
  		};

  		SDPUtils.getKind = function(mediaSection) {
  		  const lines = SDPUtils.splitLines(mediaSection);
  		  const mline = lines[0].split(' ');
  		  return mline[0].substring(2);
  		};

  		SDPUtils.isRejected = function(mediaSection) {
  		  return mediaSection.split(' ', 2)[1] === '0';
  		};

  		SDPUtils.parseMLine = function(mediaSection) {
  		  const lines = SDPUtils.splitLines(mediaSection);
  		  const parts = lines[0].substring(2).split(' ');
  		  return {
  		    kind: parts[0],
  		    port: parseInt(parts[1], 10),
  		    protocol: parts[2],
  		    fmt: parts.slice(3).join(' '),
  		  };
  		};

  		SDPUtils.parseOLine = function(mediaSection) {
  		  const line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  		  const parts = line.substring(2).split(' ');
  		  return {
  		    username: parts[0],
  		    sessionId: parts[1],
  		    sessionVersion: parseInt(parts[2], 10),
  		    netType: parts[3],
  		    addressType: parts[4],
  		    address: parts[5],
  		  };
  		};

  		// a very naive interpretation of a valid SDP.
  		SDPUtils.isValidSDP = function(blob) {
  		  if (typeof blob !== 'string' || blob.length === 0) {
  		    return false;
  		  }
  		  const lines = SDPUtils.splitLines(blob);
  		  for (let i = 0; i < lines.length; i++) {
  		    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
  		      return false;
  		    }
  		    // TODO: check the modifier a bit more.
  		  }
  		  return true;
  		};

  		// Expose public methods.
  		{
  		  module.exports = SDPUtils;
  		} 
  	} (sdp$1));
  	return sdp$1.exports;
  }

  var sdpExports = requireSdp();
  var SDPUtils = /*@__PURE__*/getDefaultExportFromCjs(sdpExports);

  var sdp = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    'default': SDPUtils
  }, [sdpExports]);

  /*
   *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  function shimRTCIceCandidate(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
        window.RTCIceCandidate.prototype)) {
      return;
    }

    const NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function RTCIceCandidate(args) {
      // Remove the a= which shouldn't be part of the candidate string.
      if (typeof args === 'object' && args.candidate &&
          args.candidate.indexOf('a=') === 0) {
        args = JSON.parse(JSON.stringify(args));
        args.candidate = args.candidate.substring(2);
      }

      if (args.candidate && args.candidate.length) {
        // Augment the native candidate with the parsed fields.
        const nativeCandidate = new NativeRTCIceCandidate(args);
        const parsedCandidate = SDPUtils.parseCandidate(args.candidate);
        for (const key in parsedCandidate) {
          if (!(key in nativeCandidate)) {
            Object.defineProperty(nativeCandidate, key,
              {value: parsedCandidate[key]});
          }
        }

        // Override serializer to not serialize the extra attributes.
        nativeCandidate.toJSON = function toJSON() {
          return {
            candidate: nativeCandidate.candidate,
            sdpMid: nativeCandidate.sdpMid,
            sdpMLineIndex: nativeCandidate.sdpMLineIndex,
            usernameFragment: nativeCandidate.usernameFragment,
          };
        };
        return nativeCandidate;
      }
      return new NativeRTCIceCandidate(args);
    };
    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    wrapPeerConnectionEvent(window, 'icecandidate', e => {
      if (e.candidate) {
        Object.defineProperty(e, 'candidate', {
          value: new window.RTCIceCandidate(e.candidate),
          writable: 'false'
        });
      }
      return e;
    });
  }

  function shimRTCIceCandidateRelayProtocol(window) {
    if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'relayProtocol' in
        window.RTCIceCandidate.prototype)) {
      return;
    }

    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    wrapPeerConnectionEvent(window, 'icecandidate', e => {
      if (e.candidate) {
        const parsedCandidate = SDPUtils.parseCandidate(e.candidate.candidate);
        if (parsedCandidate.type === 'relay') {
          // This is a libwebrtc-specific mapping of local type preference
          // to relayProtocol.
          e.candidate.relayProtocol = {
            0: 'tls',
            1: 'tcp',
            2: 'udp',
          }[parsedCandidate.priority >> 24];
        }
      }
      return e;
    });
  }

  function shimMaxMessageSize(window, browserDetails) {
    if (!window.RTCPeerConnection) {
      return;
    }

    if (!('sctp' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
        get() {
          return typeof this._sctp === 'undefined' ? null : this._sctp;
        }
      });
    }

    const sctpInDescription = function(description) {
      if (!description || !description.sdp) {
        return false;
      }
      const sections = SDPUtils.splitSections(description.sdp);
      sections.shift();
      return sections.some(mediaSection => {
        const mLine = SDPUtils.parseMLine(mediaSection);
        return mLine && mLine.kind === 'application'
            && mLine.protocol.indexOf('SCTP') !== -1;
      });
    };

    const getRemoteFirefoxVersion = function(description) {
      // TODO: Is there a better solution for detecting Firefox?
      const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (match === null || match.length < 2) {
        return -1;
      }
      const version = parseInt(match[1], 10);
      // Test for NaN (yes, this is ugly)
      return version !== version ? -1 : version;
    };

    const getCanSendMaxMessageSize = function(remoteIsFirefox) {
      // Every implementation we know can send at least 64 KiB.
      // Note: Although Chrome is technically able to send up to 256 KiB, the
      //       data does not reach the other peer reliably.
      //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
      let canSendMaxMessageSize = 65536;
      if (browserDetails.browser === 'firefox') {
        if (browserDetails.version < 57) {
          if (remoteIsFirefox === -1) {
            // FF < 57 will send in 16 KiB chunks using the deprecated PPID
            // fragmentation.
            canSendMaxMessageSize = 16384;
          } else {
            // However, other FF (and RAWRTC) can reassemble PPID-fragmented
            // messages. Thus, supporting ~2 GiB when sending.
            canSendMaxMessageSize = 2147483637;
          }
        } else if (browserDetails.version < 60) {
          // Currently, all FF >= 57 will reset the remote maximum message size
          // to the default value when a data channel is created at a later
          // stage. :(
          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
          canSendMaxMessageSize =
            browserDetails.version === 57 ? 65535 : 65536;
        } else {
          // FF >= 60 supports sending ~2 GiB
          canSendMaxMessageSize = 2147483637;
        }
      }
      return canSendMaxMessageSize;
    };

    const getMaxMessageSize = function(description, remoteIsFirefox) {
      // Note: 65536 bytes is the default value from the SDP spec. Also,
      //       every implementation we know supports receiving 65536 bytes.
      let maxMessageSize = 65536;

      // FF 57 has a slightly incorrect default remote max message size, so
      // we need to adjust it here to avoid a failure when sending.
      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
      if (browserDetails.browser === 'firefox'
           && browserDetails.version === 57) {
        maxMessageSize = 65535;
      }

      const match = SDPUtils.matchPrefix(description.sdp,
        'a=max-message-size:');
      if (match.length > 0) {
        maxMessageSize = parseInt(match[0].substring(19), 10);
      } else if (browserDetails.browser === 'firefox' &&
                  remoteIsFirefox !== -1) {
        // If the maximum message size is not present in the remote SDP and
        // both local and remote are Firefox, the remote peer can receive
        // ~2 GiB.
        maxMessageSize = 2147483637;
      }
      return maxMessageSize;
    };

    const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        this._sctp = null;
        // Chrome decided to not expose .sctp in plan-b mode.
        // As usual, adapter.js has to do an 'ugly worakaround'
        // to cover up the mess.
        if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
          const {sdpSemantics} = this.getConfiguration();
          if (sdpSemantics === 'plan-b') {
            Object.defineProperty(this, 'sctp', {
              get() {
                return typeof this._sctp === 'undefined' ? null : this._sctp;
              },
              enumerable: true,
              configurable: true,
            });
          }
        }

        if (sctpInDescription(arguments[0])) {
          // Check if the remote is FF.
          const isFirefox = getRemoteFirefoxVersion(arguments[0]);

          // Get the maximum message size the local peer is capable of sending
          const canSendMMS = getCanSendMaxMessageSize(isFirefox);

          // Get the maximum message size of the remote peer.
          const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

          // Determine final maximum message size
          let maxMessageSize;
          if (canSendMMS === 0 && remoteMMS === 0) {
            maxMessageSize = Number.POSITIVE_INFINITY;
          } else if (canSendMMS === 0 || remoteMMS === 0) {
            maxMessageSize = Math.max(canSendMMS, remoteMMS);
          } else {
            maxMessageSize = Math.min(canSendMMS, remoteMMS);
          }

          // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
          // attribute.
          const sctp = {};
          Object.defineProperty(sctp, 'maxMessageSize', {
            get() {
              return maxMessageSize;
            }
          });
          this._sctp = sctp;
        }

        return origSetRemoteDescription.apply(this, arguments);
      };
  }

  function shimSendThrowTypeError(window) {
    if (!(window.RTCPeerConnection &&
        'createDataChannel' in window.RTCPeerConnection.prototype)) {
      return;
    }

    // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

    function wrapDcSend(dc, pc) {
      const origDataChannelSend = dc.send;
      dc.send = function send() {
        const data = arguments[0];
        const length = data.length || data.size || data.byteLength;
        if (dc.readyState === 'open' &&
            pc.sctp && length > pc.sctp.maxMessageSize) {
          throw new TypeError('Message too large (can send a maximum of ' +
            pc.sctp.maxMessageSize + ' bytes)');
        }
        return origDataChannelSend.apply(dc, arguments);
      };
    }
    const origCreateDataChannel =
      window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel =
      function createDataChannel() {
        const dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
      };
    wrapPeerConnectionEvent(window, 'datachannel', e => {
      wrapDcSend(e.channel, e.target);
      return e;
    });
  }


  /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
   * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
   * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
   * since DTLS failures would be hidden. See
   * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
   * for the Firefox tracking bug.
   */
  function shimConnectionState(window) {
    if (!window.RTCPeerConnection ||
        'connectionState' in window.RTCPeerConnection.prototype) {
      return;
    }
    const proto = window.RTCPeerConnection.prototype;
    Object.defineProperty(proto, 'connectionState', {
      get() {
        return {
          completed: 'connected',
          checking: 'connecting'
        }[this.iceConnectionState] || this.iceConnectionState;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(proto, 'onconnectionstatechange', {
      get() {
        return this._onconnectionstatechange || null;
      },
      set(cb) {
        if (this._onconnectionstatechange) {
          this.removeEventListener('connectionstatechange',
            this._onconnectionstatechange);
          delete this._onconnectionstatechange;
        }
        if (cb) {
          this.addEventListener('connectionstatechange',
            this._onconnectionstatechange = cb);
        }
      },
      enumerable: true,
      configurable: true
    });

    ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
      const origMethod = proto[method];
      proto[method] = function() {
        if (!this._connectionstatechangepoly) {
          this._connectionstatechangepoly = e => {
            const pc = e.target;
            if (pc._lastConnectionState !== pc.connectionState) {
              pc._lastConnectionState = pc.connectionState;
              const newEvent = new Event('connectionstatechange', e);
              pc.dispatchEvent(newEvent);
            }
            return e;
          };
          this.addEventListener('iceconnectionstatechange',
            this._connectionstatechangepoly);
        }
        return origMethod.apply(this, arguments);
      };
    });
  }

  function removeExtmapAllowMixed(window, browserDetails) {
    /* remove a=extmap-allow-mixed for webrtc.org < M71 */
    if (!window.RTCPeerConnection) {
      return;
    }
    if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
      return;
    }
    if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
      return;
    }
    const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
    function setRemoteDescription(desc) {
      if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
        const sdp = desc.sdp.split('\n').filter((line) => {
          return line.trim() !== 'a=extmap-allow-mixed';
        }).join('\n');
        // Safari enforces read-only-ness of RTCSessionDescription fields.
        if (window.RTCSessionDescription &&
            desc instanceof window.RTCSessionDescription) {
          arguments[0] = new window.RTCSessionDescription({
            type: desc.type,
            sdp,
          });
        } else {
          desc.sdp = sdp;
        }
      }
      return nativeSRD.apply(this, arguments);
    };
  }

  function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
    // Support for addIceCandidate(null or undefined)
    // as well as addIceCandidate({candidate: "", ...})
    // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
    // Note: must be called before other polyfills which change the signature.
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
      return;
    }
    const nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
      return;
    }
    window.RTCPeerConnection.prototype.addIceCandidate =
      function addIceCandidate() {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        // Native support for ignoring exists for Chrome M77+.
        // Safari ignores as well, exact version unknown but works in the same
        // version that also ignores addIceCandidate(null).
        if (((browserDetails.browser === 'chrome' && browserDetails.version < 78)
             || (browserDetails.browser === 'firefox'
                 && browserDetails.version < 68)
             || (browserDetails.browser === 'safari'))
            && arguments[0] && arguments[0].candidate === '') {
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
  }

  // Note: Make sure to call this ahead of APIs that modify
  // setLocalDescription.length
  function shimParameterlessSetLocalDescription(window, browserDetails) {
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
      return;
    }
    const nativeSetLocalDescription =
        window.RTCPeerConnection.prototype.setLocalDescription;
    if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
      return;
    }
    window.RTCPeerConnection.prototype.setLocalDescription =
      function setLocalDescription() {
        let desc = arguments[0] || {};
        if (typeof desc !== 'object' || (desc.type && desc.sdp)) {
          return nativeSetLocalDescription.apply(this, arguments);
        }
        // The remaining steps should technically happen when SLD comes off the
        // RTCPeerConnection's operations chain (not ahead of going on it), but
        // this is too difficult to shim. Instead, this shim only covers the
        // common case where the operations chain is empty. This is imperfect, but
        // should cover many cases. Rationale: Even if we can't reduce the glare
        // window to zero on imperfect implementations, there's value in tapping
        // into the perfect negotiation pattern that several browsers support.
        desc = {type: desc.type, sdp: desc.sdp};
        if (!desc.type) {
          switch (this.signalingState) {
            case 'stable':
            case 'have-local-offer':
            case 'have-remote-pranswer':
              desc.type = 'offer';
              break;
            default:
              desc.type = 'answer';
              break;
          }
        }
        if (desc.sdp || (desc.type !== 'offer' && desc.type !== 'answer')) {
          return nativeSetLocalDescription.apply(this, [desc]);
        }
        const func = desc.type === 'offer' ? this.createOffer : this.createAnswer;
        return func.apply(this)
          .then(d => nativeSetLocalDescription.apply(this, [d]));
      };
  }

  var commonShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shimRTCIceCandidate: shimRTCIceCandidate,
    shimRTCIceCandidateRelayProtocol: shimRTCIceCandidateRelayProtocol,
    shimMaxMessageSize: shimMaxMessageSize,
    shimSendThrowTypeError: shimSendThrowTypeError,
    shimConnectionState: shimConnectionState,
    removeExtmapAllowMixed: removeExtmapAllowMixed,
    shimAddIceCandidateNullOrEmpty: shimAddIceCandidateNullOrEmpty,
    shimParameterlessSetLocalDescription: shimParameterlessSetLocalDescription
  });

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  // Shimming starts here.
  function adapterFactory({window} = {}, options = {
    shimChrome: true,
    shimFirefox: true,
    shimSafari: true,
  }) {
    // Utils.
    const logging = log;
    const browserDetails = detectBrowser(window);

    const adapter = {
      browserDetails,
      commonShim,
      extractVersion: extractVersion,
      disableLog: disableLog,
      disableWarnings: disableWarnings,
      // Expose sdp as a convenience. For production apps include directly.
      sdp,
    };

    // Shim browser if found.
    switch (browserDetails.browser) {
      case 'chrome':
        if (!chromeShim || !shimPeerConnection$1 ||
            !options.shimChrome) {
          logging('Chrome shim is not included in this adapter release.');
          return adapter;
        }
        if (browserDetails.version === null) {
          logging('Chrome shim can not determine version, not shimming.');
          return adapter;
        }
        logging('adapter.js shimming chrome.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = chromeShim;

        // Must be called before shimPeerConnection.
        shimAddIceCandidateNullOrEmpty(window, browserDetails);
        shimParameterlessSetLocalDescription(window);

        shimGetUserMedia$2(window, browserDetails);
        shimMediaStream(window);
        shimPeerConnection$1(window, browserDetails);
        shimOnTrack$1(window);
        shimAddTrackRemoveTrack(window, browserDetails);
        shimGetSendersWithDtmf(window);
        shimSenderReceiverGetStats(window);
        fixNegotiationNeeded(window, browserDetails);

        shimRTCIceCandidate(window);
        shimRTCIceCandidateRelayProtocol(window);
        shimConnectionState(window);
        shimMaxMessageSize(window, browserDetails);
        shimSendThrowTypeError(window);
        removeExtmapAllowMixed(window, browserDetails);
        break;
      case 'firefox':
        if (!firefoxShim || !shimPeerConnection ||
            !options.shimFirefox) {
          logging('Firefox shim is not included in this adapter release.');
          return adapter;
        }
        logging('adapter.js shimming firefox.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = firefoxShim;

        // Must be called before shimPeerConnection.
        shimAddIceCandidateNullOrEmpty(window, browserDetails);
        shimParameterlessSetLocalDescription(window);

        shimGetUserMedia$1(window, browserDetails);
        shimPeerConnection(window, browserDetails);
        shimOnTrack(window);
        shimRemoveStream(window);
        shimSenderGetStats(window);
        shimReceiverGetStats(window);
        shimRTCDataChannel(window);
        shimAddTransceiver(window);
        shimGetParameters(window);
        shimCreateOffer(window);
        shimCreateAnswer(window);

        shimRTCIceCandidate(window);
        shimConnectionState(window);
        shimMaxMessageSize(window, browserDetails);
        shimSendThrowTypeError(window);
        break;
      case 'safari':
        if (!safariShim || !options.shimSafari) {
          logging('Safari shim is not included in this adapter release.');
          return adapter;
        }
        logging('adapter.js shimming safari.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = safariShim;

        // Must be called before shimCallbackAPI.
        shimAddIceCandidateNullOrEmpty(window, browserDetails);
        shimParameterlessSetLocalDescription(window);

        shimRTCIceServerUrls(window);
        shimCreateOfferLegacy(window);
        shimCallbacksAPI(window);
        shimLocalStreamsAPI(window);
        shimRemoteStreamsAPI(window);
        shimTrackEventTransceiver(window);
        shimGetUserMedia(window);
        shimAudioContext(window);

        shimRTCIceCandidate(window);
        shimRTCIceCandidateRelayProtocol(window);
        shimMaxMessageSize(window, browserDetails);
        shimSendThrowTypeError(window);
        removeExtmapAllowMixed(window, browserDetails);
        break;
      default:
        logging('Unsupported browser!');
        break;
    }

    return adapter;
  }

  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

  const adapter =
    adapterFactory({window: typeof window === 'undefined' ? undefined : window});

  function $parcel$export(e, n, v, s) {
    Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
  }
  class $fcbcc7538a6776d5$export$f1c5f4c9cb95390b {
      constructor(){
          this.chunkedMTU = 16300 // The original 60000 bytes setting does not work when sending data from Firefox to Chrome, which is "cut off" after 16384 bytes and delivered individually.
          ;
          // Binary stuff
          this._dataCount = 1;
          this.chunk = (blob)=>{
              const chunks = [];
              const size = blob.byteLength;
              const total = Math.ceil(size / this.chunkedMTU);
              let index = 0;
              let start = 0;
              while(start < size){
                  const end = Math.min(size, start + this.chunkedMTU);
                  const b = blob.slice(start, end);
                  const chunk = {
                      __peerData: this._dataCount,
                      n: index,
                      data: b,
                      total: total
                  };
                  chunks.push(chunk);
                  start = end;
                  index++;
              }
              this._dataCount++;
              return chunks;
          };
      }
  }
  function $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
      let size = 0;
      for (const buf of bufs)size += buf.byteLength;
      const result = new Uint8Array(size);
      let offset = 0;
      for (const buf of bufs){
          result.set(buf, offset);
          offset += buf.byteLength;
      }
      return result;
  }




  const $fb63e766cfafaab9$var$webRTCAdapter = //@ts-ignore
  (adapter).default || (adapter);
  const $fb63e766cfafaab9$export$25be9502477c137d = new class {
      isWebRTCSupported() {
          return typeof RTCPeerConnection !== "undefined";
      }
      isBrowserSupported() {
          const browser = this.getBrowser();
          const version = this.getVersion();
          const validBrowser = this.supportedBrowsers.includes(browser);
          if (!validBrowser) return false;
          if (browser === "chrome") return version >= this.minChromeVersion;
          if (browser === "firefox") return version >= this.minFirefoxVersion;
          if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
          return false;
      }
      getBrowser() {
          return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
      }
      getVersion() {
          return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
      }
      isUnifiedPlanSupported() {
          const browser = this.getBrowser();
          const version = $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
          if (browser === "chrome" && version < this.minChromeVersion) return false;
          if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
          if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return false;
          let tempPc;
          let supported = false;
          try {
              tempPc = new RTCPeerConnection();
              tempPc.addTransceiver("audio");
              supported = true;
          } catch (e) {} finally{
              if (tempPc) tempPc.close();
          }
          return supported;
      }
      toString() {
          return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
      }
      constructor(){
          this.isIOS = typeof navigator !== "undefined" ? [
              "iPad",
              "iPhone",
              "iPod"
          ].includes(navigator.platform) : false;
          this.supportedBrowsers = [
              "firefox",
              "chrome",
              "safari"
          ];
          this.minFirefoxVersion = 59;
          this.minChromeVersion = 72;
          this.minSafariVersion = 605;
      }
  }();


  const $9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id)=>{
      // Allow empty ids
      return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
  };


  const $0e5fd1585784c252$export$4e61f672936bec77 = ()=>Math.random().toString(36).slice(2);


  const $4f4134156c446392$var$DEFAULT_CONFIG = {
      iceServers: [
          {
              urls: "stun:stun.l.google.com:19302"
          },
          {
              urls: [
                  "turn:eu-0.turn.peerjs.com:3478",
                  "turn:us-0.turn.peerjs.com:3478"
              ],
              username: "peerjs",
              credential: "peerjsp"
          }
      ],
      sdpSemantics: "unified-plan"
  };
  class $4f4134156c446392$export$f8f26dd395d7e1bd extends ($fcbcc7538a6776d5$export$f1c5f4c9cb95390b) {
      noop() {}
      blobToArrayBuffer(blob, cb) {
          const fr = new FileReader();
          fr.onload = function(evt) {
              if (evt.target) cb(evt.target.result);
          };
          fr.readAsArrayBuffer(blob);
          return fr;
      }
      binaryStringToArrayBuffer(binary) {
          const byteArray = new Uint8Array(binary.length);
          for(let i = 0; i < binary.length; i++)byteArray[i] = binary.charCodeAt(i) & 0xff;
          return byteArray.buffer;
      }
      isSecure() {
          return location.protocol === "https:";
      }
      constructor(...args){
          super(...args);
          this.CLOUD_HOST = "0.peerjs.com";
          this.CLOUD_PORT = 443;
          // Browsers that need chunking:
          this.chunkedBrowsers = {
              Chrome: 1,
              chrome: 1
          };
          // Returns browser-agnostic default config
          this.defaultConfig = $4f4134156c446392$var$DEFAULT_CONFIG;
          this.browser = ($fb63e766cfafaab9$export$25be9502477c137d).getBrowser();
          this.browserVersion = ($fb63e766cfafaab9$export$25be9502477c137d).getVersion();
          this.pack = $0cfd7828ad59115f$export$2a703dbb0cb35339;
          this.unpack = $0cfd7828ad59115f$export$417857010dc9287f;
          /**
  	 * A hash of WebRTC features mapped to booleans that correspond to whether the feature is supported by the current browser.
  	 *
  	 * :::caution
  	 * Only the properties documented here are guaranteed to be present on `util.supports`
  	 * :::
  	 */ this.supports = function() {
              const supported = {
                  browser: ($fb63e766cfafaab9$export$25be9502477c137d).isBrowserSupported(),
                  webRTC: ($fb63e766cfafaab9$export$25be9502477c137d).isWebRTCSupported(),
                  audioVideo: false,
                  data: false,
                  binaryBlob: false,
                  reliable: false
              };
              if (!supported.webRTC) return supported;
              let pc;
              try {
                  pc = new RTCPeerConnection($4f4134156c446392$var$DEFAULT_CONFIG);
                  supported.audioVideo = true;
                  let dc;
                  try {
                      dc = pc.createDataChannel("_PEERJSTEST", {
                          ordered: true
                      });
                      supported.data = true;
                      supported.reliable = !!dc.ordered;
                      // Binary test
                      try {
                          dc.binaryType = "blob";
                          supported.binaryBlob = !(0, $fb63e766cfafaab9$export$25be9502477c137d).isIOS;
                      } catch (e) {}
                  } catch (e) {} finally{
                      if (dc) dc.close();
                  }
              } catch (e) {} finally{
                  if (pc) pc.close();
              }
              return supported;
          }();
          // Ensure alphanumeric ids
          this.validateId = ($9a84a32bf0bf36bb$export$f35f128fd59ea256);
          this.randomToken = ($0e5fd1585784c252$export$4e61f672936bec77);
      }
  }
  const $4f4134156c446392$export$7debb50ef11d5e0b = new $4f4134156c446392$export$f8f26dd395d7e1bd();



  const $257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
  var $257947e92926277a$export$243e62d78d3b544d;
  (function(LogLevel) {
      /**
  	 * Prints no logs.
  	 */ LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
      /**
  	 * Prints only errors.
  	 */ LogLevel[LogLevel["Errors"] = 1] = "Errors";
      /**
  	 * Prints errors and warnings.
  	 */ LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
      /**
  	 * Prints all logs.
  	 */ LogLevel[LogLevel["All"] = 3] = "All";
  })($257947e92926277a$export$243e62d78d3b544d || ($257947e92926277a$export$243e62d78d3b544d = {}));
  class $257947e92926277a$var$Logger {
      get logLevel() {
          return this._logLevel;
      }
      set logLevel(logLevel) {
          this._logLevel = logLevel;
      }
      log(...args) {
          if (this._logLevel >= 3) this._print(3, ...args);
      }
      warn(...args) {
          if (this._logLevel >= 2) this._print(2, ...args);
      }
      error(...args) {
          if (this._logLevel >= 1) this._print(1, ...args);
      }
      setLogFunction(fn) {
          this._print = fn;
      }
      _print(logLevel, ...rest) {
          const copy = [
              $257947e92926277a$var$LOG_PREFIX,
              ...rest
          ];
          for(const i in copy)if (copy[i] instanceof Error) copy[i] = "(" + copy[i].name + ") " + copy[i].message;
          if (logLevel >= 3) console.log(...copy);
          else if (logLevel >= 2) console.warn("WARNING", ...copy);
          else if (logLevel >= 1) console.error("ERROR", ...copy);
      }
      constructor(){
          this._logLevel = 0;
      }
  }
  var $257947e92926277a$export$2e2bcd8739ae039 = new $257947e92926277a$var$Logger();


  var $c4dcfd1d1ea86647$exports = {};
  var $c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty, $c4dcfd1d1ea86647$var$prefix = "~";
  /**
   * Constructor to create a storage for our `EE` objects.
   * An `Events` instance is a plain object whose properties are event names.
   *
   * @constructor
   * @private
   */ function $c4dcfd1d1ea86647$var$Events() {}
  //
  // We try to not inherit from `Object.prototype`. In some engines creating an
  // instance in this way is faster than calling `Object.create(null)` directly.
  // If `Object.create(null)` is not supported we prefix the event names with a
  // character to make sure that the built-in object properties are not
  // overridden or used as an attack vector.
  //
  if (Object.create) {
      $c4dcfd1d1ea86647$var$Events.prototype = Object.create(null);
      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new $c4dcfd1d1ea86647$var$Events().__proto__) $c4dcfd1d1ea86647$var$prefix = false;
  }
  /**
   * Representation of a single event listener.
   *
   * @param {Function} fn The listener function.
   * @param {*} context The context to invoke the listener with.
   * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
   * @constructor
   * @private
   */ function $c4dcfd1d1ea86647$var$EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
  }
  /**
   * Add a listener for a given event.
   *
   * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn The listener function.
   * @param {*} context The context to invoke the listener with.
   * @param {Boolean} once Specify if the listener is a one-time listener.
   * @returns {EventEmitter}
   * @private
   */ function $c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") throw new TypeError("The listener must be a function");
      var listener = new $c4dcfd1d1ea86647$var$EE(fn, context || emitter, once), evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [
          emitter._events[evt],
          listener
      ];
      return emitter;
  }
  /**
   * Clear event by name.
   *
   * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
   * @param {(String|Symbol)} evt The Event name.
   * @private
   */ function $c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new $c4dcfd1d1ea86647$var$Events();
      else delete emitter._events[evt];
  }
  /**
   * Minimal `EventEmitter` interface that is molded against the Node.js
   * `EventEmitter` interface.
   *
   * @constructor
   * @public
   */ function $c4dcfd1d1ea86647$var$EventEmitter() {
      this._events = new $c4dcfd1d1ea86647$var$Events();
      this._eventsCount = 0;
  }
  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   *
   * @returns {Array}
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for(name in events = this._events)if ($c4dcfd1d1ea86647$var$has.call(events, name)) names.push($c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
      if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
      return names;
  };
  /**
   * Return the listeners registered for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @returns {Array} The registered listeners.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [
          handlers.fn
      ];
      for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)ee[i] = handlers[i].fn;
      return ee;
  };
  /**
   * Return the number of listeners listening to a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @returns {Number} The number of listeners.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
  };
  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @returns {Boolean} `true` if the event had listeners, else `false`.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
          if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
          switch(len){
              case 1:
                  return listeners.fn.call(listeners.context), true;
              case 2:
                  return listeners.fn.call(listeners.context, a1), true;
              case 3:
                  return listeners.fn.call(listeners.context, a1, a2), true;
              case 4:
                  return listeners.fn.call(listeners.context, a1, a2, a3), true;
              case 5:
                  return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
              case 6:
                  return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for(i = 1, args = new Array(len - 1); i < len; i++)args[i - 1] = arguments[i];
          listeners.fn.apply(listeners.context, args);
      } else {
          var length = listeners.length, j;
          for(i = 0; i < length; i++){
              if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
              switch(len){
                  case 1:
                      listeners[i].fn.call(listeners[i].context);
                      break;
                  case 2:
                      listeners[i].fn.call(listeners[i].context, a1);
                      break;
                  case 3:
                      listeners[i].fn.call(listeners[i].context, a1, a2);
                      break;
                  case 4:
                      listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                      break;
                  default:
                      if (!args) for(j = 1, args = new Array(len - 1); j < len; j++)args[j - 1] = arguments[j];
                      listeners[i].fn.apply(listeners[i].context, args);
              }
          }
      }
      return true;
  };
  /**
   * Add a listener for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn The listener function.
   * @param {*} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
      return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
  };
  /**
   * Add a one-time listener for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn The listener function.
   * @param {*} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
      return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
  };
  /**
   * Remove the listeners of a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn Only remove the listeners that match this function.
   * @param {*} context Only remove the listeners that have this context.
   * @param {Boolean} once Only remove one-time listeners.
   * @returns {EventEmitter} `this`.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
          $c4dcfd1d1ea86647$var$clearEvent(this, evt);
          return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      } else {
          for(var i = 0, events = [], length = listeners.length; i < length; i++)if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
          //
          // Reset the array, or remove it completely if we have no more listeners.
          //
          if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
          else $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      }
      return this;
  };
  /**
   * Remove all listeners, or those of the specified event.
   *
   * @param {(String|Symbol)} [event] The event name.
   * @returns {EventEmitter} `this`.
   * @public
   */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
          evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
          if (this._events[evt]) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      } else {
          this._events = new $c4dcfd1d1ea86647$var$Events();
          this._eventsCount = 0;
      }
      return this;
  };
  //
  // Alias methods names because people roll like that.
  //
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
  //
  // Expose the prefix.
  //
  $c4dcfd1d1ea86647$var$EventEmitter.prefixed = $c4dcfd1d1ea86647$var$prefix;
  //
  // Allow `EventEmitter` to be imported as module namespace.
  //
  $c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $c4dcfd1d1ea86647$var$EventEmitter;
  $c4dcfd1d1ea86647$exports = $c4dcfd1d1ea86647$var$EventEmitter;



  var $78455e22dea96b8c$exports = {};

  $parcel$export($78455e22dea96b8c$exports, "ConnectionType", () => $78455e22dea96b8c$export$3157d57b4135e3bc);
  $parcel$export($78455e22dea96b8c$exports, "PeerErrorType", () => $78455e22dea96b8c$export$9547aaa2e39030ff);
  $parcel$export($78455e22dea96b8c$exports, "BaseConnectionErrorType", () => $78455e22dea96b8c$export$7974935686149686);
  $parcel$export($78455e22dea96b8c$exports, "DataConnectionErrorType", () => $78455e22dea96b8c$export$49ae800c114df41d);
  $parcel$export($78455e22dea96b8c$exports, "SerializationType", () => $78455e22dea96b8c$export$89f507cf986a947);
  $parcel$export($78455e22dea96b8c$exports, "SocketEventType", () => $78455e22dea96b8c$export$3b5c4a4b6354f023);
  $parcel$export($78455e22dea96b8c$exports, "ServerMessageType", () => $78455e22dea96b8c$export$adb4a1754da6f10d);
  var $78455e22dea96b8c$export$3157d57b4135e3bc;
  (function(ConnectionType) {
      ConnectionType["Data"] = "data";
      ConnectionType["Media"] = "media";
  })($78455e22dea96b8c$export$3157d57b4135e3bc || ($78455e22dea96b8c$export$3157d57b4135e3bc = {}));
  var $78455e22dea96b8c$export$9547aaa2e39030ff;
  (function(PeerErrorType) {
      /**
  	 * The client's browser does not support some or all WebRTC features that you are trying to use.
  	 */ PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
      /**
  	 * You've already disconnected this peer from the server and can no longer make any new connections on it.
  	 */ PeerErrorType["Disconnected"] = "disconnected";
      /**
  	 * The ID passed into the Peer constructor contains illegal characters.
  	 */ PeerErrorType["InvalidID"] = "invalid-id";
      /**
  	 * The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
  	 */ PeerErrorType["InvalidKey"] = "invalid-key";
      /**
  	 * Lost or cannot establish a connection to the signalling server.
  	 */ PeerErrorType["Network"] = "network";
      /**
  	 * The peer you're trying to connect to does not exist.
  	 */ PeerErrorType["PeerUnavailable"] = "peer-unavailable";
      /**
  	 * PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
  	 */ PeerErrorType["SslUnavailable"] = "ssl-unavailable";
      /**
  	 * Unable to reach the server.
  	 */ PeerErrorType["ServerError"] = "server-error";
      /**
  	 * An error from the underlying socket.
  	 */ PeerErrorType["SocketError"] = "socket-error";
      /**
  	 * The underlying socket closed unexpectedly.
  	 */ PeerErrorType["SocketClosed"] = "socket-closed";
      /**
  	 * The ID passed into the Peer constructor is already taken.
  	 *
  	 * :::caution
  	 * This error is not fatal if your peer has open peer-to-peer connections.
  	 * This can happen if you attempt to {@apilink Peer.reconnect} a peer that has been disconnected from the server,
  	 * but its old ID has now been taken.
  	 * :::
  	 */ PeerErrorType["UnavailableID"] = "unavailable-id";
      /**
  	 * Native WebRTC errors.
  	 */ PeerErrorType["WebRTC"] = "webrtc";
  })($78455e22dea96b8c$export$9547aaa2e39030ff || ($78455e22dea96b8c$export$9547aaa2e39030ff = {}));
  var $78455e22dea96b8c$export$7974935686149686;
  (function(BaseConnectionErrorType) {
      BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
      BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
  })($78455e22dea96b8c$export$7974935686149686 || ($78455e22dea96b8c$export$7974935686149686 = {}));
  var $78455e22dea96b8c$export$49ae800c114df41d;
  (function(DataConnectionErrorType) {
      DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
      DataConnectionErrorType["MessageToBig"] = "message-too-big";
  })($78455e22dea96b8c$export$49ae800c114df41d || ($78455e22dea96b8c$export$49ae800c114df41d = {}));
  var $78455e22dea96b8c$export$89f507cf986a947;
  (function(SerializationType) {
      SerializationType["Binary"] = "binary";
      SerializationType["BinaryUTF8"] = "binary-utf8";
      SerializationType["JSON"] = "json";
      SerializationType["None"] = "raw";
  })($78455e22dea96b8c$export$89f507cf986a947 || ($78455e22dea96b8c$export$89f507cf986a947 = {}));
  var $78455e22dea96b8c$export$3b5c4a4b6354f023;
  (function(SocketEventType) {
      SocketEventType["Message"] = "message";
      SocketEventType["Disconnected"] = "disconnected";
      SocketEventType["Error"] = "error";
      SocketEventType["Close"] = "close";
  })($78455e22dea96b8c$export$3b5c4a4b6354f023 || ($78455e22dea96b8c$export$3b5c4a4b6354f023 = {}));
  var $78455e22dea96b8c$export$adb4a1754da6f10d;
  (function(ServerMessageType) {
      ServerMessageType["Heartbeat"] = "HEARTBEAT";
      ServerMessageType["Candidate"] = "CANDIDATE";
      ServerMessageType["Offer"] = "OFFER";
      ServerMessageType["Answer"] = "ANSWER";
      ServerMessageType["Open"] = "OPEN";
      ServerMessageType["Error"] = "ERROR";
      ServerMessageType["IdTaken"] = "ID-TAKEN";
      ServerMessageType["InvalidKey"] = "INVALID-KEY";
      ServerMessageType["Leave"] = "LEAVE";
      ServerMessageType["Expire"] = "EXPIRE";
  })($78455e22dea96b8c$export$adb4a1754da6f10d || ($78455e22dea96b8c$export$adb4a1754da6f10d = {}));


  var $f5f881ec4575f1fc$exports = {};
  $f5f881ec4575f1fc$exports = JSON.parse('{"name":"peerjs","version":"1.5.4","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xfcckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.1.0","webrtc-adapter":"^9.0.0"},"alias":{"process":false,"buffer":false}}');


  class $8f5bfa60836d261d$export$4798917dbf149b79 extends ($c4dcfd1d1ea86647$exports.EventEmitter) {
      constructor(secure, host, port, path, key, pingInterval = 5000){
          super();
          this.pingInterval = pingInterval;
          this._disconnected = true;
          this._messagesQueue = [];
          const wsProtocol = secure ? "wss://" : "ws://";
          this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
      }
      start(id, token) {
          this._id = id;
          const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
          if (!!this._socket || !this._disconnected) return;
          this._socket = new WebSocket(wsUrl + "&version=" + ($f5f881ec4575f1fc$exports.version));
          this._disconnected = false;
          this._socket.onmessage = (event)=>{
              let data;
              try {
                  data = JSON.parse(event.data);
                  (0, $257947e92926277a$export$2e2bcd8739ae039).log("Server message received:", data);
              } catch (e) {
                  ($257947e92926277a$export$2e2bcd8739ae039).log("Invalid server message", event.data);
                  return;
              }
              this.emit(($78455e22dea96b8c$export$3b5c4a4b6354f023).Message, data);
          };
          this._socket.onclose = (event)=>{
              if (this._disconnected) return;
              ($257947e92926277a$export$2e2bcd8739ae039).log("Socket closed.", event);
              this._cleanup();
              this._disconnected = true;
              this.emit(($78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected);
          };
          // Take care of the queue of connections if necessary and make sure Peer knows
          // socket is open.
          this._socket.onopen = ()=>{
              if (this._disconnected) return;
              this._sendQueuedMessages();
              ($257947e92926277a$export$2e2bcd8739ae039).log("Socket open");
              this._scheduleHeartbeat();
          };
      }
      _scheduleHeartbeat() {
          this._wsPingTimer = setTimeout(()=>{
              this._sendHeartbeat();
          }, this.pingInterval);
      }
      _sendHeartbeat() {
          if (!this._wsOpen()) {
              ($257947e92926277a$export$2e2bcd8739ae039).log(`Cannot send heartbeat, because socket closed`);
              return;
          }
          const message = JSON.stringify({
              type: ($78455e22dea96b8c$export$adb4a1754da6f10d).Heartbeat
          });
          this._socket.send(message);
          this._scheduleHeartbeat();
      }
      /** Is the websocket currently open? */ _wsOpen() {
          return !!this._socket && this._socket.readyState === 1;
      }
      /** Send queued messages. */ _sendQueuedMessages() {
          //Create copy of queue and clear it,
          //because send method push the message back to queue if smth will go wrong
          const copiedQueue = [
              ...this._messagesQueue
          ];
          this._messagesQueue = [];
          for (const message of copiedQueue)this.send(message);
      }
      /** Exposed send for DC & Peer. */ send(data) {
          if (this._disconnected) return;
          // If we didn't get an ID yet, we can't yet send anything so we should queue
          // up these messages.
          if (!this._id) {
              this._messagesQueue.push(data);
              return;
          }
          if (!data.type) {
              this.emit(($78455e22dea96b8c$export$3b5c4a4b6354f023).Error, "Invalid message");
              return;
          }
          if (!this._wsOpen()) return;
          const message = JSON.stringify(data);
          this._socket.send(message);
      }
      close() {
          if (this._disconnected) return;
          this._cleanup();
          this._disconnected = true;
      }
      _cleanup() {
          if (this._socket) {
              this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
              this._socket.close();
              this._socket = undefined;
          }
          clearTimeout(this._wsPingTimer);
      }
  }






  class $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a {
      constructor(connection){
          this.connection = connection;
      }
      /** Returns a PeerConnection object set up correctly (for data, media). */ startConnection(options) {
          const peerConnection = this._startPeerConnection();
          // Set the connection's PC.
          this.connection.peerConnection = peerConnection;
          if (this.connection.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Media && options._stream) this._addTracksToConnection(options._stream, peerConnection);
          // What do we need to do now?
          if (options.originator) {
              const dataConnection = this.connection;
              const config = {
                  ordered: !!options.reliable
              };
              const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
              dataConnection._initializeDataChannel(dataChannel);
              this._makeOffer();
          } else this.handleSDP("OFFER", options.sdp);
      }
      /** Start a PC. */ _startPeerConnection() {
          ($257947e92926277a$export$2e2bcd8739ae039).log("Creating RTCPeerConnection.");
          const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
          this._setupListeners(peerConnection);
          return peerConnection;
      }
      /** Set up various WebRTC listeners. */ _setupListeners(peerConnection) {
          const peerId = this.connection.peer;
          const connectionId = this.connection.connectionId;
          const connectionType = this.connection.type;
          const provider = this.connection.provider;
          // ICE CANDIDATES.
          ($257947e92926277a$export$2e2bcd8739ae039).log("Listening for ICE candidates.");
          peerConnection.onicecandidate = (evt)=>{
              if (!evt.candidate || !evt.candidate.candidate) return;
              ($257947e92926277a$export$2e2bcd8739ae039).log(`Received ICE candidates for ${peerId}:`, evt.candidate);
              provider.socket.send({
                  type: ($78455e22dea96b8c$export$adb4a1754da6f10d).Candidate,
                  payload: {
                      candidate: evt.candidate,
                      type: connectionType,
                      connectionId: connectionId
                  },
                  dst: peerId
              });
          };
          peerConnection.oniceconnectionstatechange = ()=>{
              switch(peerConnection.iceConnectionState){
                  case "failed":
                      ($257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is failed, closing connections to " + peerId);
                      this.connection.emitError(($78455e22dea96b8c$export$7974935686149686).NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
                      this.connection.close();
                      break;
                  case "closed":
                      ($257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is closed, closing connections to " + peerId);
                      this.connection.emitError(($78455e22dea96b8c$export$7974935686149686).ConnectionClosed, "Connection to " + peerId + " closed.");
                      this.connection.close();
                      break;
                  case "disconnected":
                      ($257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState changed to disconnected on the connection with " + peerId);
                      break;
                  case "completed":
                      peerConnection.onicecandidate = ()=>{};
                      break;
              }
              this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
          };
          // DATACONNECTION.
          ($257947e92926277a$export$2e2bcd8739ae039).log("Listening for data channel");
          // Fired between offer and answer, so options should already be saved
          // in the options hash.
          peerConnection.ondatachannel = (evt)=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log("Received data channel");
              const dataChannel = evt.channel;
              const connection = provider.getConnection(peerId, connectionId);
              connection._initializeDataChannel(dataChannel);
          };
          // MEDIACONNECTION.
          ($257947e92926277a$export$2e2bcd8739ae039).log("Listening for remote stream");
          peerConnection.ontrack = (evt)=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log("Received remote stream");
              const stream = evt.streams[0];
              const connection = provider.getConnection(peerId, connectionId);
              if (connection.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
                  const mediaConnection = connection;
                  this._addStreamToMediaConnection(stream, mediaConnection);
              }
          };
      }
      cleanup() {
          ($257947e92926277a$export$2e2bcd8739ae039).log("Cleaning up PeerConnection to " + this.connection.peer);
          const peerConnection = this.connection.peerConnection;
          if (!peerConnection) return;
          this.connection.peerConnection = null;
          //unsubscribe from all PeerConnection's events
          peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = ()=>{};
          const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
          let dataChannelNotClosed = false;
          const dataChannel = this.connection.dataChannel;
          if (dataChannel) dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
          if (peerConnectionNotClosed || dataChannelNotClosed) peerConnection.close();
      }
      async _makeOffer() {
          const peerConnection = this.connection.peerConnection;
          const provider = this.connection.provider;
          try {
              const offer = await peerConnection.createOffer(this.connection.options.constraints);
              (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created offer.");
              if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
              try {
                  await peerConnection.setLocalDescription(offer);
                  (0, $257947e92926277a$export$2e2bcd8739ae039).log("Set localDescription:", offer, `for:${this.connection.peer}`);
                  let payload = {
                      sdp: offer,
                      type: this.connection.type,
                      connectionId: this.connection.connectionId,
                      metadata: this.connection.metadata
                  };
                  if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
                      const dataConnection = this.connection;
                      payload = {
                          ...payload,
                          label: dataConnection.label,
                          reliable: dataConnection.reliable,
                          serialization: dataConnection.serialization
                      };
                  }
                  provider.socket.send({
                      type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer,
                      payload: payload,
                      dst: this.connection.peer
                  });
              } catch (err) {
                  // TODO: investigate why _makeOffer is being called from the answer
                  if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
                      provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
                      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
                  }
              }
          } catch (err_1) {
              provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
              ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to createOffer, ", err_1);
          }
      }
      async _makeAnswer() {
          const peerConnection = this.connection.peerConnection;
          const provider = this.connection.provider;
          try {
              const answer = await peerConnection.createAnswer();
              (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created answer.");
              if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
              try {
                  await peerConnection.setLocalDescription(answer);
                  (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
                  provider.socket.send({
                      type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer,
                      payload: {
                          sdp: answer,
                          type: this.connection.type,
                          connectionId: this.connection.connectionId
                      },
                      dst: this.connection.peer
                  });
              } catch (err) {
                  provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
                  (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
              }
          } catch (err_1) {
              provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
              ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to create answer, ", err_1);
          }
      }
      /** Handle an SDP. */ async handleSDP(type, sdp) {
          sdp = new RTCSessionDescription(sdp);
          const peerConnection = this.connection.peerConnection;
          const provider = this.connection.provider;
          ($257947e92926277a$export$2e2bcd8739ae039).log("Setting remote description", sdp);
          const self = this;
          try {
              await peerConnection.setRemoteDescription(sdp);
              (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set remoteDescription:${type} for:${this.connection.peer}`);
              if (type === "OFFER") await self._makeAnswer();
          } catch (err) {
              provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
              ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to setRemoteDescription, ", err);
          }
      }
      /** Handle a candidate. */ async handleCandidate(ice) {
          ($257947e92926277a$export$2e2bcd8739ae039).log(`handleCandidate:`, ice);
          try {
              await this.connection.peerConnection.addIceCandidate(ice);
              (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Added ICE candidate for:${this.connection.peer}`);
          } catch (err) {
              this.connection.provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
              ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to handleCandidate, ", err);
          }
      }
      _addTracksToConnection(stream, peerConnection) {
          ($257947e92926277a$export$2e2bcd8739ae039).log(`add tracks from stream ${stream.id} to peer connection`);
          if (!peerConnection.addTrack) return ($257947e92926277a$export$2e2bcd8739ae039).error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
          stream.getTracks().forEach((track)=>{
              peerConnection.addTrack(track, stream);
          });
      }
      _addStreamToMediaConnection(stream, mediaConnection) {
          ($257947e92926277a$export$2e2bcd8739ae039).log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
          mediaConnection.addStream(stream);
      }
  }





  class $23779d1881157a18$export$6a678e589c8a4542 extends ($c4dcfd1d1ea86647$exports.EventEmitter) {
      /**
  	 * Emits a typed error message.
  	 *
  	 * @internal
  	 */ emitError(type, err) {
          ($257947e92926277a$export$2e2bcd8739ae039).error("Error:", err);
          // @ts-ignore
          this.emit("error", new $23779d1881157a18$export$98871882f492de82(`${type}`, err));
      }
  }
  class $23779d1881157a18$export$98871882f492de82 extends Error {
      /**
  	 * @internal
  	 */ constructor(type, err){
          if (typeof err === "string") super(err);
          else {
              super();
              Object.assign(this, err);
          }
          this.type = type;
      }
  }


  class $5045192fc6d387ba$export$23a2a68283c24d80 extends ($23779d1881157a18$export$6a678e589c8a4542) {
      /**
  	 * Whether the media connection is active (e.g. your call has been answered).
  	 * You can check this if you want to set a maximum wait time for a one-sided call.
  	 */ get open() {
          return this._open;
      }
      constructor(/**
  		 * The ID of the peer on the other end of this connection.
  		 */ peer, provider, options){
          super();
          this.peer = peer;
          this.provider = provider;
          this.options = options;
          this._open = false;
          this.metadata = options.metadata;
      }
  }


  class $5c1d08c7c57da9a3$export$4a84e95a2324ac29 extends ($5045192fc6d387ba$export$23a2a68283c24d80) {
      static #_ = this.ID_PREFIX = "mc_";
      /**
  	 * For media connections, this is always 'media'.
  	 */ get type() {
          return ($78455e22dea96b8c$export$3157d57b4135e3bc).Media;
      }
      get localStream() {
          return this._localStream;
      }
      get remoteStream() {
          return this._remoteStream;
      }
      constructor(peerId, provider, options){
          super(peerId, provider, options);
          this._localStream = this.options._stream;
          this.connectionId = this.options.connectionId || $5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + ($4f4134156c446392$export$7debb50ef11d5e0b).randomToken();
          this._negotiator = new ($b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
          if (this._localStream) this._negotiator.startConnection({
              _stream: this._localStream,
              originator: true
          });
      }
      /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
          this.dataChannel = dc;
          this.dataChannel.onopen = ()=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
              this.emit("willCloseOnRemote");
          };
          this.dataChannel.onclose = ()=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
              this.close();
          };
      }
      addStream(remoteStream) {
          ($257947e92926277a$export$2e2bcd8739ae039).log("Receiving stream", remoteStream);
          this._remoteStream = remoteStream;
          super.emit("stream", remoteStream); // Should we call this `open`?
      }
      /**
  	 * @internal
  	 */ handleMessage(message) {
          const type = message.type;
          const payload = message.payload;
          switch(message.type){
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
                  // Forward to negotiator
                  this._negotiator.handleSDP(type, payload.sdp);
                  this._open = true;
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
                  this._negotiator.handleCandidate(payload.candidate);
                  break;
              default:
                  ($257947e92926277a$export$2e2bcd8739ae039).warn(`Unrecognized message type:${type} from peer:${this.peer}`);
                  break;
          }
      }
      /**
       * When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
       * `answer` on the media connection provided by the callback to accept the call
       * and optionally send your own media stream.

       *
       * @param stream A WebRTC media stream.
       * @param options
       * @returns
       */ answer(stream, options = {}) {
          if (this._localStream) {
              ($257947e92926277a$export$2e2bcd8739ae039).warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
              return;
          }
          this._localStream = stream;
          if (options && options.sdpTransform) this.options.sdpTransform = options.sdpTransform;
          this._negotiator.startConnection({
              ...this.options._payload,
              _stream: stream
          });
          // Retrieve lost messages stored because PeerConnection not set up.
          const messages = this.provider._getMessages(this.connectionId);
          for (const message of messages)this.handleMessage(message);
          this._open = true;
      }
      /**
  	 * Exposed functionality for users.
  	 */ /**
  	 * Closes the media connection.
  	 */ close() {
          if (this._negotiator) {
              this._negotiator.cleanup();
              this._negotiator = null;
          }
          this._localStream = null;
          this._remoteStream = null;
          if (this.provider) {
              this.provider._removeConnection(this);
              this.provider = null;
          }
          if (this.options && this.options._stream) this.options._stream = null;
          if (!this.open) return;
          this._open = false;
          super.emit("close");
      }
  }






  class $abf266641927cd89$export$2c4e825dc9120f87 {
      constructor(_options){
          this._options = _options;
      }
      _buildRequest(method) {
          const protocol = this._options.secure ? "https" : "http";
          const { host: host, port: port, path: path, key: key } = this._options;
          const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
          // TODO: Why timestamp, why random?
          url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
          url.searchParams.set("version", ($f5f881ec4575f1fc$exports.version));
          return fetch(url.href, {
              referrerPolicy: this._options.referrerPolicy
          });
      }
      /** Get a unique ID from the server via XHR and initialize with it. */ async retrieveId() {
          try {
              const response = await this._buildRequest("id");
              if (response.status !== 200) throw new Error(`Error. Status:${response.status}`);
              return response.text();
          } catch (error) {
              ($257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving ID", error);
              let pathError = "";
              if (this._options.path === "/" && this._options.host !== ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
              throw new Error("Could not get an ID from the server." + pathError);
          }
      }
      /** @deprecated */ async listAllPeers() {
          try {
              const response = await this._buildRequest("peers");
              if (response.status !== 200) {
                  if (response.status === 401) {
                      let helpfulError = "";
                      if (this._options.host === (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
                      else helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
                      throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
                  }
                  throw new Error(`Error. Status:${response.status}`);
              }
              return response.json();
          } catch (error) {
              ($257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving list peers", error);
              throw new Error("Could not get list peers from the server." + error);
          }
      }
  }










  class $6366c4ca161bc297$export$d365f7ad9d7df9c9 extends ($5045192fc6d387ba$export$23a2a68283c24d80) {
      static #_ = this.ID_PREFIX = "dc_";
      static #_2 = this.MAX_BUFFERED_AMOUNT = 8388608;
      get type() {
          return ($78455e22dea96b8c$export$3157d57b4135e3bc).Data;
      }
      constructor(peerId, provider, options){
          super(peerId, provider, options);
          this.connectionId = this.options.connectionId || $6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + ($0e5fd1585784c252$export$4e61f672936bec77)();
          this.label = this.options.label || this.connectionId;
          this.reliable = !!this.options.reliable;
          this._negotiator = new ($b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
          this._negotiator.startConnection(this.options._payload || {
              originator: true,
              reliable: this.reliable
          });
      }
      /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
          this.dataChannel = dc;
          this.dataChannel.onopen = ()=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
              this._open = true;
              this.emit("open");
          };
          this.dataChannel.onmessage = (e)=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc onmessage:`, e.data);
          // this._handleDataMessage(e);
          };
          this.dataChannel.onclose = ()=>{
              ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
              this.close();
          };
      }
      /**
  	 * Exposed functionality for users.
  	 */ /** Allows user to close connection. */ close(options) {
          if (options?.flush) {
              this.send({
                  __peerData: {
                      type: "close"
                  }
              });
              return;
          }
          if (this._negotiator) {
              this._negotiator.cleanup();
              this._negotiator = null;
          }
          if (this.provider) {
              this.provider._removeConnection(this);
              this.provider = null;
          }
          if (this.dataChannel) {
              this.dataChannel.onopen = null;
              this.dataChannel.onmessage = null;
              this.dataChannel.onclose = null;
              this.dataChannel = null;
          }
          if (!this.open) return;
          this._open = false;
          super.emit("close");
      }
      /** Allows user to send data. */ send(data, chunked = false) {
          if (!this.open) {
              this.emitError(($78455e22dea96b8c$export$49ae800c114df41d).NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
              return;
          }
          return this._send(data, chunked);
      }
      async handleMessage(message) {
          const payload = message.payload;
          switch(message.type){
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
                  await this._negotiator.handleSDP(message.type, payload.sdp);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
                  await this._negotiator.handleCandidate(payload.candidate);
                  break;
              default:
                  ($257947e92926277a$export$2e2bcd8739ae039).warn("Unrecognized message type:", message.type, "from peer:", this.peer);
                  break;
          }
      }
  }


  class $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b extends ($6366c4ca161bc297$export$d365f7ad9d7df9c9) {
      get bufferSize() {
          return this._bufferSize;
      }
      _initializeDataChannel(dc) {
          super._initializeDataChannel(dc);
          this.dataChannel.binaryType = "arraybuffer";
          this.dataChannel.addEventListener("message", (e)=>this._handleDataMessage(e));
      }
      _bufferedSend(msg) {
          if (this._buffering || !this._trySend(msg)) {
              this._buffer.push(msg);
              this._bufferSize = this._buffer.length;
          }
      }
      // Returns true if the send succeeds.
      _trySend(msg) {
          if (!this.open) return false;
          if (this.dataChannel.bufferedAmount > ($6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT) {
              this._buffering = true;
              setTimeout(()=>{
                  this._buffering = false;
                  this._tryBuffer();
              }, 50);
              return false;
          }
          try {
              this.dataChannel.send(msg);
          } catch (e) {
              ($257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
              this._buffering = true;
              this.close();
              return false;
          }
          return true;
      }
      // Try to send the first message in the buffer.
      _tryBuffer() {
          if (!this.open) return;
          if (this._buffer.length === 0) return;
          const msg = this._buffer[0];
          if (this._trySend(msg)) {
              this._buffer.shift();
              this._bufferSize = this._buffer.length;
              this._tryBuffer();
          }
      }
      close(options) {
          if (options?.flush) {
              this.send({
                  __peerData: {
                      type: "close"
                  }
              });
              return;
          }
          this._buffer = [];
          this._bufferSize = 0;
          super.close();
      }
      constructor(...args){
          super(...args);
          this._buffer = [];
          this._bufferSize = 0;
          this._buffering = false;
      }
  }




  class $9fcfddb3ae148f88$export$f0a5a64d5bb37108 extends ($a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
      close(options) {
          super.close(options);
          this._chunkedData = {};
      }
      constructor(peerId, provider, options){
          super(peerId, provider, options);
          this.chunker = new ($fcbcc7538a6776d5$export$f1c5f4c9cb95390b)();
          this.serialization = ($78455e22dea96b8c$export$89f507cf986a947).Binary;
          this._chunkedData = {};
      }
      // Handles a DataChannel message.
      _handleDataMessage({ data: data }) {
          const deserializedData = ($0cfd7828ad59115f$export$417857010dc9287f)(data);
          // PeerJS specific message
          const peerData = deserializedData["__peerData"];
          if (peerData) {
              if (peerData.type === "close") {
                  this.close();
                  return;
              }
              // Chunked data -- piece things back together.
              // @ts-ignore
              this._handleChunk(deserializedData);
              return;
          }
          this.emit("data", deserializedData);
      }
      _handleChunk(data) {
          const id = data.__peerData;
          const chunkInfo = this._chunkedData[id] || {
              data: [],
              count: 0,
              total: data.total
          };
          chunkInfo.data[data.n] = new Uint8Array(data.data);
          chunkInfo.count++;
          this._chunkedData[id] = chunkInfo;
          if (chunkInfo.total === chunkInfo.count) {
              // Clean up before making the recursive call to `_handleDataMessage`.
              delete this._chunkedData[id];
              // We've received all the chunks--time to construct the complete data.
              // const data = new Blob(chunkInfo.data);
              const data = ($fcbcc7538a6776d5$export$52c89ebcdc4f53f2)(chunkInfo.data);
              this._handleDataMessage({
                  data: data
              });
          }
      }
      _send(data, chunked) {
          const blob = ($0cfd7828ad59115f$export$2a703dbb0cb35339)(data);
          if (blob instanceof Promise) return this._send_blob(blob);
          if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
              this._sendChunks(blob);
              return;
          }
          this._bufferedSend(blob);
      }
      async _send_blob(blobPromise) {
          const blob = await blobPromise;
          if (blob.byteLength > this.chunker.chunkedMTU) {
              this._sendChunks(blob);
              return;
          }
          this._bufferedSend(blob);
      }
      _sendChunks(blob) {
          const blobs = this.chunker.chunk(blob);
          ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
          for (const blob of blobs)this.send(blob, true);
      }
  }




  class $bbaee3f15f714663$export$6f88fe47d32c9c94 extends ($a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
      _handleDataMessage({ data: data }) {
          super.emit("data", data);
      }
      _send(data, _chunked) {
          this._bufferedSend(data);
      }
      constructor(...args){
          super(...args);
          this.serialization = ($78455e22dea96b8c$export$89f507cf986a947).None;
      }
  }





  class $817f931e3f9096cf$export$48880ac635f47186 extends ($a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
      // Handles a DataChannel message.
      _handleDataMessage({ data: data }) {
          const deserializedData = this.parse(this.decoder.decode(data));
          // PeerJS specific message
          const peerData = deserializedData["__peerData"];
          if (peerData && peerData.type === "close") {
              this.close();
              return;
          }
          this.emit("data", deserializedData);
      }
      _send(data, _chunked) {
          const encodedData = this.encoder.encode(this.stringify(data));
          if (encodedData.byteLength >= ($4f4134156c446392$export$7debb50ef11d5e0b).chunkedMTU) {
              this.emitError(($78455e22dea96b8c$export$49ae800c114df41d).MessageToBig, "Message too big for JSON channel");
              return;
          }
          this._bufferedSend(encodedData);
      }
      constructor(...args){
          super(...args);
          this.serialization = ($78455e22dea96b8c$export$89f507cf986a947).JSON;
          this.encoder = new TextEncoder();
          this.decoder = new TextDecoder();
          this.stringify = JSON.stringify;
          this.parse = JSON.parse;
      }
  }
  class $416260bce337df90$export$ecd1fc136c422448 extends ($23779d1881157a18$export$6a678e589c8a4542) {
      static #_ = this.DEFAULT_KEY = "peerjs";
      /**
  	 * The brokering ID of this peer
  	 *
  	 * If no ID was specified in {@apilink Peer | the constructor},
  	 * this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
  	 */ get id() {
          return this._id;
      }
      get options() {
          return this._options;
      }
      get open() {
          return this._open;
      }
      /**
  	 * @internal
  	 */ get socket() {
          return this._socket;
      }
      /**
  	 * A hash of all connections associated with this peer, keyed by the remote peer's ID.
  	 * @deprecated
  	 * Return type will change from Object to Map<string,[]>
  	 */ get connections() {
          const plainConnections = Object.create(null);
          for (const [k, v] of this._connections)plainConnections[k] = v;
          return plainConnections;
      }
      /**
  	 * true if this peer and all of its connections can no longer be used.
  	 */ get destroyed() {
          return this._destroyed;
      }
      /**
  	 * false if there is an active connection to the PeerServer.
  	 */ get disconnected() {
          return this._disconnected;
      }
      constructor(id, options){
          super();
          this._serializers = {
              raw: ($bbaee3f15f714663$export$6f88fe47d32c9c94),
              json: ($817f931e3f9096cf$export$48880ac635f47186),
              binary: ($9fcfddb3ae148f88$export$f0a5a64d5bb37108),
              "binary-utf8": ($9fcfddb3ae148f88$export$f0a5a64d5bb37108),
              default: ($9fcfddb3ae148f88$export$f0a5a64d5bb37108)
          };
          this._id = null;
          this._lastServerId = null;
          // States.
          this._destroyed = false // Connections have been killed
          ;
          this._disconnected = false // Connection to PeerServer killed but P2P connections still active
          ;
          this._open = false // Sockets and such are not yet open.
          ;
          this._connections = new Map() // All connections for this peer.
          ;
          this._lostMessages = new Map() // src => [list of messages]
          ;
          let userId;
          // Deal with overloading
          if (id && id.constructor == Object) options = id;
          else if (id) userId = id.toString();
          // Configurize options
          options = {
              debug: 0,
              host: ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST,
              port: ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_PORT,
              path: "/",
              key: $416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY,
              token: ($4f4134156c446392$export$7debb50ef11d5e0b).randomToken(),
              config: ($4f4134156c446392$export$7debb50ef11d5e0b).defaultConfig,
              referrerPolicy: "strict-origin-when-cross-origin",
              serializers: {},
              ...options
          };
          this._options = options;
          this._serializers = {
              ...this._serializers,
              ...this.options.serializers
          };
          // Detect relative URL host.
          if (this._options.host === "/") this._options.host = window.location.hostname;
          // Set path correctly.
          if (this._options.path) {
              if (this._options.path[0] !== "/") this._options.path = "/" + this._options.path;
              if (this._options.path[this._options.path.length - 1] !== "/") this._options.path += "/";
          }
          // Set whether we use SSL to same as current host
          if (this._options.secure === undefined && this._options.host !== ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = ($4f4134156c446392$export$7debb50ef11d5e0b).isSecure();
          else if (this._options.host == ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = true;
          // Set a custom log function if present
          if (this._options.logFunction) ($257947e92926277a$export$2e2bcd8739ae039).setLogFunction(this._options.logFunction);
          ($257947e92926277a$export$2e2bcd8739ae039).logLevel = this._options.debug || 0;
          this._api = new ($abf266641927cd89$export$2c4e825dc9120f87)(options);
          this._socket = this._createServerConnection();
          // Sanity checks
          // Ensure WebRTC supported
          if (!($4f4134156c446392$export$7debb50ef11d5e0b).supports.audioVideo && !($4f4134156c446392$export$7debb50ef11d5e0b).supports.data) {
              this._delayedAbort(($78455e22dea96b8c$export$9547aaa2e39030ff).BrowserIncompatible, "The current browser does not support WebRTC");
              return;
          }
          // Ensure alphanumeric id
          if (!!userId && !($4f4134156c446392$export$7debb50ef11d5e0b).validateId(userId)) {
              this._delayedAbort(($78455e22dea96b8c$export$9547aaa2e39030ff).InvalidID, `ID "${userId}" is invalid`);
              return;
          }
          if (userId) this._initialize(userId);
          else this._api.retrieveId().then((id)=>this._initialize(id)).catch((error)=>this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
      }
      _createServerConnection() {
          const socket = new ($8f5bfa60836d261d$export$4798917dbf149b79)(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
          socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Message, (data)=>{
              this._handleMessage(data);
          });
          socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Error, (error)=>{
              this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).SocketError, error);
          });
          socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected, ()=>{
              if (this.disconnected) return;
              this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).Network, "Lost connection to server.");
              this.disconnect();
          });
          socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Close, ()=>{
              if (this.disconnected) return;
              this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).SocketClosed, "Underlying socket is already closed.");
          });
          return socket;
      }
      /** Initialize a connection with the server. */ _initialize(id) {
          this._id = id;
          this.socket.start(id, this._options.token);
      }
      /** Handles messages from the server. */ _handleMessage(message) {
          const type = message.type;
          const payload = message.payload;
          const peerId = message.src;
          switch(type){
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Open:
                  this._lastServerId = this.id;
                  this._open = true;
                  this.emit("open", this.id);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Error:
                  this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, payload.msg);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).IdTaken:
                  this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).UnavailableID, `ID "${this.id}" is taken`);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).InvalidKey:
                  this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).InvalidKey, `API KEY "${this._options.key}" is invalid`);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Leave:
                  ($257947e92926277a$export$2e2bcd8739ae039).log(`Received leave message from ${peerId}`);
                  this._cleanupPeer(peerId);
                  this._connections.delete(peerId);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Expire:
                  this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).PeerUnavailable, `Could not connect to peer ${peerId}`);
                  break;
              case ($78455e22dea96b8c$export$adb4a1754da6f10d).Offer:
                  {
                      // we should consider switching this to CALL/CONNECT, but this is the least breaking option.
                      const connectionId = payload.connectionId;
                      let connection = this.getConnection(peerId, connectionId);
                      if (connection) {
                          connection.close();
                          ($257947e92926277a$export$2e2bcd8739ae039).warn(`Offer received for existing Connection ID:${connectionId}`);
                      }
                      // Create a new connection.
                      if (payload.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
                          const mediaConnection = new ($5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peerId, this, {
                              connectionId: connectionId,
                              _payload: payload,
                              metadata: payload.metadata
                          });
                          connection = mediaConnection;
                          this._addConnection(peerId, connection);
                          this.emit("call", mediaConnection);
                      } else if (payload.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
                          const dataConnection = new this._serializers[payload.serialization](peerId, this, {
                              connectionId: connectionId,
                              _payload: payload,
                              metadata: payload.metadata,
                              label: payload.label,
                              serialization: payload.serialization,
                              reliable: payload.reliable
                          });
                          connection = dataConnection;
                          this._addConnection(peerId, connection);
                          this.emit("connection", dataConnection);
                      } else {
                          ($257947e92926277a$export$2e2bcd8739ae039).warn(`Received malformed connection type:${payload.type}`);
                          return;
                      }
                      // Find messages.
                      const messages = this._getMessages(connectionId);
                      for (const message of messages)connection.handleMessage(message);
                      break;
                  }
              default:
                  {
                      if (!payload) {
                          ($257947e92926277a$export$2e2bcd8739ae039).warn(`You received a malformed message from ${peerId} of type ${type}`);
                          return;
                      }
                      const connectionId = payload.connectionId;
                      const connection = this.getConnection(peerId, connectionId);
                      if (connection && connection.peerConnection) // Pass it on.
                      connection.handleMessage(message);
                      else if (connectionId) // Store for possible later use
                      this._storeMessage(connectionId, message);
                      else ($257947e92926277a$export$2e2bcd8739ae039).warn("You received an unrecognized message:", message);
                      break;
                  }
          }
      }
      /** Stores messages without a set up connection, to be claimed later. */ _storeMessage(connectionId, message) {
          if (!this._lostMessages.has(connectionId)) this._lostMessages.set(connectionId, []);
          this._lostMessages.get(connectionId).push(message);
      }
      /**
  	 * Retrieve messages from lost message store
  	 * @internal
  	 */ //TODO Change it to private
      _getMessages(connectionId) {
          const messages = this._lostMessages.get(connectionId);
          if (messages) {
              this._lostMessages.delete(connectionId);
              return messages;
          }
          return [];
      }
      /**
  	 * Connects to the remote peer specified by id and returns a data connection.
  	 * @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
  	 * @param options for specifying details about Peer Connection
  	 */ connect(peer, options = {}) {
          options = {
              serialization: "default",
              ...options
          };
          if (this.disconnected) {
              ($257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
              this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
              return;
          }
          const dataConnection = new this._serializers[options.serialization](peer, this, options);
          this._addConnection(peer, dataConnection);
          return dataConnection;
      }
      /**
  	 * Calls the remote peer specified by id and returns a media connection.
  	 * @param peer The brokering ID of the remote peer (their peer.id).
  	 * @param stream The caller's media stream
  	 * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
  	 */ call(peer, stream, options = {}) {
          if (this.disconnected) {
              ($257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
              this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
              return;
          }
          if (!stream) {
              ($257947e92926277a$export$2e2bcd8739ae039).error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
              return;
          }
          const mediaConnection = new ($5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peer, this, {
              ...options,
              _stream: stream
          });
          this._addConnection(peer, mediaConnection);
          return mediaConnection;
      }
      /** Add a data/media connection to this peer. */ _addConnection(peerId, connection) {
          ($257947e92926277a$export$2e2bcd8739ae039).log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
          if (!this._connections.has(peerId)) this._connections.set(peerId, []);
          this._connections.get(peerId).push(connection);
      }
      //TODO should be private
      _removeConnection(connection) {
          const connections = this._connections.get(connection.peer);
          if (connections) {
              const index = connections.indexOf(connection);
              if (index !== -1) connections.splice(index, 1);
          }
          //remove from lost messages
          this._lostMessages.delete(connection.connectionId);
      }
      /** Retrieve a data/media connection for this peer. */ getConnection(peerId, connectionId) {
          const connections = this._connections.get(peerId);
          if (!connections) return null;
          for (const connection of connections){
              if (connection.connectionId === connectionId) return connection;
          }
          return null;
      }
      _delayedAbort(type, message) {
          setTimeout(()=>{
              this._abort(type, message);
          }, 0);
      }
      /**
  	 * Emits an error message and destroys the Peer.
  	 * The Peer is not destroyed if it's in a disconnected state, in which case
  	 * it retains its disconnected state and its existing connections.
  	 */ _abort(type, message) {
          ($257947e92926277a$export$2e2bcd8739ae039).error("Aborting!");
          this.emitError(type, message);
          if (!this._lastServerId) this.destroy();
          else this.disconnect();
      }
      /**
  	 * Destroys the Peer: closes all active connections as well as the connection
  	 * to the server.
  	 *
  	 * :::caution
  	 * This cannot be undone; the respective peer object will no longer be able
  	 * to create or receive any connections, its ID will be forfeited on the server,
  	 * and all of its data and media connections will be closed.
  	 * :::
  	 */ destroy() {
          if (this.destroyed) return;
          ($257947e92926277a$export$2e2bcd8739ae039).log(`Destroy peer with ID:${this.id}`);
          this.disconnect();
          this._cleanup();
          this._destroyed = true;
          this.emit("close");
      }
      /** Disconnects every connection on this peer. */ _cleanup() {
          for (const peerId of this._connections.keys()){
              this._cleanupPeer(peerId);
              this._connections.delete(peerId);
          }
          this.socket.removeAllListeners();
      }
      /** Closes all connections to this peer. */ _cleanupPeer(peerId) {
          const connections = this._connections.get(peerId);
          if (!connections) return;
          for (const connection of connections)connection.close();
      }
      /**
  	 * Disconnects the Peer's connection to the PeerServer. Does not close any
  	 *  active connections.
  	 * Warning: The peer can no longer create or accept connections after being
  	 *  disconnected. It also cannot reconnect to the server.
  	 */ disconnect() {
          if (this.disconnected) return;
          const currentId = this.id;
          ($257947e92926277a$export$2e2bcd8739ae039).log(`Disconnect peer with ID:${currentId}`);
          this._disconnected = true;
          this._open = false;
          this.socket.close();
          this._lastServerId = currentId;
          this._id = null;
          this.emit("disconnected", currentId);
      }
      /** Attempts to reconnect with the same ID.
  	 *
  	 * Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
  	 * Destroyed peers cannot be reconnected.
  	 * If the connection fails (as an example, if the peer's old ID is now taken),
  	 * the peer's existing connections will not close, but any associated errors events will fire.
  	 */ reconnect() {
          if (this.disconnected && !this.destroyed) {
              ($257947e92926277a$export$2e2bcd8739ae039).log(`Attempting reconnection to server with ID ${this._lastServerId}`);
              this._disconnected = false;
              this._initialize(this._lastServerId);
          } else if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
          else if (!this.disconnected && !this.open) // Do nothing. We're still connecting the first time.
          ($257947e92926277a$export$2e2bcd8739ae039).error("In a hurry? We're still trying to make the initial connection!");
          else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
      }
      /**
  	 * Get a list of available peer IDs. If you're running your own server, you'll
  	 * want to set allow_discovery: true in the PeerServer options. If you're using
  	 * the cloud server, email team@peerjs.com to get the functionality enabled for
  	 * your key.
  	 */ listAllPeers(cb = (_)=>{}) {
          this._api.listAllPeers().then((peers)=>cb(peers)).catch((error)=>this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
      }
  }

  // Player management for OvO multiplayer

  // Initialize player module
  function init$5() {
    state.connections.forEach((connection) => {
      connection.player = null;
    });
  }

  // Handle start of layout
  function startOfLayout() {
    if (!state.initialised) return;
    state.usernameInsts = null;
    state.connections.forEach((connection) => {
      connection.player = null;
    });

    // Handle UI visibility based on layout
    let button = document.getElementById("ovo-multiplayer-toggle-button");
    let container = document.getElementById("ovo-multiplayer-container");

    if (!getFlag()) {
      // Not in a level
      if (
        state.runtime.isMobile &&
        button &&
        container &&
        container.style.display === "none"
      ) {
        button.onclick(true);
      }
    } else {
      // In a level
      if (
        state.runtime.isMobile &&
        button &&
        container &&
        container.style.display !== "none"
      ) {
        button.onclick(true);
      }

      // Create other players
      state.connections.forEach((connection) => {
        if (connection.data) {
          connection.player = createGhostPlayer(connection.data);
        }
      });
    }
  }

  // Create a ghost player
  function createGhostPlayer(data) {
    if (!data || data.layout !== getCurLayout()) return null;

    let layer = state.runtime.running_layout.layers.find(
      (layer) => layer.name === data.layer
    );
    if (!layer) return null;

    destroyNonPlayerGhosts();

    // Create ghost player instance
    let instance = state.runtime.createInstance(
      state.playerType,
      layer,
      data.x,
      data.y
    );
    instance.visible = false;
    instance.instance_vars[16] = 1;
    instance.instance_vars[17] = "";
    instance.instance_vars[12] = data.skin;

    // Apply skin
    setTimeout(() => {
      if (!getFlag()) return;
      instance.siblings.forEach((sibling) => {
        if (data.skin === "") {
          cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
            sibling.behaviorSkins[0]
          );
        } else {
          cr.behaviors.SkymenSkin.prototype.acts.SetSkin.call(
            sibling.behaviorSkins[0],
            data.skin
          );
        }
      });
    }, 200);

    // Create username display
    let usernames = createUsernameInstances(
      layer,
      data.x - 100,
      data.y - 55,
      data.username
    );

    return {
      instance,
      usernames,
    };
  }

  // Destroy a ghost player
  function destroyGhostPlayer(player) {
    if (!player) return;

    if (player.instance) {
      player.instance.siblings.forEach((sibling) => {
        cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
          sibling.behaviorSkins[0]
        );
      });
      state.runtime.DestroyInstance(player.instance);
    }

    if (player.usernames) {
      player.usernames.forEach((username) => {
        state.runtime.DestroyInstance(username);
      });
    }
  }

  // Remove non-player ghosts
  function destroyNonPlayerGhosts() {
    if (!getFlag()) return;

    let ghosts = state.playerType.instances.filter(
      (x) => x.instance_vars[16] && x.instance_vars[17] !== ""
    );

    if (!ghosts) return;

    ghosts.forEach((ghost) => {
      state.runtime.DestroyInstance(ghost);
      ghost.siblings.forEach((sibling) => {
        cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
          sibling.behaviorSkins[0]
        );
      });
    });

    let ghostArr = state.ghostArrType.instances[0];
    ghostArr.setSize(0, ghostArr.cy, ghostArr.cz);
    state.runtime.eventsheets.Player.events[2].subevents[2].subevents[1].actions.length = 0;
  }

  // Update a ghost player with new data
  function loadPlayerData(player, data) {
    if (data.layout !== getCurLayout()) return;

    updateUsernamePosition(
      player.usernames,
      data.x - 100,
      data.y - 55,
      data.username
    );

    player.instance.x = data.x;
    player.instance.y = data.y;
    player.instance.angle = data.angle;
    player.instance.instance_vars[0] = data.state;
    player.instance.instance_vars[2] = data.side;

    if (data.side > 0) {
      c2_callFunction("Player > Unmirror", [player.instance.uid]);
    }
    if (data.side < 0) {
      c2_callFunction("Player > Mirror", [player.instance.uid]);
    }

    cr.plugins_.Sprite.prototype.acts.SetAnimFrame.call(
      player.instance,
      data.frame
    );

    player.instance.y = data.y;
    player.instance.set_bbox_changed();
  }

  // Create username text instances
  function createUsernameInstances(layer, x, y, username) {
    let ret = [];

    // Create shadow instances (for outline effect)
    [-2, 2].forEach((offsetX) => {
      let inst = state.runtime.createInstance(
        state.textType,
        layer,
        x + offsetX,
        y
      );
      inst.text = username;
      inst.height = 25;
      inst.width = 200;
      inst.facename = "Retron2000";
      inst.halign = 50;
      inst.valign = 50;
      inst.color = "rgb(0,0,0)";
      inst.fontstyle = "bold";
      inst.updateFont();
      inst.set_bbox_changed();
      ret.push(inst);
    });

    [-2, 2].forEach((offsetY) => {
      let inst = state.runtime.createInstance(
        state.textType,
        layer,
        x,
        y + offsetY
      );
      inst.text = username;
      inst.height = 25;
      inst.width = 200;
      inst.facename = "Retron2000";
      inst.halign = 50;
      inst.valign = 50;
      inst.color = "rgb(0,0,0)";
      inst.fontstyle = "bold";
      inst.updateFont();
      inst.set_bbox_changed();
      ret.push(inst);
    });

    // Create main text
    let inst = state.runtime.createInstance(state.textType, layer, x, y);
    inst.text = username;
    inst.height = 25;
    inst.width = 200;
    inst.facename = "Retron2000";
    inst.halign = 50;
    inst.valign = 50;
    inst.color = "rgb(255,255,255)";
    inst.fontstyle = "";
    inst.updateFont();
    inst.set_bbox_changed();
    ret.push(inst);

    return ret;
  }

  // Update username position
  function updateUsernamePosition(usernames, x, y, username) {
    usernames.forEach((inst, i) => {
      if (i === 0) {
        inst.x = x - 2;
        inst.y = y;
      } else if (i === 1) {
        inst.x = x + 2;
        inst.y = y;
      } else if (i === 2) {
        inst.x = x;
        inst.y = y - 2;
      } else if (i === 3) {
        inst.x = x;
        inst.y = y + 2;
      } else {
        inst.x = x;
        inst.y = y;
      }
      inst.text = username;
      inst.updateFont();
      inst.set_bbox_changed();
    });
  }

  // Handle username display updates
  function handleUsernameDisplay() {
    let player = getPlayer();
    if (player && getFlag()) {
      if (!state.usernameInsts) {
        state.usernameInsts = createUsernameInstances(
          player.layer,
          player.x,
          player.y,
          state.username
        );
      }

      updateUsernamePosition(
        state.usernameInsts,
        player.x - 100,
        player.y - 55,
        state.username
      );
    }
  }

  // Get current player data
  function getMyData() {
    let player = getPlayer();
    if (!player)
      return {
        layout: getCurLayout(),
        skin: state.globalType.instances[0].instance_vars[8],
        username: state.username,
        UID: state.myUniqueHash,
        initialUsername: state.initialUsername,
        isHost: state.isHost,
        timestamp: Date.now(),
        version: VERSION,
      };

    return {
      x: player.x,
      y: player.y,
      angle: player.angle,
      state: player.instance_vars[0],
      layout: getCurLayout(),
      layer: player.layer.name,
      username: state.username,
      UID: state.myUniqueHash,
      initialUsername: state.initialUsername,
      isHost: state.isHost,
      timestamp: Date.now(),
      version: VERSION,
      side: player.instance_vars[2],
      skin: player.instance_vars[12],
      frame: player.cur_frame,
    };
  }

  // Server browser implementation for OvO Multiplayer

  // Server browser state
  const serverBrowserState = {
    servers: [],
    isOpen: false,
    modal: null,
    createServerModal: null, // Add reference to creation modal
    selectedServer: null,
    refreshTimer: null,
    currentServerId: null, // Track the current registered server ID
    clickStateMap: null, // Store the click state map for restoring later
  };

  // Initialize the server browser
  function init$4() {
    createServerBrowserModal();
    createServerCreationModal(); // Initialize the server creation modal
  }

  // Create the server browser modal
  function createServerBrowserModal() {
    // Create server browser modal
    const modal = document.createElement("div");
    modal.id = "ovo-multiplayer-server-browser";
    modal.classList.add("ovo-multiplayer-modal");

    // Add wheel event listener to prevent propagation to the game
    modal.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    document.body.appendChild(modal);

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("ovo-multiplayer-server-browser");

    // Add wheel event listener to prevent propagation to the game
    modalContent.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    modal.appendChild(modalContent);

    // Create header
    const header = document.createElement("div");
    header.classList.add("ovo-multiplayer-server-header");
    modalContent.appendChild(header);

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Server Browser";
    header.appendChild(title);

    // Create close button
    const close = document.createElement("span");
    close.classList.add("ovo-multiplayer-modal-close");
    close.innerHTML = "&times;";
    close.onclick = () => {
      closeServerBrowser();
    };
    header.appendChild(close);

    // Create server list
    const serverList = document.createElement("div");
    serverList.id = "ovo-multiplayer-server-list";
    serverList.classList.add("ovo-multiplayer-server-list");

    // Add wheel event listener to enable smooth scrolling in server list
    serverList.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    modalContent.appendChild(serverList);

    // Create bottom actions
    const actions = document.createElement("div");
    actions.classList.add("ovo-multiplayer-server-actions");
    actions.style.marginTop = "20px";
    actions.style.display = "flex";
    actions.style.justifyContent = "space-between";
    modalContent.appendChild(actions);

    // Create refresh button
    const refreshButton = document.createElement("button");
    refreshButton.classList.add("ovo-multiplayer-server-refresh");
    // Replace text with SVG icon
    refreshButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="vertical-align: middle; margin-right: 5px;">
      <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
    </svg>
    Refresh`;
    refreshButton.onclick = async () => {
      const isConnected = await checkInternetConnectivity();
      if (!isConnected) {
        showNoInternetMessage();
        return;
      }
      refreshServerList();
    };
    actions.appendChild(refreshButton);

    // Create direct join button
    const directJoinButton = document.createElement("button");
    directJoinButton.classList.add("ovo-multiplayer-server-join");
    // Replace text with SVG icon
    directJoinButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="vertical-align: middle; margin-right: 5px;">
      <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
    </svg>
    Direct Join`;
    directJoinButton.onclick = async () => {
      const isConnected = await checkInternetConnectivity();
      if (!isConnected) {
        showNoInternetMessage();
        return;
      }

      const roomCode = await getDialogPrompt({ text: "Enter room code" });
      if (roomCode) {
        closeServerBrowser();
        joinRoomWithServerId(roomCode);
      }
    };
    actions.appendChild(directJoinButton);

    // Create create server button
    const createButton = document.createElement("button");
    createButton.classList.add("ovo-multiplayer-server-create");
    // Replace text with SVG icon
    createButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="vertical-align: middle; margin-right: 5px;">
      <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
    Create Server`;
    createButton.onclick = async () => {
      const isConnected = await checkInternetConnectivity();
      if (!isConnected) {
        showNoInternetMessage();
        return;
      }

      // Show the server creation modal instead of running createNewServer()
      showCreateServerModal();
    };
    actions.appendChild(createButton);

    // Save modal reference
    serverBrowserState.modal = modal;
  }

  // Create the server creation modal
  function createServerCreationModal() {
    // Create modal
    const modal = document.createElement("div");
    modal.id = "ovo-multiplayer-create-server-modal";
    modal.classList.add("ovo-multiplayer-modal");

    // Add wheel event listener to prevent propagation to the game
    modal.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    document.body.appendChild(modal);

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("ovo-multiplayer-modal-content");

    // Add wheel event listener to prevent propagation to the game
    modalContent.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    modal.appendChild(modalContent);

    // Create header
    const header = document.createElement("div");
    header.classList.add("ovo-multiplayer-modal-header");
    modalContent.appendChild(header);

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Create Server";
    header.appendChild(title);

    // Create close button
    const close = document.createElement("span");
    close.classList.add("ovo-multiplayer-modal-close");
    close.innerHTML = "&times;";
    close.onclick = () => {
      hideCreateServerModal();
    };
    header.appendChild(close);

    // Create form content
    const content = document.createElement("div");
    content.classList.add("ovo-multiplayer-modal-body");

    // Add wheel event listener to content
    content.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    modalContent.appendChild(content);

    // Create form elements with server settings
    // --- Server Name ---
    const nameOption = document.createElement("div");
    nameOption.classList.add("ovo-multiplayer-settings-option");
    content.appendChild(nameOption);

    const nameLabel = document.createElement("label");
    nameLabel.innerText = "Server Name:";
    nameOption.appendChild(nameLabel);

    // Use contenteditable div instead of input for better interaction
    const nameInput = document.createElement("div");
    nameInput.id = "ovo-multiplayer-server-name-input";
    nameInput.className =
      "ovo-multiplayer-input ovo-multiplayer-chat-contenteditable";
    nameInput.contentEditable = "true";
    nameInput.setAttribute("spellcheck", "false");
    nameInput.textContent = `${state.username}'s Server`;
    nameInput.style.minHeight = "20px";
    nameInput.style.cursor = "text";
    nameInput.tabIndex = "1"; // Make it focusable with Tab

    // Add event handlers to stop propagation
    nameInput.addEventListener("mousedown", (e) => e.stopPropagation());
    nameInput.addEventListener("mousemove", (e) => e.stopPropagation());
    nameInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => nameInput.focus(), 0);
    });
    nameInput.addEventListener("click", (e) => e.stopPropagation());
    nameInput.addEventListener("selectstart", (e) => e.stopPropagation());

    // Add keyboard event handling
    nameInput.addEventListener("keydown", (e) => {
      e.stopPropagation();

      // Handle Tab key to navigate to the next element
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        maxPlayersInput.focus();
      }

      // Handle Enter key to submit the form
      if (e.key === "Enter") {
        e.preventDefault();
        createButton.click();
      }

      // Handle Escape key to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    nameOption.appendChild(nameInput);

    // --- Max Players ---
    const maxPlayersOption = document.createElement("div");
    maxPlayersOption.classList.add("ovo-multiplayer-settings-option");
    content.appendChild(maxPlayersOption);

    const maxPlayersLabel = document.createElement("label");
    maxPlayersLabel.innerText = "Max Players:";
    maxPlayersOption.appendChild(maxPlayersLabel);

    // Keep as standard input for number type but add event handlers
    const maxPlayersInput = document.createElement("input");
    maxPlayersInput.type = "number";
    maxPlayersInput.id = "ovo-multiplayer-max-players-input";
    maxPlayersInput.classList.add("ovo-multiplayer-input");
    maxPlayersInput.value = "8";
    maxPlayersInput.min = "1";
    maxPlayersInput.max = "16";
    maxPlayersInput.tabIndex = "2"; // Make it focusable with Tab

    // Add event handlers to stop propagation
    maxPlayersInput.addEventListener("mousedown", (e) => e.stopPropagation());
    maxPlayersInput.addEventListener("mousemove", (e) => e.stopPropagation());
    maxPlayersInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => maxPlayersInput.focus(), 0);
    });
    maxPlayersInput.addEventListener("click", (e) => e.stopPropagation());

    // Add keyboard event handling
    maxPlayersInput.addEventListener("keydown", (e) => {
      e.stopPropagation();

      // Handle Tab navigation
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          // Go to previous field
          nameInput.focus();
        } else {
          // Go to next field
          privateCheckbox.focus();
        }
      }

      // Handle Enter key to submit the form
      if (e.key === "Enter") {
        e.preventDefault();
        createButton.click();
      }

      // Handle Escape key to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    maxPlayersOption.appendChild(maxPlayersInput);

    // --- Private Server ---
    const privateOption = document.createElement("div");
    privateOption.classList.add("ovo-multiplayer-settings-option");
    content.appendChild(privateOption);

    const privateLabel = document.createElement("label");
    privateLabel.innerText = "Private Server:";
    privateOption.appendChild(privateLabel);

    const privateCheckbox = document.createElement("input");
    privateCheckbox.type = "checkbox";
    privateCheckbox.id = "ovo-multiplayer-private-checkbox";
    privateCheckbox.tabIndex = "3"; // Make it focusable with Tab

    // Add event handlers to stop propagation
    privateCheckbox.addEventListener("mousedown", (e) => e.stopPropagation());
    privateCheckbox.addEventListener("mousemove", (e) => e.stopPropagation());
    privateCheckbox.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => privateCheckbox.focus(), 0);
    });
    privateCheckbox.addEventListener("click", (e) => e.stopPropagation());

    // Add keyboard event handling
    privateCheckbox.addEventListener("keydown", (e) => {
      e.stopPropagation();

      // Handle Tab navigation
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          // Go to previous field
          maxPlayersInput.focus();
        } else {
          // Go to next field
          passwordInput.focus();
        }
      }

      // Handle space to toggle checkbox
      if (e.key === " ") {
        e.preventDefault();
        privateCheckbox.checked = !privateCheckbox.checked;
      }

      // Handle Enter key to submit the form
      if (e.key === "Enter") {
        e.preventDefault();
        createButton.click();
      }

      // Handle Escape key to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    privateOption.appendChild(privateCheckbox);

    // --- Password ---
    const passwordOption = document.createElement("div");
    passwordOption.classList.add("ovo-multiplayer-settings-option");
    content.appendChild(passwordOption);

    const passwordLabel = document.createElement("label");
    passwordLabel.innerText = "Password:";
    passwordOption.appendChild(passwordLabel);

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "ovo-multiplayer-password-input";
    passwordInput.classList.add("ovo-multiplayer-input");
    passwordInput.placeholder = "Optional";
    passwordInput.tabIndex = "4"; // Make it focusable with Tab

    // Add event handlers to stop propagation
    passwordInput.addEventListener("mousedown", (e) => e.stopPropagation());
    passwordInput.addEventListener("mousemove", (e) => e.stopPropagation());
    passwordInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => passwordInput.focus(), 0);
    });
    passwordInput.addEventListener("click", (e) => e.stopPropagation());

    // Add keyboard event handling
    passwordInput.addEventListener("keydown", (e) => {
      e.stopPropagation();

      // Handle Tab navigation
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          // Go to previous field
          privateCheckbox.focus();
        } else {
          // Go to next field
          cancelButton.focus();
        }
      }

      // Handle Enter key to submit the form
      if (e.key === "Enter") {
        e.preventDefault();
        createButton.click();
      }

      // Handle Escape key to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    passwordOption.appendChild(passwordInput);

    // Create actions container
    const actionsContainer = document.createElement("div");
    actionsContainer.style.marginTop = "20px";
    actionsContainer.style.textAlign = "right";
    content.appendChild(actionsContainer);

    // Create cancel button
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("ovo-multiplayer-button");
    cancelButton.innerText = "Cancel";
    cancelButton.style.marginRight = "10px";
    cancelButton.tabIndex = "5"; // Make it focusable with Tab

    cancelButton.onclick = (e) => {
      e.stopPropagation();
      hideCreateServerModal();
    };
    cancelButton.addEventListener("click", (e) => e.stopPropagation());

    // Add keyboard event handling
    cancelButton.addEventListener("keydown", (e) => {
      e.stopPropagation();

      // Handle Tab navigation
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          // Go to previous field
          passwordInput.focus();
        } else {
          // Go to next field
          createButton.focus();
        }
      }

      // Handle Enter/Space key to activate button
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cancelButton.click();
      }

      // Handle Escape key to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    actionsContainer.appendChild(cancelButton);

    // Create create button
    const createButton = document.createElement("button");
    createButton.classList.add("ovo-multiplayer-button");
    createButton.innerHTML = `Create`;
    createButton.tabIndex = "6"; // Make it focusable with Tab

    createButton.onclick = (e) => {
      e.stopPropagation();
      // Get values from form
      const serverName = nameInput.textContent.trim();
      if (!serverName) {
        getDialogAlert({ type: "error", text: "Server name cannot be empty" });
        return;
      }

      const maxPlayersStr = maxPlayersInput.value;
      const maxPlayers = parseInt(maxPlayersStr, 10) || 8;
      const clampedMaxPlayers = Math.min(Math.max(1, maxPlayers), 16);

      const isPrivate = privateCheckbox.checked;
      const password = passwordInput.value || null;

      // Close both modals
      hideCreateServerModal();
      closeServerBrowser();

      // Create room with provided settings
      createRoom(serverName, clampedMaxPlayers, isPrivate, password);
    };
    createButton.addEventListener("click", (e) => e.stopPropagation());

    // Add keyboard event handling
    createButton.addEventListener("keydown", (e) => {
      e.stopPropagation();

      // Handle Tab navigation - circle back to first element
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          // Go to previous field
          cancelButton.focus();
        } else {
          // Go to first field again
          nameInput.focus();
        }
      }

      // Handle Enter/Space key to activate button
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        createButton.click();
      }

      // Handle Escape key to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    actionsContainer.appendChild(createButton);

    // Handle modal keyboard events
    modal.addEventListener("keydown", (e) => {
      // Ensure we stop propagation to the game
      e.stopPropagation();

      // Handle Escape to close the modal
      if (e.key === "Escape") {
        e.preventDefault();
        hideCreateServerModal();
      }
    });

    // Save reference
    serverBrowserState.createServerModal = modal;
  }

  // Show server creation modal
  function showCreateServerModal() {
    if (serverBrowserState.createServerModal) {
      // We keep the same click state map since we're already in a modal (server browser)
      serverBrowserState.createServerModal.style.display = "block";
    }
  }

  // Hide server creation modal
  function hideCreateServerModal() {
    if (serverBrowserState.createServerModal) {
      serverBrowserState.createServerModal.style.display = "none";
      // We don't restore click state here because server browser is still open
    }
  }

  // Show server browser
  async function openServerBrowser() {
    // Check internet connectivity first
    hideServerBrowserTooltip();
    const isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      showNoInternetMessage();
      return;
    }

    if (!serverBrowserState.modal) {
      init$4();
    }

    serverBrowserState.isOpen = true;
    serverBrowserState.modal.focus();
    serverBrowserState.modal.style.display = "block";

    // Disable game clicks while the server browser is open
    serverBrowserState.clickStateMap = disableClick();

    // Refresh server list
    refreshServerList();

    // Set up auto-refresh timer
    serverBrowserState.refreshTimer = setInterval(async () => {
      const isConnected = await checkInternetConnectivity();
      if (isConnected) {
        refreshServerList(true);
      } else {
        // If connection was lost during browser session
        if (serverBrowserState.isOpen) {
          showNoInternetMessage();
          closeServerBrowser();
        }
      }
    }, 10000); // Refresh every 10 seconds
  }

  // Hide server browser
  function closeServerBrowser() {
    if (serverBrowserState.modal) {
      serverBrowserState.modal.style.display = "none";
    }

    // Also hide the create server modal if it's open
    if (serverBrowserState.createServerModal) {
      serverBrowserState.createServerModal.style.display = "none";
    }

    serverBrowserState.isOpen = false;

    // Re-enable game clicks
    if (serverBrowserState.clickStateMap) {
      enableClick(serverBrowserState.clickStateMap);
      serverBrowserState.clickStateMap = null;
    }

    // Clear refresh timer
    if (serverBrowserState.refreshTimer) {
      clearInterval(serverBrowserState.refreshTimer);
      serverBrowserState.refreshTimer = null;
    }
  }

  // Refresh server list
  async function refreshServerList(silent = false) {
    if (!silent) {
      serverBrowserState.servers = [];
      updateServerListUI(true);
    }
    try {
      const response = await fetch(SERVER_API_ENDPOINT);
      const data = await response.json();

      if (data.servers) {
        serverBrowserState.servers = data.servers;
        updateServerListUI();
      }
    } catch (error) {
      console.error("Error refreshing server list:", error);

      // Show fallback server list if API is not available
      serverBrowserState.servers = [];
      updateServerListUI();
    }
  }

  // Update server list UI
  function updateServerListUI(loading = false) {
    const serverListElement = document.getElementById(
      "ovo-multiplayer-server-list"
    );
    if (!serverListElement) return;

    // Clear current list
    serverListElement.innerHTML = "";

    // Check if there are servers
    if (serverBrowserState.servers.length === 0) {
      const noServers = document.createElement("div");
      noServers.style.padding = "20px";
      noServers.style.textAlign = "center";
      noServers.innerText = loading
        ? "Loading..."
        : "No servers available. Create one to get started!";
      serverListElement.appendChild(noServers);
      return;
    }

    // Add each server to the list
    serverBrowserState.servers.forEach((server) => {
      const serverItem = document.createElement("div");
      serverItem.classList.add("ovo-multiplayer-server-item");

      // Server info section
      const serverInfo = document.createElement("div");
      serverInfo.style.flex = "1";
      serverInfo.classList.add("ovo-multiplayer-server-info");
      serverItem.appendChild(serverInfo);

      const serverName = document.createElement("div");
      serverName.classList.add("ovo-multiplayer-server-name");
      serverName.innerText = server.name;
      serverInfo.appendChild(serverName);

      // Add server ID in small text
      const serverIdContainer = document.createElement("div");
      serverIdContainer.style.display = "flex";
      serverIdContainer.style.flexDirection = "row";
      serverIdContainer.style.alignItems = "center";
      const serverId = document.createElement("div");
      serverId.classList.add("ovo-multiplayer-server-id");
      serverId.innerText = `ID: ${server.id}`;
      serverId.style.fontSize = "11px";
      serverId.style.color = "#888";
      serverInfo.appendChild(serverIdContainer);

      // Show lock icon if password protected
      if (server.requiresPassword) {
        const lockIcon = document.createElement("span");
        lockIcon.style.width = "22px";
        lockIcon.style.height = "22px";
        lockIcon.innerHTML = `<img src="lock.svg" width="22" height="22" alt="Password protected" style="margin-right: 8px;">`;
        lockIcon.title = "Password protected";
        serverItem.appendChild(lockIcon);
      }
      serverIdContainer.appendChild(serverId);

      const serverPlayers = document.createElement("div");
      serverPlayers.classList.add("ovo-multiplayer-server-players");
      serverPlayers.innerText = `Players: ${server.players}/${server.maxPlayers}`;
      serverItem.appendChild(serverPlayers);

      // Join button
      const joinButton = document.createElement("button");
      joinButton.classList.add("ovo-multiplayer-server-join");
      // Add arrow icon to join button
      joinButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="vertical-align: middle; margin-right: 5px;">
        <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
      </svg>
      Join`;
      joinButton.onclick = async () => {
        joinRoomWithServerId(server.id);
        closeServerBrowser();
      };

      const actions = document.createElement("div");
      actions.classList.add("ovo-multiplayer-server-actions");
      actions.appendChild(joinButton);

      serverItem.appendChild(actions);
      serverListElement.appendChild(serverItem);
    });
  }

  // Register a server with the API
  async function registerServer(
    peerId,
    serverName,
    maxPlayers = 8,
    isPrivate = false,
    password = null
  ) {
    if (!peerId || !serverName) return null;

    try {
      const response = await fetch(`${SERVER_API_ENDPOINT}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: serverName,
          peerId,
          maxPlayers,
          isPrivate,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        serverBrowserState.currentServerId = data.serverId;
        console.log("Server registered successfully with ID:", data.serverId);
        return data.serverId;
      } else {
        console.error("Failed to register server:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error registering server:", error);
      return null;
    }
  }

  // Update server settings
  async function updateServerSettings(serverId, peerId, settings = {}) {
    if (!serverId || !peerId) return false;

    try {
      const response = await fetch(`${SERVER_API_ENDPOINT}/${serverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          peerId,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error updating server settings:", error);
      return false;
    }
  }

  // Update server player count
  async function updateServerPlayers(serverId, peerId, playerCount) {
    if (!serverId || !peerId) return false;

    try {
      const response = await fetch(`${SERVER_API_ENDPOINT}/${serverId}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          players: playerCount,
          peerId,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error updating server players:", error);
      return false;
    }
  }

  // Unregister a server
  async function unregisterServer(serverId, peerId) {
    if (!serverId || !peerId) return false;

    try {
      const response = await fetch(`${SERVER_API_ENDPOINT}/${serverId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          peerId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        serverBrowserState.currentServerId = null;
      }

      return data.success;
    } catch (error) {
      console.error("Error unregistering server:", error);
      return false;
    }
  }

  // API endpoint for servers

  // detect if running locally
  const local = window.location.hostname === "localhost";
  const SERVER_ENDPOINT_NOPORT = local
    ? "localhost"
    : "classroomcharter.com"; // "127.0.0.1";

  const secure = window.location.protocol === "https:";

  const SERVER_PORT = secure ? 443 : 80;
  const SERVER_ENDPOINT =
    (local ? "http" : "https") +
    "://" +
    SERVER_ENDPOINT_NOPORT +
    (local ? ":" + SERVER_PORT : "");
  const SERVER_API_ENDPOINT = SERVER_ENDPOINT + "/api/servers";
  const SERVER_PEER_PATH = "/ovo-peer";
  const SERVER_TURN_ENDPOINT = SERVER_ENDPOINT + "/api/turn-credentials";

  // Create nanoid implementation
  function customAlphabet(alphabet, size) {
    let random = (a) => crypto.getRandomValues(new Uint8Array(a));
    let customRandom = (a, b, d) => {
      let c = (2 << (Math.log(a.length - 1) / Math.LN2)) - 1;
      let e = -~((1.6 * c * b) / a.length);
      return (h = b) => {
        let f = "";
        for (;;) {
          let i = d(e),
            g = e;
          for (; g--; ) if ((f += a[i[g] & c] || "").length === h) return f;
        }
      };
    };
    return customRandom(alphabet, size, random);
  }

  // Generate a random room code using nanoid
  customAlphabet(
    "6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz",
    6
  );

  const generateUUID = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    16
  );

  // Check if a user can join
  function canUserJoin(user) {
    return userIsOnMyVersion(user) && !userIsBanned(user);
  }

  // Check if I can join the host
  function canIJoinHost() {
    if (!state.connectedToRoom) {
      return false;
    }
    if (state.isHost) {
      return true;
    }
    // Find host in connections
    let host = state.connections.find((c) => c.data?.isHost);
    if (host) {
      return host.data.version === VERSION;
    }
    return false;
  }

  // Check if user is on same version
  function userIsOnMyVersion(user) {
    if (!user) {
      return false;
    }
    return user.version === VERSION;
  }

  // Check if user is banned
  function userIsBanned(user) {
    if (!user) {
      return false;
    }

    let bannedUser = state.bannedUsers.find((u) => u.UID === user.UID);
    if (bannedUser) {
      return true;
    }

    bannedUser = state.permaBannedUsers.find((u) => u.UID === user.UID);
    if (bannedUser) {
      return true;
    }

    return false;
  }

  // Create a new room as host
  async function createRoom(
    roomName = null,
    maxPlayers = 8,
    isPrivate = false,
    password = null
  ) {
    // Check internet connectivity first
    const isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      showNoInternetMessage();
      return;
    }

    state.connectedToRoom = true;
    state.isHost = true;
    state.chat = [];
    state.bannedUsers = [];
    state.mutedUsers = [];
    updateBanlist();

    // Save room settings
    state.roomName = roomName || `${state.username}'s Room`;
    state.maxPlayers = maxPlayers;
    state.isPrivate = isPrivate;
    state.roomPassword = password;

    // Create a new Peer instance directly
    state.peer = await initPeer();

    state.peer.on("error", (error) => {
      if (
        error.type === "network" ||
        error.type === "server-error" ||
        error.type === "socket-error"
      ) {
        showNoInternetMessage();
        leaveRoom();
      }
    });

    state.peer.on("open", async (id) => {
      // Register the server with our API
      if (roomName) {
        const serverId = await registerServer(
          id,
          state.roomName,
          state.maxPlayers,
          state.isPrivate,
          state.roomPassword
        );

        if (serverId) {
          state.serverId = serverId;
        }
      }

      // Show the ID on screen and allow players to copy it
      // console.log("My peer ID is: " + id);
      // notify("Room created", "My peer ID is: " + id);
      updateDomContainers();
      updateQueryStrings();
      state.initialUsername = state.username;
      updateUserList(true);

      // Start the heartbeat to update player count
      startServerHeartbeat();
    });

    state.peer.on("connection", (conn) => {
      let myConnObject = {
        conn,
        id: conn.peer,
        data: null,
        player: null,
      };

      let isBannedUser = false;
      conn.on("open", () => {
        state.connections.push(myConnObject);
        // Receive messages
        conn.on("data", (data) => {
          if (data.type === DATA_TYPES.CHAT) {
            pushChat(data.payload, true);
          } else if (data.type === DATA_TYPES.PLAYER_DATA) {
            if (myConnObject.data === null) {
              // Check if user can join
              if (!canUserJoin(data.payload)) {
                isBannedUser = true;
                conn.close();
                return;
              }

              // Check if server is full
              if (
                state.maxPlayers &&
                state.connections.length > state.maxPlayers
              ) {
                conn.send({
                  type: DATA_TYPES.SERVER_FULL,
                  payload: { message: "Server is full" },
                });
                conn.close();
                return;
              }

              notifyPlayerUpdate(data.payload.username, data.payload.skin, true);

              // Let every one else know they joined
              state.connections.forEach((connection) => {
                if (connection.conn !== conn) {
                  connection.conn.send({
                    type: DATA_TYPES.PLAYER_JOIN,
                    payload: {
                      username: data.payload.username,
                      skin: data.payload.skin,
                    },
                  });
                }
              });

              // Update server player count
              updateServerPlayerCount();
            }

            myConnObject.data = data.payload;

            if (data.payload && data.payload.timestamp) {
              myConnObject.data.ping = Date.now() - data.payload.timestamp;
            }

            updateUserList();
          }
        });

        let closeConn = () => {
          if (!isBannedUser) {
            notifyPlayerUpdate(
              myConnObject?.data?.username ?? "Player",
              myConnObject?.data?.skin ?? "default",
              false
            );
          }

          destroyGhostPlayer(myConnObject.player);

          // Remove connection from list
          state.connections.splice(
            state.connections.findIndex((x) => x.id === conn.peer),
            1
          );

          updateUserList();

          // Update server player count
          updateServerPlayerCount();

          // Let other connections know this one dropped
          state.connections.forEach((connection) => {
            connection.conn.send({
              type: DATA_TYPES.PLAYER_LEAVE,
              payload: {
                id: conn.peer,
              },
            });
          });
        };

        conn.on("close", closeConn);
        conn.on("error", closeConn);
      });
    });
  }

  // Join an existing room
  async function joinRoom(roomId, serverId) {
    // Check internet connectivity first
    // Show joining overlay

    // Prevent multiple join attempts
    if (state.isJoiningRoom) {
      return;
    }

    // Check if roomid is url using regex
    if (
      roomId.match(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
      )
    ) {
      roomId = getQueryString(roomId).roomCode;
    }

    if (!roomId) return;
    showJoiningOverlay(serverId || roomId);
    const isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      showNoInternetMessage();
      hideJoiningOverlay();
      return;
    }

    state.isHost = false;

    // Create a new Peer instance for the client directly
    state.peer = await initPeer();

    state.peer.on("error", (error) => {
      if (
        error.type === "network" ||
        error.type === "server-error" ||
        error.type === "socket-error"
      ) {
        showNoInternetMessage();
        leaveRoom();
      }
    });

    state.peer.on("open", (id) => {
      // Connect to the host using the room ID
      state.conn = state.peer.connect(roomId);

      state.conn.on("error", async () => {
        hideJoiningOverlay();
        showNoInternetMessage();
        leaveRoom();
      });

      state.conn.on("open", async () => {
        hideJoiningOverlay();
        state.initialUsername = state.username;
        state.connectedToRoom = true;
        let firstData = true;
        notify("Joined room", "Connected to room " + serverId);
        state.serverId = serverId;
        updateQueryStrings();
        updateDomContainers();

        // Receive messages
        state.conn.on("data", (data) => {
          if (data.type === DATA_TYPES.HOST_DATA) {
            // Update other players besides me
            let otherData = data.payload;

            Object.keys(otherData).forEach((id) => {
              if (id === state.peer.id) return;

              let connection = state.connections.find(
                (connection) => connection.id === id
              );

              let playerData = otherData[id];
              playerData.ping = Date.now() - playerData.timestamp;

              if (!connection) {
                connection = {
                  id: id,
                  data: playerData,
                  player: null,
                };
                state.connections.push(connection);
              } else {
                connection.data = playerData;
              }

              // Create player if needed
              if (!connection.player) {
                connection.player = createGhostPlayer(playerData);
              } else if (playerData.layout !== getCurLayout()) {
                // Destroy player
                destroyGhostPlayer(connection.player);
                connection.player = null;
              } else {
                loadPlayerData(connection.player, playerData);
              }
            });

            updateUserList();

            if (firstData) {
              firstData = false;
              if (!canIJoinHost()) {
                state.conn.close();
              }
            }
          } else if (data.type === DATA_TYPES.CHAT) {
            pushChat(data.payload, false);
          } else if (data.type === DATA_TYPES.PLAYER_JOIN) {
            notifyPlayerUpdate(data.payload.username, data.payload.skin, true);
          } else if (data.type === DATA_TYPES.PLAYER_LEAVE) {
            let connectionId = state.connections.findIndex(
              (connection) => connection.id === data.payload.id
            );
            let connection = state.connections[connectionId];

            notifyPlayerUpdate(
              connection.data.username,
              connection.data.skin,
              false
            );

            destroyGhostPlayer(connection.player);

            // Remove connection from list
            state.connections.splice(connectionId, 1);
            updateUserList();
          } else if (data.type === DATA_TYPES.SERVER_FULL) {
            notify(
              "Server full",
              "The server is full and cannot accept more players"
            );
            leaveRoom();
          } else if (data.type === DATA_TYPES.HOST_DISCONNECT) {
            notify(
              "Connection lost",
              "Host left the room, server is shutting down"
            );
            leaveRoom();
          }
        });

        let closeConn = () => {
          if (!state.connectedToRoom) return;
          notify("Connection lost", "Host left the room, or you left the room");
          leaveRoom();
        };

        state.conn.on("close", closeConn);
      });
    });
  }

  async function joinRoomWithServerId(serverId, silent = false) {
    showJoiningOverlay(serverId);
    // Check internet connectivity first
    const isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      showNoInternetMessage();
      return;
    }

    try {
      // First, check if the server requires a password
      const response = await fetch(`${SERVER_API_ENDPOINT}/${serverId}`);
      const server = await response.json();

      let password = null;

      hideJoiningOverlay();

      if (server && server.requiresPassword) {
        password = await getDialogPrompt({
          text: "Enter server password",
          value: "",
          type: "password",
        });

        if (password === null) return; // User cancelled
      }

      showJoiningOverlay(serverId);

      // Now try to join the server
      const joinResponse = await fetch(`${SERVER_API_ENDPOINT}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId,
          password,
        }),
      });

      const joinData = await joinResponse.json();

      hideJoiningOverlay();
      if (!joinData.success) {
        if (!silent) {
          notify("Join failed", "Failed to join server. " + joinData.error);
        } else {
          let queryStrings = getQueryString();
          delete queryStrings.roomCode;
          setQueryString(queryStrings);
        }
        return;
      }

      // Success, join with the peer ID
      joinRoom(joinData.peerId, serverId);
      //notify("Joining server", `Connecting to ${joinData.name}`);
    } catch (error) {
      hideJoiningOverlay();
      console.error("Error joining server:", error);
      if (!silent) {
        notify(
          "Join failed",
          "Failed to join server. Please check your connection and try again."
        );
      } else {
        let queryStrings = getQueryString();
        delete queryStrings.roomCode;
        setQueryString(queryStrings);
      }
    }
  }

  async function fetchTurnCredentials() {
    try {
      const response = await fetch(SERVER_TURN_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch TURN credentials");
      return await response.json();
    } catch (error) {
      console.error("Error fetching TURN credentials:", error);
      // Fallback to public STUN servers only
      return {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
            ],
          },
        ],
      };
    }
  }

  async function initPeer() {
    let config = await fetchTurnCredentials();

    // get debug value from query string
    const debug = getQueryString().debug;

    const extra = {};
    if (debug) {
      extra.debug = 3;
    }

    return new $416260bce337df90$export$ecd1fc136c422448(undefined, {
      host: SERVER_ENDPOINT_NOPORT,
      path: SERVER_PEER_PATH,
      port: SERVER_PORT,
      secure: secure,
      config,
      ...extra,
    });
  }

  function cancelJoinRoom() {
    // If we are currently joining a room, cancel it
    if (state.isJoiningRoom) {
      hideJoiningOverlay();
      if (state.peer) {
        state.peer.destroy();
        state.peer = null;
      }
      if (state.conn) {
        state.conn.close();
        state.conn = null;
      }
    }
    leaveRoom();
  }

  // Leave the current room
  function leaveRoom() {
    if (!state.connectedToRoom) return;

    // Unregister server if I'm the host
    if (state.isHost && state.serverId) {
      unregisterServer(state.serverId, state.peer.id);
      state.serverId = null;

      // Stop heartbeat
      if (state.heartbeatInterval) {
        clearInterval(state.heartbeatInterval);
        state.heartbeatInterval = null;
      }

      state.connections.forEach((connection) => {
        connection.conn.send({
          type: DATA_TYPES.HOST_DISCONNECT,
        });
        connection.conn.close();
      });
    }

    // Close chat overlay if it's currently open
    let chatInput = document.getElementById("ovo-multiplayer-chat-input");
    if (
      chatInput &&
      chatInput.style.display !== "none" &&
      globalThis.toggleChatBox
    ) {
      globalThis.toggleChatBox();
    }

    state.isHost = false;
    state.connectedToRoom = false;
    updateQueryStrings();

    state.peer.destroy();
    state.peer = null;
    state.conn = null;

    state.connections.forEach((connection) => {
      destroyGhostPlayer(connection.player);
    });

    state.connections = [];
    updateDomContainers();
    updateUserList();
    notify("Left room");

    if (state.initialUsername && state.initialUsername !== state.username) {
      state.username = state.initialUsername;
    }

    // Clear chat
    clearChat();
  }

  // Start server heartbeat to update player count
  function startServerHeartbeat() {
    if (state.heartbeatInterval) {
      clearInterval(state.heartbeatInterval);
    }

    // Only hosts need to send heartbeats
    if (!state.isHost || !state.serverId) return;

    // Initially update the player count
    updateServerPlayerCount();

    // Set up interval to update player count
    state.heartbeatInterval = setInterval(() => {
      if (state.connectedToRoom && state.isHost && state.serverId) {
        updateServerPlayerCount();
      } else {
        clearInterval(state.heartbeatInterval);
        state.heartbeatInterval = null;
      }
    }, 30000); // Every 30 seconds
  }

  // Update the server player count
  function updateServerPlayerCount() {
    if (!state.isHost || !state.serverId || !state.peer || !state.peer.id) return;

    // Count includes host + connections
    const playerCount = 1 + state.connections.length;

    updateServerPlayers(state.serverId, state.peer.id, playerCount);
  }

  // Update query strings in URL
  function updateQueryStrings() {
    let queryStrings = {};

    if (state.connectedToRoom) {
      queryStrings.roomCode = getRoomCode();
    }

    if (WebSdkWrapper?.currentSdk?.name === "CrazyGames") {
      WebSdkWrapper.currentSdk.sdk.inviteLink(queryStrings);
    } else {
      setQueryString(queryStrings);
    }
  }

  // Get current room code
  function getRoomCode() {
    if (!state.connectedToRoom) return;
    return state.serverId;
  }

  // Send player updates to peers
  function sendPlayerUpdates() {
    destroyNonPlayerGhosts();

    state.connections.forEach((connection) => {
      if (!connection.data) return;

      if (!connection.player) {
        connection.player = createGhostPlayer(connection.data);
      } else if (connection.data.layout !== getCurLayout()) {
        // Destroy player
        destroyGhostPlayer(connection.player);
        connection.player = null;
      } else {
        loadPlayerData(connection.player, connection.data);
      }
    });

    if (state.isHost) {
      if (!state.peer) return;
      let otherData = {};

      state.connections.forEach((connection) => {
        otherData[connection.id] = connection.data;
      });

      // Add my data with my id to other data
      otherData[state.peer.id] = getMyData();

      // Send all player data you received
      state.connections.forEach((connection) => {
        connection.conn.send({
          type: DATA_TYPES.HOST_DATA,
          payload: otherData,
        });
      });
    } else {
      // Send only your player data
      state.conn.send({
        type: DATA_TYPES.PLAYER_DATA,
        payload: getMyData(),
      });
    }
  }

  // Notify player update (join/leave)
  function notifyPlayerUpdate(name, skin, hasJoined = true) {
    let skinImage = getSkinIconFromSkinName$1(skin);

    if (hasJoined) {
      notify(name, "has joined the room", skinImage);
    } else {
      notify(name, "has left the room", skinImage);
    }
  }

  // Initialize network module
  function init$3() {
    state.connections = [];
    state.heartbeatInterval = null;
    state.serverId = null;
    state.roomName = null;
    state.maxPlayers = 8;
    state.isPrivate = false;
    state.roomPassword = null;
    // No need to preload PeerJS anymore as we're importing it directly
  }

  // UI management for OvO multiplayer

  // Add CSS styles
  function addStyles() {
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
    /* Theme Variables */
    :root {
      --bg-color: #ffffff;
      --text-color: #000000;
      --primary-color: #000000;
      --secondary-color: #ffffff;
      --border-color: #000000;
      --element-bg: rgba(255, 255, 255, 0.6);
      --element-hover-bg: rgba(255, 255, 255, 0.8);
      --list-item-bg: rgba(255, 255, 255, 1);
      --list-item-hover-bg: rgba(240, 240, 240, 1);
      --button-bg: #000000;
      --button-text: #ffffff;
      --button-hover-bg: #333333;
      --modal-bg: #ffffff;
      --modal-text: #000000;
      --modal-border: #000000;
      --tab-active-bg: #000000;
      --tab-active-text: #ffffff;
      --tab-bg: #dddddd;
      --tab-text: #000000;
      --input-bg: #ffffff; /* Added for consistency */
      --input-text: #000000; /* Added for consistency */
      --input-border: #000000; /* Added for consistency */
      --list-item-bg: rgba(255, 255, 255, 0.8); /* Added for settings list items */
      --list-item-border: #cccccc; /* Added for settings list items */
      --list-item-hover-bg: rgba(240, 240, 240, 0.9); /* Added for settings list items */
      --action-button-bg: #eeeeee; /* Added for settings action buttons */
      --action-button-text: #000000; /* Added for settings action buttons */
      --action-button-border: #bbbbbb; /* Added for settings action buttons */
      --action-button-hover-bg: #dddddd; /* Added for settings action buttons */

      /* Dialog Specific Variables */
      --dialog-overlay-bg: rgba(0, 0, 0, 0.7);
      --dialog-shadow: rgba(0, 0, 0, 0.2);
      --dialog-input-border: #cccccc;
      --dialog-button-border: #555555;
      --dialog-confirm-button-bg: #4CAF50; /* Green */
      --dialog-confirm-button-hover-bg: #45a049;
      --dialog-cancel-button-bg: #f44336; /* Red */
      --dialog-cancel-button-hover-bg: #da190b;
    }

    /* Dark Theme */
    .dark-theme {
      --bg-color: #121212;
      --text-color: #ffffff;
      --primary-color: #ffffff;
      --secondary-color: #121212;
      --border-color: #ffffff;
      --element-bg: rgba(40, 40, 40, 0.8);
      --element-hover-bg: rgba(60, 60, 60, 0.9);
      --list-item-bg: rgba(50, 50, 50, 1);
      --list-item-hover-bg: rgba(70, 70, 70, 1);
      --button-bg: #333333;
      --button-text: #ffffff;
      --button-hover-bg: #555555;
      --modal-bg: #1f1f1f;
      --modal-text: #ffffff;
      --modal-border: #ffffff;
      --tab-active-bg: #4d4d4d;
      --tab-active-text: #ffffff;
      --tab-bg: #2d2d2d;
      --tab-text: #cccccc;
      --input-bg: #2d2d2d; /* Added for consistency */
      --input-text: #ffffff; /* Added for consistency */
      --input-border: #555555; /* Added for consistency */
      --list-item-bg: rgba(50, 50, 50, 0.8); /* Added for settings list items */
      --list-item-border: #444444; /* Added for settings list items */
      --list-item-hover-bg: rgba(70, 70, 70, 0.9); /* Added for settings list items */
      --action-button-bg: #444444; /* Added for settings action buttons */
      --action-button-text: #ffffff; /* Added for settings action buttons */
      --action-button-border: #666666; /* Added for settings action buttons */
      --action-button-hover-bg: #555555; /* Added for settings action buttons */

      /* Dialog Specific Variables */
      --dialog-overlay-bg: rgba(0, 0, 0, 0.8);
      --dialog-shadow: rgba(255, 255, 255, 0.1);
      --dialog-input-border: #444444;
      --dialog-button-border: #777777;
      --dialog-confirm-button-bg: #388E3C; /* Darker Green */
      --dialog-confirm-button-hover-bg: #2E7D32;
      --dialog-cancel-button-bg: #D32F2F; /* Darker Red */
      --dialog-cancel-button-hover-bg: #C62828;
    }

    /* Use theme variables */
    .ovo-multiplayer-toggle-button {
      background-color: transparent;
      position: absolute;
      top: 0;
      left: calc(50% - 20px);
      color: var(--text-color);
      border: none;
      font-family: "Retron2000";
      z-index: 9999999999999999;
      cursor: pointer;
      transition: opacity 0.23s;
      font-size: 10pt;
      padding: 2px;
      opacity: 0.5;
    }
    .ovo-multiplayer-toggle-button:hover {
      opacity: 1;
    }
    .ovo-multiplayer-toggle-button:active {
      opacity: 0.7;
    }
    .ovo-multiplayer-toggle-icon {
      width: 38px;
      height: 38px;
      filter: var(--icon-filter, none);
    }
    /*
    .dark-theme .ovo-multiplayer-toggle-icon {
      filter: invert(1);
    }
    */
    .ovo-multiplayer-button {
      background-color: var(--button-bg);
      color: var(--button-text);
      border: none;
      margin-left: 2px;
      font-family: "Retron2000";
      z-index: 99998;
      cursor: pointer;
      transition: background-color 0.23s;
      font-size: 10pt;
      min-width: 50px;
      padding: 5px 10px;
    }
    .ovo-multiplayer-button:hover {
      background-color: var(--button-hover-bg);
    }
    .ovo-multiplayer-button:active {
      background-color: rgba(80, 80, 80, 1);
    }
    .ovo-multiplayer-button-holder {
      position: absolute;
      z-index: 99999;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: end;
      flex-wrap: nowrap;
    }
    .ovo-multiplayer-text-box {
      background-color: var(--element-bg);
      border: solid;
      border-color: var(--border-color);
      border-width: 2px;
      font-family: "Retron2000";
      position: absolute;
      z-index: 99998;
      transition: background-color 0.23s;
      scrollbar-color: #888 #f1f1f1;
      scrollbar-width: thin;
      pointer-events: all;
      color: var(--text-color);
    }
    .ovo-multiplayer-text-box:hover {
      background-color: var(--element-hover-bg);
    }
    .ovo-multiplayer-chat-input {
      background-color: var(--element-bg);
      font-family: "Retron2000";
      position: absolute;
      z-index: 99998;
      bottom: 0px;
      left: 0;
      width: 400px;
      height: 60px;
      resize: none;
      display: none;
      pointer-events: all;
      cursor: text;
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      color: var(--text-color);
      padding: 5px; /* Added padding */
      box-sizing: border-box; /* Ensure padding is included in width/height */
      border-top: 2px solid var(--border-color);
    }

    .ovo-multiplayer-chat-input::selection {
      background-color: #4d82f3;
      color: var(--text-color);
    }

    .ovo-multiplayer-chat-contenteditable {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-y: auto;
      text-align: left;
    }
    .ovo-multiplayer-chat-element{
      display: flex;
      flex-direction: row;
      width: 100%;
      white-space: pre;
      background-color: var(--element-bg);
      border: solid;
      border-color: var(--border-color);
      border-width: 0px 0px 2px;
      font-family: "Retron2000";
    }
    .ovo-multiplayer-chat-sub-element{
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 0px 6px 2px 2px;
    }
    .ovo-multiplayer-chat-sub-sub-element{
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
    .ovo-multiplayer-chat-text{
      font-size: 10pt;
      width: 100%;
      margin-top: 2px;
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .ovo-multiplayer-chat-username{
      font-weight: bold;
      font-size: 11pt;
    }
    .ovo-multiplayer-chat-timestamp{
      font-size: 8pt;
      white-space: initial;
      margin-left: 6px;
      text-align: end;
    }
    .ovo-multiplayer-chat-icon{
      width: 32px;
      height: 32px;
      margin: 6px;
    }
    /* Main UI User List Element */
    .ovo-multiplayer-user-element{
      display: flex;
      flex-direction: row;
      width: 100%;
      white-space: pre;
      background-color: var(--element-bg);
      border: solid;
      border-color: var(--border-color);
      border-width: 0px 0px 2px;
      font-family: "Retron2000";
      align-items: center;
      pointer-events: all;
    }
    .ovo-multiplayer-user-sub-element{
      display: flex;
      flex-direction: row;
      width: 100%;
      margin: 0px 6px 2px 2px;
      justify-content: space-between;
      align-items: center;
    }
    .ovo-multiplayer-user-sub-sub-element{
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: center;
      justify-content: space-between;
    }
    .ovo-multiplayer-user-buttons{
      font-size: 10pt;
      margin-top: 2px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 6px;
    }
    .ovo-multiplayer-user-button {
      background-color: var(--secondary-color);
      border: solid;
      border-color: var(--border-color);
      border-width: 2px;
      font-family: "Retron2000";
      padding: 4px 8px;
      cursor: pointer;
      min-width: 50px;
      transition: background-color 0.23s;
      pointer-events: all;
      color: var(--text-color);
    }
    .ovo-multiplayer-user-button:hover {
      background-color: var(--element-hover-bg);
    }
    .ovo-multiplayer-user-button:active {
      background-color: rgba(200, 200, 200, 1);
    }
    
    /* Hamburger Menu Styles */
    .ovo-multiplayer-user-hamburger {
      background-color: var(--secondary-color);
      border: solid;
      border-color: var(--border-color);
      border-width: 2px;
      font-family: "Retron2000";
      margin-left: 6px;
      padding: 4px 8px;
      cursor: pointer;
      min-width: 30px;
      height: 24px;
      transition: background-color 0.23s;
      pointer-events: all;
      color: var(--text-color);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .ovo-multiplayer-user-hamburger:hover {
      background-color: var(--element-hover-bg);
    }
    
    .ovo-multiplayer-user-hamburger-lines {
      width: 12px;
      height: 2px;
      background-color: var(--text-color);
      margin: 1px 0;
      transition: 0.3s;
    }
    
    /* Dropdown Menu Styles */
    .ovo-multiplayer-user-dropdown {
      position: absolute;
      right: calc(100% + 10px);
      background-color: var(--element-bg);
      border: 2px solid var(--border-color);
      z-index: 1000;
      display: none;
      flex-direction: row-reverse;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      max-height: 45px;
    }
    
    .ovo-multiplayer-user-dropdown.show {
      display: flex;
    }
    
    .ovo-multiplayer-user-dropdown button {
      background-color: transparent;
      border: none;
      padding: 4px 12px;
      text-align: left;
      cursor: pointer;
      font-family: "Retron2000";
      font-size: 10pt;
      color: var(--text-color);
      border-right: 1px solid var(--border-color);
      transition: background-color 0.2s;
    }
    
    .ovo-multiplayer-user-dropdown button:last-child {
      border-right: none;
    }
    
    .ovo-multiplayer-user-dropdown button:hover {
      background-color: var(--element-hover-bg);
    }
    
    .ovo-multiplayer-user-dropdown button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    /* Join Button Styles */
    .ovo-multiplayer-user-join-button {
      background-color: var(--button-bg);
      color: var(--button-text);
      border: 2px solid var(--border-color);
      font-family: "Retron2000";
      margin-left: 6px;
      padding: 4px 8px;
      cursor: pointer;
      min-width: 50px;
      transition: background-color 0.23s;
      pointer-events: all;
    }
    
    .ovo-multiplayer-user-join-button:hover {
      background-color: var(--button-hover-bg);
    }
    
    .ovo-multiplayer-user-username{
      font-weight: bold;
      font-size: 11pt;
    }
    .ovo-multiplayer-user-extra{
      font-size: 8pt;
      white-space: initial;
      margin-left: 6px;
      text-align: center;
    }
    .ovo-multiplayer-user-icon{
      width: 32px;
      height: 32px;
      margin: 6px;
    }
    /* Main UI Ban List Element (Copied from user list for now) */
    .ovo-multiplayer-banlist-sub-sub-element{
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: center;
      justify-content: space-between;
    }
    .ovo-multiplayer-banlist-buttons{
      font-size: 10pt;
      margin-top: 2px;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #22222222;
    }
    ::-webkit-scrollbar-thumb {
      background: #eeeeeecc;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #eee;
    }
    /* Tooltip */
    .tooltip {
      position: relative;
      border-bottom: 1px dotted var(--border-color);
      font-family: "Retron2000";
      z-index: 9999999999999999;
      pointer-events: all;
    }
    .tooltiptext {
      display: flex;
      flex-direction: column;
      pointer-events: all;
    }
    .tooltip .tooltiptext {
      opacity: 0;
      width: 200px;
      background-color: var(--secondary-color);
      color: var(--text-color);
      font-size: 14pt;
      text-align: center;
      border-radius: 0px;
      border: solid 4px var(--border-color);
      padding: 0.7em;
      position: absolute;
      z-index: 1;
      top: 150%;
      left: 50%;
      margin-left: -116px;
      margin-top: 45px;
      transition: opacity 0.3s;
      user-select: none;
    }
    .tooltip .tooltiptext::after {
      content: "";
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent var(--border-color) transparent;
    }

    .server-browser-tooltip .tooltiptext::after {
      content: "";
      position: absolute;
      top: calc(100% + 4px);
      left: 70px;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: var(--border-color) transparent transparent transparent;
    }
    .tooltipbutton {
      margin-top: 0.7em;
      pointer-events: all;
    }
    /* Pointer interaction control */
    #ovo-multiplayer-disconnected-container {
      pointer-events: none;
    }
    #ovo-multiplayer-other-container {
      pointer-events: none;
    }
    #ovo-multiplayer-container {
      pointer-events: none;
    }
    #ovo-multiplayer-tab-container {
      pointer-events: all;
    }
    .ovo-multiplayer-button-holder {
      pointer-events: all;
    }
    .ovo-multiplayer-tab {
      pointer-events: all;
    }
    .ovo-multiplayer-button {
      pointer-events: all;
    }

    /* Placeholder for contenteditable elements */
    [contenteditable=true]:empty:not(:focus):before {
      content: attr(data-placeholder);
      color: #888;
      font-style: italic;
    }

    [contenteditable=true]:focus {
      outline: none;
    }

    /* Settings Button */
    .ovo-multiplayer-settings-button {
      position: fixed;
      bottom: 0px;
      right: 0px;
      width: 30px;
      height: 30px;
      padding: 5px;
      background-color: var(--button-bg);
      color: var(--button-text);
      border: none;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999999999;
      transition: all 0.3s ease;
      pointer-events: all;
    }

    .ovo-multiplayer-settings-button:hover {
      transform: rotate(30deg);
      background-color: var(--button-hover-bg);
    }

    /* Modal */
    .ovo-multiplayer-modal {
      display: none;
      position: fixed;
      z-index: 99999999999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.7);
      pointer-events: all; /* Allow interaction with modal */
    }

    .ovo-multiplayer-modal-content {
      background-color: var(--modal-bg);
      margin: 5vh auto;
      padding: 20px;
      border: 4px solid var(--modal-border);
      width: 70%;
      max-width: 700px;
      max-height: 90vh;
      position: relative;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      color: var(--modal-text);
      font-family: "Retron2000";
      pointer-events: all; /* Allow interaction with modal content */
      overflow-y: auto; /* Enable scrolling for tall content */
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
    }

    .ovo-multiplayer-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
    }

    .ovo-multiplayer-modal-header h2 {
      margin: 0;
      font-size: 24px;
    }

    .ovo-multiplayer-modal-close {
      color: var(--text-color);
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }

    .ovo-multiplayer-modal-close:hover {
      color: #777;
    }

    .ovo-multiplayer-modal-body {
      margin-bottom: 20px;
    }

    /* Settings Tabs */
    .ovo-multiplayer-settings-tabs {
      display: flex;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 20px;
    }

    .ovo-multiplayer-settings-tab-button {
      background-color: var(--tab-bg);
      border: none;
      outline: none;
      cursor: pointer;
      padding: 10px 20px;
      margin-right: 2px;
      font-family: "Retron2000";
      font-size: 14px;
      transition: 0.3s;
      color: var(--tab-text);
    }

    .ovo-multiplayer-settings-tab-button:hover {
      background-color: var(--button-hover-bg);
      color: var(--button-text);
    }

    .ovo-multiplayer-settings-tab-button.active {
      background-color: var(--tab-active-bg);
      color: var(--tab-active-text);
    }

    .ovo-multiplayer-settings-tab {
      display: none;
      /* Removed padding and border, handled by container */
    }

    /* Settings options */
    .ovo-multiplayer-settings-option {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .ovo-multiplayer-settings-option label {
      margin-right: 10px;
      min-width: 100px;
    }

    .ovo-multiplayer-input, .ovo-multiplayer-select {
      padding: 8px;
      margin-right: 10px;
      font-family: "Retron2000";
      border: 2px solid var(--input-border);
      background-color: var(--input-bg);
      color: var(--input-text);
    }

    /* Custom Select Dropdown Styles */
    .ovo-multiplayer-custom-select-container {
      position: relative;
      display: inline-block;
      font-family: "Retron2000";
      min-width: 120px; /* Adjust as needed */
    }

    .ovo-multiplayer-custom-select-value {
      padding: 8px;
      border: 2px solid var(--input-border);
      background-color: var(--input-bg);
      color: var(--input-text);
      cursor: pointer;
      user-select: none; /* Prevent text selection */
      position: relative; /* For arrow positioning */
      padding-right: 30px; /* Space for arrow */
      min-width: 180px; /* Adjust as needed */
    }

    /* Arrow for the dropdown */
    .ovo-multiplayer-custom-select-value::after {
        content: '▼'; /* Down arrow */
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: var(--text-color);
        pointer-events: none; /* Don't let arrow intercept clicks */
    }

    .ovo-multiplayer-custom-select-options {
      position: absolute;
      top: 100%; /* Position below the value display */
      left: 0;
      right: 0;
      background-color: var(--input-bg);
      border: 2px solid var(--input-border);
      border-top: none; /* Avoid double border */
      z-index: 10; /* Ensure it's above other elements in the modal */
      max-height: 150px; /* Optional: limit height */
      overflow-y: auto; /* Optional: add scroll if many options */
    }

    .ovo-multiplayer-custom-select-option {
      padding: 4px 8px;
      color: var(--input-text);
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid var(--input-border);
      background-color: var(--list-item-bg); /* Background for the list area */
    }

    .ovo-multiplayer-custom-select-option:last-child {
      border-bottom: none; /* Remove border for last item */
    }

    .ovo-multiplayer-custom-select-option:hover {
      background-color: var(--list-item-hover-bg); /* Use existing hover color */
    }

    /* Settings User and Ban Lists Container */
    .ovo-multiplayer-settings-list-container {
      max-height: 40vh;
      overflow-y: auto;
      border: 1px solid var(--border-color); /* Add border to container */
      padding: 5px; /* Add padding to container */
      background-color: var(--element-bg); /* Background for the list area */
    }

    /* Settings User List Item */
    .ovo-multiplayer-settings-user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid var(--list-item-border);
      background-color: var(--list-item-bg);
      transition: background-color 0.2s;
    }
    .ovo-multiplayer-settings-user:last-child {
      border-bottom: none;
    }
    .ovo-multiplayer-settings-user:hover {
      background-color: var(--list-item-hover-bg);
    }

    .ovo-multiplayer-settings-user-info {
      display: flex;
      align-items: center;
      flex-grow: 1; /* Allow info to take up space */
      margin-right: 10px; /* Space before actions */
    }

    .ovo-multiplayer-settings-user-icon {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }

    .ovo-multiplayer-settings-user-details {
        display: flex;
        flex-direction: column;
    }

    .ovo-multiplayer-settings-user-name {
      font-weight: bold;
      font-size: 14px;
    }

    .ovo-multiplayer-settings-user-extra {
      font-size: 11px;
      color: #888;
    }
    .dark-theme .ovo-multiplayer-settings-user-extra {
        color: #aaa;
    }

    .ovo-multiplayer-settings-user-actions {
        display: flex;
        flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
        gap: 5px; /* Space between buttons */
    }

    .ovo-multiplayer-settings-user-action {
      padding: 4px 8px;
      background-color: var(--action-button-bg);
      color: var(--action-button-text);
      border: 1px solid var(--action-button-border);
      cursor: pointer;
      font-family: "Retron2000";
      font-size: 11px;
      transition: background-color 0.2s;
    }

    .ovo-multiplayer-settings-user-action:hover {
      background-color: var(--action-button-hover-bg);
    }
    .ovo-multiplayer-settings-user-action:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Settings Ban List Item */
    .ovo-multiplayer-settings-ban {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid var(--list-item-border);
      background-color: var(--list-item-bg);
      transition: background-color 0.2s;
    }
    .ovo-multiplayer-settings-ban:last-child {
        border-bottom: none;
    }
    .ovo-multiplayer-settings-ban:hover {
      background-color: var(--list-item-hover-bg);
    }

    .ovo-multiplayer-settings-ban-info {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin-right: 10px;
    }

    .ovo-multiplayer-settings-ban-icon {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }

    .ovo-multiplayer-settings-ban-details {
        display: flex;
        flex-direction: column;
    }

    .ovo-multiplayer-settings-ban-name {
      font-weight: bold;
      font-size: 14px;
    }

    .ovo-multiplayer-settings-ban-extra {
      font-size: 11px;
      color: #888;
    }
    .dark-theme .ovo-multiplayer-settings-ban-extra {
        color: #aaa;
    }

    .ovo-multiplayer-settings-ban-type { /* Style for Ban Type text */
      font-size: 11px;
      color: #666;
      margin-left: 5px;
    }
    .dark-theme .ovo-multiplayer-settings-ban-type {
        color: #ccc;
    }

    .ovo-multiplayer-settings-ban-action {
      padding: 4px 8px;
      background-color: var(--action-button-bg);
      color: var(--action-button-text);
      border: 1px solid var(--action-button-border);
      cursor: pointer;
      font-family: "Retron2000";
      font-size: 11px;
      transition: background-color 0.2s;
    }

    .ovo-multiplayer-settings-ban-action:hover {
      background-color: var(--action-button-hover-bg);
    }

    /* Info Tab */
    .ovo-multiplayer-settings-info-content {
      padding: 10px;
    }

    .ovo-multiplayer-settings-info-controls {
      margin-top: 20px;
    }

    .ovo-multiplayer-settings-info-controls h4 {
      margin-bottom: 10px;
    }

    .ovo-multiplayer-settings-info-controls ul {
      padding-left: 20px;
    }

    /* Server Browser */
    .ovo-multiplayer-server-browser {
      background-color: var(--modal-bg);
      border: 4px solid var(--modal-border);
      color: var(--modal-text);
      font-family: "Retron2000";
      padding: 20px;
      width: 80%;
      max-width: 800px;
      margin: 5vh auto;
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }

    .ovo-multiplayer-server-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
    }

    .ovo-multiplayer-server-list {
      max-height: 50vh;
      overflow-y: auto;
    }

    .ovo-multiplayer-server-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .ovo-multiplayer-server-item:hover {
      background-color: var(--element-hover-bg);
    }

    .ovo-multiplayer-server-name {
      font-weight: bold;
      font-size: 16px;
    }

    .ovo-multiplayer-server-players {
      font-size: 14px;
      margin-left: 10px;
    }

    .ovo-multiplayer-server-ping {
      font-size: 14px;
      margin-left: 10px;
    }

    .ovo-multiplayer-server-actions {
      display: flex;
    }

    .ovo-multiplayer-server-join {
      padding: 5px 15px;
      background-color: var(--button-bg);
      color: var(--button-text);
      border: none;
      cursor: pointer;
      margin-left: 10px;
      font-family: "Retron2000";
    }

    .ovo-multiplayer-server-join:hover {
      background-color: var(--button-hover-bg);
    }

    .ovo-multiplayer-server-refresh {
      margin-left: 10px;
      padding: 5px 15px;
      background-color: var(--button-bg);
      color: var(--button-text);
      border: none;
      cursor: pointer;
      font-family: "Retron2000";
    }

    .ovo-multiplayer-server-refresh:hover {
      background-color: var(--button-hover-bg);
    }

    .ovo-multiplayer-server-create {
      margin-left: 10px;
      padding: 5px 15px;
      background-color: var(--button-bg);
      color: var(--button-text);
      border: none;
      cursor: pointer;
      font-family: "Retron2000";
    }

    .ovo-multiplayer-server-create:hover {
      background-color: var(--button-hover-bg);
    }

    /* Credits Tab Styles */
    .ovo-multiplayer-credits-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      height: 100%;
      text-align: center;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1) 100%);
      background-size: 200% 200%;
      animation: shine 3s infinite ease-in-out;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      overflow: hidden;
      position: relative;
    }

    .dark-theme .ovo-multiplayer-credits-container {
      background: linear-gradient(135deg, rgba(40,40,40,0.1) 0%, rgba(80,80,80,0.5) 50%, rgba(40,40,40,0.1) 100%);
      box-shadow: 0 0 15px rgba(255,255,255,0.1);
    }

    @keyframes shine {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 0%; }
    }

    .ovo-multiplayer-credits-logo {
      width: auto;
      height: 80px;
      margin: 10px 0;
      object-fit: contain;
      filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
      transition: transform 0.3s ease;
    }

    .ovo-multiplayer-credits-logo-dedra {
      width: auto;
      height: 120px;
    }

    .dark-theme .ovo-multiplayer-credits-logo {
      filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
    }
    .dark-theme .ovo-multiplayer-credits-logo-dedra {
      filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)) invert(1);
    }

    .ovo-multiplayer-credits-logo:hover {
      transform: scale(1.1);
      cursor: pointer;
    }

    .ovo-multiplayer-credits-text {
      font-family: "Retron2000";
      font-size: 18px;
      font-weight: bold;
      margin: 5px 0 20px 0;
      margin: 0;
      color: var(--text-color);
    }

    .ovo-multiplayer-credits-cross {
      font-size: 30px;
      font-weight: bold;
      margin: 10px 0;
      color: var(--text-color);
    }

    .ovo-multiplayer-credits-collaboration-text {
      font-family: "Retron2000";
      font-size: 16px;
      margin-top: 20px;
      color: var(--text-color);
      line-height: 1.5;
    }

    /* Additional shine effect */
    .ovo-multiplayer-credits-container::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      animation: rotate 10s linear infinite;
      z-index: -1;
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Joining Room Overlay Styles */
    .ovo-multiplayer-joining-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      color: white;
      font-family: Retron2000, Arial, sans-serif;
    }

    .ovo-multiplayer-joining-content {
      text-align: center;
      background-color: rgba(30, 30, 30, 0.9);
      padding: 40px;
      border-radius: 10px;
      border: 2px solid var(--primary-color);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      max-width: 400px;
      width: 90%;
    }

    .ovo-multiplayer-joining-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: var(--primary-color);
    }

    .ovo-multiplayer-joining-message {
      font-size: 16px;
      margin-bottom: 30px;
      opacity: 0.9;
    }

    .ovo-multiplayer-joining-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 30px;
    }

    .ovo-multiplayer-joining-timeout {
      font-size: 14px;
      margin-bottom: 20px;
      color: #ff6b6b;
    }

    .ovo-multiplayer-joining-cancel {
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      font-family: Retron2000, Arial, sans-serif;
      transition: background-color 0.3s;
    }

    .ovo-multiplayer-joining-cancel:hover {
      background-color: #cc0000;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(style);
  }

  // Initialize UI
  function init$2() {
    initDomUI();
    updateDomContainers();
    updateDomUsername();
    updateUserList();

    // Add global event listener to container to capture mouse interactions
    document.getElementById("ovo-multiplayer-container");
  }

  // Update UI visibility based on connection status
  function updateDomContainers() {
    updateChatBox();

    if (state.connectedToRoom) {
      state.connectedContainer.style.display = "block";
      state.connectContainer.style.display = "none";
    } else {
      state.connectedContainer.style.display = "none";
      state.connectContainer.style.display = "block";
    }
  }

  // Update username display
  function updateDomUsername() {
    let text = document.getElementById("ovo-multiplayer-username");
    if (text) text.innerText = "Username: " + state.username;

    // Update username in settings modal if it exists
    let usernameInput = document.getElementById("ovo-multiplayer-username-input");
    if (usernameInput) {
      usernameInput.value = state.username;
    }
  }

  // Set username with validation
  async function setUsernamePrompt() {
    let defaultName = state.username === "" ? "OvO Player" : state.username;
    let isDone = false;

    while (!isDone) {
      let username = await getDialogPrompt({
        text: "Enter your username",
        value: defaultName,
      });

      // Validate username
      if (username === null) {
        // User cancelled
        if (state.username === "") {
          // If username was empty, force them to set one eventually
          await getDialogAlert({
            type: "warning",
            text: "You need to set a username to play online.",
          });
          // Keep looping until they set a name or close the game
        } else {
          isDone = true; // Allow cancel if username is already set
        }
      } else if (username.trim() === "") {
        await getDialogAlert({
          type: "error",
          text: "Username cannot be empty",
        });
      } else if (username.length > 20) {
        defaultName = username;
        await getDialogAlert({
          type: "error",
          text: "Username cannot be longer than 20 characters",
        });
      } else if (username.toLowerCase() !== removeProfanity(username)) {
        defaultName = username;
        await getDialogAlert({
          type: "error",
          text: "Username cannot contain profanity",
        });
      } else {
        isDone = true;
        setUsername(username.trim()); // Trim whitespace
      }
    }
  }

  // Update username in state and UI
  function setUsername(name) {
    state.username = name;

    if (state.usernameInsts) {
      state.usernameInsts.forEach((inst) => {
        inst.text = name;
        inst.updateFont();
      });
    }

    updateDomUsername();
    savePreferences();
  }

  // Copy room code to clipboard
  function copyRoomCode() {
    let toCopy = getRoomCode();

    if (window.WebSdkWrapper?.currentSdk?.name === "CrazyGames") {
      toCopy = WebSdkWrapper.currentSdk.sdk.inviteLink({
        roomCode: toCopy,
      });
    }

    if (toCopy) {
      let textArea = document.createElement("textarea");
      textArea.value = toCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      notify("Invite Copied!", "Room code copied to clipboard");
    }
  }

  // Show joining room overlay
  function showJoiningOverlay(serverName = "") {
    if (state.joinOverlay) return; // Already showing

    state.isJoiningRoom = true;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "ovo-multiplayer-joining-overlay";

    const content = document.createElement("div");
    content.className = "ovo-multiplayer-joining-content";

    const title = document.createElement("div");
    title.className = "ovo-multiplayer-joining-title";
    title.textContent = "Joining Room";

    const message = document.createElement("div");
    message.className = "ovo-multiplayer-joining-message";
    message.textContent = serverName
      ? `Connecting to ${serverName}...`
      : "Connecting to room...";

    const spinner = document.createElement("div");
    spinner.className = "ovo-multiplayer-joining-spinner";

    const timeoutDiv = document.createElement("div");
    timeoutDiv.className = "ovo-multiplayer-joining-timeout";
    timeoutDiv.textContent = "Connection will timeout in 10 seconds";

    const cancelButton = document.createElement("button");
    cancelButton.className = "ovo-multiplayer-joining-cancel";
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => {
      cancelJoinRoom();
    };

    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(spinner);
    content.appendChild(timeoutDiv);
    content.appendChild(cancelButton);
    overlay.appendChild(content);

    document.body.appendChild(overlay);
    state.joinOverlay = overlay;

    // Set timeout to auto-cancel connection (reduced from default to 15 seconds)
    state.joinTimeout = setTimeout(() => {
      cancelJoinRoom();
      notify("Connection timeout", "Failed to connect to room within 10 seconds");
    }, 10000); // 10 seconds timeout

    // Update countdown every second
    let countdown = 10;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (timeoutDiv && countdown > 0) {
        timeoutDiv.textContent = `Connection will timeout in ${countdown} seconds`;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Store interval for cleanup
    overlay.countdownInterval = countdownInterval;
  }

  // Hide joining room overlay
  function hideJoiningOverlay() {
    if (!state.joinOverlay) return;

    state.isJoiningRoom = false;

    // Clear timeout
    if (state.joinTimeout) {
      clearTimeout(state.joinTimeout);
      state.joinTimeout = null;
    }

    // Clear countdown interval
    if (state.joinOverlay.countdownInterval) {
      clearInterval(state.joinOverlay.countdownInterval);
    }

    // Remove overlay from DOM
    if (document.body.contains(state.joinOverlay)) {
      document.body.removeChild(state.joinOverlay);
    }

    state.joinOverlay = null;
  }

  // Show/hide tooltip
  function showTooltip(show = true) {
    let tooltip = document.getElementsByClassName("tooltiptext")[0];
    if (tooltip) {
      tooltip.style.opacity = show ? 1 : 0;
      state.hasClickedTooltip = !show;
      savePreferences();
    }
  }

  // Show server browser guidance tooltip
  function showServerBrowserTooltip() {
    // Only show if user hasn't seen the main tooltip
    if (!state.hasClickedTooltip) {
      return;
    }
    // Create a new tooltip for server browser guidance
    let serverBrowserTooltip = document.createElement("div");
    serverBrowserTooltip.classList.add("tooltip");
    serverBrowserTooltip.classList.add("server-browser-tooltip");
    serverBrowserTooltip.style.position = "fixed";

    let tooltipText = document.createElement("div");
    tooltipText.classList.add("tooltiptext");
    tooltipText.style.opacity = "1";
    tooltipText.style.width = "280px";
    tooltipText.style.marginLeft = "-156px"; // Adjusted for wider tooltip
    tooltipText.style.marginTop = "0px";

    let tooltipTextspan = document.createElement("span");
    tooltipTextspan.innerHTML =
      "Now click the 'Browse Servers' tab to join or create multiplayer rooms!";

    // Create container for buttons
    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.justifyContent = "center";

    // Create "Browse Servers" button
    let browseButton = document.createElement("button");
    browseButton.classList.add("ovo-multiplayer-button");
    browseButton.classList.add("tooltipbutton");
    browseButton.innerHTML = "Browse Servers";
    browseButton.style.backgroundColor = "var(--dialog-confirm-button-bg)";
    browseButton.onclick = () => {
      openServerBrowser();
    };

    // Create "Maybe Later" button
    let laterButton = document.createElement("button");
    laterButton.classList.add("ovo-multiplayer-button");
    laterButton.classList.add("tooltipbutton");
    laterButton.innerHTML = "Maybe Later";
    laterButton.onclick = () => {
      hideServerBrowserTooltip();
    };

    buttonContainer.appendChild(browseButton);
    buttonContainer.appendChild(laterButton);

    tooltipText.appendChild(tooltipTextspan);
    tooltipText.appendChild(buttonContainer);
    serverBrowserTooltip.appendChild(tooltipText);

    // Position the tooltip next to the toggle button
    const buttonHolder = document.querySelector(".ovo-multiplayer-button-holder");
    if (buttonHolder) {
      const rect = buttonHolder.getBoundingClientRect();
      serverBrowserTooltip.style.position = "fixed";
      serverBrowserTooltip.style.left = rect.left + rect.width / 2 + "px";
      serverBrowserTooltip.style.top = rect.top - 165 + "px";
    }

    document.body.appendChild(serverBrowserTooltip);
  }

  // Hide server browser tooltip
  function hideServerBrowserTooltip() {
    const serverBrowserTooltip = document.querySelector(
      ".server-browser-tooltip"
    );
    if (serverBrowserTooltip) {
      document.body.removeChild(serverBrowserTooltip);
    }
  }

  // Get skin icon path from skin name
  function getSkinIconFromSkinName(skinName = "") {
    let skinsData = globalThis.skinsData || [];
    let skin = skinsData.find((skin) => skin.skin === skinName);

    if (skin) {
      return "./" + skin.icon;
    } else {
      // Fallback for default or unknown skins
      return "./default.png";
    }
  }

  // Set query string parameters
  function setQueryString(query) {
    // Set url to have query string
    let url = new URL(window.location.href);
    url.search = new URLSearchParams(query);
    window.history.replaceState({}, "", url.href);
  }

  // Add title logo text
  function spawnTextOnTitleLogo() {
    // Only run on Main Menu
    if (getCurLayout() !== "Main Menu") return;

    // Spawn text on title logo
    let titleLogo = state.types.TitleLogo?.instances[0];
    if (!titleLogo) return;

    // Check if text already exists
    if (globalThis.ovoMultiplayerTitleTextInstance) {
      // Ensure it's visible and positioned correctly if layout reloaded
      let inst = globalThis.ovoMultiplayerTitleTextInstance;
      if (inst.layer !== titleLogo.layer) {
        state.runtime.moveInstanceToLayer(inst, titleLogo.layer);
      }
      inst.x = titleLogo.x;
      inst.y = titleLogo.y - 10;
      inst.opacity = 1;
      inst.update_bbox();
      return;
    }

    titleLogo.angle = 0;
    titleLogo.update_bbox();

    let inst = state.runtime.createInstance(
      state.types.SpriteFont,
      titleLogo.layer,
      titleLogo.x,
      titleLogo.y - 10
    );

    inst.text = "Online v" + VERSION;
    inst.width = titleLogo.width / 2;
    inst.height = titleLogo.height;
    inst.hotspotX = titleLogo.hotspotX;
    inst.hotspotY = titleLogo.hotspotY;
    inst.halign = 0.5;
    inst.valign = 0;
    inst.characterScale = 1;
    inst.update_bbox();

    // Store instance globally to prevent duplicates
    globalThis.ovoMultiplayerTitleTextInstance = inst;

    let pinToInst = (self, otherinst) => {
      if (!self || !otherinst) return; // Add null check
      self.pinObject = otherinst;
      self.pinAngle =
        cr.angleTo(otherinst.x, otherinst.y, self.inst.x, self.inst.y) -
        otherinst.angle;
      self.pinDist = cr.distanceTo(
        otherinst.x,
        otherinst.y,
        self.inst.x,
        self.inst.y
      );
      self.myStartAngle = self.inst.angle;
      self.lastKnownAngle = self.inst.angle;
      self.theirStartAngle = otherinst.angle;
      self.mode = 0; // Pin mode
    };

    // Find the pin behavior instance
    let pinBehaviorInst = inst.behavior_insts.find(
      (x) => x.behavior instanceof cr.behaviors.SkymenPin
    );

    pinToInst(pinBehaviorInst, titleLogo);
  }

  function showCredits() {
    // open settings modal on credits page
    openSettingsModal("credits");
  }

  // Update user list in UI (Main Lobby)
  function updateUserList(force = false) {
    // This function now ONLY updates the main lobby user list
    if (!force && state.selectedTab !== 1) {
      return;
    }

    // Get user list element
    const userList = document.getElementById("ovo-multiplayer-user-list");
    if (!userList) return;

    // Clear existing list
    userList.innerHTML = "";

    // --- Create User Element Helper (Main UI Style) ---
    let createUserElement = () => {
      let userElement = document.createElement("div");
      userElement.className = "ovo-multiplayer-user-element"; // Main UI class

      let userIcon = document.createElement("img");
      userIcon.className = "ovo-multiplayer-user-icon"; // Main UI class
      userElement.appendChild(userIcon);

      let userSubElement = document.createElement("div");
      userSubElement.className = "ovo-multiplayer-user-sub-element"; // Main UI class
      userElement.appendChild(userSubElement);

      let userUsername = document.createElement("div");
      userUsername.className = "ovo-multiplayer-user-username"; // Main UI class
      userSubElement.appendChild(userUsername);

      let userExtraData = document.createElement("div");
      userExtraData.className = "ovo-multiplayer-user-extra"; // Main UI class
      userSubElement.appendChild(userExtraData);

      let userButtonsDiv = document.createElement("div");
      userButtonsDiv.className = "ovo-multiplayer-user-buttons"; // Main UI class
      userSubElement.appendChild(userButtonsDiv);

      // Add hamburger menu button (Main UI Style)
      let hamburgerButton = document.createElement("button");
      hamburgerButton.className = "ovo-multiplayer-user-hamburger"; // Main UI class
      hamburgerButton.innerHTML = `
      <div class="ovo-multiplayer-user-hamburger-lines"></div>
      <div class="ovo-multiplayer-user-hamburger-lines"></div>
      <div class="ovo-multiplayer-user-hamburger-lines"></div>
    `;
      userButtonsDiv.appendChild(hamburgerButton);

      // Create dropdown menu
      let dropdown = document.createElement("div");
      dropdown.className = "ovo-multiplayer-user-dropdown";
      hamburgerButton.appendChild(dropdown);

      // Add dropdown buttons (Settings Style)
      let joinButton = document.createElement("button");
      joinButton.innerHTML = "Join";
      dropdown.appendChild(joinButton);

      // Add dropdown buttons
      let muteButton = document.createElement("button");
      muteButton.innerHTML = "Mute";
      dropdown.appendChild(muteButton);

      let kickButton = document.createElement("button");
      kickButton.innerHTML = "Kick";
      kickButton.disabled = true;
      dropdown.appendChild(kickButton);

      let banButton = document.createElement("button");
      banButton.innerHTML = "Ban";
      banButton.disabled = true;
      dropdown.appendChild(banButton);

      let permaBanButton = document.createElement("button");
      permaBanButton.innerHTML = "Perma Ban";
      permaBanButton.disabled = true;
      dropdown.appendChild(permaBanButton);

      let changeUsernameButton = document.createElement("button");
      changeUsernameButton.innerHTML = "Change Username";
      changeUsernameButton.disabled = true;
      dropdown.appendChild(changeUsernameButton);

      // Add click handler for hamburger menu
      hamburgerButton.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        // Close other dropdowns
        let otherDropdowns = document.querySelectorAll(
          ".ovo-multiplayer-user-dropdown.show"
        );
        otherDropdowns.forEach((d) => {
          if (d !== dropdown) {
            d.classList.remove("show");
          }
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        dropdown.classList.remove("show");
      });

      return {
        elementDiv: userElement,
        usernameDiv: userUsername,
        extraDataDiv: userExtraData,
        buttonsDiv: userButtonsDiv,
        joinButton: joinButton,
        hamburgerButton: hamburgerButton,
        dropdown: dropdown,
        muteButton: muteButton,
        kickButton: kickButton,
        banButton: banButton,
        permaBanButton: permaBanButton,
        changeUsername: changeUsernameButton,
        iconElement: userIcon,
      };
    };

    // --- Update User Element Data (Main UI Logic) ---
    let updateUserElementData = (userElement, user, isMe = false, connection) => {
      userElement.usernameDiv.innerHTML = user.username;
      userElement.extraDataDiv.innerHTML =
        user.layout +
        " - " +
        (user.isHost ? "(host) - " : "") +
        (user.username === user.initialUsername
          ? ""
          : "(" + user.initialUsername + ") - ") +
        (isMe ? "You - " : (user.ping || "?") + "ms - ") +
        user.UID;
      userElement.iconElement.src = getSkinIconFromSkinName(user.skin);

      // --- Button Logic (Main UI) ---
      if (!isMe && connection) {
        // Added connection check
        userElement.muteButton.innerHTML = userIsMuted(connection.id)
          ? "Unmute"
          : "Mute";
        userElement.muteButton.onclick = () => {
          toggleMuteUser(connection.id);
          updateUserList(true); // Update this list
          populateSettingsUserList(); // Update settings list too
        };
        userElement.muteButton.style.display = "block";
        userElement.muteButton.disabled = false;

        // Show hamburger menu for other users
        userElement.hamburgerButton.style.display = "flex";
      } else {
        userElement.muteButton.style.display = "none";
        userElement.muteButton.disabled = true;

        // Hide hamburger menu for self
        userElement.hamburgerButton.style.display = "flex";
      }

      if (state.isHost && !isMe && connection) {
        // Added connection check
        userElement.kickButton.style.display = "block";
        userElement.kickButton.disabled = false;
        userElement.banButton.style.display = "block";
        userElement.banButton.disabled = false;
        userElement.permaBanButton.style.display = "block";
        userElement.permaBanButton.disabled = false;

        userElement.kickButton.onclick = () => kickUser(user, connection);
        userElement.banButton.onclick = () => banUser(user, connection);
        userElement.permaBanButton.onclick = () => permaBanUser(user, connection);
      } else {
        userElement.kickButton.style.display = "none";
        userElement.kickButton.disabled = true;
        userElement.banButton.style.display = "none";
        userElement.banButton.disabled = true;
        userElement.permaBanButton.style.display = "none";
        userElement.permaBanButton.disabled = true;
      }

      if (isMe) {
        userElement.changeUsername.style.display = "block";
        userElement.changeUsername.disabled = false;
        userElement.changeUsername.onclick = async () => {
          await setUsernamePrompt();
          // No need to update element data here, setUsername handles it
          userElement.changeUsername.blur();
        };
      } else {
        userElement.changeUsername.style.display = "none";
        userElement.changeUsername.disabled = true;
      }

      // Join button logic
      if (!isMe && user.layout) {
        userElement.joinButton.style.display = "block";
        userElement.joinButton.disabled = false;
        userElement.joinButton.onclick = () => {
          goToLayout(user.layout);
        };
      } else {
        userElement.joinButton.style.display = "none";
        userElement.joinButton.disabled = true;
      }
    };

    // --- Populate List (Main UI) ---
    const usersToDisplay = [
      { connection: null, data: getMyData(), isMe: true }, // Add self
      ...state.connections.map((conn) => ({
        connection: conn,
        data: conn.data,
        isMe: false,
      })),
    ];

    usersToDisplay.forEach((item) => {
      if (!item.data) return; // Skip if connection data isn't available yet

      let userElement = createUserElement();
      updateUserElementData(userElement, item.data, item.isMe, item.connection);
      userList.appendChild(userElement.elementDiv);
    });

    // Update settings list if it's visible
    let settingsModal = document.getElementById("ovo-multiplayer-settings-modal");
    let userListTabButton = document.getElementById(
      "ovo-multiplayer-settings-user-list-tab-button"
    );
    if (
      settingsModal &&
      settingsModal.style.display === "block" &&
      userListTabButton &&
      userListTabButton.classList.contains("active")
    ) {
      populateSettingsUserList();
    }
  }

  // Update chat box content
  function updateChatBox() {
    let chatBox = document.getElementById("ovo-multiplayer-chat-box");
    if (!chatBox) return;

    chatBox.innerHTML = "";

    // Create chat element helper function
    let createChatElement = (chat) => {
      let chatElement = document.createElement("div");
      chatElement.className = "ovo-multiplayer-chat-element";

      let chatIcon = document.createElement("img");
      chatIcon.className = "ovo-multiplayer-chat-icon";
      chatIcon.src = getSkinIconFromSkinName(chat.skin);
      chatElement.appendChild(chatIcon);

      let chatSubElement = document.createElement("div");
      chatSubElement.className = "ovo-multiplayer-chat-sub-element";
      chatElement.appendChild(chatSubElement);

      let chatSubSubElement = document.createElement("div");
      chatSubSubElement.className = "ovo-multiplayer-chat-sub-sub-element";
      chatSubElement.appendChild(chatSubSubElement);

      let chatUsername = document.createElement("div");
      chatUsername.className = "ovo-multiplayer-chat-username";
      chatUsername.innerText = chat.username;
      chatSubSubElement.appendChild(chatUsername);

      let chatTimestamp = document.createElement("div");
      chatTimestamp.className = "ovo-multiplayer-chat-timestamp";
      chatTimestamp.innerText =
        (chat.username === chat.initialUsername
          ? ""
          : "(" + chat.initialUsername + ") - ") +
        new Date(chat.timestamp).toLocaleTimeString();
      chatSubSubElement.appendChild(chatTimestamp);

      let chatText = document.createElement("div");
      chatText.className = "ovo-multiplayer-chat-text";
      chatText.innerHTML = chat.message; // Use innerHTML to render potential formatting (though profanity filter removes tags)
      chatSubElement.appendChild(chatText);

      return chatElement;
    };

    // Add chat elements
    if (state.chat && state.chat.length > 0 && !state.hideChat) {
      state.chat.forEach((chat) => {
        chatBox.appendChild(createChatElement(chat));
      });
    } else if (state.hideChat) {
      chatBox.innerHTML = "Chat has been disabled. Enable it in settings.";
    } else {
      chatBox.innerHTML = "No chat messages yet...";
    }

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Select a tab (Main UI)
  function selectTab(index) {
    if (
      index === state.selectedTab ||
      index < 0 ||
      index >= state.tabContents.length
    ) {
      return;
    }

    // Hide all tabs
    for (let i = 0; i < state.tabContents.length; i++) {
      state.tabContents[i].style.display = "none";
    }

    // Show this tab
    state.tabContents[index].style.display = "block";

    // Change tab color
    for (let i = 0; i < state.tabs.length; i++) {
      state.tabs[i].style.backgroundColor = "var(--element-hover-bg)"; // Use theme variable
      state.tabs[i].style.color = "var(--text-color)"; // Use theme variable
    }

    state.tabs[index].style.backgroundColor = "var(--button-bg)"; // Use theme variable
    state.tabs[index].style.color = "var(--button-text)"; // Use theme variable
    state.selectedTab = index;

    // --- Handle Chat Input Visibility ---
    let chatInput = document.getElementById("ovo-multiplayer-chat-input");
    document.getElementById("ovo-multiplayer-container");

    if (index === 0) {
      // Chat tab selected
      // Don't automatically show input, wait for Enter or button press
      // Scroll chat to bottom
      let chatBox = document.getElementById("ovo-multiplayer-chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    } else {
      // Other tab selected
      // Hide chat input if it was open
      if (chatInput && chatInput.style.display !== "none") {
        globalThis.toggleChatBox();
      }
    }

    // Update list content if necessary
    if (index === 1) {
      // User list tab
      updateUserList(true);
    } else if (index === 2) {
      // Ban list tab
      updateBanlist(); // Update the main UI ban list
    }
  }

  // Initialize all UI elements
  function initDomUI() {
    // Add CSS
    addStyles();

    // Create main container
    let container = document.createElement("div");
    container.id = "ovo-multiplayer-container";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.backgroundColor = "rgba(0,0,0,0)";
    container.style.zIndex = "9999999999";

    // First container - disconnected
    let disconnectedContainer = document.createElement("div");
    disconnectedContainer.id = "ovo-multiplayer-disconnected-container";
    disconnectedContainer.style.position = "absolute";
    disconnectedContainer.style.top = "0";
    disconnectedContainer.style.left = "0";
    disconnectedContainer.style.width = "100%";
    disconnectedContainer.style.height = "100%";
    disconnectedContainer.style.backgroundColor = "rgba(0,0,0,0)";
    disconnectedContainer.style.zIndex = "9999999999";
    container.appendChild(disconnectedContainer);
    state.connectContainer = disconnectedContainer;

    // Button holder
    let buttonsHolder = document.createElement("div");
    buttonsHolder.classList.add("ovo-multiplayer-button-holder");
    disconnectedContainer.appendChild(buttonsHolder);

    // Add server browser button
    let serverBrowserButton = document.createElement("button");
    serverBrowserButton.innerText = "Browse Servers";
    serverBrowserButton.classList.add("ovo-multiplayer-button");
    serverBrowserButton.onclick = () => {
      openServerBrowser();
      serverBrowserButton.blur();
    };
    serverBrowserButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
    buttonsHolder.appendChild(serverBrowserButton);

    // Add create room button
    let createRoomButton = document.createElement("button");
    createRoomButton.innerText = "Create Room";
    createRoomButton.classList.add("ovo-multiplayer-button");
    createRoomButton.onclick = () => {
      createRoom();
      createRoomButton.blur();
    };
    createRoomButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
    //buttonsHolder.appendChild(createRoomButton);

    // Add join room button
    let joinRoomButton = document.createElement("button");
    joinRoomButton.innerText = "Join Room";
    joinRoomButton.classList.add("ovo-multiplayer-button");
    joinRoomButton.onclick = async () => {};
    joinRoomButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
    //buttonsHolder.appendChild(joinRoomButton);

    // Add set username button
    let setUsernameButton = document.createElement("button");
    setUsernameButton.innerText = "Change Username";
    setUsernameButton.classList.add("ovo-multiplayer-button");
    setUsernameButton.onclick = async () => {
      await setUsernamePrompt();
      setUsernameButton.blur();
    };
    setUsernameButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
    //buttonsHolder.appendChild(setUsernameButton);

    // Add username display
    let text = document.createElement("p");
    text.id = "ovo-multiplayer-username";
    text.style.backgroundColor = "var(--element-bg)"; // Use theme variable
    text.style.zIndex = "9999999999";
    text.style.fontSize = "14px";
    text.style.color = "var(--text-color)"; // Use theme variable
    text.style.textAlign = "left";
    text.style.paddingLeft = "5px";
    text.style.paddingRight = "5px";
    text.style.paddingBottom = "4px";
    text.style.fontFamily = "Retron2000";
    text.style.cursor = "pointer";
    text.addEventListener("click", async (e) => {
      e.stopImmediatePropagation();
      await setUsernamePrompt();
    });
    updateDomUsername();
    buttonsHolder.appendChild(text);

    // Second container - connected
    let connectedContainer = document.createElement("div");
    connectedContainer.id = "ovo-multiplayer-other-container";
    connectedContainer.style.position = "absolute";
    connectedContainer.style.top = "0";
    connectedContainer.style.left = "0";
    connectedContainer.style.width = "100%";
    connectedContainer.style.height = "100%";
    connectedContainer.style.backgroundColor = "rgba(0,0,0,0)";
    connectedContainer.style.zIndex = "9999999999";
    container.appendChild(connectedContainer);
    state.connectedContainer = connectedContainer;

    // Connected buttons holder
    let buttonsHolder2 = document.createElement("div");
    buttonsHolder2.classList.add("ovo-multiplayer-button-holder");
    connectedContainer.appendChild(buttonsHolder2);

    // Add leave room button
    let leaveRoomButton = document.createElement("button");
    leaveRoomButton.innerText = "Leave Room";
    leaveRoomButton.classList.add("ovo-multiplayer-button");
    leaveRoomButton.onclick = () => {
      leaveRoom();

      let chatInput = document.getElementById("ovo-multiplayer-chat-input");
      if (chatInput) {
        chatInput.textContent = ""; // Clear contenteditable
        chatInput.blur();
      }

      container.style.backgroundColor = "rgba(0,0,0,0)";

      if (chatInput && chatInput.style.display !== "none") {
        globalThis.toggleChatBox();
      }

      if (globalThis.ovoMultiplayerChatStateMap) {
        enableClick(globalThis.ovoMultiplayerChatStateMap);
        globalThis.ovoMultiplayerChatStateMap = null;
      }

      leaveRoomButton.blur();
    };
    leaveRoomButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
    buttonsHolder2.appendChild(leaveRoomButton);

    // Copy room code button
    let copyRoomCodeButton = document.createElement("button");
    copyRoomCodeButton.innerText = "Invite Friends";
    copyRoomCodeButton.classList.add("ovo-multiplayer-button");
    copyRoomCodeButton.onclick = () => {
      copyRoomCode();

      let chatInput = document.getElementById("ovo-multiplayer-chat-input");
      if (chatInput) {
        chatInput.textContent = ""; // Clear contenteditable
        chatInput.blur();
      }

      container.style.backgroundColor = "rgba(0,0,0,0)";

      if (chatInput && chatInput.style.display !== "none") {
        globalThis.toggleChatBox();
      }

      if (globalThis.ovoMultiplayerChatStateMap) {
        enableClick(globalThis.ovoMultiplayerChatStateMap);
        globalThis.ovoMultiplayerChatStateMap = null;
      }

      copyRoomCodeButton.blur();
    };
    copyRoomCodeButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
    buttonsHolder2.appendChild(copyRoomCodeButton);

    // Create tab container
    let tabContainer = document.createElement("div");
    tabContainer.id = "ovo-multiplayer-tab-container";
    tabContainer.style.position = "absolute";
    tabContainer.style.bottom = "300px";
    tabContainer.style.left = "0";
    tabContainer.style.width = "400px";
    tabContainer.style.height = "20px";
    tabContainer.style.display = "flex";
    tabContainer.style.flexDirection = "row";
    tabContainer.style.justifyContent = "flex-start";
    tabContainer.style.alignItems = "flex-end";
    tabContainer.style.zIndex = "9999999999";
    tabContainer.style.boxSizing = "border-box";
    connectedContainer.appendChild(tabContainer);

    // Initialize tab system variables
    state.selectedTab = -1;
    state.tabs = [];
    state.tabContents = [];

    // Add tab helper function - creates a tab and its content
    const addTab = (name, contentSetup) => {
      const index = state.tabs.length;

      // Create tab button
      const tab = document.createElement("div");
      tab.id = `ovo-multiplayer-tab-${index}`;
      tab.classList.add("ovo-multiplayer-tab");
      tab.innerText = name;

      // Improved styling for tabs
      tab.style.height = "16px"; // Slightly shorter than container for visual effect
      tab.style.backgroundColor = "var(--element-hover-bg)";
      tab.style.color = "var(--text-color)";
      tab.style.fontSize = "11pt";
      tab.style.fontFamily = "Retron2000";
      tab.style.cursor = "pointer";
      tab.style.padding = "4px 12px";
      tab.style.textAlign = "center";
      tab.style.border = "solid var(--border-color)";
      tab.style.borderWidth = "2px 2px 0 2px";
      tab.style.borderRadius = "6px 6px 0 0"; // Rounded top corners
      tab.style.marginRight = "3px";
      tab.style.zIndex = "9999999999";
      tab.style.display = "flex";
      tab.style.alignItems = "center"; // Center text vertically
      tab.style.justifyContent = "center"; // Center text horizontally
      tab.style.minWidth = "40px"; // Ensure minimum width for nice appearance
      tab.style.boxShadow = "0px -1px 2px rgba(0,0,0,0.1)"; // Subtle shadow
      tab.style.transition = "background-color 0.2s ease"; // Smooth hover transition

      // Create content container
      const content = document.createElement("div");
      content.id = `ovo-multiplayer-${name
      .toLowerCase()
      .replace(/\s+/g, "-")}-tab-content`;
      content.classList.add("ovo-multiplayer-text-box");
      content.style.position = "absolute";
      content.style.bottom = "30px";
      content.style.left = "0";
      content.style.width = "400px";
      content.style.height = "270px";
      content.style.display = "none";
      content.style.padding = name === "Info" ? "10px" : "0"; // Increased padding for Info
      content.style.border = "2px solid var(--border-color)";
      content.style.borderRadius = "0 6px 6px 0";
      content.style.borderLeft = "none";
      content.style.overflow = name === "Info" ? "auto scroll" : "hidden";
      content.style.boxShadow = "0px 2px 5px rgba(0,0,0,0.15)"; // Subtle shadow
      content.style.boxSizing = "border-box"; // Include padding in width/height calculation

      // Add hover effect
      tab.onmouseover = () => {
        if (state.selectedTab !== index) {
          tab.style.backgroundColor = "var(--element-bg)";
        }
      };

      tab.onmouseout = () => {
        if (state.selectedTab !== index) {
          tab.style.backgroundColor = "var(--element-hover-bg)";
        }
      };

      // Add click handler
      tab.onclick = () => {
        selectTab(index);
      };

      // Add elements to DOM
      tabContainer.appendChild(tab);
      connectedContainer.appendChild(content);

      // Add to state arrays
      state.tabs.push(tab);
      state.tabContents.push(content);

      // Allow caller to setup content
      if (contentSetup) {
        contentSetup(content);
      }

      return { tab, content };
    };

    // Create tabs with their content
    const chatTab = addTab("Chat", (content) => {
      // Create chat box
      let chatBox = document.createElement("div");
      chatBox.id = "ovo-multiplayer-chat-box";
      chatBox.classList.add("ovo-multiplayer-text-box");
      chatBox.style.border = "none";
      chatBox.style.padding = "6px";
      chatBox.style.color = "var(--text-color)";
      chatBox.style.width = "100%";
      chatBox.style.height = "100%";
      chatBox.style.boxSizing = "border-box"; // Ensure padding is included in dimensions
      chatBox.style.resize = "none";
      chatBox.style.display = "block";
      chatBox.style.textShadow = "0 0 5px white";
      chatBox.innerHTML = "No chat messages yet...";
      chatBox.style.overflow = "auto scroll";
      chatBox.style.textAlign = "left";
      chatBox.addEventListener("wheel", (e) => e.stopImmediatePropagation());
      content.appendChild(chatBox);
    });

    addTab("User list", (content) => {
      // Create user list container
      let userList = document.createElement("div");
      userList.id = "ovo-multiplayer-user-list";
      userList.style.padding = "6px";
      userList.style.color = "var(--text-color)";
      userList.style.width = "100%";
      userList.style.height = "100%";
      userList.style.resize = "none";
      userList.style.display = "block";
      userList.style.textShadow = "0 0 5px white";
      userList.style.overflow = "auto scroll";
      userList.style.textAlign = "left";
      userList.style.boxSizing = "border-box";
      userList.addEventListener("wheel", (e) => e.stopImmediatePropagation());
      content.appendChild(userList);
    });

    addTab("Ban list", (content) => {
      // Create ban list container
      let settings = document.createElement("div");
      settings.id = "ovo-multiplayer-settings";
      settings.style.padding = "6px";
      settings.style.color = "var(--text-color)";
      settings.style.width = "100%";
      settings.style.height = "100%";
      settings.style.resize = "none";
      settings.style.display = "block";
      settings.style.textShadow = "0 0 5px white";
      settings.style.overflow = "auto scroll";
      settings.style.textAlign = "left";
      settings.innerHTML = "No banned users (yet).";
      settings.style.boxSizing = "border-box";
      settings.addEventListener("wheel", (e) => e.stopImmediatePropagation());
      content.appendChild(settings);
    });

    addTab("Info", (content) => {
      // Add info content
      content.innerHTML = `
      <h3 style="padding-left: 14px;">Info & Tips</h3>
      <br>
      <p>
        <b>-</b> Press "Enter" to open/send chat, "Escape" to close.
      </p>
      <br>
      <p>
        <b>-</b> Click the globe icon (top-center) to toggle this UI.
      </p>
      <br>
      <p>
        <b>-</b> You can join other players' levels by clicking the join button in the User List.
      </p>
      <br>
      <p>
        <b>-</b> Change your username anytime in the User List tab or Settings (⚙️).
      </p>
      <br>
      <p>
        <b>-</b> Hosts can kick/ban players from the User List tab or Settings.
      </p>
      <br>
      <p>
        <b>-</b> Perma-bans persist across rooms; regular bans are session-only.
      </p>
      <br>
      <p>
        <b>-</b> Mute noisy players from the User List tab or Settings.
      </p>
      <br>
      <p>
        <b>-</b> Hosts can change the room's settings at any time in the Settings menu.
      </p>
    `;
      content.addEventListener("wheel", (e) => e.stopImmediatePropagation());
    });

    // Select first tab (Chat) by default
    selectTab(0);

    // Create chat input
    let chatInput;
    // Use contenteditable div for better text selection
    chatInput = document.createElement("div");
    chatInput.id = "ovo-multiplayer-chat-input";
    chatInput.className =
      "ovo-multiplayer-chat-input ovo-multiplayer-chat-contenteditable";
    chatInput.contentEditable = "true";
    chatInput.setAttribute("spellcheck", "false");
    chatInput.setAttribute("placeholder", "Type here...");
    chatInput.setAttribute("data-placeholder", "Type here...");
    chatInput.style.display = "none"; // Hidden by default

    chatInput.addEventListener("focus", function () {
      if (chatInput.textContent.trim() === "") {
        chatInput.setAttribute("data-focused", "true");
      }
    });

    chatInput.addEventListener("blur", function () {
      if (chatInput.textContent.trim() === "") {
        chatInput.setAttribute("data-focused", "false");
      }
    });

    chatInput.addEventListener("mousedown", (e) => e.stopPropagation());
    chatInput.addEventListener("mousemove", (e) => e.stopPropagation());
    chatInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => chatInput.focus(), 0);
    });
    chatInput.addEventListener("click", (e) => e.stopPropagation());
    chatInput.addEventListener("selectstart", (e) => e.stopPropagation());

    chatInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.stopImmediatePropagation();
        if (e.shiftKey) return; // Allow line breaks with Shift+Enter

        const message = chatInput.textContent.trim();
        if (message) {
          sendChat({ message });
        }

        // Clear input after sending
        setTimeout(() => {
          chatInput.textContent = "";
        }, 0); // Use timeout 0 to clear after event processing
        e.preventDefault(); // Prevent Enter key from adding newline
      }

      if (e.key === "Escape") {
        if (chatInput && chatInput.style.display !== "none") {
          globalThis.toggleChatBox();
          e.preventDefault();
        }
      }

      e.stopPropagation();
    };

    chatTab.content.appendChild(chatInput); // Append directly to connectedContainer

    // Add chat button
    let chatButton = document.createElement("button");
    chatButton.innerText = "Open Chat";
    chatButton.classList.add("ovo-multiplayer-button");

    // Chat toggle function
    let toggleChatBox = () => {
      // Do nothing if not connected
      if (!state.connectedToRoom) return;

      let settingsModal = document.getElementById(
        "ovo-multiplayer-settings-modal"
      );
      if (settingsModal && settingsModal.style.display === "block") {
        return; // Do nothing if settings are open
      }

      if (chatInput.style.display === "none") {
        selectTab(0); // Ensure chat tab is selected
        chatInput.style.display = "block";
        container.style.backgroundColor = "rgba(0,0,0,0.5)";
        chatTab.content.firstChild.style.height = "calc(100% - 60px)";
        chatTab.content.firstChild.scrollTop = chatTab.content.scrollHeight;

        globalThis.ovoMultiplayerChatStateMap = disableClick();
        setTimeout(() => {
          chatInput.focus();
        }, 100);
      } else {
        chatInput.style.display = "none";
        chatInput.blur();
        container.style.backgroundColor = "rgba(0,0,0,0)";
        chatTab.content.firstChild.style.height = "100%";
        chatTab.content.firstChild.scrollTop = chatTab.content.scrollHeight;

        if (globalThis.ovoMultiplayerChatStateMap) {
          enableClick(globalThis.ovoMultiplayerChatStateMap);
          globalThis.ovoMultiplayerChatStateMap = null;
        }
      }
    };

    globalThis.toggleChatBox = toggleChatBox; // Expose function globally

    chatButton.onclick = () => {
      toggleChatBox();
      chatButton.blur();
    };

    document.addEventListener("keydown", (e) => {
      let settingsModal = document.getElementById(
        "ovo-multiplayer-settings-modal"
      );
      if (settingsModal && settingsModal.style.display === "block") {
        return; // Do nothing if settings are open
      }
      if (e.key === "Enter" && chatInput.style.display === "none") {
        toggleChatBox();
        e.preventDefault();
      }

      if (e.key === "Escape" && chatInput.style.display !== "none") {
        toggleChatBox();
        e.preventDefault();
      }
    });

    chatButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });

    buttonsHolder2.appendChild(chatButton);
    document.body.appendChild(container);

    // Create toggle button
    let toggleButton = document.createElement("button");
    toggleButton.id = "ovo-multiplayer-toggle-button";
    toggleButton.innerText = "";

    // Add globe icon
    let globeIcon = document.createElement("img");
    globeIcon.src =
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE2LjM2LDE0QzE2LjQ0LDEzLjM0IDE2LjUsMTIuNjggMTYuNSwxMkMxNi41LDExLjMyIDE2LjQ0LDEwLjY2IDE2LjM2LDEwSDE5Ljc0QzE5LjksMTAuNjQgMjAsMTEuMzEgMjAsMTJDMjAsMTIuNjkgMTkuOSwxMy4zNiAxOS43NCwxNE0xNC41OSwxOS41NkMxNS4xOSwxOC40NSAxNS42NSwxNy4yNSAxNS45NywxNkgxOC45MkMxNy45NiwxNy42NSAxNi40MywxOC45MyAxNC41OSwxOS41Nk0xNC4zNCwxNEg5LjY2QzkuNTYsMTMuMzQgOS41LDEyLjY4IDkuNSwxMkM5LjUsMTEuMzIgOS41NiwxMC42NSA5LjY2LDEwSDE0LjM0QzE0LjQzLDEwLjY1IDE0LjUsMTEuMzIgMTQuNSwxMkMxNC41LDEyLjY4IDE0LjQzLDEzLjM0IDE0LjM0LDE0TTEyLDE5Ljk2QzExLjE3LDE4Ljc2IDEwLjUsMTcuNDMgMTAuMDksMTZIMTMuOTFDMTMuNSwxNy40MyAxMi44MywxOC43NiAxMiwxOS45Nk04LDhINS4wOEM2LjAzLDYuMzQgNy41Nyw1LjA2IDkuNCw0LjQ0QzguOCw1LjU1IDguMzUsNi43NSA4LDhNNS4wOCwxNkg4QzguMzUsMTcuMjUgOC44LDE4LjQ1IDkuNCwxOS41NkM3LjU3LDE4LjkzIDYuMDMsMTcuNjUgNS4wOCwxNk00LjI2LDE0QzQuMSwxMy4zNiA0LDEyLjY5IDQsMTJDNCwxMS4zMSA0LjEsMTAuNjQgNC4yNiwxMEg3LjY0QzcuNTYsMTAuNjYgNy41LDExLjMyIDcuNSwxMkM3LjUsMTIuNjggNy41NiwxMy4zNCA3LjY0LDE0TTEyLDQuMDNDMTIuODMsNS4yMyAxMy41LDYuNTcgMTMuOTEsOEgxMC4wOUMxMC41LDYuNTcgMTEuMTcsNS4yMyAxMiw0LjAzTTE4LjkyLDhIMTUuOTdDMTUuNjUsNi43NSAxNS4xOSw1LjU1IDE0LjU5LDQuNDRDMTYuNDMsNS4wNyAxNy45Niw2LjM0IDE4LjkyLDhNMTIsMkM2LjQ3LDIgMiw2LjUgMiwxMkExMCwxMCAwIDAsMCAxMiwyMkExMCwxMCAwIDAsMCAyMiwxMkExMCwxMCAwIDAsMCAxMiwyWiIgLz48L3N2Zz4=";
    globeIcon.classList.add("ovo-multiplayer-toggle-icon");
    toggleButton.appendChild(globeIcon);

    toggleButton.classList.add("ovo-multiplayer-toggle-button");

    toggleButton.onclick = async (mute = false) => {
      // On first click, prompt for username if not set
      if (state.username === "") {
        await setUsernamePrompt();
        // If username is still empty after prompt (user cancelled), don't toggle UI
        if (state.username === "") return Promise.resolve();
      }

      container.style.display =
        container.style.display === "none" ? "block" : "none";

      if (!mute) {
        notify(
          "OvO Online",
          "UI is now " +
            (container.style.display === "none" ? "hidden" : "visible")
        );
      }

      toggleButton.blur();
      return Promise.resolve();
    };

    toggleButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });

    container.style.display = "none";
    document.body.appendChild(toggleButton);

    // Create tooltip
    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");

    let tooltipText = document.createElement("div");
    tooltipText.classList.add("tooltiptext");

    let tooltipTextspan = document.createElement("span");
    tooltipTextspan.innerHTML = "Click the globe to toggle the multiplayer UI";

    let tooltipButton = document.createElement("button");
    tooltipButton.classList.add("ovo-multiplayer-button");
    tooltipButton.classList.add("tooltipbutton");
    tooltipButton.innerHTML = "Got it !";
    tooltipButton.onclick = () => {
      showTooltip(false);
      // Show second tooltip after a short delay to guide users to browse servers
      setTimeout(() => {
        showServerBrowserTooltip();
      }, 500);
    };

    tooltipText.appendChild(tooltipTextspan);
    tooltipText.appendChild(tooltipButton);
    tooltip.appendChild(tooltipText);
    document.body.appendChild(tooltip);

    // Create settings button
    let settingsButton = document.createElement("button");
    settingsButton.id = "ovo-multiplayer-settings-button";
    settingsButton.classList.add("ovo-multiplayer-settings-button");
    settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
    <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
  </svg>`;

    settingsButton.onclick = () => {
      openSettingsModal();
    };

    // add button to container
    container.appendChild(settingsButton);

    // Create settings modal
    createSettingsModal();

    // Apply current theme
    applyTheme(state.theme);

    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
          if (state.theme === "system") {
            applyTheme("system"); // Re-apply theme based on new system preference
          }
        });
    }
  }

  // Create settings modal
  function createSettingsModal() {
    // Create settings modal
    let settingsModal = document.createElement("div");
    settingsModal.id = "ovo-multiplayer-settings-modal";
    settingsModal.classList.add("ovo-multiplayer-modal");

    // Prevent clicks on overlay from closing modal (optional, but good UX)
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        // Only close if overlay itself is clicked
        enableClick(globalThis.ovoMultiplayerChatStateMap);
        settingsModal.style.display = "none";
      }
    });

    // Added to prevent wheel events from propagating to the game
    settingsModal.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    document.body.appendChild(settingsModal);

    // Create modal content
    let modalContent = document.createElement("div");
    modalContent.classList.add("ovo-multiplayer-modal-content");
    // Prevent clicks inside content from closing modal
    modalContent.addEventListener("click", (e) => {
      // e.stopPropagation();
    });
    // Added to prevent wheel events from propagating to the game
    modalContent.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    settingsModal.appendChild(modalContent);

    // Create header
    let header = document.createElement("div");
    header.classList.add("ovo-multiplayer-modal-header");
    modalContent.appendChild(header);

    // Create title
    let title = document.createElement("h2");
    title.innerText = "Settings";
    header.appendChild(title);

    // Create close button
    let close = document.createElement("span");
    close.classList.add("ovo-multiplayer-modal-close");
    close.innerHTML = "&times;";
    close.onclick = () => {
      settingsModal.style.display = "none";
      enableClick(globalThis.ovoMultiplayerChatStateMap);
    };
    header.appendChild(close);

    // Create content body
    let content = document.createElement("div");
    content.classList.add("ovo-multiplayer-modal-body");
    modalContent.appendChild(content);

    // Create tabs
    let tabs = document.createElement("div");
    tabs.classList.add("ovo-multiplayer-settings-tabs");
    content.appendChild(tabs);

    // --- Tab Creation Helper ---
    const createTab = (id, text, contentContainerId) => {
      let button = document.createElement("button");
      button.classList.add("ovo-multiplayer-settings-tab-button");
      button.id = `ovo-multiplayer-settings-${id}-tab-button`;
      button.innerText = text;
      button.onclick = (e) => {
        e.stopPropagation();
        // Hide all tab contents
        document
          .querySelectorAll(".ovo-multiplayer-settings-tab")
          .forEach((tab) => {
            tab.style.display = "none";
          });
        // Show this tab content
        const targetContent = document.getElementById(contentContainerId);
        if (targetContent) targetContent.style.display = "block";

        // Update active button style
        document
          .querySelectorAll(".ovo-multiplayer-settings-tab-button")
          .forEach((btn) => {
            btn.classList.remove("active");
          });
        button.classList.add("active");

        // Populate lists if necessary
        if (id === "user-list") {
          populateSettingsUserList();
        } else if (id === "ban-list") {
          populateSettingsBanList();
        } else if (id === "server-settings") {
          populateServerSettingsTab();
        }
      };
      tabs.appendChild(button);
      return button;
    };

    // --- Tab Content Container Creation Helper ---
    const createTabContent = (id) => {
      let tabContentDiv = document.createElement("div");
      tabContentDiv.id = `ovo-multiplayer-settings-${id}`;
      tabContentDiv.classList.add("ovo-multiplayer-settings-tab");
      content.appendChild(tabContentDiv); // Append to main content body
      return tabContentDiv;
    };

    // --- Create Tabs and Content Containers ---
    const generalTabContent = createTabContent("general");
    const userListTabContent = createTabContent("user-list");
    const banListTabContent = createTabContent("ban-list");
    const serverSettingsTabContent = createTabContent("server-settings"); // Add server settings tab
    const creditsTabContent = createTabContent("credits");
    const infoTabContent = createTabContent("info");

    // --- Create Tab Buttons ---
    const generalTabButton = createTab(
      "general",
      "General",
      generalTabContent.id
    );
    createTab(
      "user-list",
      "User List",
      userListTabContent.id
    );
    createTab(
      "ban-list",
      "Ban List",
      banListTabContent.id
    );
    createTab(
      // Add server settings tab button
      "server-settings",
      "Server Settings",
      serverSettingsTabContent.id
    );
    createTab(
      "credits",
      "Credits",
      creditsTabContent.id
    );
    createTab("info", "Info", infoTabContent.id);

    // --- Populate General Tab ---
    generalTabContent.style.display = "block"; // Show general tab by default
    generalTabButton.classList.add("active"); // Set general tab as active by default

    // Theme selector (Custom Dropdown)
    let themeSelector = document.createElement("div");
    themeSelector.classList.add("ovo-multiplayer-settings-option");
    generalTabContent.appendChild(themeSelector);

    let themeLabel = document.createElement("label");
    themeLabel.innerText = "Theme:";
    themeSelector.appendChild(themeLabel);

    // Custom Select Container
    let customSelectContainer = document.createElement("div");
    customSelectContainer.classList.add(
      "ovo-multiplayer-custom-select-container"
    );
    themeSelector.appendChild(customSelectContainer);

    // Display for Current Value
    let customSelectValue = document.createElement("div");
    customSelectValue.id = "ovo-multiplayer-theme-select-value";
    customSelectValue.classList.add("ovo-multiplayer-custom-select-value");
    customSelectValue.textContent =
      state.theme === "light"
        ? "Light"
        : state.theme === "dark"
        ? "Dark"
        : "System Preference"; // Default to System Preference text
    customSelectContainer.appendChild(customSelectValue);

    // Options Container (Initially Hidden)
    let customSelectOptions = document.createElement("div");
    customSelectOptions.id = "ovo-multiplayer-theme-select-options";
    customSelectOptions.classList.add("ovo-multiplayer-custom-select-options");
    customSelectOptions.style.display = "none"; // Start hidden
    customSelectContainer.appendChild(customSelectOptions);

    // Create Option Function
    const createOption = (value, text) => {
      let optionDiv = document.createElement("div");
      optionDiv.classList.add("ovo-multiplayer-custom-select-option");
      optionDiv.textContent = text;
      optionDiv.dataset.value = value; // Store value in data attribute
      optionDiv.onclick = (e) => {
        e.stopPropagation(); // Prevent container click from re-opening
        const selectedValue = optionDiv.dataset.value;
        customSelectValue.textContent = optionDiv.textContent; // Update displayed text
        customSelectOptions.style.display = "none"; // Hide options

        // Apply theme and save
        if (state.theme !== selectedValue) {
          state.theme = selectedValue;
          savePreferences();
          applyTheme(state.theme);
        }
      };
      customSelectOptions.appendChild(optionDiv);
    };

    // Add Options
    createOption("light", "Light");
    createOption("dark", "Dark");
    createOption("system", "System Preference");

    // Toggle Options Visibility
    customSelectValue.onclick = (e) => {
      e.stopPropagation(); // Prevent clicks bubbling to modal content listener
      customSelectOptions.style.display =
        customSelectOptions.style.display === "none" ? "block" : "none";
    };

    // Close options if clicking outside
    document.addEventListener("click", (e) => {
      if (
        !customSelectContainer.contains(e.target) &&
        customSelectOptions.style.display === "block"
      ) {
        customSelectOptions.style.display = "none";
      }
    });

    // Change username
    let usernameOption = document.createElement("div");
    usernameOption.classList.add("ovo-multiplayer-settings-option");
    generalTabContent.appendChild(usernameOption);

    let usernameLabel = document.createElement("label");
    usernameLabel.innerText = "Username:";
    usernameOption.appendChild(usernameLabel);

    let usernameDisplay = document.createElement("div");
    usernameDisplay.style.display = "flex";
    usernameDisplay.style.alignItems = "center";
    usernameDisplay.style.flex = "1";
    usernameOption.appendChild(usernameDisplay);

    // Display current username
    let usernameValue = document.createElement("span");
    usernameValue.id = "ovo-multiplayer-username-display";
    usernameValue.style.marginRight = "10px";
    usernameValue.style.fontFamily = "Retron2000";
    usernameValue.style.color = "var(--text-color)";
    usernameValue.textContent = state.username;
    usernameDisplay.appendChild(usernameValue);

    let usernameButton = document.createElement("button");
    usernameButton.classList.add("ovo-multiplayer-button"); // Use general button style
    usernameButton.innerText = "Change";
    usernameButton.style.zIndex = "0";
    usernameButton.onclick = async (e) => {
      e.stopPropagation();
      await setUsernamePrompt();
      usernameValue.textContent = state.username;
    };
    usernameDisplay.appendChild(usernameButton);

    // Hide own chat messages checkbox
    let hideOwnChatOption = document.createElement("div");
    hideOwnChatOption.classList.add("ovo-multiplayer-settings-option");
    generalTabContent.appendChild(hideOwnChatOption);

    let hideOwnChatLabel = document.createElement("label");
    hideOwnChatLabel.innerText = "Hide chat:";
    hideOwnChatOption.appendChild(hideOwnChatLabel);

    let hideChatCheckbox = document.createElement("input");
    hideChatCheckbox.type = "checkbox";
    hideChatCheckbox.id = "ovo-multiplayer-hide-own-chat-checkbox";
    hideChatCheckbox.checked = state.hideChat;
    hideChatCheckbox.style.marginLeft = "10px";
    hideChatCheckbox.style.transform = "scale(1.5)";
    hideChatCheckbox.onchange = (e) => {
      e.stopPropagation();
      state.hideChat = hideChatCheckbox.checked;
      savePreferences();
      updateChatBox(); // Refresh chat display to apply the new setting
    };
    hideOwnChatOption.appendChild(hideChatCheckbox);

    // button to reset saved data
    // let resetButton = document.createElement("button");
    // resetButton.classList.add("ovo-multiplayer-button");
    // resetButton.innerText = "Reset to Defaults";
    // resetButton.style.zIndex = "0";
    // resetButton.onclick = async (e) => {
    //   e.stopPropagation();
    //   if (
    //     await getDialogConfirm({
    //       text: "Are you sure you want to reset your preferences to default?",
    //       buttonText: "Yes",
    //       cancelText: "No",
    //     })
    //   ) {
    //     state.theme = "system"; // Reset to system theme
    //     savePreferences();
    //     applyTheme(state.theme); // Apply system theme
    //     customSelectValue.textContent = "System Preference"; // Update displayed text
    //     customSelectOptions.style.display = "none"; // Hide options
    //   }
    // };
    // generalTabContent.appendChild(resetButton);

    // --- Populate Credits Tab ---
    let creditsContainer = document.createElement("div");
    creditsContainer.classList.add("ovo-multiplayer-credits-container");
    creditsTabContent.appendChild(creditsContainer);

    let dedraLogo = document.createElement("img");
    dedraLogo.src = "./images/Dedra Logo.svg";
    dedraLogo.classList.add("ovo-multiplayer-credits-logo");
    dedraLogo.classList.add("ovo-multiplayer-credits-logo-dedra");
    dedraLogo.alt = "Dedra Games";
    creditsContainer.appendChild(dedraLogo);
    dedraLogo.onclick = () => {
      window.open("https://dedragames.com", "_blank");
    };

    let dedraText = document.createElement("div");
    dedraText.classList.add("ovo-multiplayer-credits-text");
    dedraText.innerText = "Dedra Games";
    creditsContainer.appendChild(dedraText);

    let crossSymbol = document.createElement("div");
    crossSymbol.classList.add("ovo-multiplayer-credits-cross");
    crossSymbol.innerHTML = "×";
    creditsContainer.appendChild(crossSymbol);

    let freezeNovaLogo = document.createElement("img");
    freezeNovaLogo.src = "./images/freezenovagames.png";
    freezeNovaLogo.classList.add("ovo-multiplayer-credits-logo");
    freezeNovaLogo.alt = "FreezeNova.Games";
    creditsContainer.appendChild(freezeNovaLogo);
    freezeNovaLogo.onclick = () => {
      window.open("https://freezenova.games", "_blank");
    };

    let collaborationText = document.createElement("div");
    collaborationText.classList.add("ovo-multiplayer-credits-collaboration-text");
    collaborationText.innerHTML =
      "This game was made as a collaboration between<br>Dedra Games and FreezeNova.Games";
    creditsContainer.appendChild(collaborationText);

    // --- Populate User List Tab ---
    let userListContainer = document.createElement("div");
    userListContainer.id = "ovo-multiplayer-settings-user-list-container";
    userListContainer.classList.add("ovo-multiplayer-settings-list-container"); // Use new container class
    userListTabContent.appendChild(userListContainer);

    // --- Populate Ban List Tab ---
    let banListContainer = document.createElement("div");
    banListContainer.id = "ovo-multiplayer-settings-ban-list-container";
    banListContainer.classList.add("ovo-multiplayer-settings-list-container"); // Use new container class
    banListTabContent.appendChild(banListContainer);

    // --- Populate Server Settings Tab ---
    let serverSettingsContainer = document.createElement("div");
    serverSettingsContainer.id = "ovo-multiplayer-settings-server-container";
    serverSettingsContainer.classList.add("ovo-multiplayer-settings-content");
    serverSettingsTabContent.appendChild(serverSettingsContainer);

    // --- Populate Info Tab ---
    let infoContent = document.createElement("div");
    infoContent.classList.add("ovo-multiplayer-settings-info-content");
    infoTabContent.appendChild(infoContent);

    // Use the same content as the main UI info tab
    let tipsContent = document.getElementById("ovo-multiplayer-info-tab-content"); // Get the main UI info tab
    if (tipsContent) {
      infoContent.innerHTML = tipsContent.innerHTML;
    } else {
      // Fallback content if main UI isn't fully loaded yet
      infoContent.innerHTML = `
        <h3>OvO Multiplayer Revamp</h3>
        <p>Version: ${VERSION}</p>
        <p>This is a revamped version of the OvO Multiplayer mod.</p>
        <p>Please see the Info tab in the main UI for controls and tips.</p>
    `;
    }

    // Initialize tab visibility based on connection state
    updateSettingsTabsVisibility();
  }

  // --- New Function: Populate Settings User List ---
  function populateSettingsUserList() {
    const userListContainer = document.getElementById(
      "ovo-multiplayer-settings-user-list-container"
    );
    if (!userListContainer) return;

    userListContainer.innerHTML = ""; // Clear previous content

    if (!state.connectedToRoom) {
      userListContainer.innerHTML = "Not connected to a room.";
      return;
    }

    // --- Create User Element Helper (Settings Style) ---
    const createUserElementSettings = () => {
      let userElement = document.createElement("div");
      userElement.className = "ovo-multiplayer-settings-user"; // Settings style

      let userInfo = document.createElement("div");
      userInfo.className = "ovo-multiplayer-settings-user-info";
      userElement.appendChild(userInfo);

      let userIcon = document.createElement("img");
      userIcon.className = "ovo-multiplayer-settings-user-icon";
      userInfo.appendChild(userIcon);

      let userDetails = document.createElement("div");
      userDetails.className = "ovo-multiplayer-settings-user-details";
      userInfo.appendChild(userDetails);

      let userName = document.createElement("div");
      userName.className = "ovo-multiplayer-settings-user-name";
      userDetails.appendChild(userName);

      let userExtra = document.createElement("div");
      userExtra.className = "ovo-multiplayer-settings-user-extra";
      userDetails.appendChild(userExtra);

      let userActions = document.createElement("div");
      userActions.className = "ovo-multiplayer-settings-user-actions";
      userElement.appendChild(userActions);

      // Add hamburger menu button (Settings Style)
      let hamburgerButton = document.createElement("button");
      hamburgerButton.className =
        "ovo-multiplayer-settings-user-action ovo-multiplayer-user-hamburger"; // Settings style + hamburger styling
      hamburgerButton.innerHTML = `
      <div class="ovo-multiplayer-user-hamburger-lines"></div>
      <div class="ovo-multiplayer-user-hamburger-lines"></div>
      <div class="ovo-multiplayer-user-hamburger-lines"></div>
    `;
      userActions.appendChild(hamburgerButton);

      // Create dropdown menu
      let dropdown = document.createElement("div");
      dropdown.className = "ovo-multiplayer-user-dropdown";
      hamburgerButton.appendChild(dropdown);

      // Add dropdown buttons (Settings Style)
      let joinButton = document.createElement("button");
      joinButton.innerHTML = "Join";
      dropdown.appendChild(joinButton);

      // Add dropdown buttons (Settings Style)
      let muteButton = document.createElement("button");
      muteButton.innerHTML = "Mute";
      dropdown.appendChild(muteButton);

      let kickButton = document.createElement("button");
      kickButton.innerHTML = "Kick";
      kickButton.disabled = true;
      dropdown.appendChild(kickButton);

      let banButton = document.createElement("button");
      banButton.innerHTML = "Ban";
      banButton.disabled = true;
      dropdown.appendChild(banButton);

      let permaBanButton = document.createElement("button");
      permaBanButton.innerHTML = "Perma Ban";
      permaBanButton.disabled = true;
      dropdown.appendChild(permaBanButton);

      let changeUsernameButton = document.createElement("button");
      changeUsernameButton.innerHTML = "Change Username";
      changeUsernameButton.disabled = true;
      dropdown.appendChild(changeUsernameButton);

      // Add click handler for hamburger menu
      hamburgerButton.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        // Close other dropdowns
        let otherDropdowns = document.querySelectorAll(
          ".ovo-multiplayer-user-dropdown.show"
        );
        otherDropdowns.forEach((d) => {
          if (d !== dropdown) {
            d.classList.remove("show");
          }
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        dropdown.classList.remove("show");
      });

      return {
        elementDiv: userElement,
        usernameDiv: userName,
        extraDataDiv: userExtra,
        iconElement: userIcon,
        joinButton: joinButton,
        hamburgerButton: hamburgerButton,
        dropdown: dropdown,
        muteButton: muteButton,
        kickButton: kickButton,
        banButton: banButton,
        permaBanButton: permaBanButton,
        changeUsername: changeUsernameButton,
      };
    };

    // --- Update User Element Data (Settings Logic) ---
    const updateUserElementDataSettings = (elements, user, isMe, connection) => {
      elements.usernameDiv.textContent = user.username; // Use textContent for safety
      elements.extraDataDiv.textContent =
        user.layout +
        " - " +
        (user.isHost ? "(Host) - " : "") +
        (user.username !== user.initialUsername
          ? `(${user.initialUsername}) `
          : "") +
        (isMe ? "You - " : `${user.ping || "?"}ms - `) +
        user.UID;
      elements.iconElement.src = getSkinIconFromSkinName(user.skin);

      // Button Logic (Settings) - Similar to main UI but targets settings elements
      if (!isMe && connection) {
        elements.muteButton.textContent = userIsMuted(connection.id)
          ? "Unmute"
          : "Mute";
        elements.muteButton.onclick = () => {
          toggleMuteUser(connection.id);
          populateSettingsUserList(); // Update this list
          updateUserList(true); // Update main list too
        };
        elements.muteButton.style.display = "inline-block";
        elements.muteButton.disabled = false;

        // Show hamburger menu for other users
        elements.hamburgerButton.style.display = "flex";
      } else {
        elements.muteButton.style.display = "none";
        elements.muteButton.disabled = true;

        // Hide hamburger menu for self
        elements.hamburgerButton.style.display = "flex";
      }

      if (state.isHost && !isMe && connection) {
        elements.kickButton.style.display = "inline-block";
        elements.kickButton.disabled = false;
        elements.banButton.style.display = "inline-block";
        elements.banButton.disabled = false;
        elements.permaBanButton.style.display = "inline-block";
        elements.permaBanButton.disabled = false;

        elements.kickButton.onclick = () => kickUser(user, connection);
        elements.banButton.onclick = () => banUser(user, connection);
        elements.permaBanButton.onclick = () => permaBanUser(user, connection);
      } else {
        elements.kickButton.style.display = "none";
        elements.kickButton.disabled = true;
        elements.banButton.style.display = "none";
        elements.banButton.disabled = true;
        elements.permaBanButton.style.display = "none";
        elements.permaBanButton.disabled = true;
      }

      if (isMe) {
        elements.changeUsername.style.display = "inline-block";
        elements.changeUsername.disabled = false;
        elements.changeUsername.onclick = async () => {
          await setUsernamePrompt();
          // Username input in general tab will be updated by setUsername -> updateDomUsername
          elements.changeUsername.blur();
        };
      } else {
        elements.changeUsername.style.display = "none";
        elements.changeUsername.disabled = true;
      }

      // Join button logic
      if (!isMe && user.layout && user.layout !== "Main Menu") {
        elements.joinButton.style.display = "inline-block";
        elements.joinButton.disabled = false;
        elements.joinButton.onclick = () => {
          goToLayout(user.layout);
        };
      } else {
        elements.joinButton.style.display = "none";
        elements.joinButton.disabled = true;
      }
    };

    // --- Populate List (Settings) ---
    const usersToDisplay = [
      { connection: null, data: getMyData(), isMe: true },
      ...state.connections.map((conn) => ({
        connection: conn,
        data: conn.data,
        isMe: false,
      })),
    ];

    usersToDisplay.forEach((item) => {
      if (!item.data) return; // Skip if data not ready

      let userElements = createUserElementSettings();
      updateUserElementDataSettings(
        userElements,
        item.data,
        item.isMe,
        item.connection
      );
      userListContainer.appendChild(userElements.elementDiv);
    });
  }

  // --- New Function: Populate Settings Ban List ---
  function populateSettingsBanList() {
    const banListContainer = document.getElementById(
      "ovo-multiplayer-settings-ban-list-container"
    );
    if (!banListContainer) return;

    banListContainer.innerHTML = ""; // Clear previous content

    const combinedBanList = [
      ...state.bannedUsers.map((user) => ({ ...user, banType: "Session" })),
      ...state.permaBannedUsers.map((user) => ({
        ...user,
        banType: "Permanent",
      })),
    ];

    if (combinedBanList.length === 0) {
      banListContainer.innerHTML = "No banned users.";
      return;
    }

    // --- Create Ban Element Helper (Settings Style) ---
    const createBanElementSettings = () => {
      let banElement = document.createElement("div");
      banElement.className = "ovo-multiplayer-settings-ban"; // Settings style

      let banInfo = document.createElement("div");
      banInfo.className = "ovo-multiplayer-settings-ban-info";
      banElement.appendChild(banInfo);

      let banIcon = document.createElement("img");
      banIcon.className = "ovo-multiplayer-settings-ban-icon";
      banInfo.appendChild(banIcon);

      let banDetails = document.createElement("div");
      banDetails.className = "ovo-multiplayer-settings-ban-details";
      banInfo.appendChild(banDetails);

      let banName = document.createElement("div");
      banName.className = "ovo-multiplayer-settings-ban-name";
      banDetails.appendChild(banName);

      let banExtra = document.createElement("div");
      banExtra.className = "ovo-multiplayer-settings-ban-extra";
      banDetails.appendChild(banExtra);

      let unbanButton = document.createElement("button");
      unbanButton.className = "ovo-multiplayer-settings-ban-action"; // Settings style
      unbanButton.textContent = "Unban";
      banElement.appendChild(unbanButton);

      return {
        elementDiv: banElement,
        nameDiv: banName,
        extraDiv: banExtra,
        iconElement: banIcon,
        unbanButton: unbanButton,
      };
    };

    // --- Populate List (Settings) ---
    combinedBanList.forEach((bannedUser) => {
      let banElements = createBanElementSettings();

      banElements.nameDiv.textContent = bannedUser.username;
      banElements.extraDiv.textContent =
        (bannedUser.username !== bannedUser.initialUsername
          ? `(${bannedUser.initialUsername}) `
          : "") + `(${bannedUser.banType}) - ${bannedUser.UID}`;
      banElements.iconElement.src = getSkinIconFromSkinName(bannedUser.skin);
      banElements.unbanButton.onclick = async () => {
        await unbanUser(bannedUser); // Call the imported unbanUser function
        populateSettingsBanList(); // Refresh this list
        updateBanlist(); // Refresh main UI list
      };

      banListContainer.appendChild(banElements.elementDiv);
    });
  }

  // --- New Function: Populate Server Settings Tab ---
  function populateServerSettingsTab() {
    const serverSettingsContainer = document.getElementById(
      "ovo-multiplayer-settings-server-container"
    );
    if (!serverSettingsContainer) return;

    // Clear previous content
    serverSettingsContainer.innerHTML = "";

    // Only show settings to hosts who are connected to a room
    if (!state.connectedToRoom || !state.isHost) {
      serverSettingsContainer.innerHTML = state.connectedToRoom
        ? "Only hosts can modify server settings."
        : "Not connected to a room.";
      return;
    }

    // Create form style container
    const formContainer = document.createElement("div");
    formContainer.classList.add("ovo-multiplayer-settings-form");
    formContainer.style.padding = "10px";
    serverSettingsContainer.appendChild(formContainer);

    // Room ID display with copy button
    const roomIdOption = document.createElement("div");
    roomIdOption.classList.add("ovo-multiplayer-settings-option");

    const roomIdLabel = document.createElement("label");
    roomIdLabel.innerText = "Room ID:";
    roomIdOption.appendChild(roomIdLabel);

    const roomIdContainer = document.createElement("div");
    roomIdContainer.style.display = "flex";
    roomIdContainer.style.alignItems = "center";
    roomIdContainer.style.width = "calc(100% - 120px)";
    roomIdOption.appendChild(roomIdContainer);

    // Display room code in a styled readonly container
    const roomIdDisplay = document.createElement("div");
    roomIdDisplay.style.flex = "1";
    roomIdDisplay.style.minHeight = "20px";
    roomIdDisplay.style.marginRight = "10px";
    roomIdDisplay.style.padding = "8px";
    roomIdDisplay.textContent = getRoomCode() || "Unknown";
    roomIdContainer.appendChild(roomIdDisplay);

    // Add copy button
    const copyButton = document.createElement("button");
    copyButton.classList.add("ovo-multiplayer-button");
    copyButton.innerText = "Copy";
    copyButton.style.padding = "8px";
    copyButton.title = "Copy Room ID";
    copyButton.onclick = (e) => {
      e.stopPropagation();
      copyRoomCode();

      // Visual feedback
      const originalText = copyButton.innerText;
      copyButton.innerText = "Copied!";

      setTimeout(() => {
        copyButton.innerText = originalText;
      }, 1500);
    };
    roomIdContainer.appendChild(copyButton);

    // Room Name Setting
    const roomNameOption = document.createElement("div");
    roomNameOption.classList.add("ovo-multiplayer-settings-option");
    formContainer.appendChild(roomNameOption);

    const roomNameLabel = document.createElement("label");
    roomNameLabel.innerText = "Room Name:";
    roomNameOption.appendChild(roomNameLabel);

    // Use contenteditable div for room name
    const roomNameInput = document.createElement("div");
    roomNameInput.contentEditable = "true";
    roomNameInput.classList.add(
      "ovo-multiplayer-input",
      "ovo-multiplayer-chat-contenteditable"
    );
    roomNameInput.style.minHeight = "20px";
    roomNameInput.style.width = "calc(100% - 120px)";
    roomNameInput.textContent = state.roomName || `${state.username}'s Room`;
    roomNameOption.appendChild(roomNameInput);

    // Add event handlers to stop propagation and handle focus
    roomNameInput.addEventListener("mousedown", (e) => e.stopPropagation());
    roomNameInput.addEventListener("mousemove", (e) => e.stopPropagation());
    roomNameInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => roomNameInput.focus(), 0);
    });
    roomNameInput.addEventListener("click", (e) => e.stopPropagation());
    roomNameInput.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    formContainer.insertBefore(roomIdOption, roomNameOption); // Insert at the top

    // Max Players Setting
    const maxPlayersOption = document.createElement("div");
    maxPlayersOption.classList.add("ovo-multiplayer-settings-option");
    formContainer.appendChild(maxPlayersOption);

    const maxPlayersLabel = document.createElement("label");
    maxPlayersLabel.innerText = "Max Players:";
    maxPlayersOption.appendChild(maxPlayersLabel);

    const maxPlayersContainer = document.createElement("div");
    maxPlayersContainer.style.display = "flex";
    maxPlayersContainer.style.alignItems = "center";
    maxPlayersOption.appendChild(maxPlayersContainer);

    // Use contenteditable div for max players instead of number input
    const maxPlayersInput = document.createElement("div");
    maxPlayersInput.contentEditable = "true";
    maxPlayersInput.classList.add(
      "ovo-multiplayer-input",
      "ovo-multiplayer-chat-contenteditable"
    );
    maxPlayersInput.style.width = "60px";
    maxPlayersInput.style.minHeight = "20px";
    maxPlayersInput.style.textAlign = "center";
    maxPlayersInput.textContent = state.maxPlayers || 8;
    maxPlayersContainer.appendChild(maxPlayersInput);

    // Add event handlers to stop propagation and handle focus
    maxPlayersInput.addEventListener("mousedown", (e) => e.stopPropagation());
    maxPlayersInput.addEventListener("mousemove", (e) => e.stopPropagation());
    maxPlayersInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => maxPlayersInput.focus(), 0);
    });
    maxPlayersInput.addEventListener("click", (e) => e.stopPropagation());
    maxPlayersInput.addEventListener("keydown", (e) => {
      e.stopPropagation();
      // Allow only numbers and control keys
      if (
        !/^\d$/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
      ) {
        if (e.key !== "Enter") {
          // Allow Enter for submission
          e.preventDefault();
        }
      }
    });

    const maxPlayersSlider = document.createElement("input");
    maxPlayersSlider.type = "range";
    maxPlayersSlider.min = "1";
    maxPlayersSlider.max = "16";
    maxPlayersSlider.step = "1";
    maxPlayersSlider.value = state.maxPlayers || 8;
    maxPlayersSlider.style.marginLeft = "10px";
    maxPlayersSlider.style.width = "150px";
    //maxPlayersContainer.appendChild(maxPlayersSlider);

    // Sync slider and contenteditable
    maxPlayersInput.addEventListener("input", () => {
      // Get numeric value from contenteditable
      const value = parseInt(maxPlayersInput.textContent.trim(), 10) || 8;
      const clamped = Math.min(Math.max(1, value), 16);
      maxPlayersSlider.value = clamped;

      // Ensure range stays valid
      if (value !== clamped) {
        maxPlayersInput.textContent = clamped;
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(
          maxPlayersInput.childNodes[0],
          maxPlayersInput.textContent.length
        );
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });

    maxPlayersSlider.addEventListener("input", () => {
      maxPlayersInput.textContent = maxPlayersSlider.value;
    });

    // Private Room Setting
    const privateRoomOption = document.createElement("div");
    privateRoomOption.classList.add("ovo-multiplayer-settings-option");
    formContainer.appendChild(privateRoomOption);

    const privateRoomLabel = document.createElement("label");
    privateRoomLabel.innerText = "Private Room:";
    privateRoomOption.appendChild(privateRoomLabel);

    const privateRoomCheckbox = document.createElement("input");
    privateRoomCheckbox.type = "checkbox";
    privateRoomCheckbox.checked = state.isPrivate || false;
    privateRoomCheckbox.style.marginLeft = "10px";
    privateRoomCheckbox.style.transform = "scale(1.5)";
    privateRoomOption.appendChild(privateRoomCheckbox);

    // Password Setting (shown regardless of private checkbox)
    const passwordOption = document.createElement("div");
    passwordOption.classList.add("ovo-multiplayer-settings-option");
    formContainer.appendChild(passwordOption);

    const passwordLabel = document.createElement("label");
    passwordLabel.innerText = "Password:";
    passwordOption.appendChild(passwordLabel);

    // Password input container for better layout with the eye button
    const passwordInputContainer = document.createElement("div");
    passwordInputContainer.style.display = "flex";
    passwordInputContainer.style.position = "relative";
    passwordInputContainer.style.width = "calc(100% - 120px)";
    passwordOption.appendChild(passwordInputContainer);

    // Use contenteditable div for password
    const passwordInput = document.createElement("div");
    passwordInput.contentEditable = "true";
    passwordInput.classList.add(
      "ovo-multiplayer-input",
      "ovo-multiplayer-chat-contenteditable"
    );
    passwordInput.style.minHeight = "20px";
    passwordInput.style.width = "100%";
    passwordInput.style.paddingRight = "30px"; // Space for eye button
    passwordInput.textContent = state.roomPassword || "";
    passwordInput.setAttribute("data-placeholder", "Enter password");
    passwordInputContainer.appendChild(passwordInput);

    // Add eye button to toggle password visibility
    const eyeButton = document.createElement("button");
    eyeButton.style.position = "absolute";
    eyeButton.style.right = "15px";
    eyeButton.style.top = "50%";
    eyeButton.style.transform = "translateY(-50%)";
    eyeButton.style.background = "transparent";
    eyeButton.style.border = "none";
    eyeButton.style.cursor = "pointer";
    eyeButton.style.padding = "5px";
    eyeButton.style.display = "flex";
    eyeButton.style.alignItems = "center";
    eyeButton.style.justifyContent = "center";
    eyeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>`;
    eyeButton.title = "Show/Hide Password";
    passwordInputContainer.appendChild(eyeButton);

    // Toggle password masking
    let passwordVisible = false;
    eyeButton.onclick = (e) => {
      e.stopPropagation();
      passwordVisible = !passwordVisible;
      if (passwordVisible) {
        passwordInput.style.webkitTextSecurity = "none";
        eyeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>`;
      } else {
        passwordInput.style.webkitTextSecurity = "disc";
        eyeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`;
      }
    };

    // Default to masked password
    passwordInput.style.webkitTextSecurity = "disc";

    // Add event handlers to stop propagation and handle focus
    passwordInput.addEventListener("mousedown", (e) => e.stopPropagation());
    passwordInput.addEventListener("mousemove", (e) => e.stopPropagation());
    passwordInput.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      setTimeout(() => passwordInput.focus(), 0);
    });
    passwordInput.addEventListener("click", (e) => e.stopPropagation());

    // Status message for feedback
    const statusMessage = document.createElement("div");
    statusMessage.style.margin = "20px 0";
    statusMessage.style.padding = "10px";
    statusMessage.style.textAlign = "center";
    statusMessage.style.display = "none";
    formContainer.appendChild(statusMessage);

    // Update button
    const updateButton = document.createElement("button");
    updateButton.classList.add("ovo-multiplayer-button");
    updateButton.style.width = "100%";
    updateButton.style.margin = "20px 0 10px";
    updateButton.style.padding = "10px";
    updateButton.textContent = "Update Server Settings";
    formContainer.appendChild(updateButton);

    // Current players info
    const playersInfo = document.createElement("div");
    playersInfo.style.marginTop = "20px";
    playersInfo.style.fontSize = "14px";
    playersInfo.style.textAlign = "center";
    playersInfo.textContent = `Current players: ${state.connections.length + 1}/${
    state.maxPlayers || 8
  }`;
    formContainer.appendChild(playersInfo);

    // Handle form submission
    updateButton.addEventListener("click", async () => {
      updateButton.disabled = true;
      updateButton.textContent = "Updating...";

      // Validate inputs
      const roomName =
        roomNameInput.textContent.trim() || `${state.username}'s Room`;
      const maxPlayers = parseInt(maxPlayersInput.textContent.trim(), 10) || 8;
      // Clamp max players between 1 and 16
      const clampedMaxPlayers = Math.min(Math.max(1, maxPlayers), 16);
      const isPrivate = privateRoomCheckbox.checked;
      const password =
        passwordInput.textContent === "" ? null : passwordInput.textContent;

      try {
        // Make sure we have the required server ID and peer ID
        if (!state.serverId || !state.peer?.id) {
          throw new Error("Missing server or peer ID");
        }

        // Use the updateServerSettings function from server-browser module
        const success = await updateServerSettings(
          state.serverId,
          state.peer.id,
          {
            name: roomName,
            maxPlayers: clampedMaxPlayers,
            isPrivate,
            password,
          }
        );

        if (success) {
          // Update local state
          state.roomName = roomName;
          state.maxPlayers = clampedMaxPlayers;
          state.isPrivate = isPrivate;
          state.roomPassword = password;

          // Show success message
          statusMessage.textContent = "Server settings updated successfully!";
          statusMessage.style.display = "block";
          statusMessage.style.backgroundColor = "var(--dialog-confirm-button-bg)";
          statusMessage.style.color = "white";

          // Update players info
          playersInfo.textContent = `Current players: ${
          state.connections.length + 1
        }/${state.maxPlayers}`;
        } else {
          throw new Error("Failed to update server settings");
        }
      } catch (error) {
        console.error("Error updating server settings:", error);

        // Show error message
        statusMessage.textContent = "Error: Failed to update server settings";
        statusMessage.style.display = "block";
        statusMessage.style.backgroundColor = "var(--dialog-cancel-button-bg)";
        statusMessage.style.color = "white";
      } finally {
        // Re-enable the button
        updateButton.disabled = false;
        updateButton.textContent = "Update Server Settings";

        // Hide status message after a delay
        setTimeout(() => {
          statusMessage.style.display = "none";
        }, 3000);
      }
    });
  }

  // Open settings modal
  function openSettingsModal(tab) {
    let modal = document.getElementById("ovo-multiplayer-settings-modal");
    if (modal) {
      // if chatbox is open, close it
      let chatInput = document.getElementById("ovo-multiplayer-chat-input");
      if (chatInput && chatInput.style.display !== "none") {
        globalThis.toggleChatBox();
      }

      globalThis.ovoMultiplayerChatStateMap = disableClick();
      // Update tab visibility based on connection state
      updateSettingsTabsVisibility();

      // Update username input field
      let usernameInput = document.getElementById(
        "ovo-multiplayer-username-input"
      );
      if (usernameInput) {
        usernameInput.value = state.username;
      }

      // Update theme dropdown
      let themeSelect = document.getElementById("ovo-multiplayer-theme-select");
      if (themeSelect) {
        themeSelect.value = state.theme;
      }

      // Populate the currently active list tab (or default to general)
      const activeTabButton = modal.querySelector(
        ".ovo-multiplayer-settings-tab-button.active"
      );
      if (activeTabButton) {
        if (activeTabButton.id.includes("user-list")) {
          populateSettingsUserList();
        } else if (activeTabButton.id.includes("ban-list")) {
          populateSettingsBanList();
        }
        // General, Credits, Info tabs don't need dynamic population on open
      } else {
        // Default to showing general tab if none is active (shouldn't happen ideally)
        const generalTabContent = document.getElementById(
          "ovo-multiplayer-settings-general"
        );
        if (generalTabContent) generalTabContent.style.display = "block";
        const generalTabButton = document.getElementById(
          "ovo-multiplayer-settings-general-tab-button"
        );
        if (generalTabButton) generalTabButton.classList.add("active");
      }

      // Show modal
      modal.style.display = "block";

      if (tab) {
        // If a specific tab is passed, activate it
        const tabButton = document.getElementById(
          `ovo-multiplayer-settings-${tab}-tab-button`
        );
        if (tabButton) {
          tabButton.click();
        }
      }
    }
  }

  // Update settings tabs visibility based on connection state
  function updateSettingsTabsVisibility() {
    const userListTabButton = document.getElementById(
      "ovo-multiplayer-settings-user-list-tab-button"
    );
    const banListTabButton = document.getElementById(
      "ovo-multiplayer-settings-ban-list-tab-button"
    );
    const serverSettingsTabButton = document.getElementById(
      "ovo-multiplayer-settings-server-settings-tab-button"
    );
    // Info and Credits tabs are always visible, General is always visible

    if (userListTabButton && banListTabButton && serverSettingsTabButton) {
      const displayValue = state.connectedToRoom ? "inline-block" : "none";
      userListTabButton.style.display = displayValue;
      banListTabButton.style.display = displayValue;

      // Only show server settings tab to hosts
      serverSettingsTabButton.style.display =
        state.connectedToRoom && state.isHost ? "inline-block" : "none";

      // If not connected or not a host and the hidden tab was active, switch to general
      if (
        !state.connectedToRoom ||
        (serverSettingsTabButton ===
          document.querySelector(".ovo-multiplayer-settings-tab-button.active") &&
          !state.isHost)
      ) {
        const activeTabButton = document.querySelector(
          ".ovo-multiplayer-settings-tab-button.active"
        );
        if (
          activeTabButton &&
          (activeTabButton === userListTabButton ||
            activeTabButton === banListTabButton ||
            (activeTabButton === serverSettingsTabButton && !state.isHost))
        ) {
          // Deactivate hidden tab
          activeTabButton.classList.remove("active");
          document.getElementById(
            activeTabButton.id.replace("-tab-button", "")
          ).style.display = "none";

          // Activate general tab
          const generalTabButton = document.getElementById(
            "ovo-multiplayer-settings-general-tab-button"
          );
          const generalTabContent = document.getElementById(
            "ovo-multiplayer-settings-general"
          );
          if (generalTabButton && generalTabContent) {
            generalTabButton.classList.add("active");
            generalTabContent.style.display = "block";
          }
        }
      }
    }
  }

  // Apply theme
  function applyTheme(themeName) {
    const root = document.documentElement; // Target the root element
    let actualTheme = themeName;

    if (themeName === "system") {
      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        actualTheme = "dark";
      } else {
        actualTheme = "light";
      }
    }

    if (actualTheme === "dark") {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
    } else {
      // Default to light theme
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    }
  }

  // State management for OvO multiplayer

  // Central state store
  const state = {
    // Game state
    runtime: null,
    playerType: null,
    textType: null,
    ghostArrType: null,
    globalType: null,
    types: {},
    curLayout: null,

    // Network state
    peer: null,
    conn: null,
    connections: [],
    isHost: false,
    connectedToRoom: false,

    // User state
    username: "",
    initialUsername: "",
    myUniqueHash: "",
    skin: "default",

    // UI state
    usernameInsts: null,
    selectedTab: -1,
    roomUsers: null,
    theme: "system", // Add theme support

    // Content state
    chat: [],
    bannedUsers: [],
    permaBannedUsers: [],
    mutedUsers: [],

    // Preferences
    notifyWhenChatIsHidden: true,
    hideChat: false,
    hasClickedTooltip: false,
    lastPromptId: null,
    lastPromptTime: null,

    // Other
    sendPlayerData: true,
    initialised: false,
    tickMe: null,

    // Join state
    isJoiningRoom: false,
    joinTimeout: null,
    joinOverlay: null,
  };

  // Load preferences from localStorage
  function loadPreferences() {
    try {
      state.username = localStorage.getItem("username") || "";
      state.skin = localStorage.getItem("skin") || "";
      state.ignoreList = JSON.parse(localStorage.getItem("ignoreList") || "[]");
      state.bannedUsers = JSON.parse(localStorage.getItem("bannedUsers") || "[]");
      state.permaBannedUsers = JSON.parse(
        localStorage.getItem("permaBannedUsers") || "[]"
      );
      state.hasClickedTooltip =
        localStorage.getItem("hasClickedTooltip") === "true";
      state.hideChat = localStorage.getItem("hideChat") === "true";
      state.lastPromptId = localStorage.getItem("lastPromptId") || "";
      state.lastPromptTime = parseInt(
        localStorage.getItem("lastPromptTime") || "0"
      );
      state.theme = localStorage.getItem("theme") || "light"; // Load theme preference
    } catch (e) {
      console.error("Error loading preferences", e);
    }
  }

  // Save preferences to localStorage
  function savePreferences() {
    try {
      localStorage.setItem("username", state.username);
      localStorage.setItem("skin", state.skin);
      localStorage.setItem("ignoreList", JSON.stringify(state.ignoreList));
      localStorage.setItem("bannedUsers", JSON.stringify(state.bannedUsers));
      localStorage.setItem(
        "permaBannedUsers",
        JSON.stringify(state.permaBannedUsers)
      );
      localStorage.setItem(
        "hasClickedTooltip",
        state.hasClickedTooltip.toString()
      );
      localStorage.setItem("hideChat", state.hideChat.toString());
      localStorage.setItem("lastPromptId", state.lastPromptId);
      localStorage.setItem("lastPromptTime", state.lastPromptTime.toString());
      localStorage.setItem("theme", state.theme); // Save theme preference
    } catch (e) {
      console.error("Error saving preferences", e);
    }
  }

  // Initialize state with game-specific values
  function init$1(runtime) {
    state.runtime = runtime;

    // Get game types
    state.playerType = runtime.types_by_index.find(
      (x) =>
        !!x.animations &&
        x.animations[0].frames[0].texture_file.includes("collider")
    );

    state.textType = runtime.types_by_index.find(
      (x) =>
        x.name === "TextAlign" ||
        (x.plugin instanceof cr.plugins_.TextModded &&
          x.vars_count === 8 &&
          !x.is_family)
    );

    state.ghostArrType = runtime.types_by_index.find(
      (x) => x.plugin instanceof cr.plugins_.Arr && x.default_instance[5][1] === 6
    );

    state.globalType = runtime.types_by_index.find(
      (x) =>
        x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 24
    );

    // UI component types
    state.types = {
      TitleLogo: runtime.types_by_index.find(
        (x) =>
          x.name === "TitleLogo" ||
          (x.plugin instanceof cr.plugins_.Sprite &&
            x.all_frames &&
            x.all_frames[0].texture_file.includes("titlelogo"))
      ),
      Text: runtime.types_by_index.find(
        (x) =>
          x.name === "TextAlign" ||
          (x.plugin instanceof cr.plugins_.TextModded &&
            x.vars_count === 8 &&
            !x.is_family)
      ),
      SpriteFont: runtime.types_by_index.find(
        (x) =>
          x.plugin instanceof cr.plugins_.SkymenSFPlusPLus &&
          x.behaviors.some((y) => y.behavior instanceof cr.behaviors.SkymenPin)
      ),
      MobileArrows: runtime.types_by_index.find(
        (x) =>
          x.plugin instanceof cr.plugins_.Sprite &&
          x.all_frames &&
          x.all_frames[0].texture_file.startsWith("images/ui")
      ),
    };

    state.curLayout = runtime.running_layout.name;

    loadPreferences();
  }

  // Main entry point for OvO multiplayer mod

  // Initialize the mod
  async function init() {
    // Get runtime
    let runtime = cr_getC2Runtime();
    init$1(runtime);

    // Load skins data
    await initializeSkinsData();

    // Initialize modules
    init$5();
    init$3();
    init$2();
    init$6();
    init$7();

    // Override layout code to instantiate distant players
    overrideLayoutCode();

    // Initialize custom dialog system
    initDialogSystem();

    // Set up fingerprint and initialize
    initializeWithFingerprint();

    // Set up tick function
    runtime.tickMe(ovoMultiplayerClient);

    // Set up tickMe interval for player data sending
    ovoMultiplayerClient.tickMe = setInterval(() => {
      state.sendPlayerData = true;
    }, 1000 / 30);

    // Set globally accessible client
    globalThis.ovoMultiplayerClient = ovoMultiplayerClient;

    // Check if prompt should be shown
    let thisPromptId = THIS_PROMPT_ID;
    localStorage.getItem("lastPromptTime");
    localStorage.getItem("lastPromptId");

    let afterPrompt = () => {
      //click "ovo-multiplayer-toggle-button"
      let button = document.getElementById("ovo-multiplayer-toggle-button");
      if (button)
        button.onclick(true).then(() => {
          // if query string has a roomCode, join it
          let queryStrings = getQueryString();
          if (queryStrings.roomCode) {
            joinRoomWithServerId(queryStrings.roomCode, true);
          }
          if (!state.hasClickedTooltip) {
            setTimeout(() => {
              showTooltip();
            }, 500);
          }
        });
    };

    if (
      !state.lastPromptId ||
      state.lastPromptId !== thisPromptId ||
      !state.lastPromptTime ||
      Date.now() - parseInt(state.lastPromptTime) > 1000 * 60 * 60 * 24 * 7
    ) {
      state.lastPromptId = thisPromptId;
      state.lastPromptTime = Date.now();
      state.hasClickedTooltip = false;
      savePreferences();
      afterPrompt();
    } else {
      afterPrompt();
    }

    // If on main menu, show online version on title
    if (getCurLayout() === "Main Menu") {
      spawnTextOnTitleLogo();
      notifyGotToMainMenu();
    }

    //if on credits layout, show credits
    if (getCurLayout() === "Credits") {
      showCredits();
    }
  }

  // Override layout code to initialize distant players when layout changes
  function overrideLayoutCode() {
    Object.values(state.runtime.layouts).forEach((layout) => {
      let oldFn = layout.startRunning.bind(layout);
      layout.startRunning = () => {
        oldFn();
        state.curLayout = layout.name;
        startOfLayout();
        if (globalThis.crazyMidRoll) {
          globalThis.crazyMidRoll();
        }
        // If on main menu, show online version on title
        if (getCurLayout() === "Main Menu") {
          spawnTextOnTitleLogo();
          notifyGotToMainMenu();
        }

        //if on credits layout, show credits
        if (getCurLayout() === "Credits") {
          showCredits();
        }
      };
    });
  }

  // Initialize with browser fingerprint
  function initializeWithFingerprint() {
    // check localstorage for a uuid, if not, create one
    let uuid = localStorage.getItem("uuid");
    if (!uuid) {
      uuid = generateUUID();
      localStorage.setItem("uuid", uuid);
    }
    state.myUniqueHash = uuid;
    state.initialised = true;
  }

  // Tick function, called each frame
  function tick() {
    if (!state.initialised) return;

    // Handle player username display
    handleUsernameDisplay();
    if (state.connectedToRoom && state.sendPlayerData) {
      state.sendPlayerData = false;
      sendPlayerUpdates();
    }
  }

  // Public API
  const ovoMultiplayerClient = {
    init,
    tick,
    toString: () => "OvO Multiplayer Client",

    // Network methods
    createRoom: createRoom,
    joinRoom: joinRoom,
    leaveRoom: leaveRoom,
    canUserJoin: canUserJoin,

    // UI methods
    updateUserList: updateUserList,
    updateBanlist: updateBanlist,

    // Chat methods
    sendChat: sendChat,

    // Player methods
    getMyData: getMyData,

    // Moderation methods
    kickUser: kickUser,
    banUser: banUser,
    permaBanUser: permaBanUser,
    toggleMuteUser: toggleMuteUser,
  };

  globalThis.ovoMultiplayerClient = {
    initMod() {
      init();
    },
  };

})();
//# sourceMappingURL=ovo-multiplayer.js.map
