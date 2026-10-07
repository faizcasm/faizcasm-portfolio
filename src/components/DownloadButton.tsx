import React from 'react';
import { Download } from 'lucide-react';

/**
 * Direct download of the real resume PDF (no client-side PDF generation).
 */
const DownloadButton: React.FC = () => (
  <a
    href="/Faizan-Hameed-Resume.pdf"
    download="Faizan-Hameed-Resume.pdf"
    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
  >
    <Download size={16} />
    Download PDF
  </a>
);

export default DownloadButton;
