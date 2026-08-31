/**
 * Two locales, one dictionary shape.
 *
 * `mn` is typed as `Dictionary`, which is derived from `en`, so a missing or
 * misspelled key is a build error rather than an English string leaking into
 * the Mongolian site.
 */
export const LOCALES = ["en", "mn"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  mn: "Монгол",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const en = {
  nav: {
    templates: "Templates",
    howItWorks: "How it works",
    openKodu: "Open Kodu",
    switchLanguage: "Switch language",
  },
  footer: {
    note: "Templates are the work of their original authors and stay under their own licences.",
    policy: "Licensing policy",
  },
  landing: {
    badge: (count: number) => `${count} licence-checked templates`,
    title: "Start from something that already works.",
    lede: "A blank prompt box is the hardest place to start. Pick a real open-source template, open it in Kodu, and tell the agent what to change.",
    searchPlaceholder: "dashboard, saas, portfolio, astro…",
    searchAction: "Search",
    browseAll: (count: number) => `Browse all ${count} →`,
    showcaseEyebrow: "Popular right now",
    showcaseTitle: "Templates people actually ship with",
    showcaseLede:
      "Every one of these is open source, actively maintained, and free to copy into your own workspace.",
    seeAll: "See all",
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps, no setup",
    stepsLede:
      "No cloning, no dependency install, no “works on my machine”. The sandbox does it.",
    step1Title: "Pick a template",
    step1Body:
      "Filter by what you are building and what stack you want. Check the live demo before you commit to anything.",
    step2Title: "Open it in Kodu",
    step2Body:
      "Kodu clones the repository into a sandbox and starts the dev server. You get a running app, not a zip file.",
    step3Title: "Tell the agent what to change",
    step3Body:
      "Describe the change in plain language. The agent edits real code you can read, keep, and deploy.",
    categoriesEyebrow: "Browse by category",
    categoriesTitle: "What are you building?",
    licensingEyebrow: "Licensing",
    licensingTitle: "Free means free here",
    licensingLede:
      "Plenty of galleries list whatever they can scrape. We check the licence before a template is ever offered for copying.",
    licensingLink: "Read the licensing policy →",
    licensingPoint1Strong: "GitHub verifies the licence",
    licensingPoint1:
      ", not us. Every search asks for MIT, Apache-2.0, BSD, ISC, MPL-2.0, Unlicense or CC0.",
    licensingPoint2Strong: "The licence travels with the code.",
    licensingPoint2:
      " Copying a template into Kodu keeps the original LICENSE and copyright notice.",
    licensingPoint3Strong: "No licence means no copy.",
    licensingPoint3:
      " A repository without one is all-rights-reserved by default, so we link to it instead.",
    ctaTitle: "Your next project already exists.",
    ctaLede: "Find the closest starting point and change it into what you meant.",
    ctaAction: "Browse templates",
  },
  gallery: {
    title: "Browse templates",
    lede: "{count} open-source templates, each checked for a licence that lets you use it.",
    metaDescription:
      "Search free, open-source web templates by category and stack. Every template is licence-checked and opens straight into Kodu.",
    searchPlaceholder: "Search templates — dashboard, saas, astro, stripe…",
    searchLabel: "Search templates",
    all: "All",
    stack: "Stack",
    anyStack: "Any",
    sort: "Sort",
    sortFeatured: "Featured",
    sortStars: "Most stars",
    sortUpdated: "Recently updated",
    sortName: "Name (A–Z)",
    copyableOnly: "Only templates I can copy",
    mongolianOnly: "Mongolian content",
    mongolianBadge: "Монгол",
    resultCount: "{shown} of {total}",
    clear: "Clear",
    emptyTitle: "Nothing matches that yet.",
    emptyHint: "Try a broader search, or clear the filters.",
    showMore: "Show {count} more",
    otherCategories: "Other categories",
  },
  detail: {
    openInKodu: "Open in Kodu",
    viewOnGitHub: "View on GitHub",
    liveDemo: "Live demo",
    source: "Source",
    stars: "Stars",
    forks: "Forks",
    updated: "Updated",
    category: "Category",
    licenceHeading: "Licence",
    readLicence: "Read the licence on GitHub",
    byAuthor: (owner: string) => `By ${owner}.`,
    copyNote:
      " Opening it in Kodu copies the repository along with its licence and copyright notice.",
    similar: "Similar templates",
    notFound: "Template not found",
    basedOnHeading: "Based on another template",
    basedOn: "Built from {name} by {author}, which is {license} licensed. The original licence and copyright notice are kept in this repository.",
    basedOnNoLicense: "Built from {name} by {author}. The original licence and copyright notice are kept in this repository.",
    viewOriginal: "View the original",
    derivativesHeading: "Versions built from this",
  },
  licence: {
    none: "No licence",
    permissive:
      "{label} — free to copy and modify. The original licence and copyright notice are kept with the code.",
    restricted:
      "{label} — this licence has terms we cannot accept on your behalf, so we link to the source instead of copying it.",
    missing:
      "This project ships no licence, which means all rights are reserved by default. We link to it rather than copying the code.",
    copyable: "Free to copy into your workspace",
    linkOnly: "Linked to the source, not copied",
  },
  about: {
    title: "How Templete works",
    metaTitle: "How it works",
    metaDescription:
      "How Templete collects open-source templates, how licences are checked, and how a template gets opened in Kodu.",
    lede1: "Templete is a gallery of free, open-source web templates that you can open directly in ",
    lede2: " and edit with an AI agent.",
    sourcesTitle: "Where the templates come from",
    sources1:
      "An ingest job searches GitHub for repositories that tag themselves as templates or starters, then keeps the ones that are public, actively maintained, not archived, and carry a description. Awesome-lists, tutorials and course material are filtered out — they are not things you can open and edit as an app.",
    sources2:
      "The job re-runs from scratch, so a repository that is deleted, archived, or has its licence changed drops out of the gallery on the next run.",
    licenceTitle: "How licences are handled",
    licence1: (copyable: number, total: number) =>
      `Every search asks GitHub for a specific set of permissive licences — MIT, Apache-2.0, BSD, ISC, MPL-2.0, Unlicense and CC0 — so the licence is verified by GitHub rather than guessed from a README. ${copyable} of the ${total} templates listed here fall into that group and can be copied into your workspace, with the original LICENSE file and copyright notice kept intact.`,
    licence2:
      "Anything without a permissive licence is never copied. A repository that ships no licence at all is, by default, all-rights-reserved — for those we link to the source instead.",
    licence3:
      "If you are the author of a template listed here and would rather it were removed, get in touch and it comes down.",
    openTitle: "What happens when you open one",
    open1: "The Open in Kodu button posts the template to Kodu, which clones the repository into a fresh sandbox and starts the dev server. From there it is an ordinary Kodu project — you describe what you want changed and the agent edits the code.",
    open2:
      "You are starting from a codebase that already runs, so the first change is a change rather than a guess.",
    addTitle: "Adding a template",
    add1: "Templates are generated into a data file in this project's repository. To add one by hand, add an entry to data/curated.json — curated entries override the ingested ones and can be pinned to the top of the gallery.",
    back: "← Back to the gallery",
  },
};

export type Dictionary = typeof en;

const mn: Dictionary = {
  nav: {
    templates: "Template-ууд",
    howItWorks: "Хэрхэн ажилладаг вэ",
    openKodu: "Kodu нээх",
    switchLanguage: "Хэл солих",
  },
  footer: {
    note: "Template бүр эх зохиогчийнхөө бүтээл бөгөөд өөрсдийн лицензийн дор хэвээр байна.",
    policy: "Лицензийн бодлого",
  },
  landing: {
    badge: (count: number) => `Лицензээр шалгасан ${count} template`,
    title: "Хоосон дэлгэцнээс бус, ажилладаг кодоос эхэл.",
    lede: "Хоосон prompt хайрцаг бол эхлэхэд хамгийн хэцүү газар. Жинхэнэ нээлттэй эхийн template сонгоод, Kodu дээр нээж, агентдаа юу өөрчлөхийг нь хэл.",
    searchPlaceholder: "дашбоард, saas, портфолио, astro…",
    searchAction: "Хайх",
    browseAll: (count: number) => `Бүх ${count}-г үзэх →`,
    showcaseEyebrow: "Одоо эрэлттэй",
    showcaseTitle: "Хүмүүсийн үнэхээр ашигладаг template-ууд",
    showcaseLede:
      "Эдгээр бүгд нээлттэй эхийн, тогтмол шинэчлэгддэг, өөрийн орчин руугаа чөлөөтэй хуулж болох template-ууд.",
    seeAll: "Бүгдийг үзэх",
    stepsEyebrow: "Хэрхэн ажилладаг вэ",
    stepsTitle: "Гурван алхам, тохиргоо шаардахгүй",
    stepsLede:
      "Clone хийх, dependency суулгах шаардлагагүй. “Миний машин дээр ажиллаж байсан” гэж хэлэх ч хэрэггүй — sandbox бүгдийг хийнэ.",
    step1Title: "Template сонго",
    step1Body:
      "Юу барихаа, ямар технологи ашиглахаа сонгож шүү. Шийдэхээсээ өмнө ажиллаж байгаа хувилбарыг нь харж болно.",
    step2Title: "Kodu дээр нээ",
    step2Body:
      "Kodu репог sandbox руу clone хийж, dev серверийг асаана. Чи zip файл биш, ажиллаж байгаа апп авна.",
    step3Title: "Агентдаа юу өөрчлөхийг хэл",
    step3Body:
      "Өөрчлөлтөө энгийн үгээр тайлбарла. Агент чиний уншиж, өөрчилж, deploy хийж чадах жинхэнэ кодыг засна.",
    categoriesEyebrow: "Ангиллаар үзэх",
    categoriesTitle: "Чи юу барих гэж байна?",
    licensingEyebrow: "Лиценз",
    licensingTitle: "Үнэгүй гэдэг нь энд үнэхээр үнэгүй",
    licensingLede:
      "Ихэнх галерей юу таарсныг нь хуулж тавьдаг. Бид template-ийг хуулж болно гэж санал болгохоос өмнө лицензийг нь шалгадаг.",
    licensingLink: "Лицензийн бодлогыг унших →",
    licensingPoint1Strong: "Лицензийг GitHub баталгаажуулдаг",
    licensingPoint1:
      ", бид биш. Хайлт бүр MIT, Apache-2.0, BSD, ISC, MPL-2.0, Unlicense эсвэл CC0 гэж заана.",
    licensingPoint2Strong: "Лиценз кодтойгоо хамт явна.",
    licensingPoint2:
      " Template-ийг Kodu руу хуулахад эх LICENSE файл, зохиогчийн эрхийн мэдэгдэл хэвээр үлдэнэ.",
    licensingPoint3Strong: "Лицензгүй бол хуулахгүй.",
    licensingPoint3:
      " Лицензгүй репо анхдагчаар бүх эрх хамгаалагдсан гэсэн үг тул бид зөвхөн холбоос тавина.",
    ctaTitle: "Чиний дараагийн төсөл аль хэдийн байгаа.",
    ctaLede: "Хамгийн ойр эхлэлийг нь олоод, өөрийн санаа болгон өөрчил.",
    ctaAction: "Template-ууд үзэх",
  },
  gallery: {
    title: "Template-ууд",
    lede: "Ашиглахыг чинь зөвшөөрдөг лицензтэй эсэхийг нь шалгасан {count} нээлттэй эхийн template.",
    metaDescription:
      "Үнэгүй, нээлттэй эхийн вэб template-уудыг ангилал, технологиор нь хайх. Бүгд лицензээр шалгагдсан бөгөөд Kodu дээр шууд нээгдэнэ.",
    searchPlaceholder: "Хайх — дашбоард, saas, astro, stripe…",
    searchLabel: "Template хайх",
    all: "Бүгд",
    stack: "Технологи",
    anyStack: "Аль ч",
    sort: "Эрэмбэ",
    sortFeatured: "Онцлох",
    sortStars: "Од олонтой",
    sortUpdated: "Саяхан шинэчлэгдсэн",
    sortName: "Нэрээр (A–Z)",
    copyableOnly: "Зөвхөн хуулж болохыг",
    mongolianOnly: "Монгол контенттой",
    mongolianBadge: "Монгол",
    resultCount: "{total}-аас {shown}",
    clear: "Цэвэрлэх",
    emptyTitle: "Тохирох зүйл олдсонгүй.",
    emptyHint: "Илүү өргөн хайлт хийж үзэх, эсвэл шүүлтүүрээ цэвэрлэ.",
    showMore: "Дахин {count}-г харах",
    otherCategories: "Бусад ангилал",
  },
  detail: {
    openInKodu: "Kodu дээр нээх",
    viewOnGitHub: "GitHub дээр харах",
    liveDemo: "Ажиллаж байгаа хувилбар",
    source: "Эх код",
    stars: "Од",
    forks: "Салаа",
    updated: "Шинэчлэгдсэн",
    category: "Ангилал",
    licenceHeading: "Лиценз",
    readLicence: "GitHub дээр лицензийг унших",
    byAuthor: (owner: string) => `Зохиогч: ${owner}.`,
    copyNote:
      " Kodu дээр нээхэд репог лиценз, зохиогчийн эрхийн мэдэгдлийнх нь хамт хуулна.",
    similar: "Төстэй template-ууд",
    notFound: "Template олдсонгүй",
    basedOnHeading: "Өөр template дээр суурилсан",
    basedOn: "{author}-ийн {name} дээр суурилсан бөгөөд {license} лицензтэй. Эх лиценз, зохиогчийн эрхийн мэдэгдэл энэ репод хэвээр хадгалагдсан.",
    basedOnNoLicense: "{author}-ийн {name} дээр суурилсан. Эх лиценз, зохиогчийн эрхийн мэдэгдэл энэ репод хэвээр хадгалагдсан.",
    viewOriginal: "Эх хувилбарыг үзэх",
    derivativesHeading: "Үүн дээр суурилсан хувилбарууд",
  },
  licence: {
    none: "Лицензгүй",
    permissive:
      "{label} — чөлөөтэй хуулж, өөрчилж болно. Эх лиценз болон зохиогчийн эрхийн мэдэгдэл кодтой хамт үлдэнэ.",
    restricted:
      "{label} — энэ лицензийн нөхцөлийг бид таны өмнөөс хүлээж чадахгүй тул хуулахын оронд эх сурвалж руу нь холбоно.",
    missing:
      "Энэ төсөлд лиценз огт байхгүй бөгөөд энэ нь анхдагчаар бүх эрх хамгаалагдсан гэсэн үг. Тиймээс кодыг хуулахгүй, зөвхөн холбоос тавина.",
    copyable: "Өөрийн орчин руу чөлөөтэй хуулж болно",
    linkOnly: "Хуулахгүй, зөвхөн эх сурвалж руу холбоно",
  },
  about: {
    title: "Templete хэрхэн ажилладаг вэ",
    metaTitle: "Хэрхэн ажилладаг вэ",
    metaDescription:
      "Templete нээлттэй эхийн template-уудыг хэрхэн цуглуулдаг, лицензийг хэрхэн шалгадаг, template Kodu дээр хэрхэн нээгддэг тухай.",
    lede1: "Templete бол шууд ",
    lede2: " дээр нээж, AI агентаар засаж болох үнэгүй, нээлттэй эхийн вэб template-уудын галерей юм.",
    sourcesTitle: "Template-ууд хаанаас ирдэг вэ",
    sources1:
      "Ingest ажил GitHub-аас өөрсдийгөө template буюу starter гэж тэмдэглэсэн репог хайж, нийтэд нээлттэй, тогтмол шинэчлэгддэг, архивлагдаагүй, тайлбартай нь үлдээдэг. Awesome-жагсаалт, хичээл, сургалтын материалыг шүүж хаядаг — тэдгээрийг нээгээд апп болгон засах боломжгүй.",
    sources2:
      "Ажил бүрд индекс эхнээсээ дахин үүсдэг тул устсан, архивлагдсан, эсвэл лицензээ сольсон репо дараагийн ажиллагаанд галерейгаас өөрөө унана.",
    licenceTitle: "Лицензийг хэрхэн зохицуулдаг вэ",
    licence1: (copyable: number, total: number) =>
      `Хайлт бүр GitHub-аас тодорхой permissive лицензүүдийг — MIT, Apache-2.0, BSD, ISC, MPL-2.0, Unlicense, CC0 — шууд нэрлэж асуудаг. Ингэснээр лицензийг README-гээс таамаглахын оронд GitHub өөрөө баталгаажуулна. Энд байгаа ${total} template-ийн ${copyable} нь энэ бүлэгт багтах бөгөөд эх LICENSE файл, зохиогчийн эрхийн мэдэгдлийг нь бүрэн хадгалсан хэвээр чиний орчин руу хуулж болно.`,
    licence2:
      "Permissive лицензгүй зүйлийг хэзээ ч хуулахгүй. Лиценз огт байхгүй репо анхдагчаар бүх эрх хамгаалагдсан гэсэн үг тул тэдгээрийг зөвхөн эх сурвалж руу нь холбоно.",
    licence3:
      "Хэрэв энд байгаа template-ийн зохиогч нь та бөгөөд хасуулахыг хүсвэл бидэнтэй холбогдоорой, тэр даруй хасна.",
    openTitle: "Нээхэд юу болох вэ",
    open1: "«Kodu дээр нээх» товч template-ийг Kodu руу илгээнэ. Kodu репог шинэ sandbox руу clone хийж, dev серверийг асаана. Тэндээс энэ бол ердийн Kodu төсөл — юу өөрчлөхөө хэлэхэд агент кодыг засна.",
    open2:
      "Чи аль хэдийн ажиллаж байгаа кодоос эхэлж байгаа тул анхны алхам чинь таамаг биш, жинхэнэ өөрчлөлт болно.",
    addTitle: "Template нэмэх",
    add1: "Template-ууд энэ төслийн репо доторх өгөгдлийн файлд үүсдэг. Гараар нэмэхийг хүсвэл data/curated.json дотор бичлэг нэмнэ — гараар нэмсэн бичлэг автоматаар цуглуулсныг дарж, галерейн эхэнд бэхлэгдэж болно.",
    back: "← Галерей руу буцах",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, mn };

/**
 * Fills {name} placeholders.
 *
 * The gallery dictionary crosses into a Client Component, and functions cannot
 * be serialised across that boundary — so anything the client interpolates is
 * a plain string with placeholders rather than a function.
 */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Swaps the locale segment of a path: ("/mn/templates", "en") -> "/en/templates". */
export function localizePath(pathname: string, locale: Locale): string {
  const rest = pathname.replace(/^\/(en|mn)(?=\/|$)/, "");
  return `/${locale}${rest}`;
}
