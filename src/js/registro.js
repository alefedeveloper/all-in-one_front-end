const form = document.querySelector("div.rigth-section > form");

// Lógica para realizar o cadastro
const register = async (event) => {
  // Impedir a ação padrão do formulário
  event.preventDefault();

  // Pega os dados do formulário
  const name = document.querySelector('input[name="name"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;

  // Enviando os dados para rota de login
  const response = await fetch(
    "https://all-in-one-back-end.onrender.com/user/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    }
  );

  // Resposta da requisição
  const data = await response.json();

  console.log(data);

  // Verificando se o usuário foi criado com sucesso
  if (data.status == "success") {
    alert("Usuário criado com sucesso!", "success");

    setTimeout(() => {
      window.location.href = "../html/login.html";
    }, 1500);
  } else if (data.status == "error") {
    // Virificando o tipo de erro
    if (data.error.length > 0)
      data.error.forEach((message) => alert(message, "error"));
    else alert(data.message, data.result.status);
  }
};

// Criando mensagem de alerta
function alert(message, status) {
  // Área do alerta
  const alertArea = document.querySelector(".rigth-section > .alert-area");

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

// Adicionando evento para pegar o envio dos dados do formulário e realizar o registro
form.addEventListener("submit", register);
