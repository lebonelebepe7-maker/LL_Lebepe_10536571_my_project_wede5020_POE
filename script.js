// Footer: Automatically show the current year
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
// FAQ Accordion functionality
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(function (item) {
    const question = item.querySelector("h3");
    
    // Start with every answer hidden
    item.classList.add("closed");
    
    // Accessibility attributes
    question.setAttribute("tabindex", "0");
    question.setAttribute("role", "button");
    question.setAttribute("aria-expanded", "false");

    function toggleAnswer() {
        const isClosed = item.classList.toggle("closed");
        if (isClosed) {
            question.setAttribute("aria-expanded", "false");
        } else {
            question.setAttribute("aria-expanded", "true");
        }
    }

    question.addEventListener("click", toggleAnswer);
    question.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleAnswer();
        }
    });
});
// Image Gallery Lightbox Feature
const galleryImages = document.querySelectorAll(".product-card img, .gallery-img");
if (galleryImages.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox is-hidden";
    lightbox.innerHTML = `<span class="lightbox-close">&times;</span><img src="" alt="Enlarged view">`;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    galleryImages.forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove("is-hidden");
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.classList.add("is-hidden");
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("is-hidden");
        }
    });
}
// Live Product Search Filtering
const searchInput = document.getElementById("product-search");
const productCards = document.querySelectorAll(".product-card");
const noResults = document.getElementById("no-results");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        productCards.forEach(function (card) {
            const name = card.querySelector("h3").textContent;
            const details = card.querySelector(".product-meta") ? card.querySelector(".product-meta").textContent : "";
            const cardText = (name + " " + details).toLowerCase();

            if (cardText.includes(searchText)) {
                card.classList.remove("is-hidden");
                visibleCount++;
            } else {
                card.classList.add("is-hidden");
            }
        });

        if (visibleCount === 0) {
            noResults.classList.remove("is-hidden");
        } else {
            noResults.classList.add("is-hidden");
        }
    });
}
// Step 8: Switch / Case dynamic hint for Reason for contact
const typeSelect = document.getElementById("enq-type");
const typeHint = document.getElementById("type-hint");

function showTypeHint() {
    if (!typeSelect || !typeHint) return;
    let message = "";
    switch (typeSelect.value) {
        case "Enquiry about a service":
            message = "Please tell us which service you are interested in.";
            break;
        case "Enquiry about a product":
            message = "Please tell us the product name and size.";
            break;
        case "I want to volunteer":
            message = "Wonderful! Tell us when you are available and what you enjoy doing.";
            break;
        default:
            message = "Tell us how we can help you today.";
    }
    typeHint.textContent = message;
}

if (typeSelect) {
    typeSelect.addEventListener("change", showTypeHint);
    showTypeHint();
}

// Step 9: Form Validation Helper Functions
function isValidEmail(email) {
    const atPosition = email.indexOf("@");
    const lastDotPosition = email.lastIndexOf(".");
    return (
        atPosition > 0 &&
        lastDotPosition > atPosition + 1 &&
        lastDotPosition < email.length - 1 &&
        !email.includes(" ")
    );
}

function showError(field, message) {
    field.classList.add("input-error");
    const error = document.createElement("span");
    error.className = "error-message";
    error.textContent = message;
    field.parentElement.appendChild(error);
}

function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach(error => error.remove());
    form.querySelectorAll(".input-error").forEach(field => field.classList.remove("input-error"));
}

// Form Submit Listener
const forms = document.querySelectorAll("form");
forms.forEach(function (form) {
    const successMessage = form.querySelector(".form-success");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors(form);

        if (successMessage) {
            successMessage.classList.add("is-hidden");
        }

        let formIsValid = true;
        let firstBadField = null;
        const requiredFields = form.querySelectorAll("[required]");

        requiredFields.forEach(function (field) {
            const value = field.value.trim();
            const labelText = field.labels && field.labels.length > 0 ? field.labels[0].textContent : "This field";
            let problem = "";

            if (value === "") {
                problem = labelText + " is required.";
            } else if (field.type === "email" && !isValidEmail(value)) {
                problem = "Please enter a valid email address (e.g. you@email.com).";
            }

            if (problem !== "") {
                showError(field, problem);
                formIsValid = false;
                if (firstBadField === null) {
                    firstBadField = field;
                }
            }
        });

        if (formIsValid) {
            form.reset();
            showTypeHint();
            if (successMessage) {
                successMessage.classList.remove("is-hidden");
            }
        } else {
            if (firstBadField) {
                firstBadField.focus();
            }
        }
    });
});