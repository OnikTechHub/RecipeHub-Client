import { jsPDF } from "jspdf";

/**
 * Generate and download a PDF receipt/invoice for a purchased recipe or membership.
 * @param {Object} item - Transaction item details from backend
 * @param {string} userEmail - Email of the purchasing user
 */
export const downloadReceiptPDF = (item, userEmail = "") => {
  if (!item) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [249, 115, 22]; // #F97316 (Primary Amber/Orange)
  const darkColor = [30, 27, 75];     // #1E1B4B (Deep Indigo)
  const lightGray = [245, 245, 247];  // Light background
  const textDark = [38, 38, 38];      // Neutral dark

  // Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 42, "F");

  // RecipeHub Brand Logo / Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("RecipeHub", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(249, 115, 22);
  doc.text("OFFICIAL PAYMENT RECEIPT & INVOICE", 14, 27);

  doc.setFontSize(8);
  doc.setTextColor(200, 200, 220);
  doc.text("Platform: recipehub.com  |  Support: support@recipehub.com", 14, 34);

  // Invoice Number & Status
  const invoiceNo = item.transactionId
    ? `INV-${item.transactionId.slice(-10).toUpperCase()}`
    : `INV-${(item._id || "REC").slice(-8).toUpperCase()}`;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(invoiceNo, 196, 20, { align: "right" });

  doc.setFillColor(16, 185, 129); // Green badge for PAID
  doc.roundedRect(150, 26, 46, 8, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("STATUS: PAID", 173, 31.5, { align: "center" });

  // Customer & Transaction Meta Section
  let y = 52;
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, y, 182, 34, 3, 3, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text("BILLED TO:", 20, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(item.userEmail || userEmail || "Valued Gourmet Member", 20, y + 14);
  doc.text(`User ID: ${item.userId || "N/A"}`, 20, y + 20);

  doc.setFont("helvetica", "bold");
  doc.text("TRANSACTION DETAILS:", 115, y + 8);
  doc.setFont("helvetica", "normal");
  const paidDate = item.paidAt
    ? new Date(item.paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-US");
  doc.text(`Date: ${paidDate}`, 115, y + 14);
  doc.text(`Transaction ID: ${item.transactionId || "N/A"}`, 115, y + 20);
  doc.text(`Payment Gateway: Stripe Checkout`, 115, y + 26);

  // Table Header
  y = 96;
  doc.setFillColor(...darkColor);
  doc.rect(14, y, 182, 10, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Item Description", 20, y + 6.5);
  doc.text("Category", 110, y + 6.5);
  doc.text("Access Type", 150, y + 6.5);
  doc.text("Price (USD)", 190, y + 6.5, { align: "right" });

  // Table Row
  y = 106;
  doc.setFillColor(255, 255, 255);
  doc.rect(14, y, 182, 18, "F");
  doc.setDrawColor(230, 230, 230);
  doc.line(14, y + 18, 196, y + 18);

  const recipeTitle =
    item.recipeId === "membership_upgrade"
      ? "Premium Creator Membership Upgrade"
      : item.title || item.recipeInfo?.recipeName || "Premium Culinary Recipe";

  const category =
    item.recipeId === "membership_upgrade"
      ? "Membership"
      : item.recipeInfo?.category || "Culinary Recipe";

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text(recipeTitle.length > 40 ? recipeTitle.slice(0, 38) + "..." : recipeTitle, 20, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Recipe ID: ${item.recipeId || "N/A"}`, 20, y + 14);

  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text(category, 110, y + 11);
  doc.text("Lifetime Access", 150, y + 11);

  const amountStr = `$${Number(item.amount || 5).toFixed(2)}`;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(amountStr, 190, y + 11, { align: "right" });

  // Summary / Total Box
  y = 132;
  doc.setFillColor(...lightGray);
  doc.roundedRect(120, y, 76, 28, 3, 3, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textDark);
  doc.text("Subtotal:", 126, y + 8);
  doc.text(amountStr, 190, y + 8, { align: "right" });

  doc.text("Tax & Processing Fees:", 126, y + 14);
  doc.text("$0.00", 190, y + 14, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.line(126, y + 17, 190, y + 17);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Total Paid:", 126, y + 23);
  doc.text(amountStr, 190, y + 23, { align: "right" });

  // Guarantee / Terms Notice
  y = 170;
  doc.setFillColor(254, 243, 199); // Soft amber accent
  doc.roundedRect(14, y, 182, 22, 2, 2, "F");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9);
  doc.text("UNLOCKED LIFETIME ACCESS GUARANTEE", 20, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 53, 15);
  doc.text(
    "This official electronic receipt confirms your permanent, unlimited access to the secret culinary instructions and ingredients.",
    20,
    y + 13
  );
  doc.text("You can view and cook this recipe anytime at recipehub.com/dashboard/purchased-recipes.", 20, y + 18);

  // Footer
  y = 265;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, y, 196, y);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("RecipeHub Inc. — Empowering Culinary Enthusiasts Worldwide.", 105, y + 6, { align: "center" });
  doc.text("This is an automatically generated electronic receipt. No physical signature required.", 105, y + 10, {
    align: "center",
  });

  // Download File
  doc.save(`RecipeHub_Receipt_${invoiceNo}.pdf`);
};

/**
 * Generate and download a PDF document for Smart Grocery List.
 * @param {Object} groceryData - Aggregated grocery list data with categories and recipe breakdown
 * @param {string} userEmail - User's email address
 */
export const downloadGroceryListPDF = (groceryData, userEmail = "") => {
  if (!groceryData) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const emeraldColor = [16, 185, 129]; // #10B981
  const darkColor = [15, 23, 42];      // #0F172A
  const lightBg = [248, 250, 252];     // Light background
  const textDark = [30, 41, 59];       // Dark text

  // Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 38, "F");

  // RecipeHub Title & Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("RecipeHub", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...emeraldColor);
  doc.text("AI SMART GROCERY LIST & SHOPPING CHECKLIST", 14, 25);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text(`Generated for: ${userEmail || "Gourmet Member"}  |  Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`, 14, 32);

  // Cost Estimate Banner Box
  let y = 44;
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, y, 182, 18, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 18, "S");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text(`Selected Recipes: ${groceryData.selectedRecipesCount || 0}`, 20, y + 8);
  doc.text(`Total Ingredients: ${groceryData.totalItemsCount || 0} items`, 85, y + 8);

  doc.setTextColor(...emeraldColor);
  doc.text(`Est. Cost: ${groceryData.estimatedCost || "$0.00"} USD`, 145, y + 8);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Aisle-categorized list aggregated from verified active recipes.", 20, y + 14);

  y += 24;

  // Section 1: Per Recipe Breakdown
  if (Array.isArray(groceryData.recipeBreakdown) && groceryData.recipeBreakdown.length > 0) {
    doc.setFillColor(...emeraldColor);
    doc.rect(14, y, 182, 7, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("SECTION 1: PER-RECIPE INGREDIENT BREAKDOWN", 18, y + 5);

    y += 11;

    groceryData.recipeBreakdown.forEach((r, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 15;
      }
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textDark);
      doc.text(`${idx + 1}. ${r.recipeName} (${Array.isArray(r.ingredients) ? r.ingredients.length : 0} items)`, 16, y);

      y += 5;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);

      const ingArr = Array.isArray(r.ingredients) ? r.ingredients : [];
      const ingText = ingArr.join("  •  ");
      const lines = doc.splitTextToSize(ingText, 175);
      doc.text(lines, 20, y);

      y += lines.length * 4.5 + 4;
    });

    y += 4;
  }

  // Section 2: Supermarket Aisle Checklist
  if (y > 240) {
    doc.addPage();
    y = 15;
  }

  doc.setFillColor(...darkColor);
  doc.rect(14, y, 182, 7, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SECTION 2: SUPERMARKET AISLE CHECKLIST", 18, y + 5);

  y += 12;

  if (Array.isArray(groceryData.categories)) {
    groceryData.categories.forEach((cat) => {
      if (y > 260) {
        doc.addPage();
        y = 15;
      }

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...emeraldColor);
      doc.text(`• ${cat.title.toUpperCase()} (${cat.items ? cat.items.length : 0} items)`, 16, y);

      y += 5;

      if (Array.isArray(cat.items)) {
        cat.items.forEach((item) => {
          if (y > 270) {
            doc.addPage();
            y = 15;
          }

          // Checkbox square
          doc.setDrawColor(148, 163, 184);
          doc.rect(20, y - 3, 3.5, 3.5);

          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...textDark);
          const countLabel = item.count > 1 ? ` (x${item.count})` : "";
          doc.text(`${item.name}${countLabel}`, 26, y);

          y += 5;
        });
      }

      y += 3;
    });
  }

  // Footer
  y = 282;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("RecipeHub — Official AI Smart Grocery List Generator. www.recipehub.com", 105, y + 5, { align: "center" });

  doc.save(`RecipeHub_Grocery_List_${new Date().toISOString().slice(0, 10)}.pdf`);
};

