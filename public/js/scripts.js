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
