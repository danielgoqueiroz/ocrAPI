const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const TMP_FOLDER = "uploads/";
const fs = require("fs");
const app = express();
var cors = require("cors");
app.use(cors());

const PORT = 5000;

const getWorker = require("tesseract.js-node");
const { response } = require("express");

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send("Serviço rodando");
});

app.post("/imagem", async (req, res) => {
  console.log("Requisição recebida.");
  let imagem = null;
  try {
    if (!req.files) {
      return res.send({
        status: false,
        message: "imagem não enviada",
      });
    } else {
      console.log("Carregando Tesseract");
      imagem = req.files.imagem;
      let dataInicial = new Date();
      const worker = await getWorker({
        tessdata: "./tessdata",
        languages: ["por"],
      });
      console.log("Realizando reconhecimento");
      const text = await worker.recognize(imagem.data, "por");
      return res.send({
        text: text.replace(/\s+/g, " ").trim(),
        duracao: (new Date().getTime() - dataInicial.getTime()) / 1000,
      });
    }
  } catch (err) {
    console.log("Erro na requisição");
    console.log(err);
    return res.status(500).send(err);
  }
});

app.listen(process.env.PORT || PORT, () =>
  console.log(
    `Executando na porta ${process.env.PORT ? process.env.PORT : PORT}!`
  )
);
