import { useWallet } from "@/lib/providers/near";
import { queryClient } from "@/main";
import { NO_DEPOSIT, THIRTY_TGAS } from "@/wallets/near-wallet";
import { getProviderByNetwork, view } from "@near-js/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getThing, getThings, getTypes } from "./inventory";
import { useAccount } from "./providers/jazz";
import { Thing } from "./schema";
import { ID } from "jazz-tools";

export interface GuestBookMessage {
  premium: boolean;
  sender: string;
  text: string;
}

export const GRAPH_CONTRACT = {
  mainnet: "social.near",
  testnet: "v1.social08.testnet"
};

function transformToThing(input) {
  const transformedThings = [];

  for (const [namespace, namespaceData] of Object.entries(input)) {
    for (const [typeName, typeData] of Object.entries(namespaceData.type)) {
      // Create a new Thing with the mapped fields
      const thing = {
        id: `${namespace}/${typeName}`, // Customize ID as needed
        type: `${namespace}/type/${typeName}`, // Build type path
        metadata: JSON.stringify(typeData.metadata), // Stringified metadata JSON
        data: typeData[""] // Raw data goes here
      };

      transformedThings.push(thing);
    }
  }

  return transformedThings;
}

export function useType({ typeId }: { typeId: string }) {
  const { networkId } = useWallet();
  const { me } = useAccount();

  return useQuery({
    queryKey: ["get-type", typeId],
    queryFn: async () => {
      console.log("typeId", typeId);
      if (typeId.startsWith("type-registry.testnet")) {
        const args = {
          keys: [typeId, `${typeId}/metadata/**`]
        };

        const typeData = await view<number>({
          account: GRAPH_CONTRACT[networkId],
          method: "get",
          deps: { rpcProvider: getProviderByNetwork(networkId) },
          args
        });

        return transformToThing(typeData)[0];
      } else {
        const things = getThings(me);
        const type = things.filter((thing) => {
          return thing.id === typeId;
        });
        return type[0];
      }
    }
  });
}

export function useGetTypes() {
  const { networkId } = useWallet();
  const { me } = useAccount();

  return useQuery({
    queryKey: ["get-types"],
    queryFn: async () => {
      const args = {
        keys: ["type-registry.testnet/type/*"]
      };

      const publicTypes = await view<number>({
        account: GRAPH_CONTRACT[networkId],
        method: "keys",
        deps: { rpcProvider: getProviderByNetwork(networkId) },
        args
      });
      return buildObjects(publicTypes);
    }
  });
}

export function useCreateType() {
  const { networkId, wallet } = useWallet();

  return useMutation({
    onSuccess: () => {
      // Invalidate and refetch the "get-types" query
      queryClient.invalidateQueries({ queryKey: ["get-types"] });
    },
    mutationFn: async ({
      message,
      donationAmount
    }: {
      message: string;
      donationAmount?: string;
    }) => {
      try {
        const result = wallet?.signAndSendTransaction({
          contractId: GRAPH_CONTRACT[networkId],
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "set",
                args: { text: message },
                gas: THIRTY_TGAS,
                deposit: deposit ? deposit : NO_DEPOSIT
              }
            }
          ]
        });
        return result; // Make sure the function returns a value/promise
      } catch (error) {
        console.error("Error in mutation:", error);
        throw error;
      }
    }
  });
}

// This will just condense into a single path
const getPaths = (obj) => {
  const paths = [];

  // Iterate over L1 keys
  for (const l1Key in obj) {
    const l2Obj = obj[l1Key];

    // Iterate over L2 keys
    for (const l2Key in l2Obj) {
      const l3Obj = l2Obj[l2Key];

      // Iterate over L3 keys
      for (const l3Key in l3Obj) {
        paths.push(`${l1Key}/${l2Key}/${l3Key}`);
      }
    }
  }

  return paths;
};

// This builds an object
const buildObjects = (obj) => {
  const result = [];

  // Iterate over L1 keys
  for (const accountId in obj) {
    const l2Obj = obj[accountId];

    // Iterate over L2 keys
    for (const type in l2Obj) {
      const l3Obj = l2Obj[type];

      // Iterate over L3 keys
      for (const key in l3Obj) {
        result.push({
          accountId: accountId,
          type: type,
          key: key,
          id: `${accountId}/${type}/${key}`
        });
      }
    }
  }

  return result;
};
