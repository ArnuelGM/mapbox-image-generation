# How to run

Go to file `static/index.js` and change the `mapboxgl.accessToken` to your own token.

Then run:

```bash
$ docker pull ghcr.io/puppeteer/puppeteer:latest
$ docker build -t mapbox-image-api .
$ docker run -p 3000:3000 mapbox-image-api
```

Then send a request to POST: `http://localhost:3000/get-mapbox-image/binary`

```json
{
  "geojson": [
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [-95.7291, 38.1651]
          }
        }
      ]
    }
  ]
}
```

You should get a response that is a binary image in the format `image/png`.
