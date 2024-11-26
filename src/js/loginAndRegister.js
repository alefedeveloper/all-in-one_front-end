// Elementos html
const form = document.getElementById("form");
const alertArea = document.querySelector(".page-container .alert-area");

// URL para requisições
const url = "https://all-in-one-back-end.onrender.com";

// Lógica para realizar o login ou registro
async function loginAndRegister(form, router) {
  console.log(form);

  // Pega os dados do formulário
  const formData = new FormData(form);

  // Converte os dados em um objeto
  const body = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });

  console.log(body);

  // Enviando os dados para rota de login ou registro
  const response = await fetch(`${url}${router}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Resposta da requisição
  const data = await response.json();

  console.log(data);

  // Verificando se a requisição foi realizada com sucesso
  if (data.status == "success") {
    // Verificando se foi feito um login ou um registro
    if (router.includes("login")) {
      // Login realizado
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.data.id);

      alert("Login realizado com sucesso!", "success");

      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 1500);
    } else {
      // Registro realizado
      alert("Usuário criado com sucesso!", "success");

      setTimeout(() => {
        window.location.href = "../html/login.html";
      }, 1500);
    }
  } else if (data.status == "error") {
    // Virificando o tipo de erro
    if (data.error.length > 0)
      data.error.forEach((message) => alert(message, "error"));
    else alert(data.message, data.result.status);
  }
}

// Criando mensagem de alerta
function alert(message, status) {
  // Área do alerta
  const alertArea = document.querySelector(".page-container .alert-area");

  // Corpo do alerta
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // Mensagem do alerta
  const messageAlert = document.createElement("p");
  messageAlert.textContent = message;

  // Verificando se é uma mensagem de erro ou suceso
  if (status == "success") alert.classList.add("success");
  else if (status == "error") alert.classList.add("error");

  // Inserindo mensagem no alerta
  alert.appendChild(messageAlert);

  // Inserindo elemento na tela
  alertArea.appendChild(alert);

  // Removendo ele após um tempo
  setTimeout(() => {
    alertArea.removeChild(alert);
  }, 3000);
}

// Função para ativar estado de loading do botão
function setLoadingState() {
  const submitButton = document.querySelector('form > button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner"></span> Processando...';
  submitButton.classList.add("loading");
}

//_________________________________________________________________________________________________

// Adicionando evento para pegar o envio dos dados do formulário e realizar o registro
form.addEventListener("submit", async function (event) {
  // Impedir a ação padrão do formulário
  event.preventDefault();

  // Mudando o estado do botão
  setLoadingState();

  // Pegando a rota
  const route = this.dataset.route;

  // Funçao para realizar o registro
  await loginAndRegister(this, route);
});
