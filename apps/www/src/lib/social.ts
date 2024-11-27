import { NETWORK_ID, SOCIAL_CONTRACT } from "@/config";
import { queryClient } from "@/App";
import { Wallet } from "@/wallets/near-wallet";
import { Social, transformActions } from "@builddao/near-social-js";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useWallet } from "./providers/near";

export type SocialImage = {
  url: string;
  ipfs_cid: string;
};

export type Profile = {
  name: string;
  description: string;
  image?: SocialImage;
  backgroundImage?: SocialImage;
};

export interface Item {
  path: string;
  blockHeight: number;
  type: string;
}

export interface Post {
  accountId: string;
  item: Item;
  content: {
    text: string;
    image: SocialImage;
  };
}

export const social = new Social({
  contractId: SOCIAL_CONTRACT[NETWORK_ID],
  network: NETWORK_ID
});

export async function getProfile(accountId: string): Promise<Profile | null> {
  const response = await social.get({
    keys: [`${accountId}/profile/**`]
  });
  if (!response) {
    throw new Error("Failed to fetch profile");
  }
  try {
    const { profile } = (response as Record<string, { profile: Profile }>)[
      accountId
    ];
    return profile;
  } catch {
    throw new Error("Failed to destructure profile");
  }
}

export async function getPost(
  accountId: string,
  blockHeight: string
): Promise<Post | null> {
  const response = await social.get({
    keys: [`${accountId}/post/main`],
    blockHeight: blockHeight
  });
  if (!response) {
    return null;
  } else {
    try {
      return JSON.parse(response[accountId].post.main);
    } catch (error) {
      console.error("Error parsing post content:", error);
      return null;
    }
  }
}

export async function getPosts(
  action: string = "post",
  key: string = "main",
  limit: number,
  order: string = "desc",
  from?: string
): Promise<Post[]> {
  const response = await social.index({
    action,
    key,
    order,
    limit: limit.toString(),
    from
  });

  if (!response) {
    return [];
  } else {
    // Create an array of promises to fetch each post's content
    const postPromises = response.map(async (it) => {
      const post = await getPost(it.accountId, it.blockHeight);

      return {
        accountId: it.accountId,
        item: {
          path: `${it.accountId}/post/main`,
          blockHeight: it.blockHeight,
          type: "social"
        },
        content: post
      };
    });

    // Wait for all post content fetches to complete
    return Promise.all(postPromises);
  }
}

export function useGetPosts(limit: number = 10, order: string = "desc") {
  const computeFetchFrom = (items: any, limit: number) => {
    if (!items || items.length < limit) {
      return false; // Return false if less than limit or no items
    }
    const blockHeight = items[items.length - 1].item.blockHeight;
    return order === "desc" ? blockHeight - 1 : blockHeight + 1; // Adjust based on order
  };

  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = undefined }) => {
      // post main
      return await getPosts("post", "main", limit, order, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      const from = computeFetchFrom(lastPage, limit);
      return from; // Pass computed "from" value for the next query
    },
    initialPageParam: undefined
  });
}

export function useCreatePost({ cleanup }: { cleanup?: () => void }) {
  const { wallet } = useWallet();

  return useMutation({
    onSuccess: () => {
      // Invalidate and refetch the "posts" query
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (cleanup) {
        cleanup();
      }
    },
    mutationFn: async ({ content }: { content: any }) => {
      try {
        const tx = await createPost(wallet!, content);

        const result = wallet?.signAndSendTransaction(tx);
        return result; // Make sure the function returns a value/promise
      } catch (error) {
        console.error("Error in mutation:", error);
        throw error;
      }
    }
  });
}

export async function createPost(wallet: Wallet, content: any) {
  const account = await wallet.getAccount();
  const { publicKey, accountId } = account;
  try {
    const transaction = await social.set({
      data: {
        [accountId]: {
          post: {
            main: JSON.stringify(content)
          },
          index: {
            post: JSON.stringify({
              key: "main",
              value: {
                type: content.type
              }
            })
          }
        }
      },
      account: {
        publicKey: publicKey,
        accountID: accountId
      }
    });

    const transformedActions = transformActions(transaction.actions);

    return {
      contractId: SOCIAL_CONTRACT[NETWORK_ID],
      actions: transformedActions
    };
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
// Types
type Like = {
  accountId: string;
  value: {
    type: "like" | "unlike";
  };
};

type LikeIndex = {
  [accountId: string]: Like;
};

// Function to get likes for a given item
/**
 * Retrieves and processes likes for a specific item.
 * @param item - The item to get likes for.
 * @returns A promise that resolves to an object containing likes indexed by user accounts.
 */
export async function getLikes(item: Item): any {
  const response = await social.index({ action: "like", key: item });
  if (!response) {
    return [];
  } else {
    const likesByUsers: LikeIndex = {};

    response.forEach((like: Like) => {
      if (like.value.type === "like") {
        likesByUsers[like.accountId] = like;
      } else if (like.value.type === "unlike") {
        delete likesByUsers[like.accountId];
      }
    });

    return likesByUsers;
  }
  // console.log("look", likes);
}

export async function likeItem(
  wallet: Wallet,
  item: Item,
  hasLike: boolean,
  notifyAccountId?: string
): Promise<void> {
  const account = await wallet.getAccount();
  const { publicKey, accountId } = account;

  const data: any = {
    index: {
      like: JSON.stringify({
        key: item,
        value: {
          type: hasLike ? "unlike" : "like"
        }
      })
    }
  };

  if (!hasLike && notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: notifyAccountId,
      value: {
        type: "like",
        item
      }
    });
  }

  const transaction = await social.set({
    account: { accountID: accountId, publicKey: publicKey },
    data: { [accountId]: data }
  });

  const transformedActions = transformActions(transaction.actions);

  await wallet.signAndSendTransaction({
    contractId: SOCIAL_CONTRACT[NETWORK_ID],
    actions: transformedActions
  });
}

// Function to check if an account has liked an item
/**
 * Checks if the provided account ID has liked the given item.
 * @param item - The item to check for likes.
 * @param accountId - The account ID to check.
 * @returns A promise that resolves to a boolean indicating whether the account has liked the item.
 */
export async function hasLike(item: Item, accountId: string): Promise<boolean> {
  const likes = await getLikes(item);
  return !!likes[accountId];
}

export const getImageUrl = (image: { url: string; ipfs_cid: string }) => {
  if (image.url) return image.url;
  if (image.ipfs_cid) return `https://ipfs.near.social/ipfs/${image.ipfs_cid}`;
  return "";
};
