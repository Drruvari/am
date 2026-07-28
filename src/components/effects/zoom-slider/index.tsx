import ZoomSliderComp, { type ZoomSliderItem } from "./ZoomSliderComp";

const sliderData: ZoomSliderItem[] = [
  {
    number: "01",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-09.jpg",
    title: "AURA",
    desc: "A calm interior shaped by soft daylight, warm materials, and quiet spatial transitions.",
    categories: ["Interior Design"],
  },
  {
    number: "02",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-07.jpg",
    title: "DRIFT",
    desc: "A compact coastal home designed around breeze, shade, and an easy connection to outdoors.",
    categories: ["Homes"],
  },
  {
    number: "03",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-03.jpg",
    title: "FORM",
    desc: "Sculptural rooms where curved forms frame changing light throughout the day.",
    categories: ["Interior Design", "Commercial"],
  },
  {
    number: "04",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg",
    title: "FLOW",
    desc: "A flexible workplace balancing open collaboration with focused, private zones.",
    categories: ["Commercial"],
  },
  {
    number: "05",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg",
    title: "DEPTH",
    desc: "A careful renovation that reveals original structure while adding contemporary depth.",
    categories: ["Renovations"],
  },
  {
    number: "06",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-06.jpg",
    title: "ENERGY",
    desc: "A family home organised around a planted courtyard and generous shared living spaces.",
    categories: ["Homes"],
  },
  {
    number: "07",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg",
    title: "GLITCH",
    desc: "A bold commercial interior built from reflective surfaces, contrast, and precise detailing.",
    categories: ["Commercial"],
  },
  {
    number: "08",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg",
    title: "FRAME-X",
    desc: "An existing residence reworked with framed views, clearer circulation, and natural finishes.",
    categories: ["Renovations"],
  },
  {
    number: "09",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg",
    title: "LIGHTPLAY",
    desc: "A light-led interior study pairing restrained colour with tactile, durable materials.",
    categories: ["Interior Design"],
  },
  {
    number: "10",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg",
    title: "MINIMAL",
    desc: "A minimal home extension creating more space through fewer, stronger architectural moves.",
    categories: ["Homes", "Renovations"],
  },
];

export default function ZoomSlider() {
  return <ZoomSliderComp title="Works" sliderData={sliderData} />;
}
