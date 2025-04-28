function enhanceOnLoad() {
  // hide our referral, so startpage does not get problems with our extension :)
  hideReferrer();
  // set search title and return query
  return setTitle();
}

function enhanceDelayed(searchTerm) {
  // Append OSM link
  addOsmLink(searchTerm)
  // colorize ads in results
  colorizeAds();
}

function hideReferrer() {
  const meta = document.createElement("meta");
  meta.name = "referrer";
  meta.content = "no-referrer";
  document.getElementsByTagName("head")[0].appendChild(meta);
}

function colorizeAds() {
  let color = window.getComputedStyle(document.documentElement).background;
  if (color.substring(0, 3) !== "rgb") {
    console.error("Input color not in expected rgb() format.");
    return;
  }
  const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let ratio;
  if ((rgb[1] * 299 + rgb[2] * 587 + rgb[3] * 114) / 1000 > 128) {
    // Bright background, use darker color
    ratio = 0.93;
  } else {
    // Dark background, use brighter color
    ratio = 1.5;
  }
  for (let i = 0; i < 3; i++) {
    const int = parseInt(rgb[i + 1]);
    rgb[i] = Math.max(0, Math.min(255, Math.floor(int * ratio)));
  }
  color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  const ads = document.getElementsByClassName("right-side-attribution-container")
  console.log(`Found ${ads.length} ads to colorize.`);
  for (let i = 0; i < ads.length; i++) {
    ads[i].parentNode.parentNode.style.background = color;
  }
}

function setTitle(fallback) {
  let searchTerm;
  if (!fallback) {
    // Try to extract query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get("q");
    searchTerm = (urlParams !== undefined && urlQuery !== null) ? urlQuery : undefined;
  } else {
    // Try to extract query from input field
    const queryInput = document.getElementsByName("query")[0];
    searchTerm = queryInput !== undefined ? queryInput.value : undefined;
  }
  if (searchTerm === undefined || searchTerm === "") {
    if (!fallback) {
      return setTitle(fallback=true);
    } else {
      return;
    }
  }
  document.title = searchTerm + " - Startpage.com";
  return searchTerm;
}

function addOsmLink(searchTerm) {
  const dropdownDisplay = document.querySelector(".maps").querySelector(".dropdown-display");

  // last Dropdown-Entry is empty div tag, like they were waiting for me to fix the extension and add OpenStreetMaps ;)
  const osmaps = dropdownDisplay.childNodes[2].cloneNode(true);

  osmaps.querySelector("span").textContent = "OpenStreetMap";
  osmaps.querySelector("img").src = "https://icon.horse/icon/openstreetmap.com";
  osmaps.onclick = function() { window.open("https://www.openstreetmap.org/search?query=" + searchTerm, '_blank'); };
  dropdownDisplay.appendChild(osmaps);
}

(async () => {
  console.log("Enhancing Startpage...");
  const searchTerm = enhanceOnLoad();

  if (searchTerm !== undefined && searchTerm !== "") {
    window.setInterval(function() {
      if (document.querySelectorAll("[src*='icon.horse']").length === 0) {
        enhanceDelayed(searchTerm);
      }
    }, 500);
  }
})();
