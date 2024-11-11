// Elementos html
const formLogin = document.getElementById("login");
const formRegister = document.getElementById("register");


// URL para requisições
const url = "https://all-in-one-back-end.onrender.com";

// Lógica para realizar o login ou registro
async function loginAndRegister(form, router) {
  // Pega os dados do formulário
  const formData = new FormData(form);

  // Converte os dados em um objeto
  const body = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });

  // Enviando os dados para rota de login
  const response = await fetch(`${url}${router}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  // Resposta da requisição
  const data = await response.json();

  // Verificando se a requisição foi realizada com sucesso
  if (data.status == "success") {
    // Verificando se foi feito um login ou um registro
    if (router.includes("login")) {
      // Login realizado
      localStorage.setItem("token", data.token);

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

const alertArea = document.querySelector(".page-container .alert-area");


// Adicionando evento para pegar o envio dos dados do formulário e realizar o login
formLogin.addEventListener("submit", async function (event) {
  // Impedir a ação padrão do formulário
  event.preventDefault();

  // Funçao para realizar o login
  await loginAndRegister(this, "/user/login");
});

// Adicionando evento para pegar o envio dos dados do formulário e realizar o registro
formRegister.addEventListener("submit", async function (event) {
  // Impedir a ação padrão do formulário
  event.preventDefault();

  // Funçao para realizar o registro
  await loginAndRegister(this, "/user/create");
});
