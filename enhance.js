function enhance() {
  // hide our referral, so startpage does not get problems with our extension :)
  hideReferrer();
  // Set search-title and return query
  const searchTerm = setTitle();
  // Append OSM link
  if (searchTerm !== undefined && searchTerm !== "") {
    addOsmLink(searchTerm);
  }
}

function hideReferrer() {
  const meta = document.createElement("meta");
  meta.name = "referrer";
  meta.content = "no-referrer";
  document.getElementsByTagName("head")[0].appendChild(meta);
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
  const menubar = document.getElementsByClassName("categories")[0];
  menubar.className = "categories"; // removes additional styling

  const dropdownDisplay = document.querySelector(".dropdown-display");

  const osmLink = document.createElement("a");
  osmLink.style = "text-decoration: inherit; color:inherit; white-space: nowrap;";
  osmLink.href = "https://www.openstreetmap.org/search?query=" + searchTerm;

  // last Dropdown-Entry is empty div tag, like they were waiting for me to fix the extension and add OpenStreetMaps ;)
  const osmaps = dropdownDisplay.childNodes[dropdownDisplay.childElementCount-2].cloneNode(true);
  osmaps.querySelector("span").textContent = "OpenStreetMap";
  osmaps.querySelector("img").src = "https://icon.horse/icon/openstreetmap.com";
  osmLink.appendChild(osmaps);
  dropdownDisplay.appendChild(osmLink);
}

var intervalId = window.setInterval(function() {
  if (document.querySelectorAll("[src*='icon.horse']").length === 0) {
    console.log("Enhancing Startpage...");
    enhance();
  }
}, 100);
