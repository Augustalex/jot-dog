import React, { ReactNode, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { createUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";

type FormDataType = {
  title: string;
  address: string;
};

export function CreateFileModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [submitPending, startSubmit] = useTransition();
  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Dialog.Title className="text-xl font-medium text-gray-900">
            Make new Jot
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2 text-gray-600">
            Give your note a nice title, but also an address that is easy to
            remember and to type into a browser.
          </Dialog.Description>

          <Form.Root className="flex flex-1 flex-col gap-4" onSubmit={onSubmit}>
            <Form.Field name="title" className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Form.Label htmlFor="title" className="text-sm text-gray-700">
                  Title
                </Form.Label>
                <Form.Message className="text-red-500" match="valueMissing">
                  Please enter a title
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  required
                  className="inline-flex w-80 flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  id="title"
                  name="title"
                  defaultValue="Meeting notes"
                  inputMode="text"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="address" className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Form.Label htmlFor="address" className="text-sm text-gray-700">
                  Address
                </Form.Label>
                <Form.Message className="text-red-500" match="valueMissing">
                  Please enter an address
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  className="inline-flex w-80 flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  id="address"
                  name="address"
                  required
                  defaultValue="meeting-notes"
                />
              </Form.Control>
            </Form.Field>

            <div className="mt-6 flex justify-end">
              <Form.Submit
                disabled={submitPending}
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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormDataType;

    startSubmit(async () => {
      await createUserFile({
        title: data.title ?? "Untitled",
        key: data.address ?? "untitled",
      });
      setOpen(false);
      router.push(`/${localUser.username}/${data.address}`);
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
