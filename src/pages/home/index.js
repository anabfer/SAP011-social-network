export default () => {
  const container = document.createElement("div");
  container.classList.add("container-timeLine");
  const template = `
    <header>
    <span id="containerUser">
      <img src="./img/MaleUser.png" alt="user" class="icons">
      <p>User</p>
    </span>
    </header>
    <main class="container-timeline">
     <h1> HOME</h1>
     <p> Receitas Saudáveis.</p>
    </main> 
     <footer>
     <span id="containerIcons">
       <a href="./#"><img src="./img/Home.png" alt="home" class="icons"></a>
       <a href="./#favorite"><img src="./img/Heart.png" alt="heart" class="icons"></a>
       <a href="./#login"><img src="./img/Logout.png" alt="logout" class="icons"></a>
     </span>
  </footer> 
     `;
  container.innerHTML = template;

  return container;
};
