"use client";
import {
  Box,
  Input,
  Typography,
  Button,
  CircularProgress,
  styled,
} from "@mui/joy";
import { jwtDecode } from "jwt-decode";
import { Lagertha, LagerthaTypes } from "lagertha-sdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SvgIcon from "@mui/joy/SvgIcon";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const Signup = () => {
  const [checkConnexion, setCheckConnexion] = useState<boolean>(true);
  const [loadingEncrypt, setLoadingEncrypt] = useState<boolean>(false);
  const [loadingDecrypt, setLoadingDecrypt] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
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
      if (decoded.roles.includes("ROLE_VALIDATION")) {
        router.push("/validation");
      }
      setUsername(decoded.firstname + " " + decoded.lastname);
      setUserId(decoded.id);
      setCheckConnexion(false);
    } catch (e) {
      router.push("/");
    }
  }, []);

  const encryptFile = useCallback(async (e: React.BaseSyntheticEvent) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingEncrypt(true);
      const access_token = localStorage.getItem("access_token");
      const env = process.env.NEXT_PUBLIC_LAGERTHA_URL || "";
      const config = {
        access_token,
        env,
      };
      const new_sentinel = await Lagertha.create_sentinel(config, {
        clusters: [],
      });
      const encrypted = await Lagertha.encrypt_file_with_sentinel(
        file,
        new_sentinel
      );
      const encryptedName = await Lagertha.encrypt_with_sentinel(
        file.name,
        new_sentinel
      );
      const decryptedName = await Lagertha.decrypt_with_sentinel(
        encryptedName,
        new_sentinel
      );
      const url = URL.createObjectURL(encrypted);
      const a = document.createElement("a");
      a.href = url;
      a.download = encryptedName + ".lf";
      document.body.appendChild(a);
      a.click();
      setLoadingEncrypt(false);
    }
  }, []);

  const decryptFile = useCallback(async (e: React.BaseSyntheticEvent) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingDecrypt(true);

      const access_token = localStorage.getItem("access_token");
      const env = process.env.NEXT_PUBLIC_LAGERTHA_URL || "";
      const config = {
        access_token,
        env,
      };
      const decrypted = await Lagertha.decrypt_file(file, config);
      const filename = await Lagertha.decrypt(
        file.name.replaceAll(".lf", "").replaceAll("_", "/"),
        config
      );
      const url = URL.createObjectURL(decrypted);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setLoadingDecrypt(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.clear();
    router.push("/");
  }, []);

  return (
    <Box>
      {checkConnexion ? (
        <CircularProgress />
      ) : (
        <>
          <Typography level="h2">Hello, {username} </Typography>
          {userId && (
            <Typography level="body-md">
              you&apos;re Lagertha-id is <b>{userId}</b>
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            <Button
              component="label"
              loading={loadingEncrypt}
              role={undefined}
              tabIndex={-1}
              variant="solid"
              color="primary"
              fullWidth
              startDecorator={
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </SvgIcon>
              }
            >
              Encrypt a file
              <VisuallyHiddenInput
                type="file"
                multiple={false}
                onChange={encryptFile}
              />
            </Button>
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="outlined"
              loading={loadingDecrypt}
              color="neutral"
              fullWidth
              startDecorator={
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </SvgIcon>
              }
            >
              Decrypt a file
              <VisuallyHiddenInput
                accept=".lf"
                type="file"
                onChange={decryptFile}
              />
            </Button>
          </Box>
          <Button onClick={disconnect} variant="plain" color="neutral">
            Disconnect
          </Button>
        </>
      )}
    </Box>
  );
};

export default Signup;
