export default () => {
  const container = document.createElement("div");
  container.classList.add("about");
  const template = `
    <header class="header-page">
      <span id="container-user">
        <img src="./img/MaleUser.png" alt="user" class="icons">
        <p id="user-name"></p>
      </span>
    </header>
    <main class="container-about">
    <figure>
    <img src="./img/about.png" alt="about" class="about-img">
  </figure>
  <section class="section-about">
    <h2 class="about-h2">Bem Vindo(a) ao Vida Saudavél!</h2>
    <p>O Vida Saudável é muito mais do que apenas uma rede social, é uma comunidade de entusiastas da alimentação saudável e do bem-estar. Aqui, você encontrará um espaço para dicas para uma vida saudável, receitas deliciosas e bem estar em primeiro lugar.  </p>
    <h3 class="about-h3">Junte-se à comunidade</h3>
    <p>Esperamos que o Vida Saudável se torne seu ponto de encontro virtual para aprendizado, inspiração e apoio mútuo. Juntos, vamos tornar a busca por um estilo de vida mais saudável uma jornada incrível.
      #VidaSaudável #AlimentaçãoSaudável #BemEstar #ComidaDeliciosa</p>
  </section>
    </main> 
   <footer>
     <span id="containerIcons">
       <a href="./#home"><img src="./img/Home.png" alt="home" class="icons"></a>
       <a href="./#about"><img src="./img/Heart.png" alt="heart" class="icons"></a>
       <a data-logout><img src="./img/Logout.png" alt="logout" class="icons"></a>
     </span>
   </footer> 
     `;
  container.innerHTML = template;
  return container;
};
