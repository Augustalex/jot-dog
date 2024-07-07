import React, { ReactNode, useCallback, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { isAddressChanged } from "../../utils/isAddressChanged";
import { getAddress } from "../../utils/getAddress";
import { matchesExistingAddress } from "../matchesExistingAddress";
import { NoteFile } from "../../../jot-one/utils/file-utils";

type FormDataType = {
  title: string;
  address: string;
};

export function DocumentSettingsModal({
  creating = false,
  file,
  userFiles,
  onSubmit,
  onDelete,
  children,
}: {
  creating?: boolean;
  file?: NoteFile;
  userFiles: NoteFile[];
  onSubmit({
    title,
    address,
  }: {
    title: string;
    address: string;
  }): Promise<void>;
  onDelete?(): Promise<void>;
  children: ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [submitPending, startSubmit] = useTransition();
  const [pressedDelete, setPressedDelete] = React.useState<number | null>(null);
  const [tryingToDelete, tryToDelete] = useTransition();
  const [deletingFile, deleteFile] = useTransition();

  const [title, setTitle] = React.useState<string | undefined>(file?.name);
  const [defaultAddress, setDefaultAddress] = React.useState<
    string | undefined
  >(file ? getAddress(file.key) : undefined);

  const updateDefaultAddress = useCallback(
    (title: string) => {
      if (!creating) return;

      if (!title) setDefaultAddress(undefined);
      const suggestedAddress = title.toLowerCase().replace(/\s+/g, "-");
      if (matchesExistingAddress(suggestedAddress, userFiles)) {
        setDefaultAddress(undefined);
      } else {
        setDefaultAddress(suggestedAddress);
      }
    },
    [creating, userFiles],
  );

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {creating ? (
            <>
              <Dialog.Title className="text-xl font-medium text-gray-900">
                Make new Jot
              </Dialog.Title>
              <Dialog.Description className="mb-5 mt-2 text-gray-600">
                Give your note a nice title, but also an address that is easy to
                remember and to type into a browser.
              </Dialog.Description>
            </>
          ) : (
            <>
              <Dialog.Title className="mb-4 text-xl font-medium text-gray-900">
                Edit jot settings
              </Dialog.Title>
              <Dialog.Description className="hidden">
                Update the title and address of your jot.
              </Dialog.Description>
            </>
          )}

          <Form.Root className="flex flex-1 flex-col gap-4" onSubmit={submit}>
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
                  placeholder="Meeting notes"
                  defaultValue={file?.name}
                  inputMode="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    updateDefaultAddress(e.target.value);
                  }}
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
                  placeholder="meeting-notes"
                  defaultValue={defaultAddress}
                />
              </Form.Control>
              <div className="ml-1 mt-1 flex flex-col items-baseline justify-between gap-1 text-sm text-red-500">
                <Form.Message className="text-red-500" match="valueMissing">
                  Please enter an address
                </Form.Message>
                <Form.Message
                  match={(value) =>
                    (!file || isAddressChanged(file, value)) &&
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
              {onDelete && (
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
              )}

              <Form.Submit
                disabled={submitPending || deletingFile}
                onSubmit={submit}
                className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:disabled:bg-gray-300 disabled:disabled:text-gray-700 disabled:text-gray-700 disabled:disabled:shadow-none disabled:shadow-none disabled:disabled:ring-gray-300 disabled:disabled:hover:bg-gray-300 disabled:hover:bg-gray-300 disabled:disabled:focus:ring-gray-300 disabled:focus:ring-gray-300"
              >
                {creating ? "Create Jot" : "Save changes"}
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

    if (!onDelete || !pressedDelete) return;
    const timeSincePressedDelete = Date.now() - pressedDelete;
    if (timeSincePressedDelete < 250) return;

    deleteFile(async () => {
      setPressedDelete(null);
      await onDelete();
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormDataType;

    if (!data.title || !data.address) return;
    if (
      file &&
      !isAddressChanged(file, data.address) &&
      file.name === data.title
    ) {
      setOpen(false);
      return;
    }
    if (
      (!file || isAddressChanged(file, data.address)) &&
      matchesExistingAddress(data.address, userFiles)
    )
      return;

    startSubmit(async () => {
      await onSubmit({
        title: data.title,
        address: data.address,
      });
      setOpen(false);
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
