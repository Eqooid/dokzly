import { Grid } from "@mui/material";
import DataTableSection from "./DataTableSection";
import ChatSection from "./ChatSection";
import HeaderSection from "./HeaderSection";

export default async function Page({ params } : { params:  Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <Grid spacing={3} container>
      <Grid size={12} marginBottom={2}>
        <HeaderSection storeId={slug}/>
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <DataTableSection storeId={slug}/>
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <ChatSection storeId={slug}/>
      </Grid>
    </Grid>
  );
}