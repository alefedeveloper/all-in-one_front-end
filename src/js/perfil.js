// Valores constantes para uso global
const url = "https://all-in-one-back-end.onrender.com";
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

// Função pra buscar os dados do usuário
async function getUser() {
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
      // adicionando informação na tela
      addUserInfo(data.data);
    } else if (data.status == "error") {
      console.log(data.error);
    }
  } catch (error) {
    console.error(error);
  }
}

// Função pra atualizar os dados do usuário
async function updateUser(form) {
  // Pega os dados do formulário
  const formData = new FormData(form);

  // Converte os dados em um objeto
  const body = {};
  formData.forEach((value, key) => {
    if (value != "" && key != "confirm-password") body[key] = value;
  });

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

//___________________________________________________________________________________________

// Função para adicionar a info do usuário na tela
function addUserInfo(body) {
  // Adicionando permissão
  document.querySelector(
    ".info-display > .info-group > .info-value.permission"
  ).innerHTML = body.permission;
  // Adicionando permissão
  document.querySelector(
    ".info-display > .info-group > .info-value.sector"
  ).innerHTML = body.sector.name;
  // Adicionando nome
  document.querySelector(
    ".profile-form  .form-group > input[name='name']"
  ).value = body.name;
  // Adicionando e-mail
  document.querySelector(
    ".profile-form  .form-group > input[name='email']"
  ).value = body.email;
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
    document.body.removeChild(notification);
  }, 2000);
}

// Função para validar as senhas
function validatePasswords() {
  // Pegar os elementos dos campos de senha
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  // Adicionar o evento de input apenas no campo de confirmar senha
  confirmPassword.addEventListener("input", function () {
    // Verificar se as senhas são iguais
    if (this.value !== password.value) {
      // Senhas diferentes
      this.setCustomValidity("As senhas não coincidem");
      this.style.borderColor = "#ff3333";
      this.style.boxShadow = "0 0 0 2px rgba(255,51,51,0.1)";

      // Adicionar mensagem de erro
      let errorMessage = this.parentElement.querySelector(".error-message");
      if (!errorMessage) {
        errorMessage = document.createElement("span");
        errorMessage.className = "error-message";
        this.parentElement.appendChild(errorMessage);
      }
      errorMessage.textContent = "As senhas não coincidem";
    } else {
      // Senhas iguais
      this.setCustomValidity("");
      this.style.borderColor = "#4CAF50";
      this.style.boxShadow = "0 0 0 2px rgba(76,175,80,0.1)";

      // Remover mensagem de erro se existir
      const errorMessage = this.parentElement.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  });

  // Limpar validação quando o campo de senha principal for alterado
  password.addEventListener("input", function () {
    if (confirmPassword.value) {
      // Disparar o evento input no confirma senha para revalidar
      const event = new Event("input");
      confirmPassword.dispatchEvent(event);
    }
  });
}

// Função para ativar estado de loading do botão
function setLoadingState() {
  const submitButton = document.querySelector('form > button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner"></span> Processando...';
  submitButton.classList.add("loading");
}

//___________________________________________________________________________________________

// Adicionando os eventos
document.addEventListener("DOMContentLoaded", () => {
  getUser();
  validatePasswords();
});

document
  .getElementById("profile-form")
  .addEventListener("submit", async function (event) {
    // Impedir a ação padrão do formulário
    event.preventDefault();
    // Mudando o estado do botão
    setLoadingState();
    // Funçao para realizar o registro
    await updateUser(this);
  });
