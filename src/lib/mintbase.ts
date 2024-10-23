/**
 * @file useMint.ts
 * @title Minting Hook for Images
 * @description Provides a React hook `useMintImage` for handling the minting process of images on the Mintbase platform.
 * This includes form handling, file uploading, and interacting with the Mintbase blockchain to mint the image as an NFT.
 * It utilizes the `@mintbase-js/react` and `@mintbase-js/storage` packages for wallet integration and file storage, respectively.
 * The hook returns an object containing the form handlers and a preview state for the image to be minted.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChangeEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { uploadFile, uploadReference } from "@mintbase-js/storage";
import { ArweaveResponse } from "@mintbase-js/storage/lib/types";
import { useWallet } from "./providers/near";
import { NETWORK_ID } from "@/config";

const MINTBASE_STORE_CONTRACT = {
  "mainnet": "",
  "testnet": "everything.mintspace2.testnet"
}

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "description must be at least 2 characters.",
  }),
  media: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.size <= 10 * 1024 * 1024), {
      message: "The media must be a maximum of 10MB.",
    })
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed to be sent.",
    }),
});


export { formSchema }

interface SubmitData {
  title: string;
  description: string;
  media: ((false | File) & (false | File | undefined)) | null;
}

export const useMintImage = () => {
  const { wallet, signedAccountId } = useWallet();
  const [preview, setPreview] = useState<string | File>("");

  const onSubmit = async (data: SubmitData) => {

    const reference = await uploadReference({
      title: typeof data?.title === "string" ? data.title : "",
      media: data?.media as unknown as File,
    });

    const file = uploadFile(data?.media as unknown as File);

    await handleMint(
      reference.id,
      file
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "", media: null, title: "" },
  });

  async function handleMint(
    reference: string,
    media: Promise<ArweaveResponse>,
  ) {
    if (reference) {
      await wallet!.signAndSendTransaction({
        contractId: MINTBASE_STORE_CONTRACT[NETWORK_ID] as string, // your mintbase store contract
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_batch_mint",
              args: {
                owner_id: signedAccountId,
                metadata: {
                  reference,
                  media: (await media).id,
                },
                num_to_mint: 1
              },
              gas: "200000000000000",
              deposit: "10000000000000000000000",
            },
          },
        ],
      });
    }
  }

  return { form, onSubmit, preview, setPreview };
};