import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getBase64FromImageUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject("Logo load failed");
    img.src = url;
  });
};

const generateTransactionPDF = async (txn) => {
  const doc = new jsPDF();

  try {
    const logo = await getBase64FromImageUrl("/favicon.png");

    // Header
    doc.addImage(logo, "PNG", 14, 10, 20, 20);
    doc.setFontSize(20);
    doc.setTextColor("#0f172a");
    doc.text("NeoCure Hospital", 40, 22);

    // Subheading
    doc.setFontSize(12);
    doc.setTextColor("#333");
    doc.text("Transaction Receipt", 14, 40);

    // Transaction Metadata Table
    const metadataRows = [
      ["Date", new Date(txn.createdAt).toLocaleString()],
      ["Amount", `INR ${txn.amount / 100}`],
      ["Order ID", txn.orderID],
      ["Payment ID", txn.paymentID],
      ["Status", txn.status.toUpperCase()],
    ];

    autoTable(doc, {
      startY: 45,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 4 },
      head: [["Field", "Value"]],
      body: metadataRows,
    });

    // Cart Items Table
    const itemStartY = doc.lastAutoTable.finalY + 10;
    const itemTable = txn.items.map((item) => [
      item.name,
      `INR ${item.price}`,
      item.duration,
    ]);

    autoTable(doc, {
      startY: itemStartY,
      theme: "striped",
      styles: {
        fontSize: 11,
        cellPadding: 4,
        textColor: "#1f2937", // dark gray
        fillColor: [245, 245, 245],
      },
      headStyles: {
        fillColor: [55, 65, 81], // slate-700
        textColor: "#fff",
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      head: [["Service Name", "Price", "Duration"]],
      body: itemTable,
    });

    // Footer
    const footerY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor("#666");
    doc.text(
      "This is an auto-generated receipt. For queries, contact support@neocure.in",
      14,
      footerY
    );

    doc.save(`receipt_${txn._id}.pdf`);
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};

export default generateTransactionPDF;
