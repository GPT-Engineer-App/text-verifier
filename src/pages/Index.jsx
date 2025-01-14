import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [correctedText, setCorrectedText] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        // Simulate OCR extraction
        setExtractedText("Extracted text from the image will appear here.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event) => {
    setCorrectedText(event.target.value);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log("Corrected Text Saved:", correctedText);
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
          <Textarea
            value={correctedText}
            onChange={handleTextChange}
            className="w-full h-32"
            placeholder="Correct the extracted text here."
          />
          <Button onClick={handleSave}>Save Corrected Text</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;