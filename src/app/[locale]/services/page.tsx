import ServicesShowcase, { ServiceShowcaseItem } from "@/components/ServicesShowcase";
import { PREFAB_IMAGES, BETON_IMAGES, CELIK_IMAGES } from "@/assets/expertise";

type CopyShape = {
  title: string;
  lead: string;
  items: {
    precast: {
      title: string;
      lead: string;
      paragraphs: string[];
    };
    concrete: {
      title: string;
      lead: string;
      paragraphs: string[];
    };
    steel: {
      title: string;
      lead: string;
      paragraphs: string[];
    };
  };
};

function getCopy(locale: string): CopyShape {
  const l = locale.toLowerCase();

  if (l.startsWith("sr")) {
    return {
      title: "Usluge",
      lead:
        "Ovo je prva radna verzija stranice Usluge. Za sada koristimo placeholder tekstove i postojeće galerije iz homepage sekcije, a kasnije možemo lako da prebacimo sve u next-intl poruke i dodamo finalne fotografije, opise i reference projekata.",
      items: {
        precast: {
          title: "Prefabrikovane betonske konstrukcije",
          lead:
            "Podrška kroz ceo proces razvoja prefabrikovanog sistema — od koncepta i koordinacije do modelovanja, detaljisanja i pripreme dokumentacije za proizvodnju.",
          paragraphs: [
            "Ova sekcija je trenutno namenjena kao placeholder sadržaj. Kasnije ovde možemo prikazati tačan obim usluga, tipične deliverable-e, BIM workflow, proizvodne crteže, planove montaže i primere projekata.",
            "Struktura je već spremna za budući sadržaj: naslov, uvodni tekst, više pasusa i galerija slika. To znači da dalje samo menjamo tekstove i fotografije, bez dodatnog menjanja logike stranice."
          ]
        },
        concrete: {
          title: "Betonske konstrukcije",
          lead:
            "Projektovanje i razrada armiranobetonskih sistema uz fokus na statiku, detalje armature, koordinaciju sa ostalim strukama i jasnu tehničku dokumentaciju.",
          paragraphs: [
            "Za ovu oblast kasnije možemo ubaciti finalne opise usluga kao što su proračuni, oplatni planovi, armirački crteži, tehnička koordinacija i BIM isporuka za različite faze projekta.",
            "Vizuelni deo sada koristi postojeće slike, a raspored sekcija je namerno cik-cak kako stranica ne bi delovala šablonski i da bi svaka oblast imala svoj jasan identitet."
          ]
        },
        steel: {
          title: "Čelične konstrukcije",
          lead:
            "Razvoj čeličnih sistema od statičke razrade i koordinacije do proizvodne dokumentacije, spojeva, detalja i podrške tokom izrade i montaže.",
          paragraphs: [
            "Ovde kasnije možemo dodati konkretne opise za hale, sekundarne čelične elemente, spojeve, radioničke nacrte i koordinaciju sa arhitekturom i MEP disciplinama.",
            "Carousel je već spreman za više slika po sekciji, pa možemo jednostavno dodavati galerije realizacija, detalja čeličnih spojeva ili rendera bez izmene same komponente."
          ]
        }
      }
    };
  }

  if (l.startsWith("nl")) {
    return {
      title: "Diensten",
      lead:
        "Dit is de eerste werkversie van de dienstenpagina. Voorlopig gebruiken we placeholderteksten en de bestaande galerijen uit de homepage-sectie. Later kunnen we alles eenvoudig verplaatsen naar next-intl berichten en de definitieve foto's en teksten toevoegen.",
      items: {
        precast: {
          title: "Prefab betonconstructies",
          lead:
            "Ondersteuning tijdens het volledige ontwikkelproces van een prefab systeem — van concept en coördinatie tot modellering, detaillering en productiedocumentatie.",
          paragraphs: [
            "Deze sectie bevat voorlopig tijdelijke inhoud. Later kunnen we hier de exacte scope van de diensten, BIM-workflow, productietekeningen, montagetekeningen en projectvoorbeelden tonen.",
            "De structuur is al klaar voor definitieve content: titel, introductie, meerdere alinea's en een beeldgalerij. Daardoor hoeven we later alleen de inhoud te vervangen, zonder de paginaopbouw te wijzigen."
          ]
        },
        concrete: {
          title: "Betonconstructies",
          lead:
            "Ontwerp en uitwerking van gewapend-betonsystemen met focus op constructieve logica, wapening, disciplinecoördinatie en duidelijke technische documentatie.",
          paragraphs: [
            "Voor dit onderdeel kunnen we later definitieve beschrijvingen toevoegen, zoals berekeningen, bekistingsplannen, wapeningstekeningen, technische coördinatie en BIM-leveringen voor verschillende projectfasen.",
            "Het visuele gedeelte gebruikt nu bestaande afbeeldingen, terwijl de zig-zag opbouw bewust is gekozen zodat de pagina dynamischer oogt en elke discipline een eigen ritme krijgt."
          ]
        },
        steel: {
          title: "Staalconstructies",
          lead:
            "Ontwikkeling van staalsystemen van constructieve uitwerking en coördinatie tot werkplaatstekeningen, verbindingen, details en ondersteuning tijdens productie en montage.",
          paragraphs: [
            "Hier kunnen we later concrete beschrijvingen toevoegen voor hallen, secundaire staalonderdelen, verbindingen, productietekeningen en afstemming met architectuur en installaties.",
            "De carousel is al voorbereid op meerdere beelden per sectie, zodat we later eenvoudig foto's van projecten, verbindingsdetails of renders kunnen toevoegen zonder de component opnieuw te bouwen."
          ]
        }
      }
    };
  }

  if (l.startsWith("de")) {
    return {
      title: "Leistungen",
      lead:
        "Dies ist die erste Arbeitsversion der Leistungsseite. Vorerst verwenden wir Platzhaltertexte und die vorhandenen Galerien aus dem Homepage-Bereich. Später können wir alles problemlos in next-intl auslagern und mit finalen Bildern und Texten ergänzen.",
      items: {
        precast: {
          title: "Vorgefertigte Betonkonstruktionen",
          lead:
            "Unterstützung über den gesamten Entwicklungsprozess eines Fertigteilsystems — vom Konzept und der Koordination bis zur Modellierung, Detaillierung und Produktionsdokumentation.",
          paragraphs: [
            "Dieser Bereich enthält aktuell Platzhalterinhalte. Später können wir hier den genauen Leistungsumfang, BIM-Workflow, Produktionszeichnungen, Montageunterlagen und Projektbeispiele darstellen.",
            "Die Struktur ist bereits für finalen Inhalt vorbereitet: Titel, Einleitung, mehrere Textabsätze und eine Bildergalerie. Dadurch müssen wir später nur Inhalte austauschen, nicht die Seitenlogik."
          ]
        },
        concrete: {
          title: "Betonkonstruktionen",
          lead:
            "Planung und Ausarbeitung von Stahlbetonsystemen mit Fokus auf Tragwerkslogik, Bewehrungsdetails, interdisziplinäre Koordination und klare technische Dokumentation.",
          paragraphs: [
            "Für diesen Bereich können wir später finale Beschreibungen wie Berechnungen, Schalpläne, Bewehrungszeichnungen, technische Koordination und BIM-Lieferungen für verschiedene Projektphasen ergänzen.",
            "Der visuelle Teil nutzt momentan vorhandene Bilder. Das Zick-Zack-Layout ist bewusst gewählt, damit die Seite lebendiger wirkt und jede Leistung einen eigenen Schwerpunkt erhält."
          ]
        },
        steel: {
          title: "Stahlkonstruktionen",
          lead:
            "Entwicklung von Stahlsystemen von der statischen Ausarbeitung und Koordination bis zu Werkstattzeichnungen, Anschlüssen, Details und Unterstützung bei Fertigung und Montage.",
          paragraphs: [
            "Hier können wir später konkrete Leistungsbeschreibungen für Hallen, sekundäre Stahlbauteile, Anschlüsse, Fertigungszeichnungen und die Abstimmung mit Architektur und TGA ergänzen.",
            "Der Carousel ist bereits für mehrere Bilder pro Bereich vorbereitet, sodass wir später Projektreferenzen, Anschlussdetails oder Renderings einfach ergänzen können, ohne die Komponente umzubauen."
          ]
        }
      }
    };
  }

  return {
    title: "Services",
    lead:
      "This is the first working version of the Services page. For now it uses placeholder copy and the existing galleries from the homepage expertise section. Later we can move everything into next-intl messages and replace the temporary content with final multilingual text and curated imagery.",
    items: {
      precast: {
        title: "Precast concrete structures",
        lead:
          "Support throughout the full development process of a precast system — from concept and coordination to modeling, detailing and production-ready documentation.",
        paragraphs: [
          "This section currently uses temporary placeholder content. Later we can present the exact scope of services, BIM workflow, shop drawings, erection documentation and selected project references here.",
          "The structure is already prepared for the final content: title, lead paragraph, multiple text blocks and an image gallery. That means the next step is mostly content replacement, not component rebuilding."
        ]
      },
      concrete: {
        title: "Concrete structures",
        lead:
          "Design and development of reinforced concrete systems with a focus on structural logic, reinforcement detailing, multidisciplinary coordination and clear technical documentation.",
        paragraphs: [
          "For this discipline we can later add final service descriptions such as calculations, formwork plans, reinforcement drawings, technical coordination and BIM delivery across different project phases.",
          "The visual part currently uses the existing images, while the alternating zig-zag layout keeps the page from feeling too repetitive and gives each discipline its own visual rhythm."
        ]
      },
      steel: {
        title: "Steel structures",
        lead:
          "Development of steel systems from structural design and coordination to shop drawings, connections, detailing and support during fabrication and erection.",
        paragraphs: [
          "Here we can later add more specific descriptions for halls, secondary steel elements, connection detailing, fabrication packages and coordination with architecture and MEP disciplines.",
          "The carousel is already prepared for multiple images per section, so we can later expand it with project photos, steel details or rendered visuals without changing the component structure."
        ]
      }
    }
  };
}

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = getCopy(locale);

  const items: ServiceShowcaseItem[] = [
    {
      key: "precast",
      title: copy.items.precast.title,
      lead: copy.items.precast.lead,
      paragraphs: copy.items.precast.paragraphs,
      gallery: PREFAB_IMAGES.length ? PREFAB_IMAGES : ["/precast.webp"]
    },
    {
      key: "concrete",
      title: copy.items.concrete.title,
      lead: copy.items.concrete.lead,
      paragraphs: copy.items.concrete.paragraphs,
      gallery: BETON_IMAGES.length ? BETON_IMAGES : ["/concrete.webp"]
    },
    {
      key: "steel",
      title: copy.items.steel.title,
      lead: copy.items.steel.lead,
      paragraphs: copy.items.steel.paragraphs,
      gallery: CELIK_IMAGES.length ? CELIK_IMAGES : ["/steel.webp"]
    }
  ];

  return (
    <ServicesShowcase
      title={copy.title}
      lead={copy.lead}
      items={items}
    />
  );
}