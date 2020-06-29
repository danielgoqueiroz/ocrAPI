try:
    from fastapi import FastAPI, Request, Response,File, UploadFile, Form
    import io, os
    from PIL import ImageEnhance
    from PIL import Image
    import requests
    from pprint import pprint
    import pytesseract
    import time
    from pdf2image import convert_from_path, convert_from_bytes
    from pdf2image.exceptions import (
        PDFInfoNotInstalledError,
        PDFPageCountError,
        PDFSyntaxError
    )
except ImportError:
    print(ImportError)
# uvicorn main:app --reload

pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

app = FastAPI()

@app.post("/parse/image/teste")
async def ocr(file: UploadFile = File(...)):
    texto = 'teste'
    return texto

@app.post("/parse/image")
async def ocr(file: UploadFile = File(...)):
    inicio = int(time.time() * 1000.0)
    texto = ""
    print(file.content_type)
    if file.content_type == "image/png" or file.content_type == "image/jpeg":
        contents = file.file
        image = Image.open(contents)
        image = ImageEnhance.Contrast(image).enhance(3)
        image = ImageEnhance.Brightness(image).enhance(3)
        image = ImageEnhance.Sharpness(image).enhance(3)
        texto = pytesseract.image_to_string(image, lang="por")  
        image.close()
    if file.content_type == "application/pdf":
        images = convert_from_bytes(file.file.read(), poppler_path="D:/Downloads/poppler-0.68.0/bin")
        pagina = 1
        texto = list()
        for image in images:
            t = pytesseract.image_to_string(image, lang='por')
            texto.append(t)

    fim = int(time.time() * 1000.0)
    tempo = str(fim - inicio) + "ms"
    resposta = {"texto": texto, "tempo": tempo}
    return resposta