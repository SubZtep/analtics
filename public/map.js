const limit = 100;
const dailyStats = new Map();
const markers = [];
let map;

const removeMarkers = () => {
  while (markers.length > 0) {
    markers.pop().remove();
  }
};

const loadMarkers = (day) =>
  () => {
    removeMarkers();
    const { bounds } = dailyStats.get(day);
    if (bounds.length > 0) {
      map.fitBounds(bounds);
      bounds.forEach((coords) =>
        void markers.push(L.marker(coords).addTo(map))
      );
    }
  };

const populateDaily = (visits) => {
  visits.forEach(({ created, geo }) => {
    const day = created.split("T")[0];
    const stat = dailyStats.has(day)
      ? dailyStats.get(day)
      : { bounds: [], count: 0 };
    if (geo) {
      const coords = Object.values(geo);
      const cj = coords.join("x");
      if (stat.bounds.every((bc) => bc.join("x") !== cj)) {
        stat.bounds.push(coords);
      }
    }
    stat.count++;
    dailyStats.set(day, stat);
  });
};

const renderDayButtons = () => {
  const dataEl = document.querySelector("#data");
  dataEl.querySelectorAll("day-button").forEach((el) =>
    el.parentNode.removeChild(el)
  );
  dailyStats.forEach(({ count }, day) => {
    const btn = document.createElement("day-button");
    btn.setAttribute("day", day);
    btn.setAttribute("count", count);
    btn.addEventListener("click", loadMarkers(day));
    dataEl.appendChild(btn);
  });
};

const fetchData = async (nextBtn) => {
  nextBtn.setAttribute("disabled", "disabled");
  const cursor = nextBtn.getAttribute("data-after");
  const idval = (id) => document.querySelector(`#${id}`).value;

  const res = await fetch(idval("endpoint"), {
    method: "POST",
    body: JSON.stringify({
      query: `{
        findAccountByID(id: ${idval("account")}) {
          name
          visits(_size: ${limit}${
        cursor !== null ? `, _cursor: "${cursor}"` : ""
      }) {
            data {
              created
              geo {
                latitude
                longitude
              }
            }
            after
          }
        }
      }`,
    }),
    headers: {
      Authorization: `Bearer ${idval("secret")}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    alert(res.statusText);
    return;
  }
  const json = await res.json();
  if (json.errors) {
    alert(json.errors[0].message);
    return;
  }

  const { name, visits: { data, after } } = json.data.findAccountByID;
  document.querySelector("#name").innerText = name;

  if (after) {
    nextBtn.setAttribute("data-after", after);
    nextBtn.removeAttribute("disabled");
  }
  return data;
};

document.addEventListener("DOMContentLoaded", () => {
  // init map
  map = L.map("map").setView([51.505, -0.09], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // trigger db query
  const nextBtn = document.querySelector("#next");
  nextBtn.addEventListener("click", async () => {
    const visits = await fetchData(nextBtn);
    populateDaily(visits);
    renderDayButtons();
  });
});
