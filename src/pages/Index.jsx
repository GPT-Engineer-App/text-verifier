import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tesseract from "tesseract.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import { jsonToCSV } from "react-papaparse";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const QuillMention = dynamic(() => import("quill-mention"), { ssr: false });

const Index = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [ocrConfidence, setOcrConfidence] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        // Perform OCR using Tesseract
        Tesseract.recognize(reader.result, "eng", {
          logger: (m) => console.log(m),
        }).then(({ data: { text, confidence } }) => {
          setExtractedText(text);
          setOcrConfidence(confidence);
          toast.success("OCR completed successfully!");
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (value) => {
    setCorrectedText(value);
  };

  const handleSave = () => {
    const jsonlData = {
      question: extractedText,
      answer: correctedText,
    };
    const blob = new Blob([JSON.stringify(jsonlData)], {
      type: "application/jsonl",
    });
    saveAs(blob, "ocr_data.jsonl");
    toast.success("Corrected Text Saved!");
  };

  const handleBatchProcessing = (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        Tesseract.recognize(reader.result, "eng", {
          logger: (m) => console.log(m),
        }).then(({ data: { text, confidence } }) => {
          setExtractedText((prev) => prev + "\n" + text);
          setOcrConfidence((prev) => (prev + confidence) / 2);
        });
      };
      reader.readAsDataURL(file);
    });
    toast.success("Batch processing completed!");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>OCR Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleBatchProcessing}
          />
          {image && <img src={image} alt="Uploaded" className="w-full h-auto" />}
          <Textarea
            value={extractedText}
            readOnly
            className="w-full h-32"
            placeholder="Extracted text will appear here."
          />
          <ReactQuill
            value={correctedText}
            onChange={handleTextChange}
            modules={{
              mention: {
                allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                mentionDenotationChars: ["@", "#"],
              },
            }}
            placeholder="Correct the extracted text here."
          />
          <Button onClick={handleSave}>Save Corrected Text</Button>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Index;