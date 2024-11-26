// Valores constantes para uso global
const url = "http://localhost:8080";
let userId;
const token = localStorage.getItem("token");

// Função para buscar os setores
async function getAllSectors() {
  try {
    const response = await fetch(`${url}/sector/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    // Verificando se a requisição foi realizada com sucesso
    if (data.status == "success") {
      // Adicionando setores no painel
      addSectors(data.data);
    } else if (data.status == "error") {
      console.log("Token inválido");
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para criar um setor
async function createSector(form) {
  // Pega os dados do formulário
  const formData = new FormData(form);

  // Converte os dados em um objeto
  const body = { name: formData.get("name") };

  try {
    const response = await fetch(`${url}/sector/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.status == "success") {
      console.log("Setor criado com sucesso!");
      notify("Setor criado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.status == "error") {
      console.log("Erro ao atualizar o ticket!");
      notify("Erro ao criar o ticket!");
    }
  } catch (error) {
    console.error(error);
  }
}

// função para adicionar setores no painel
function addSectors(sectors) {
  const sectorList = document.querySelector(".card > .sector-list");

  sectors.forEach((sector) => {
    const sectorElement = document.createElement("div");
    sectorElement.classList.add("sector");
    sectorElement.innerHTML = `
      <p>${sector.name}</p>
    `;
    sectorList.appendChild(sectorElement);
  });
}

// Função para notificação dos setores
function notify(msg) {
  // Criando o elemento de alerta
  const notification = document.createElement("div");
  notification.classList.add("notification");
  // Adicionando o texto
  notification.textContent = msg;
  // Adicionando na página
  document.body.appendChild(notification);
  // Removendo ele após um tempo
  setTimeout(() => {
    alertArea.removeChild(alert);
  }, 2000);
}

//__________________________________________________________________________________________

// Adicionando os eventos
window.onload = getAllSectors;

document
  .getElementById("sector-form")
  .addEventListener("submit", async function (event) {
    // Impedir a ação padrão do formulário
    event.preventDefault();

    // Funçao para realizar o registro
    await createSector(this);
  });
