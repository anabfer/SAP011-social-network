export default () => {
    const container = document.createElement("div");
    const template = `
       <h1> Login </h1>
       <a href="./#registro">Sing Up</a>
       `;
    container.innerHTML = template;
    return container;
  };