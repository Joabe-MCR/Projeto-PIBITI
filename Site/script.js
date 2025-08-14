function toggleResposta(index) {
  const respostas = document.querySelectorAll(".faq-answer");
  const resposta = respostas[index];

  if (resposta.style.display === "block") {
    resposta.style.display = "none";
  } else {
    respostas.forEach(r => r.style.display = "none");
    resposta.style.display = "block";
  }
}
