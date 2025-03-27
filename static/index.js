const url = new URL(window.location.href);
const geojsonId = url.searchParams.get("geojson_id");
const $ = (selector) => document.querySelector(selector);
mapboxgl.accessToken = "";

const defaultlngLat = [-95.7291, 38.1651];
const heatmapColors = {
  default: [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(33,102,172,0)",
    0.2,
    "rgb(103,169,207)",
    0.4,
    "rgb(209,229,240)",
    0.6,
    "rgb(253,219,199)",
    0.8,
    "rgb(239,138,98)",
    1,
    "rgb(178,24,43)",
  ],
  critical: [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(0, 0, 255, 0)",
    0.2,
    "#FA7F7F",
    0.4,
    "#F17B7B",
    0.6,
    "#CF6A6A",
    0.8,
    "#AD5858",
    1,
    "#8B4747",
  ],
  high: [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(0, 0, 255, 0)",
    0.2,
    "#FF8B4D",
    0.4,
    "#ED8147",
    0.6,
    "#D0713E",
    0.8,
    "#B36136",
    1,
    "#95512D",
  ],
  medium: [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(0, 0, 255, 0)",
    0.2,
    "#FACA15",
    0.4,
    "#E8BA13",
    0.6,
    "#CBA210",
    0.8,
    "#AD8B0E",
    1,
    "#90740C",
  ],
  low: [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(0, 0, 255, 0)",
    0.2,
    "#76A9FA",
    0.4,
    "#6D9CE8",
    0.6,
    "#5F88CB",
    0.8,
    "#5175AD",
    1,
    "#446190",
  ],
};

async function getGeojson() {
  const url = geojsonId
    ? `http://localhost:3000/geojson/${geojsonId}`
    : "/heatmap-point.json";
  const response = await fetch(url);
  return await response.json();
}

const map = new mapboxgl.Map({
  container: "map",
  center: defaultlngLat,
  style: "mapbox://styles/mapbox/navigation-night-v1",
  zoom: 3.16,
});

map.on("load", async () => {
  const geojson = await getGeojson();

  for (const layer in geojson) {
    map.addSource(`heatmap-source-${layer}`, {
      type: "geojson",
      data: geojson[layer],
    });

    map.addLayer({
      id: `heatmap-${layer}-id`,
      type: "heatmap",
      source: `heatmap-source-${layer}`,
      maxzoom: 24,
      paint: {
        "heatmap-radius": 10,
        "heatmap-color": heatmapColors[layer] ?? heatmapColors.default,
        "heatmap-weight": 1,
      },
    });
  }
});
