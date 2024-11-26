// Valores constantes para uso global
const url = "https://all-in-one-back-end.onrender.com";
const token = localStorage.getItem("token");

// Função para buscar os usuários
async function getAllUser() {
  try {
    const response = await fetch(`${url}/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    // Verificando se a requisição foi realizada com sucesso
    if (data.status == "success") {
      // Buscando os setores
      const allSectors = await getAllSectors();
      // Adicionando usuários no painel
      addUsers(data.data, allSectors);
    } else if (data.status == "error") {
      // notificando o erro ao buscar os dados
      console.log(data.message);
      notify(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// Função pra atualizar os dados do usuário
async function updateUser(userId, body) {

  try {
    const response = await fetch(`${url}/user/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Verificando se a requisição foi realizada com sucesso
    if (data.status == "success") {
      // notificando a atualização dos dados
      notify(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.status == "error") {
      // notificando o erro ao atualizar os dados
      console.log(data.message);
      notify(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

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
      // Adicionando setores no formulário
      return data.data;
    } else if (data.status == "error") {
      notify(data.message);
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para adicionar usuários no painel
function addUsers(users, sectors) {
  users.forEach((user) => {
    if (user.sectorId != null) {
      sectors.forEach((setor) => {
        if (user.sectorId == setor.id) {
          createUser(
            {
              id: user.id,
              name: user.name,
              permission: user.permission,
              sector: setor.name,
            },
            sectors
          );
        }
      });
    } else
      createUser(
        {
          id: user.id,
          name: user.name,
          permission: user.permission,
          sector: "A definir",
        },
        sectors
      );
  });
}
// Função para criar um novo usuário
function createUser(user, sectors) {
  const userList = document.querySelector(".user-list");
  const userDiv = document.createElement("div");
  userDiv.className = "user";

  userDiv.innerHTML = `
            <span class="info-user">
              <p>${user.name}</p>

              <div class="options">
                <form id="team-form" enctype="multipart/form-data" data-id="${
                  user.id
                }">
                  <div class="selects">
                    <select
                      name="permission"
                      id="permission"
                      class="permission-camp"
                    >
                      <option value="admin" ${
                        user.permission == "admin" ? "selected" : ""
                      }>Admin</option>
                      <option value="colaborador" ${
                        user.permission == "colaborador" ? "selected" : ""
                      }>Colaborador</option>
                    </select>

                    <select name="sectorId" id="sectorId" class="sector-camp">
                    ${
                      user.sector == "A definir"
                        ? `<option value="" selected disabled>${user.sector}</option>`
                        : ""
                    }
                      ${sectors.map((setor) => {
                        if (user.sector == setor.name)
                          return `<option value="${setor.id}" selected>${user.sector}</option>`;
                        else
                          return `<option value="${setor.id}">${setor.name}</option>`;
                      })}
                      
                    </select>
                  </div>
                  <div class="buttons">
                    <button type="submit" class="edit" id="edit">
                      <i class="ph ph-note-pencil"></i>
                    </button>
                  </div>
                </form>
              </div>
            </span>
          `;

  userList.appendChild(userDiv);
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
    document.body.removeChild(notification);
  }, 2000);
}

// Função de envio de dados
function dataProcessing(e) {
  e.preventDefault();

  const id = parseInt(this.dataset.id);

  const formData = new FormData(this);
  const body = {};
  formData.forEach((value, key) => {
    if (key == "sectorId") body[key] = parseInt(value);
    else body[key] = value;
  });

  updateUser(id, body);
}

//___________________________________________________________________________________________

document.addEventListener("DOMContentLoaded", async () => {
  await getAllUser();

  const forms = document.querySelectorAll("#team-form");

  if (forms != null) {
    forms.forEach((form) => {
      form.addEventListener("submit", dataProcessing);
    });
  } else {
    document
      .getElementById("team-form")
      .addEventListener("submit", dataProcessing);
  }
});
