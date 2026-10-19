const sendForm = document.getElementById("contact-form");
const inputName = document.getElementById("namePerson");
const inputEmail = document.getElementById("emailPerson");
const inputPhone = document.getElementById("phonePerson");
const inputMessage = document.getElementById("messagePerson");
// Păstrăm limbajul selectat curent (implicit 'all')
let currentLanguageFilter = "all";

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("#nav-list");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
}

function validateField(field, fieldName) {
  if (!field) return false;
  const value = field.value.trim();
  switch (fieldName) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    case "name":
      return value.length >= 2;
    case "phone":
      // Dacă nu este completat, este valid (fiind opțional)
      if (value === "") return true;
      // Validare simplă de format telefon (cifre, spații, plus, cratimă)
      const phoneRegex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      return phoneRegex.test(value);

    case "message":
      // Verificăm dacă mesajul are între 10 și 1000 de caractere
      return value.length >= 10 && value.length <= 1000;
    default:
      return true;
  }
}

if (sendForm) {
  sendForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValid = validateField(inputEmail, "email");
    const nameValid = validateField(inputName, "name");
    const phoneValid = validateField(inputPhone, "phone");
    const messageValid = validateField(inputMessage, "message");
    if (nameValid && emailValid && phoneValid && messageValid) {
      alert("Mesajul a fost trimis cu succes!");
    } else {
      alert("Datele introduse nu sunt valide!");
    }
  });
}

async function fetchGithubRepos() {
  const container = document.getElementById("projects-container");
  if (!container) return; // Rulăm doar pe projects.html

  try {
    const response = await fetch(
      "https://api.github.com/users/andreiBirsanIoan/repos",
    );
    const repos = await response.json();

    const filteredRepos = repos.filter((repo) => !repo.fork);
    container.innerHTML = "";

    // 1. Generăm butoanele de limbaje disponibile
    setupLanguageFilters(filteredRepos);

    // 2. Randăm cardurile cu atributul data-language și efect de delay la animație
    filteredRepos.forEach((repo, index) => {
      const card = document.createElement("div");
      card.className = "project-card";

      // Salvăm limbajul într-un atribut de date pentru filtrare
      card.dataset.language = repo.language
        ? repo.language.toLowerCase()
        : "fără limbaj";

      // Decalaj scurt de timp pentru animație (stagger effect)
      card.style.animationDelay = `${index * 0.08}s`;

      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "Fără descriere disponibilă."}</p>
        <div class="repo-info">
          <span>🔤 ${repo.language || "Nespecificat"}</span>
          <span>⭐ ${repo.stargazers_count}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Vezi pe GitHub →</a>
      `;
      container.appendChild(card);
    });

    // 3. Pornim ascultătorii de evenimente pentru căutare și filtrare
    initSearchAndFilter();
  } catch (error) {
    console.error("Eroare la preluarea proiectelor:", error);
    container.innerHTML = "<p>Nu s-au putut încărca proiectele.</p>";
  }
}

function setupLanguageFilters(repos) {
  const filterContainer = document.getElementById("language-filters");
  if (!filterContainer) return;

  // Extragerea limbajelor unice
  const languages = new Set();
  repos.forEach((repo) => {
    if (repo.language) languages.add(repo.language);
  });

  filterContainer.innerHTML = `<button class="filter-btn active" data-lang="all">Toate</button>`;

  languages.forEach((lang) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.lang = lang.toLowerCase();
    btn.textContent = lang;
    filterContainer.appendChild(btn);
  });
}

function initSearchAndFilter() {
  const searchInput = document.getElementById("project-search");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Funcție centrală de filtrare combinată
  function filterProjects() {
    const searchText = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
      const projectName = card.querySelector("h3").textContent.toLowerCase();
      const cardLang = card.dataset.language;

      const matchesSearch = projectName.includes(searchText);
      const matchesLang =
        currentLanguageFilter === "all" || cardLang === currentLanguageFilter;

      if (matchesSearch && matchesLang) {
        card.style.display = "flex";
        // Reinițializăm animația pentru reafișare lină
        card.style.animation = "none";
        card.offsetHeight; // Trigger reflow
        card.style.animation = "fadeInUp 0.3s ease forwards";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Căutare la fiecare literă tastată
  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  // Click pe butoanele de limbaje
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      currentLanguageFilter = this.dataset.lang;
      filterProjects();
    });
  });
}

// Apelăm funcția când se încarcă DOM-ul
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  fetchGithubRepos();
});
