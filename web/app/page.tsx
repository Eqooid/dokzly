import { 
  Typography, 
  Container, 
  Box, 
  Button,
  Paper
} from "@mui/material";
import { 
  Storage as StorageIcon, 
  Search as SearchIcon
} from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxWidth="lg" style={{marginTop: '5%'}}>
      <Box>
        {/* Hero Section */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Welcome to Dokzly
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            gutterBottom
            sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            Your intelligent document management & vector storage
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              component={Link}
              href="/vector-storage"
              variant="contained" 
              size="large"
              startIcon={<StorageIcon />}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<SearchIcon />}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Quick Actions Section */}
        <Paper sx={{ p: 4, mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Explore our vector storage system and start managing your documents intelligently.
          </Typography>
          <Button 
            component={Link}
            href="/vector-storage"
            variant="contained" 
            size="large"
            sx={{ mr: 2 }}
          >
            Browse Vector Storage
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
