const sendForm = document.getElementById("contact-form");
const inputName = document.getElementById("namePerson");
const inputEmail = document.getElementById("emailPerson");

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
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
  } catch (error) {
    console.error("Eroare la preluarea proiectelor:", error);
    container.innerHTML = "<p>Nu s-au putut încărca proiectele.</p>";
  }
}

// Apelăm funcția când se încarcă pagina
fetchGithubRepos();
