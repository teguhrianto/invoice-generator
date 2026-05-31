import { nanoid } from "nanoid";
import type { Invoice, InvoiceAction, LineItem } from "@/types/invoice";
import { DEFAULT_CURRENCY, DEFAULT_INVOICE } from "@/lib/constants";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  recalculateLineItem,
} from "@/lib/calculations";
import { getTodayISODate, getDefaultDueDate } from "@/lib/formatters";

/**
 * Re-derives `subtotal`, `taxAmount`, and `total` from the current state.
 * Call this after any mutation that could change line items or adjustment fields.
 */
function deriveTotals(state: Invoice): Invoice {
  const subtotal = calculateSubtotal(state.lineItems);
  // Tax is calculated on the post-discount amount so customers are not taxed
  // on a portion they receive back as a discount.
  const taxableBase = Math.max(0, subtotal - state.discountAmount);
  const taxAmount = calculateTax(taxableBase, state.taxPercent);
  const total = calculateTotal(subtotal, taxAmount, state.discountAmount, state.shippingFee);
  return { ...state, subtotal, taxAmount, total };
}

/**
 * Builds a blank LineItem with a nanoid id and zero values.
 */
function blankLineItem(): LineItem {
  return {
    id: nanoid(),
    description: "",
    unitCost: 0,
    quantity: 1,
    amount: 0,
  };
}

/**
 * Creates a fresh Invoice with a new nanoid id, today's date,
 * a due date 14 days out, and all DEFAULT_INVOICE field values.
 */
export function createInitialInvoice(): Invoice {
  const today = getTodayISODate();
  return {
    ...DEFAULT_INVOICE,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    invoiceDate: today,
    dueDate: getDefaultDueDate(today),
    currency: DEFAULT_CURRENCY,
    lineItems: [blankLineItem()],
  };
}

/**
 * Typed reducer for the invoice state machine.
 * All mutations that affect totals call `deriveTotals` before returning.
 */
export function invoiceReducer(state: Invoice, action: InvoiceAction): Invoice {
  const now = new Date().toISOString();

  switch (action.type) {
    case "LOAD_INVOICE": {
      const loaded = action.payload;
      // Ensure at least one line item even if the stored invoice has none.
      const lineItems = loaded.lineItems.length > 0 ? loaded.lineItems : [blankLineItem()];
      return deriveTotals({ ...loaded, lineItems, updatedAt: now });
    }

    case "RESET_INVOICE": {
      return createInitialInvoice();
    }

    case "SET_FIELD": {
      const updated: Invoice = {
        ...state,
        updatedAt: now,
        [action.field]: action.value,
      };
      // Re-derive when the adjustment fields that feed into totals change.
      const affectsTotals: Array<keyof Invoice> = ["taxPercent", "discountAmount", "shippingFee"];
      if (affectsTotals.includes(action.field as keyof Invoice)) {
        return deriveTotals(updated);
      }
      return updated;
    }

    case "SET_LOGO": {
      return { ...state, updatedAt: now, logoDataUrl: action.dataUrl };
    }

    case "SET_CURRENCY": {
      return { ...state, updatedAt: now, currency: action.currency };
    }

    case "ADD_LINE_ITEM": {
      return deriveTotals({
        ...state,
        updatedAt: now,
        lineItems: [...state.lineItems, blankLineItem()],
      });
    }

    case "UPDATE_LINE_ITEM": {
      const lineItems = state.lineItems.map((item) => {
        if (item.id !== action.id) return item;
        // Apply the field update then recompute amount.
        const partial = { ...item, [action.field]: action.value };
        return recalculateLineItem(partial);
      });
      return deriveTotals({ ...state, updatedAt: now, lineItems });
    }

    case "REMOVE_LINE_ITEM": {
      // Always keep at least one line item.
      if (state.lineItems.length <= 1) return state;
      return deriveTotals({
        ...state,
        updatedAt: now,
        lineItems: state.lineItems.filter((item) => item.id !== action.id),
      });
    }

    case "REORDER_LINE_ITEMS": {
      const { fromIndex, toIndex } = action;
      const lineItems = [...state.lineItems];
      const [moved] = lineItems.splice(fromIndex, 1);
      // Guard against invalid indices; if splice produced undefined, bail out.
      if (moved === undefined) return state;
      lineItems.splice(toIndex, 0, moved);
      return { ...state, updatedAt: now, lineItems };
    }

    default: {
      // Exhaustive check: TypeScript will error here if a case is unhandled.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
