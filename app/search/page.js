import { listTools } from "../../lib/api";
import SearchClient from "./SearchClient";

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;

  const q = searchParams?.q || "";
  const tag = searchParams?.tag || "";
  const page = Number(searchParams?.page) || 1;

  const spSort = String(searchParams?.sort || "").trim().toLowerCase();
  const uiSort = spSort === "rating" ? "rating" : "newest";

  const apiSort = uiSort === "rating" ? "rating" : "";

  const data = await listTools({ q, tag, page, sort: apiSort });

  return <SearchClient q={q} tag={tag} page={page} sort={uiSort} data={data} />;
}
