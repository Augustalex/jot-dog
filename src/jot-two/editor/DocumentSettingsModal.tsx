import React, { ReactNode, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import {
  deleteUserFile,
  updateUserFile,
} from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { useFileContext } from "../file/FileContext";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import { isAddressChanged } from "../utils/isAddressChanged";
import { getAddress } from "../utils/getAddress";
import { matchesExistingAddress } from "./matchesExistingAddress";
import { useOpenFiles } from "../utils/useOpenFiles";

type FormDataType = {
  title: string;
  address: string;
};

export function DocumentSettingsModal({ children }: { children: ReactNode }) {
  const { file, userFiles } = useFileContext();
  const { closeFile } = useOpenFiles();
  const { removeFileFromRecent } = useRecentlyViewed();
  const [open, setOpen] = React.useState(false);
  const [submitPending, startSubmit] = useTransition();

  const [pressedDelete, setPressedDelete] = React.useState<number | null>(null);
  const [tryingToDelete, tryToDelete] = useTransition();
  const [deletingFile, deleteFile] = useTransition();

  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Dialog.Title className="mb-4 text-xl font-medium text-gray-900">
            Edit jot settings
          </Dialog.Title>
          <Dialog.Description className="hidden">
            Update the title and address of your jot.
          </Dialog.Description>

          <Form.Root className="flex flex-1 flex-col gap-4" onSubmit={onSubmit}>
            <Form.Field name="title" className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Form.Label htmlFor="title" className="text-sm text-gray-700">
                  Title
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  required
                  className="inline-flex w-80 flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={file.name}
                  inputMode="text"
                />
              </Form.Control>
              <div className="ml-1 mt-1 flex flex-col items-baseline justify-between gap-1 text-sm text-red-500">
                <Form.Message match="valueMissing">
                  Please enter a title
                </Form.Message>
              </div>
            </Form.Field>

            <Form.Field name="address" className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Form.Label htmlFor="address" className="text-sm text-gray-700">
                  Address
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  className="inline-flex w-80 flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  id="address"
                  name="address"
                  required
                  defaultValue={getAddress(file.key)}
                />
              </Form.Control>
              <div className="ml-1 mt-1 flex flex-col items-baseline justify-between gap-1 text-sm text-red-500">
                <Form.Message className="text-red-500" match="valueMissing">
                  Please enter an address
                </Form.Message>
                <Form.Message
                  match={(value) =>
                    isAddressChanged(file, value) &&
                    matchesExistingAddress(value, userFiles)
                  }
                >
                  Address is already taken
                </Form.Message>
                <span className="text-zinc-400">
                  Note that if you have sent the current address to others they
                  will lose access to this file when you change it.
                </span>
              </div>
            </Form.Field>

            <div className="mt-6 flex items-end justify-end">
              <button
                disabled={deletingFile}
                onClick={tryingToDelete ? reallyDeleteJot : deleteJot}
                className="mr-2 rounded-md bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {deletingFile
                  ? "Deleting"
                  : tryingToDelete
                    ? "Are you sure?"
                    : "Delete jot"}
              </button>

              <Form.Submit
                disabled={submitPending || deletingFile}
                onSubmit={onSubmit}
                className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:disabled:bg-gray-300 disabled:disabled:text-gray-700 disabled:text-gray-700 disabled:disabled:shadow-none disabled:shadow-none disabled:disabled:ring-gray-300 disabled:disabled:hover:bg-gray-300 disabled:hover:bg-gray-300 disabled:disabled:focus:ring-gray-300 disabled:focus:ring-gray-300"
              >
                Save changes
              </Form.Submit>
            </div>
          </Form.Root>
          <Dialog.Close className="absolute right-4 top-4 hover:scale-125">
            <CloseIcon />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  function deleteJot(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setPressedDelete(Date.now());
    tryToDelete(() => {
      return new Promise((resolve) =>
        setTimeout(() => {
          setPressedDelete(null);
          resolve();
        }, 2500),
      );
    });
  }

  async function reallyDeleteJot(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!pressedDelete) return;
    const timeSincePressedDelete = Date.now() - pressedDelete;
    if (timeSincePressedDelete < 250) return;

    deleteFile(async () => {
      setPressedDelete(null);
      removeFileFromRecent(file);
      closeFile(file);
      await deleteUserFile(file.key);
      router.push(`/${localUser.username}`);
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormDataType;

    if (!data.title || !data.address) return;
    if (
      isAddressChanged(file, data.address) &&
      matchesExistingAddress(data.address, userFiles)
    )
      return;

    startSubmit(async () => {
      await updateUserFile(file.key, {
        title: data.title ?? "Untitled",
        key: data.address ?? "untitled",
      });
      setOpen(false);

      if (isAddressChanged(file, data.address)) {
        removeFileFromRecent(file);
        closeFile(file);
        router.push(`/${localUser.username}/${data.address}`);
      } else if (data.title !== file.name) {
        window.location.reload();
      }
    });
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
