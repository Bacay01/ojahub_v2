// Load header and footer

// components/main.js
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const html = await response.text();

    const targetElement = document.getElementById(elementId);
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const component = temp.firstElementChild;
    targetElement.parentNode.replaceChild(component, targetElement);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

loadComponent("header", "pages/components/header.html");
loadComponent("footer", "pages/components/footer.html");

// Load header and footer stops here

document.querySelector(".js-feedback-btn").addEventListener("click", () => {
  const options = document.querySelectorAll(".js-feedback-option:checked");

  let message = "OjaHub Feedback:%0A";

  options.forEach((option) => {
    message += "- " + option.value + "%0A";
  });

  if (options.length === 0) {
    message += "No option selected";
  }

  const phone = "2348165410790";
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
});
