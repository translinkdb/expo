import { GTFSStaticParser } from "./services/gtfsStatic/parser";

async function main() {
  const parser = new GTFSStaticParser();

  const stops = await parser.parseStops(
    "/Users/john/projects/tldb/expo/test_data/google_transit (1)"
  );

  console.log(stops.find((s) => s.code === "50718"));
}

main();
