import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

async function pushSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const schemaPath = path.join(process.cwd(), "scripts", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  console.log("Executing schema...");
  console.log(schema);

  const { error } = await supabase.rpc("exec_sql", { query: schema });

  if (error) {
    console.error("Error executing schema:", error);
    process.exit(1);
  }

  console.log("Schema applied successfully!");
}

pushSchema();