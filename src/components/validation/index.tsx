"use client";
import { Box, Input, Typography, Button, CircularProgress } from "@mui/joy";
import { jwtDecode } from "jwt-decode";
import { Lagertha, LagerthaTypes } from "lagertha-sdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Signup = () => {
  const [checkConnexion, setCheckConnexion] = useState<boolean>(true);
  const [validationCode, setValidationCode] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (!accessToken || !refreshToken) throw "no token";
      const decoded: any = jwtDecode(accessToken);
      const decodedRefresh: any = jwtDecode(refreshToken);
      const isAccesTokenValid = decoded.exp && decoded.exp > Date.now() / 1000;
      const isRefreshTokenValid =
        decodedRefresh.exp && decodedRefresh.exp > Date.now() / 1000;
      if (!isAccesTokenValid || !isRefreshTokenValid) {
        localStorage.clear();
        throw "expired token";
      }
      if (!decoded.roles.includes("ROLE_VALIDATION")) {
        router.push("/connect");
      }
      setCheckConnexion(false);
    } catch (e) {
      console.log(e);
      router.push("/");
    }
  }, []);

  const onSubmit = useCallback(async () => {
    setCheckConnexion(true);
    try {
      const env = process.env.NEXT_PUBLIC_LAGERTHA_URL || "";
      const application_id = Number(
        process.env.NEXT_PUBLIC_LAGERTHA_APPLICATION_ID
      );
      const config = {
        access_token: localStorage.getItem("access_token"),
        env,
      };
      await Lagertha.validate_user_public(validationCode, config);
      const creds = await Lagertha.refresh({
        refresh_token: localStorage.getItem("refresh_token"),
        env,
        application_id,
      });
      localStorage.setItem("access_token", creds.access_token);
      localStorage.setItem("refresh_token", creds.refresh_token);
      router.push("/connect");
    } catch {
      setValidationCode("");
      setCheckConnexion(false);
    }
  }, [router, validationCode]);

  return (
    <Box>
      {checkConnexion ? (
        <CircularProgress />
      ) : (
        <>
          <Typography level="h2">Validation</Typography>
          <Typography level="body-md">
            Entrez le code unique reçu par email
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit()
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
                placeholder="Validation code"
                value={validationCode}
                onChange={(e) => {
                  setValidationCode(e.target.value);
                }}
              />
              <Button type="submit" fullWidth>
                Validate
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default Signup;
