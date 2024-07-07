import React, { ReactNode, useCallback, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { matchesExistingAddress } from "../editor/matchesExistingAddress";
import { getAddress } from "../utils/getAddress";
import { isAddressChanged } from "../utils/isAddressChanged";
import { JotTwoFile } from "../file/file-utils";

type FormDataType = {
  url: string;
  address: string;
};

export function LinkFileModal({
  file,
  userFiles,
  onSubmit,
  children,
}: {
  file?: JotTwoFile;
  userFiles: JotTwoFile[];
  onSubmit({ url, key }: { url: string; key: string }): Promise<void>;
  children: ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [submitPending, startSubmit] = useTransition();
  const [title, setTitle] = React.useState<string | undefined>(file?.name);

  const [defaultAddress, setDefaultAddress] = React.useState<
    string | undefined
  >(file ? getAddress(file.key) : undefined);

  const updateDefaultAddress = useCallback(
    (title: string) => {
      if (!!file) return;

      if (!title) setDefaultAddress(undefined);
      const suggestedAddress = title.toLowerCase().replace(/\s+/g, "-");
      if (matchesExistingAddress(suggestedAddress, userFiles)) {
        setDefaultAddress(undefined);
      } else {
        setDefaultAddress(suggestedAddress);
      }
    },
    [file, userFiles],
  );

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Dialog.Title className="mb-4 text-xl font-medium text-gray-900">
            Link to a file
          </Dialog.Title>
          <Dialog.Description className="hidden">
            Link a file to be accessible within Jot.
          </Dialog.Description>

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

            <Form.Field name="url" className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Form.Label htmlFor="url" className="text-sm text-gray-700">
                  URL
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  required
                  className="inline-flex w-80 flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  id="url"
                  name="url"
                  placeholder="https://whiteboard.com/shared/1234"
                  defaultValue={file?.name}
                  inputMode="text"
                />
              </Form.Control>
              <div className="ml-1 mt-1 flex flex-col items-baseline justify-between gap-1 text-sm text-red-500">
                <Form.Message match="valueMissing">
                  Please enter a URL
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
                  placeholder="team-whiteboard"
                  defaultValue={defaultAddress}
                />
              </Form.Control>
              <div className="ml-1 mt-1 flex flex-col items-baseline justify-between gap-1 text-sm text-red-500">
                <Form.Message className="text-red-500" match="valueMissing">
                  Please enter an address
                </Form.Message>
                <Form.Message
                  match={(value) => matchesExistingAddress(value, userFiles)}
                >
                  Address is already taken
                </Form.Message>
                <span className="text-zinc-400">
                  Note that if you have sent the current address to others they
                  will lose access to this file when you change it.
                </span>
              </div>
            </Form.Field>

            <div className="mt-6 flex justify-end">
              <Form.Submit
                disabled={submitPending}
                onSubmit={submit}
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormDataType;

    if (!data.url || !data.address) return;
    if (
      file &&
      !isAddressChanged(file, data.address) &&
      file.name === data.url
    ) {
      setOpen(false);
      return;
    }
    if (matchesExistingAddress(data.address, userFiles)) return;

    startSubmit(async () => {
      await onSubmit({
        url: data.url,
        key: data.address,
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
