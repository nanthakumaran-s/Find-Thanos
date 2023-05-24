const stones = [
  {
    name: "Power Stone",
    location: {
      latitude: 36.191086,
      longitude: 44.009154,
    },
    img: "assets/images/stones/power stone.webp",
  },
  {
    name: "Mind Stone",
    location: {
      latitude: 59.048805,
      longitude: -3.341756,
    },
    img: "assets/images/stones/mind stone.webp",
  },
  {
    name: "Soul Stone",
    location: {
      latitude: -27.126135,
      longitude: -109.276876,
    },
    img: "assets/images/stones/soul stone.webp",
  },
  {
    name: "Time Stone",
    location: {
      latitude: 11.399179,
      longitude: 79.693572,
    },
    img: "assets/images/stones/time stone.webp",
  },
  {
    name: "Space Stone",
    location: {
      latitude: 51.178606,
      longitude: -1.826076,
    },
    img: "assets/images/stones/space stone.webp",
  },
  {
    name: "Reality Stone",
    location: {
      latitude: 29.975263,
      longitude: 31.137692,
    },
    img: "assets/images/stones/reality stone.webp",
  },
];

const avengers = [
  {
    name: "Iron man",
    location: {
      latitude: -5.808884,
      longitude: -55.301941,
    },
    image: "assets/images/avengers/iron man.png",
    marker: undefined,
  },
  {
    name: "Black panther",
    location: {
      latitude: -0.554989,
      longitude: 9.959376,
    },
    image: "assets/images/avengers/black panther.png",
    marker: undefined,
  },
  {
    name: "Captain america",
    location: {
      latitude: 40.102348,
      longitude: -123.47607,
    },
    image: "assets/images/avengers/captain america.png",
    marker: undefined,
  },
  {
    name: "Doctor strange",
    location: {
      latitude: 40.747372,
      longitude: -73.463289,
    },
    image: "assets/images/avengers/doctor strange.png",
    marker: undefined,
  },
  {
    name: "Hulk",
    location: {
      latitude: 22.147345,
      longitude: -101.416639,
    },
    image: "assets/images/avengers/hulk.png",
    marker: undefined,
  },
  {
    name: "Spider man",
    location: {
      latitude: 32.086127,
      longitude: -92.923034,
    },
    image: "assets/images/avengers/spider man.png",
    marker: undefined,
  },
  {
    name: "Thor",
    location: {
      latitude: 19.956809,
      longitude: 83.921004,
    },
    image: "assets/images/avengers/thor.png",
    marker: undefined,
  },
];

const thanosMarker = {
  marker: undefined,
  location: {
    latitude: undefined,
    longitude: undefined,
  },
};

const initMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmFudGhha3VtYXJhbiIsImEiOiJjbGkxeHBjYXMwbGxoM2RvNHY2OW5uenhqIn0.H9wIcwT_IhKVf8imKjAU7g";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 1,
  });
  map.addControl(new mapboxgl.NavigationControl());

  for (let i = 0; i < stones.length; i++) {
    new mapboxgl.Marker({
      element: generateElem(stones[i].img, stones[i].name),
    })
      .setLngLat([stones[i].location.longitude, stones[i].location.latitude])
      .addTo(map);
  }

  for (let i = 0; i < avengers.length; i++) {
    avengers[0].marker = new mapboxgl.Marker({
      element: generateElem(avengers[i].image, avengers[i].name),
    })
      .setLngLat([
        avengers[i].location.longitude,
        avengers[i].location.latitude,
      ])
      .addTo(map);
  }

  thanosMarker.location.latitude = getRandomInRange(-90, 90, 3);
  thanosMarker.location.longitude = getRandomInRange(-180, 180, 3);
  thanosMarker.marker = new mapboxgl.Marker({
    element: generateElem("assets/images/thanos.png", "thanos"),
    draggable: true,
  })
    .setLngLat([
      thanosMarker.location.longitude,
      thanosMarker.location.latitude,
    ])
    .addTo(map);
};

const generateElem = (img, id) => {
  var el = document.createElement("img");
  el.id = id;
  el.className = "marker";
  el.src = img;
  el.style.width = 50 + "px";
  el.style.height = 50 + "px";

  return el;
};

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

const moveThanos = () => {
  newLoc = getLocation(
    thanosMarker.location.latitude,
    thanosMarker.location.longitude
  );
  thanosMarker.location.latitude = newLoc.newLat;
  thanosMarker.location.longitude = newLoc.newLng;
  thanosMarker.marker.setLngLat([
    thanosMarker.location.longitude,
    thanosMarker.location.latitude,
  ]);
  checkStonesVsThanos();
  setTimeout(() => {
    moveThanos();
  }, 1000);
};

const getLocation = (givenLat, givenLng) => {
  var maxDistance = 500;
  var distance = Math.random() * maxDistance;
  var angle = Math.random() * 2 * Math.PI;
  var earthRadius = 6371;
  var latInRadians = (givenLat * Math.PI) / 180;
  var lngInRadians = (givenLng * Math.PI) / 180;
  var newLatInRadians = Math.asin(
    Math.sin(latInRadians) * Math.cos(distance / earthRadius) +
      Math.cos(latInRadians) *
        Math.sin(distance / earthRadius) *
        Math.cos(angle)
  );
  var newLat = (newLatInRadians * 180) / Math.PI;
  var newLngInRadians =
    lngInRadians +
    Math.atan2(
      Math.sin(angle) *
        Math.sin(distance / earthRadius) *
        Math.cos(latInRadians),
      Math.cos(distance / earthRadius) -
        Math.sin(latInRadians) * Math.sin(newLatInRadians)
    );
  var newLng = (newLngInRadians * 180) / Math.PI;
  return {
    newLat,
    newLng,
  };
};

const checkStonesVsThanos = () => {
  for (let i = 0; i < stones.length; i++) {
    const diff = distanceDif(
      thanosMarker.location.latitude,
      stones[i].location.latitude,
      thanosMarker.location.longitude,
      stones[i].location.longitude
    );
    if (diff < 1000) {
      alert(`Thonos is close to ${stones[i].name}`);
      alert("Avengers Assemble");
      for (let j = 0; j < avengers.length; j++) {
        avengers[j].marker.setLngLat([
          thanosMarker.location.longitude,
          thanosMarker.location.latitude,
        ]);
      }
      setTimeout(() => initMap(), 6000);
    }
  }
};

const distanceDif = (lat1, lat2, lng1, lng2) => {
  var earthRadius = 6371;
  var lat1InRadians = (lat1 * Math.PI) / 180;
  var lng1InRadians = (lng1 * Math.PI) / 180;
  var lat2InRadians = (lat2 * Math.PI) / 180;
  var lng2InRadians = (lng2 * Math.PI) / 180;
  var latDiff = lat2InRadians - lat1InRadians;
  var lngDiff = lng2InRadians - lng1InRadians;
  var a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(lat1InRadians) *
      Math.cos(lat2InRadians) *
      Math.sin(lngDiff / 2) ** 2;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

initMap();
moveThanos();
