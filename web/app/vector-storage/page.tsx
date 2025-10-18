import { Grid, Stack } from "@mui/material";
import DataTableSection from "./DataTableSection";
import HeaderSection from "./HeaderSection";

export default async function Page() {
  return (
    <Stack>
      <Grid container>
        <Grid size={12} marginBottom={2}>
          <HeaderSection/>
        </Grid>
      </Grid>
      <DataTableSection/>
    </Stack>
  );
}