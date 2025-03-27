import express from "express";
import pupeeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import cors from "cors";
import morgan from "morgan";

let browser = null;

const app = express();
const mapboxGeojsonDataDic = {}
const mapboxApiV2ConfigDic = new Map();

const sleep = duration => new Promise(res => setTimeout(res, duration))

async function getMappboxImage(url, encoding) {
  if (!browser) {
    browser = await pupeeteer.launch();
  }

  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({width: 800, height: 400});
  await sleep(2000);

  const image = await page.screenshot({
    encoding,
    type: "png",
    fullPage: true,
    omitBackground: true,
  });

  await page.close();

  return image;
}

app.use(cors());
app.use(morgan());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.static("static"));

app.post("/get-mapbox-image/:format?", async function (request, response) {

  const id = uuid();
  mapboxGeojsonDataDic[id] = request.body.geojson;

  const format = request.params.format ?? "binary"
  const encoding = format === "binary" ? "binary" : "base64"
  const image = await getMappboxImage(`http://localhost:3000/index.html?geojson_id=${id}`, encoding);
  
  Reflect.deleteProperty(mapboxGeojsonDataDic, id)
  
  if(format === "binary") {
    response.setHeader("Content-Type", "image/png");
    const buffer = Buffer.from(image, "base64");
    response.send(buffer);
  } else {
    response.setHeader("Content-Type", "application/json");
    response.send({
      data: image
    });
  }


});

app.post("/mapbox-image-v2", async function (req, res) {

  const id = uuid();
  const config = req.body.config;
  mapboxApiV2ConfigDic.set(id, config);

  const url = `http://localhost:3000/mapbox-image-v2/?configId=${id}`;
  const image = await getMappboxImage(url, "base64");
  
  Reflect.deleteProperty(mapboxApiV2ConfigDic, id)
  
  res.setHeader("Content-Type", "application/json");
  res.send({
    data: image
  });

});

app.get("/geojson/:id?", function (req, res) {

  const id = req.params.id;

  res.setHeader("Content-Type", "application/json");

  if (id) {
    res.send(mapboxGeojsonDataDic[id]);
  } else {
    res.send(mapboxGeojsonDataDic);
  }

});


app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
