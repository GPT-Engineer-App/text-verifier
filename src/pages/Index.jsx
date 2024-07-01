import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tesseract from "tesseract.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SpellChecker from "react-spellchecker";
import ReactJson from "react-json-view";

const Index = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [jsonlData, setJsonlData] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (imageData) => {
    Tesseract.recognize(imageData, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setExtractedText(text);
        toast.success("OCR processing completed!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("OCR processing failed!");
      });
  };

  const handleTextChange = (value) => {
    setCorrectedText(value);
  };

  const handleSave = () => {
    const newEntry = {
      question: extractedText,
      answer: correctedText,
    };
    setJsonlData([...jsonlData, newEntry]);
    toast.success("Corrected Text Saved!");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>OCR Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <img src={image} alt="Uploaded" className="w-full h-auto" />}
          <Textarea
            value={extractedText}
            readOnly
            className="w-full h-32"
            placeholder="Extracted text will appear here."
          />
          <SpellChecker>
            <ReactQuill
              value={correctedText}
              onChange={handleTextChange}
              className="w-full h-32"
              placeholder="Correct the extracted text here."
            />
          </SpellChecker>
          <Button onClick={handleSave}>Save Corrected Text</Button>
          <ReactJson src={jsonlData} />
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Index;