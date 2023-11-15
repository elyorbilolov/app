/*!
 * Start Bootstrap - Heroic Features v5.0.2 (https://startbootstrap.com/template/heroic-features)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-heroic-features/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

const container1 = document.getElementById("container1");
const registerBtn = document.getElementById("register1");
const LoginBtn = document.getElementById("login1");

registerBtn.addEventListener("click", () => {
  container1.classList.add("active");
});

LoginBtn.addEventListener("click", () => {
  container1.classList.remove("active");
});

// padd.ejs
function updateRegions() {
  const provinceSelect = document.getElementById("provinceId");
  const regionSelect = document.getElementById("regionId");
  const selectedProvince = provinceSelect.value;

  // Clear the region select options
  regionSelect.innerHTML = "";

  // Add the default option for region
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Tumanni tanlang";
  defaultOption.setAttribute("disabled", "disabled");
  defaultOption.setAttribute("selected", "selected");
  regionSelect.appendChild(defaultOption);

  // If no province is selected, return
  if (selectedProvince === "") {
    return;
  }

  // Make a fetch request to retrieve the regions for the selected province
  fetch(`/regions?code=${selectedProvince}`)
    .then((response) => response.json())
    .then((data) => data.regions)
    .then((regions) => {
      // Create and append option elements for each region
      for (let i = 0; i < regions.length; i++) {
        const option = document.createElement("option");
        option.value = regions[i].soato;
        option.text = regions[i].name;
        regionSelect.appendChild(option);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
