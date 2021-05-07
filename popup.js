let btn4DevTav = document.getElementById("4devTab");
let btnGerarPessoa = document.getElementById("gerarPessoa");
let btnFillForm1 = document.getElementById("fillForm1");
let btnFillForm2 = document.getElementById("fillForm2");


btnFillForm2.addEventListener("click", async () => {
  const currentPage = await getCurrentTab();

  await chrome.scripting.executeScript({
    target: { tabId: currentPage.id },
    function: preencheForm2,
  });

  chrome.storage.sync.get("persons", (data) => {
    let count = String(data.persons.length);
    chrome.action.setBadgeText({ text: count });
  });

});

btnFillForm1.addEventListener("click", async () => {
  const currentPage = await getCurrentTab();


  await chrome.scripting.executeScript({
    target: { tabId: currentPage.id },
    function: preencheForm1,
  });
});

btnGerarPessoa.addEventListener("click", async () => {
  const currentPage = await getCurrentTab();

  await chrome.scripting.executeScript({
    target: { tabId: currentPage.id },
    function: gerarPessoa,
  });

  chrome.storage.sync.get("persons", (data) => {
    let count = String(data.persons.length);
    chrome.action.setBadgeText({ text: count });
  });
});

btn4DevTav.addEventListener("click", () => {
  chrome.tabs.create({
    active: true,
    url: "https://www.4devs.com.br/",
  });
});

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function preencheForm1() {
  const nome = document.querySelector("[os-test-input=nome]");
  const email = document.querySelector("[os-test-input=email]");
  const telefone = document.querySelector("[os-test-input=telefone]");

  chrome.storage.sync.get("persons", async (data) => {
    const last = data.persons.length - 1;
    const person = data.persons[last];

    nome.value = person.nome;
    email.value = person.email;
    telefone.value = person.celular;
  });
}

async function preencheForm2() {
  const nome = document.querySelector("[os-test-input=nome]");
  const email = document.querySelector("[os-test-input=email]");
  const cemail = document.querySelector("[os-test-input=confirmeemail]");
  const telefone = document.querySelector("[os-test-input=telefone]");
  const cpf = document.querySelector("[os-test-input=cpf]");
  const dtnascimento = document.querySelector("[os-test-input=datanascimento]");
  const cep = document.querySelector("[os-test-input=cep]");
  const numero = document.querySelector("[os-test-input=numero]");

  await chrome.storage.sync.get("persons", async (data) => {
    const last = data.persons.length - 1;
    const person = data.persons[last];

    nome.value = person.nome;
    email.value = person.email;
    cemail.value = person.email;

    telefone.value = person.celular;
    cpf.value = person.cpf;
    dtnascimento.value =  person.data_nasc.replaceAll("/","-");
    cep.value = person.cep;
    numero.value = person.numero;

    data.persons.pop();
    chrome.storage.sync.set({ persons: [...data.persons] });
    
  });

}

async function gerarPessoa() {
  const newPerson = await fetch(
    "https://www.4devs.com.br/ferramentas_online.php",
    {
      method: "POST",
      headers: {
        origin: "https://www.4devs.com.br",
        referer: "https://www.4devs.com.br/gerador_de_pessoas",
        "content-type": "application/x-www-form-urlencoded",
      },
      body:
        "acao=gerar_pessoa&sexo=I&pontuacao=S&idade=0&cep_estado=&txt_qtde=1&cep_cidade=",
    }
  ).then(async (response) => await response.json());

  await chrome.storage.sync.get("persons", async (data) => {
    await chrome.storage.sync.set({ persons: [...data.persons, newPerson] });
  });
}
