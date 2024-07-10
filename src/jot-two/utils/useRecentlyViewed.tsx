import React, { ReactNode, useEffect, useState } from "react";
import { JotTwoFile } from "../file/file-utils";
import * as Dialog from "@radix-ui/react-dialog";
import { checkIfUserFileExists } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentView {
  file: JotTwoFile;
  viewedDate: string;
}

interface RecentlyViewedStore {
  recentlyViewed: RecentView[];
  registerRecentlyViewed: (file: JotTwoFile) => void;
  removeFileFromRecent: (file: JotTwoFile) => void;
}

const useRecentlyViewedStore = create(
  persist<RecentlyViewedStore>(
    (set) => ({
      recentlyViewed: [],
      registerRecentlyViewed: (file: JotTwoFile) => {
        return set((state) => {
          return {
            recentlyViewed: [
              { file, viewedDate: new Date().toISOString() },
              ...state.recentlyViewed.filter(
                (view) => view.file.key !== file.key,
              ),
            ],
          };
        });
      },
      removeFileFromRecent: (file: JotTwoFile) => {
        return set((state) => {
          return {
            recentlyViewed: state.recentlyViewed.filter(
              (view) => view.file.key !== file.key,
            ),
          };
        });
      },
    }),
    {
      name: "jot-dog-two-recently-viewed",
    },
  ),
);

export const useRecentlyViewed = () => {
  const recentlyViewed = useRecentlyViewedStore(
    (state) => state.recentlyViewed,
  );
  const removeFileFromRecent = useRecentlyViewedStore(
    (state) => state.removeFileFromRecent,
  );

  return { recentlyViewed, removeFileFromRecent };
};

export const useRegisterView = (file: JotTwoFile) => {
  const registerRecentlyViewed = useRecentlyViewedStore(
    (state) => state.registerRecentlyViewed,
  );
  useEffect(() => {
    registerRecentlyViewed(file);
  }, [file, registerRecentlyViewed]);
};

export function RecentlyViewedChecker({
  file,
  children,
}: {
  file: JotTwoFile;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { removeFileFromRecent } = useRecentlyViewed();

  const router = useRouter();

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Trigger
        asChild
        onClickCapture={checkIfCanVisit}
        onClick={checkIfCanVisit}
      >
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Dialog.Title className="text-xl font-medium text-gray-900">
            {`File doesn't exist`}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2 text-gray-600">
            It was probably deleted or renamed on another device.
          </Dialog.Description>

          <Dialog.Close className="absolute right-4 top-4 hover:scale-125">
            <CloseIcon />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  function onOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (!newOpen) {
      removeFileFromRecent(file);
    }
  }

  async function checkIfCanVisit(e: React.MouseEvent) {
    e.preventDefault();

    const fileExists = await checkIfUserFileExists(file.key);
    if (!fileExists) {
      setOpen(true);
    } else {
      router.push(`/${file.key}`);
    }
  }
}

export function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      width="16px"
      viewBox="0 -960 960 960"
      fill="#18181B"
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
}
