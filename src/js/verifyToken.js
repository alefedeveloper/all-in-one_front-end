const url = "https://all-in-one-back-end.onrender.com";

// Função para verificar se o token de login é válido
async function verifyToken() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch(
        `${url}/user/verify`, // Usando a variável `url` para consistência
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          credentials: "include",
        }
      );

      // Resposta da requisição
      const data = await response.json();
      

      // Verificando se a requisição foi realizada com sucesso
      if (data.status == "success") {
        // Token é válido
        console.log("Válido");
        return true;
      } else if (data.status == "error") {
        console.log("Token inválido");
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar o token:", error);
      // Considerar lógica adicional de tratamento de erros
    }
  } else {
    console.log("Não tem token");
  }
}

// Chama verifyToken quando a janela é carregada
window.onload = async () => {

  const result = await verifyToken(); 

  if (result == true) window.location.href = "/src/html/chamado.html";
  
};
