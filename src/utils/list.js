import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { googleMapsIcon } from "./icons";

export class User {
  constructor(data) {
    this.name = data.ownerName?.trim() || "";
    this.phoneNumber = /^[6789]\d{9}$/.test(data.ownerPhoneNumber)
      ? data.ownerPhoneNumber
      : "";
    this.address = data.ownerAddress?.trim() || "";
    this.googleMapsLink = data.googleMapsLink;
  }

  static validatePhoneNumber(number) {
    return /^[6789]\d{9}$/.test(number);
  }

  static validateGoogleMapsLink(link) {
    if (!link) return false;

    return /^https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]{17}$/.test(link);
  }
}

class GroceryList extends User {
  constructor(data) {
    super(data);
    this.list = data.list;
    this.now = new Date().toLocaleString();
  }

  #generatePdfName() {
    return `kirana_list_${this.name || "unknown"}_${this.now.replace(
      /[:/,\s]/g,
      "_"
    )}.pdf`;
  }

  #generatePdf() {
    const doc = new jsPDF({ format: "a4" });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    // **Function to Add Footer & Page Number**
    const addFooter = (pageNumber, totalPages) => {
      const footerText = "PDF generated using kirana-list.vercel.app";
      const url = "https://kirana-list.vercel.app/";

      doc.setFontSize(10);
      doc.setTextColor(100);

      // Footer Branding (Bottom Left)
      doc.textWithLink(footerText, 15, pageHeight - 15, { url });

      // Page Number (Bottom Right)
      doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - 30,
        pageHeight - 15,
        {
          align: "right",
        }
      );
    };

    // **Header - Date**
    doc.setFontSize(12);
    doc.text(`Date: ${this.now}`, 15, y);
    y += 15;

    // **User Details**
    doc.setFontSize(12);
    if (this.name) {
      doc.text(`Name: ${this.name}`, 15, y);
      y += 10;
    }
    if (this.phoneNumber) {
      doc.text(`Phone: ${this.phoneNumber}`, 15, y);
      y += 10;
    }
    if (this.address) {
      const wrappedAddress = doc.splitTextToSize(
        `Address: ${this.address}`,
        pageWidth - 30
      );
      doc.text(wrappedAddress, 15, y);
      y += wrappedAddress.length * 6 + 5;
    }

    // **Google Maps Link (if available)**
    if (this.googleMapsLink) {
      doc.addImage(googleMapsIcon, "PNG", 15, y, 10, 10);
      doc.setTextColor(0, 0, 255);
      doc.textWithLink("View on Google Maps", 30, y + 7, {
        url: this.googleMapsLink,
      });
      doc.setTextColor(0, 0, 0);
      y += 20;
    }

    // **Separator Line**
    doc.setDrawColor(150);
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    // **Table Data**
    const tableData = this.list.map((item, index) => [index + 1, item]);

    // **First Pass to Generate Content**
    autoTable(doc, {
      startY: y,
      head: [["#", "Item"]],
      body: tableData,
      theme: "grid", // ✅ Clean grid layout
      styles: {
        fontSize: 14, // ✅ Optimized for readability without being too big
        cellPadding: 2, // ✅ Balanced padding for spacing
        lineWidth: 0.4, // ✅ Subtle yet defined borders
        textColor: [20, 20, 20], // ✅ Dark text for contrast
        fillColor: [255, 255, 255], // ✅ White background for a clean look
      },
      headStyles: {
        fillColor: [0, 102, 204], // ✅ Deep blue header for contrast
        textColor: [255, 255, 255], // ✅ White text for clear readability
        fontSize: 16, // ✅ Bigger but not too large
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 }, // ✅ Adjusted width for numbering
        1: { halign: "left", cellWidth: "auto" }, // ✅ Auto width for text
      },
      tableWidth: "auto", // ✅ Keeps it structured
    });

    // **Calculate Total Pages AFTER Content is Generated**
    const totalPages = doc.internal.getNumberOfPages();

    // **Second Pass to Add Page Numbers & Footer**
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }

    // **Save the PDF**
    doc.save(this.#generatePdfName());
  }

  download() {
    try {
      console.log("Downloading PDF...");
      this.#generatePdf();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }
}

export default GroceryList;
