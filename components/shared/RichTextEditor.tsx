"use client";

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-white/5 animate-pulse rounded-2xl border border-white/10" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="text-white rounded-2xl overflow-hidden border-white/10"
      />
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .rich-text-editor .ql-container {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
          min-height: 200px;
          font-size: 1rem;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          color: white;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.3);
          font-style: normal;
        }
        .rich-text-editor .ql-snow.ql-toolbar button {
          color: white;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover {
          color: #ff4d94;
        }
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active {
          color: #ff4d94;
        }
        .rich-text-editor .ql-snow.ql-toolbar .ql-stroke {
          stroke: #94a3b8;
        }
        .rich-text-editor .ql-snow.ql-toolbar .ql-fill {
          fill: #94a3b8;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #ff4d94;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #ff4d94;
        }
        .rich-text-editor .ql-snow.ql-toolbar .ql-picker {
          color: #94a3b8;
        }
        .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover {
          color: #ff4d94;
        }
        .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke {
          stroke: #ff4d94;
        }
        .rich-text-editor .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          color: #ff4d94;
          border-color: transparent;
        }
        .rich-text-editor .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
          stroke: #ff4d94;
        }
        .rich-text-editor .ql-snow .ql-picker-options {
          background-color: #1a1c2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        }
        .rich-text-editor .ql-snow .ql-picker-item:hover {
          color: #ff4d94 !important;
        }
        .rich-text-editor .ql-snow .ql-color-picker .ql-picker-options {
          padding: 8px;
          width: 152px;
        }
      `}</style>
    </div>
  );
}
