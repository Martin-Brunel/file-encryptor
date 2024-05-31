"use client";

import { Box, Input, Typography, Button, CircularProgress } from "@mui/joy";
import { Lagertha } from "lagertha-sdk";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();

  const onSubmit = useCallback(async () => {
    setLoading(true)
    const application_id = Number(
      process.env.NEXT_PUBLIC_LAGERTHA_APPLICATION_ID
    );
    const env = process.env.NEXT_PUBLIC_LAGERTHA_URL || "";
    const creds = await Lagertha.auth({
      login: email,
      password,
      application_id,
      env,
    });
    localStorage.setItem("access_token", creds.access_token);
    localStorage.setItem("refresh_token", creds.refresh_token);
    router.push("/connect");

    setLoading(false)

  }, [email, password, router]);
  return (
    <Box>
      <Typography level="h2">Login</Typography>
      {loading ? <CircularProgress /> : (
        <>
          <Typography level="body-md">
            Entrez vos identifiants de connexion
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: "column",
                marginTop: 1,
              }}
            >
              <Input
                placeholder="login/email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button type="submit" fullWidth>
                Login
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default Login;