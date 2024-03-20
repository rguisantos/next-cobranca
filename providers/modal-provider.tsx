"use client";

import { useEffect, useState } from "react";

import { ClinicaModal } from "@/components/modals/clinica-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ClinicaModal />
    </>
  );
}
