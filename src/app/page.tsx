import { Box, Button, Typography } from "@mui/joy";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Typography level="h2">Bienvenue</Typography>
      <Typography level="body-md">
        Veuillez vous connecter ou créer un compte pour continuer.
      </Typography>
      <Box sx={{marginBottom: 1, marginTop: 1}}>
        <Link href="/login">
          <Button fullWidth>Se connecter</Button>
        </Link>
      </Box>
      <Box sx={{marginBottom: 1, marginTop: 1}}>
        <Link href="/signup">
          <Button fullWidth>Créer un compte</Button>
        </Link>
      </Box>
    </main>
  );
}
