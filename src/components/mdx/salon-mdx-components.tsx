import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx-components";
import { BudgetTable } from "./budget-table";
import { HistoryTable } from "./history-table";
import { DataMissing } from "./data-missing";

/**
 * Set de composants MDX pour les fiches salon. Étend le set global (h2/h3/p/ul…)
 * avec les composants structurés réutilisables dans le body MDX :
 *   <BudgetTable ... />
 *   <HistoryTable ... />
 *   <DataMissing />
 */
export const salonMdxComponents: MDXComponents = {
  ...mdxComponents,
  BudgetTable,
  HistoryTable,
  DataMissing,
};
