import React, { useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Index = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState(EditorState.createEmpty());
  const [correctedText, setCorrectedText] = useState(EditorState.createEmpty());

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        // Simulate OCR extraction
        const contentState = convertFromRaw({
          entityMap: {},
          blocks: [
            {
              text: "Extracted text from the image will appear here.",
              key: "initial",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
        });
        setExtractedText(EditorState.createWithContent(contentState));
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleSave = () => {
    // Implement save functionality
    const rawContentState = convertToRaw(correctedText.getCurrentContent());
    const correctedTextString = JSON.stringify(rawContentState);
    console.log("Corrected Text Saved:", correctedTextString);
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
          <div className="w-full h-32 border p-2">
            <Editor
              editorState={extractedText}
              toolbarHidden
              readOnly
            />
          </div>
          <div className="w-full h-32 border p-2">
            <Editor
              editorState={correctedText}
              onEditorStateChange={setCorrectedText}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          <Button onClick={handleSave}>Save Corrected Text</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;