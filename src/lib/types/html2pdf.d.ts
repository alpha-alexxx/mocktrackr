/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: { type?: string; quality?: number };
        html2canvas?: any;
        jsPDF?: {
            unit?: string;
            format?: string | number[];
            orientation?: 'portrait' | 'landscape';
        };
        pagebreak?: any;
    }

    interface Html2Pdf {
        set: (opt: Html2PdfOptions) => Html2Pdf;
        from: (element: HTMLElement) => Html2Pdf;
        save: () => void;
        outputPdf: () => any;
    }

    const html2pdf: () => Html2Pdf;
    export default html2pdf;
}
