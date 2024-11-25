// Valores constantes para uso global
const url = "http://localhost:8080";
let userId;

// Função para buscar o usuário
async function getUser() {
  // Pegando o token de login
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${url}/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    // Verificando se a requisição foi realizada com sucesso
    if (data.status == "success") {
      // Buscando os tickets do setor específicado
      getAllTickets(data.data.sector.id);
    } else if (data.status == "error") {
      console.log("Token inválido");
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para buscar os setores
async function getAllSectors() {
  // Pegando o token de login
  const token = localStorage.getItem("token");

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
      // Adicionando setores no formulário
      addSectors(data.data);
    } else if (data.status == "error") {
      console.log("Token inválido");
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para buscar os chamodos
async function getAllTickets(sectorId) {
  // Pegando o token de login
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${url}/sector/${sectorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    // Verificando se a requisição foi realizada com sucesso
    if (data.status == "success") {
      // Adicionando ticket na coluna correspondente
      addTicketToColumn(data.data);
      // Adicionando evento de mostrar o modal
      selectTickets();
      // Adicionando evento de arrastar e soltar
      addDragAndDropEventListeners();
    } else if (data.status == "error") {
      console.log("Token inválido");
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para buscar um chamodo
async function getTicket(slug) {
  // Pegando o token de login
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${url}/ticket/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    // Verificando se a requisição foi realizada com sucesso
    if (data.status == "success") {
      console.log("Ticket encontrado!");
      return { data: data.data, status: true };
    } else if (data.status == "error") {
      console.log("Token inválido");
      return { data: data.error, status: false };
    }
  } catch (error) {
    console.error(error);
  }
}

// função para atualizar o ticket
async function updateTicket(id, body) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${url}/ticket/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.status == "success") {
      console.log("Ticket atualizado com sucesso!");
      return true;
    } else if (data.status == "error") {
      console.log("Erro ao atualizar o ticket!");
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para criar um ticket
async function createTicket(form) {
  // Pegando o token de login
  const token = localStorage.getItem("token");

  // Pega os dados do formulário
  const formData = new FormData(form);

  // Converte os dados em um objeto
  const body = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });

  console.log(body);

  try {
    const response = await fetch(`${url}/ticket/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ ...body, userId: userId }),
    });

    const data = await response.json();

    if (data.status == "success") {
      console.log("Ticket criado com sucesso!");
      notify("Ticket criado com sucesso!");
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

// Função para notificação dos chamados
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

// Função para criar um elemento de ticket
function createTicketElement(sector, ticket) {
  const ticketElement = document.createElement("div");
  ticketElement.classList.add("ticket-item");
  ticketElement.setAttribute("draggable", "true");
  ticketElement.dataset.id = ticket.id;
  ticketElement.dataset.slug = ticket.slug;
  ticketElement.innerHTML = `
      <h3>${ticket.title}</h3>
      <p>Setor: ${sector.name}</p>
      <p>Status: ${ticket.status}</p>
      <p>Prioridade: ${ticket.urgency}</p>
  `;
  return ticketElement;
}

// Função para adicionar o ticket na coluna correta
function addTicketToColumn(sector) {
  sector.tickets.forEach((ticket) => {
    const status = ticket.status;

    let column;
    if (status === "Aguardando") {
      column = document.querySelector(".ticket-list.waiting > .list");
    } else if (status === "Em Andamento") {
      column = document.querySelector(".ticket-list.progress > .list");
    } else if (status === "Concluído") {
      column = document.querySelector(".ticket-list.completed > .list");
    }

    if (column) {
      const ticketElement = createTicketElement(sector, ticket);
      column.appendChild(ticketElement);
    }
  });
}

// __________________________________________________________________________________________

// Lógica para mover os itens entre as colunas

// Função para adicionar eventos de arrastar e soltar
function addDragAndDropEventListeners() {
  document.querySelectorAll(".ticket-item").forEach((item) => {
    item.addEventListener("dragstart", handleDragStart); // Inicia o arrasto
    item.addEventListener("dragend", handleDragEnd); // Termina o arrasto
  });

  document.querySelectorAll(".ticket-list .list").forEach((list) => {
    list.addEventListener("dragover", handleDragOver); // Permite que itens sejam soltos
    list.addEventListener("drop", handleDrop); // Gerencia a soltura do item
    list.addEventListener("dragenter", handleDragEnter); // Destaca coluna ao entrar
    list.addEventListener("dragleave", handleDragLeave); // Remove destaque ao sair
  });
}

let draggedItem = null; // Armazena o item atualmente arrastado

function handleDragStart(event) {
  draggedItem = this; // Define o item atual como o arrastado
  setTimeout(() => (this.style.display = "none"), 0); // Oculta o item temporariamente
}

function handleDragEnd() {
  setTimeout(() => (this.style.display = "block"), 0); // Reexibe o item após o arrasto
  draggedItem = null; // Limpa o item arrastado
}

function handleDragOver(event) {
  event.preventDefault(); // Permite que o item seja solto na coluna
}

async function handleDrop(event) {
  event.preventDefault();
  if (draggedItem) {
    this.appendChild(draggedItem); // Move o item para a nova coluna
    this.classList.remove("drag-over"); // Remove o destaque da coluna

    // Determina o novo status com base na coluna de destino
    let newStatus;
    if (this.closest(".ticket-list").classList.contains("waiting")) {
      newStatus = { status: "Aguardando" };
    } else if (this.closest(".ticket-list").classList.contains("progress")) {
      newStatus = { status: "Em Andamento" };
    } else if (this.closest(".ticket-list").classList.contains("completed")) {
      newStatus = { status: "Concluído" };
    }

    const ticketId = draggedItem.dataset.id;

    await updateTicket(ticketId, newStatus);
  }
}

function handleDragEnter(event) {
  event.preventDefault();
  this.classList.add("drag-over"); // Adiciona destaque à coluna
}

function handleDragLeave(event) {
  this.classList.remove("drag-over"); // Remove o destaque ao sair
}

//___________________________________________________________________________________________

// Lógica do modal com as informações do chamado

// Função para selecionar os tickets
function selectTickets() {
  document
    .querySelectorAll(".ticket-list .list .ticket-item")
    .forEach((ticket) => {
      ticket.addEventListener("click", () => {
        showTicketModal(ticket);
      });
    });
}

// Função para criar e exibir o modal
async function showTicketModal(ticket) {
  const slug = ticket.dataset.slug;

  const { data, status } = await getTicket(slug);

  if (status == true) {
    // Criar elementos do modal
    const modal = document.createElement("div");
    modal.className = "ticket-modal";

    // Criar conteúdo do modal
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Criar cabeçalho com título
    const title = document.createElement("h2");
    title.textContent = data.title;

    // Criar informações do chamado
    const info = document.createElement("div");
    info.className = "ticket-info";
    info.innerHTML = `
    <div class="info info-1">
      <p><strong>Urgência:</strong> <span>${data.urgency}</span></p>
      <p><strong>Status:</strong> <span>${data.status}</span></p>
      <p><strong>Setor:</strong> <span>${data.sector}</span></p>
    </div>
    <div class="info info-2">
      <p><strong>Data de abertura:</strong> <span>${new Date(
        data.created
      ).toLocaleDateString("pt-BR")}</span></p>
      <p><strong>Criado por:</strong> <span>${data.user}</span></p>
    </div>
    <div class="info">
      <p><strong>Descrição:</strong> <span>${data.description}</span></p>
    </div>
  `;

    // Botão para fechar
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.className = "close-button";
    closeButton.onclick = () => modal.remove();

    // Montar o modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(info);
    modal.appendChild(modalContent);

    // Adicionar ao body
    document.body.appendChild(modal);

    // Fechar modal ao clicar fora
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };
  } else if (status == false)
    notify("Chamado não encontrado! no banco de dados!");
}

// Lógicaa para adicionar os setores ao formulário
async function addSectors(sectors) {
  const select = document.querySelector("#ticket-form > .form-group > select");

  sectors.forEach((sector) => {
    const option = document.createElement("option");
    option.value = sector.id;
    option.textContent = sector.name;
    select.appendChild(option);
  });
}

//___________________________________________________________________________________________

// Adicionando os eventos
window.onload = async () => {
  userId = localStorage.getItem("userId");
  await getUser();
  await getAllSectors();
};

// Adicionando evento para pegar o envio dos dados do formulário e realizar o registro
document
  .getElementById("ticket-form")
  .addEventListener("submit", async function (event) {
    // Impedir a ação padrão do formulário
    event.preventDefault();

    // Funçao para realizar o registro
    await createTicket(this);
  });
