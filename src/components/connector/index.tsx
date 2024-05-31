"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Connector = () => {
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


        
        // setUsername(decoded.firstname + " " + decoded.lastname);
        // setUserId(decoded.id);
        // setCheckConnexion(false);
      } catch (e) {
        console.log(e);
        router.push("/");
      }
  }, []);
  return null;
};
