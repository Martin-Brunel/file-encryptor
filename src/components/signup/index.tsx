"use client";
import { Box, Input, Typography, Button } from "@mui/joy";
import { Lagertha } from "lagertha-sdk";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const Signup: React.FC = () => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const onSubmit = useCallback(async () => {
    const application_id = Number(
      process.env.NEXT_PUBLIC_LAGERTHA_APPLICATION_ID
    );
    const env = process.env.NEXT_PUBLIC_LAGERTHA_URL || "";
    await Lagertha.create_user_public(
      {
        email,
        password,
        firstname,
        lastname,
        login: email,
        application_id,
      },
      env
    );

    const creds = await Lagertha.auth({
      login: email,
      password,
      application_id,
      env,
    });
    localStorage.setItem("access_token", creds.access_token);
    localStorage.setItem("refresh_token", creds.refresh_token);
    router.push("/validation");
  }, [email, password, firstname, lastname, router]);

  return (
    <Box>
      <Typography level="h2">Signup</Typography>
      <Typography level="body-md">
        Please enter your informations to create your account:
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
            placeholder="Firstname"
            value={firstname}
            onChange={(e) => {
              setFirstname(e.target.value);
            }}
          />
          <Input
            placeholder="Lastname"
            value={lastname}
            onChange={(e) => {
              setLastname(e.target.value);
            }}
          />
          <Input
            placeholder="Email"
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
            Signup
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Signup;
