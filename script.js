const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const estimateForm = document.getElementById("estimate-form");
const formResult = document.getElementById("form-result");

if (estimateForm && formResult) {
  const accessInput = estimateForm.querySelector('[name="access_key"]');
  const submitBtn = document.getElementById("form-submit");

  estimateForm.addEventListener("submit", async (e) => {
    if (!estimateForm.checkValidity()) {
      return;
    }

    const key = accessInput ? accessInput.value.trim() : "";
    if (!key || key === "YOUR_WEB3FORMS_ACCESS_KEY") {
      e.preventDefault();
      formResult.textContent =
        "This form needs your Web3Forms access key: sign up at web3forms.com, paste the key in the hidden access_key field in index.html, then try again.";
      formResult.className = "form-result form-result--error";
      formResult.focus();
      return;
    }

    e.preventDefault();
    formResult.textContent = "Sending…";
    formResult.className = "form-result";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(estimateForm),
      });
      const data = await res.json();

      if (data.success) {
        formResult.textContent =
          "Thanks — we received your request and will contact you soon.";
        formResult.className = "form-result form-result--success";
        estimateForm.reset();
        if (typeof gtag === "function") {
          gtag("event", "generate_lead", {
            event_category: "engagement",
            event_label: "estimate_form",
          });
        }
      } else {
        formResult.textContent =
          data.message || "Something went wrong. Please call (805) 873-6704.";
        formResult.className = "form-result form-result--error";
      }
    } catch {
      formResult.textContent =
        "Could not send right now. Please call (805) 873-6704.";
      formResult.className = "form-result form-result--error";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "phone_call_click", {
        event_category: "contact",
        event_label: link.getAttribute("href") || "tel",
      });
    }
  });
});
