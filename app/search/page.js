import { listTools } from "../../lib/api";
import SearchClient from "./SearchClient";

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;

  const q = searchParams?.q || "";
  const tag = searchParams?.tag || "";
  const page = Number(searchParams?.page) || 1;

  const data = await listTools({ q, tag, page });

  return (
    <SearchClient
      q={q}
      tag={tag}
      page={page}
      data={data}
    />
  );
}
