"use client";
import React, { useState } from "react";
import { Filter } from "lucide-react";
import FAQAccordionView from "./accordion/page";
import FAQTableView from "./table/page";

const FAQPage = () => {
  const [viewMode, setViewMode] = useState("accordion"); // "accordion" or "table"

  return (
    <div className="container-width fade-in p-6">
      {/* View Mode Toggle */}
      <div className="bg-brand-beige p-4 rounded-xl mb-6">
        <div className="flex items-center justify-center gap-2">
          <Filter className="text-brand-warm-brown w-4 h-4" />
          <div className="flex bg-white rounded-lg p-1">
            <button
              onClick={() => setViewMode("accordion")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "accordion"
                  ? "bg-brand-warm-brown text-white"
                  : "text-brand-warm-brown hover:bg-brand-light-beige"
              }`}
            >
              Accordion View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-brand-warm-brown text-white"
                  : "text-brand-warm-brown hover:bg-brand-light-beige"
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Render the appropriate view */}
      {viewMode === "accordion" ? <FAQAccordionView /> : <FAQTableView />}
    </div>
  );
};

export default FAQPage;
