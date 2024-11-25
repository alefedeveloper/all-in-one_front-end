// Criar elementos do menu
function createSideMenu() {
  // Criar o botão de toggle
  const toggleButton = document.createElement("button");
  toggleButton.className = "menu-toggle";
  toggleButton.innerHTML = "<span>☰</span>";

  // Criar o menu lateral
  const sideMenu = document.createElement("div");
  sideMenu.className = "side-menu";

  // Criar o conteúdo do menu
  const menuContent = document.createElement("div");
  menuContent.className = "menu-content";

  // Itens do menu específicos
  const permission = localStorage.getItem("permission");
  let menuItems;
  if (permission == "admin")
    menuItems = [
      {
        icon: '<i class="ph ph-user-circle"></i>',
        text: "Perfil",
        link: "../html/perfil.html",
      },
      {
        icon: '<i class="ph ph-list-bullets"></i>',
        text: "Chamados",
        link: "../html/chamado.html",
      },
      {
        icon: '<i class="ph ph-building"></i>',
        text: "Setores",
        link: "../html/setores.html",
      },
      {
        icon: '<i class="ph ph-users"></i>',
        text: "Equipe",
        link: "../html/equipe.html",
      },
    ];
  else
    menuItems = [
      {
        icon: '<i class="ph ph-user-circle"></i>',
        text: "Perfil",
        link: "../html/perfil.html",
      },
      {
        icon: '<i class="ph ph-list-bullets"></i>',
        text: "Chamados",
        link: "../html/chamado.html",
      },
    ];
  // Criar itens do menu
  menuItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.innerHTML = `
                  <a href="${item.link}">${item.icon} ${item.text}</a>
              `;

    // Adicionar evento de clique para cada item
    menuItem.addEventListener("click", () => {
      // Remove a classe active de todos os itens
      document.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.remove("active");
      });
      // Adiciona a classe active ao item clicado
      menuItem.classList.add("active");
    });

    menuContent.appendChild(menuItem);
  });

  // Montar o menu
  sideMenu.appendChild(menuContent);
  document.body.appendChild(toggleButton);
  document.body.appendChild(sideMenu);

  // Adicionar evento de toggle
  toggleButton.addEventListener("click", () => {
    sideMenu.classList.toggle("collapsed");
    toggleButton.classList.toggle("moved");
  });
}

// Inicializar o menu
createSideMenu();

// Ajustar o conteúdo principal quando o menu é toggled
const toggleButton = document.querySelector(".menu-toggle");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});
