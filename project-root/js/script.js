const sendForm = document.getElementById("contact-form");
const inputName = document.getElementById("namePerson");
const inputEmail = document.getElementById("emailPerson");

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("#nav-list");

  // Verificăm dacă ambele elemente există în pagină
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
}
function validateField(field, fieldName) {
  const value = field.value.trim();
  switch (fieldName) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    case "name":
      return value.length >= 2;
    default:
      return true;
  }
}
if (sendForm) {
  sendForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Oprește reîncărcarea paginii

    // Trimiți direct elementele HTML și numele câmpului
    const emailValid = validateField(inputEmail, "email");
    const nameValid = validateField(inputName, "name");

    if (emailValid && nameValid) {
      alert("Mesajul a fost trimis cu succes!");
    } else {
      alert("Datele introduse nu sunt valide!");
    }
  });
}
async function fetchGithubRepos() {
  const container = document.getElementById("projects-container");
  if (!container) return; // Rulăm doar dacă suntem pe projects.html

  try {
    const response = await fetch(
      "https://api.github.com/users/andreiBirsanIoan/repos",
    );
    const repos = await response.json();

    container.innerHTML = ""; // Ștergem mesajul de încărcare

    repos.forEach((repo) => {
      if (!repo.fork) {
        // Păstrăm doar proiectele create de tine
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || "Fără descriere disponibilă."}</p>
          <div class="repo-info">
            
            <span>${repo.language || "HTML/CSS"}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Vezi pe GitHub</a>
        `;
        container.appendChild(card);
      }
    });
    initLiveSearch();
  } catch (error) {
    console.error("Eroare la preluarea proiectelor:", error);
    container.innerHTML = "<p>Nu s-au putut încărca proiectele.</p>";
  }
}
// Funcție care activează căutarea live
function initLiveSearch() {
  const searchInput = document.getElementById("project-search");

  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const filterText = this.value.toLowerCase().trim(); // Ce a scris utilizatorul în căsuță
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
      // Preluăm titlul proiectului din h3
      const projectName = card.querySelector("h3").textContent.toLowerCase();

      // Dacă titlul conține literele introduse, afișăm cardul, altfel îl ascundem
      if (projectName.includes(filterText)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}
// Apelăm funcția când se încarcă pagina
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu(); // Pornim meniul pe orice pagină
  fetchGithubRepos(); // Va rula doar pe projects.html
});
