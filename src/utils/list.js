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
    const safeNow = this.now.replace(/[:/,\s]/g, "_");
    return `kirana_list_${this.name || "unknown"}_${safeNow}.pdf`;
  }

  #generatePdf() {
    const doc = new jsPDF();
    let y = 10;

    // Add Date
    doc.setFontSize(12);
    doc.text(`Date: ${this.now}`, 10, y);
    y += 10;

    // ✅ Conditionally Add User Details to PDF
    const userDetails = [];
    if (this.name) userDetails.push(`Name: ${this.name}`);
    if (this.phoneNumber) userDetails.push(`Phone: ${this.phoneNumber}`);
    if (this.address) userDetails.push(`Address: ${this.address}`);

    if (userDetails.length > 0) {
      doc.text(userDetails, 10, y);
      y += userDetails.length * 10;
    }

    // ✅ Add Google Maps icon & clickable link if available
    if (this.googleMapsLink) {
      doc.addImage(googleMapsIcon, "PNG", 10, y, 10, 10);
      doc.setTextColor(0, 0, 255);
      doc.textWithLink("View on Google Maps", 25, y + 7, {
        url: this.googleMapsLink,
      });
      doc.setTextColor(0, 0, 0);
      y += 15;
    }

    // Draw separator line
    doc.line(10, y, 200, y);
    y += 10;

    // Create table data
    const tableData = this.list.map((item, index) => [index + 1, item]);

    // Add Table with Compact Design
    autoTable(doc, {
      startY: y,
      head: [["#", "Item"]],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0,
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [50, 50, 50],
        fontSize: 10,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "left", cellWidth: 120 },
      },
      tableWidth: "auto",
    });

    // Branding at the bottom
    const footerText = `PDF generated using grocery-list-builder.com`;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(footerText, 10, doc.internal.pageSize.height - 10);

    // Save the PDF
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
