document.querySelector(".js-feedback-btn").addEventListener("click", () => {
  const options = document.querySelectorAll(".js-feedback-option:checked");

  let message = "OjaHub Feedback:%0A";

  options.forEach(option => {
    message += "- " + option.value + "%0A";
  });

  if (options.length === 0) {
    message += "No option selected";
  }

  const phone = "2348165410790"; 
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
});