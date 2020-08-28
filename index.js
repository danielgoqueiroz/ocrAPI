const express = require("express");
const app = express();
const PORT = 5000;

const getWorker = require("tesseract.js-node");

app.get("/", async (req, res) => {
  let dataInicial = new Date();
  const worker = await getWorker({
    tessdata: "./tessdata", // where .traineddata-files are located
    languages: ["por"], // languages to load
  });
  const text = await worker.recognize("imagens/imagem_2.png", "por");
  return res.send({
    text: text,
    duracao: (new Date().getTime() - dataInicial.getTime()) / 1000,
  });
});

app.listen(process.env.PORT || PORT, () =>
  console.log(
    `Executando na porta ${process.env.PORT ? process.env.PORT : PORT}!`
  )
);
