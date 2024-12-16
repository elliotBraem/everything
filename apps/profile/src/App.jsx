import React from "react";
import "./index.css";
import ReactMarkdown from "react-markdown";

const fallbackUrl =
  "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm";

const getImageUrl = (image) => {
  if (image?.url) return image.url;
  if (image?.ipfs_cid) return `https://ipfs.near.social/ipfs/${image.ipfs_cid}`;
  return fallbackUrl;
};

function getSocialLink(platform, username) {
  const links = {
    github: `https://github.com/${username}`,
    telegram: `https://t.me/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    twitter: `https://twitter.com/${username}`,
    website: `https://${username}`
  };
  return links[platform] || "#";
}

function getSocialIcon(platform) {
  const icons = {
    github: "📂",
    telegram: "📞",
    linkedin: "💼",
    twitter: "🐦",
    website: "🌐"
  };
  return icons[platform] || "🔗";
}

export default function({ profile }) {
  if (!profile) {
    return (
      <div className="p-8 text-center text-xl text-red-500">
        Profile not found
      </div>
    );
  }

  return (
    <div
      className="margin-auto relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center py-16"
      style={{
        backgroundImage: `url(${getImageUrl(profile?.backgroundImage) || ""})`
      }}
    >
      <div className="z-10 w-full max-w-2xl rounded-xl bg-white bg-opacity-95 p-8 text-center shadow-2xl backdrop-blur-sm lg:max-w-[1024px]">
        <div className="w-full">
          <img
            src={getImageUrl(profile?.image)}
            alt={profile?.name}
            className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <h1 className="mb-1 text-5xl font-bold text-gray-800">
            {profile?.name}
          </h1>
          {/* <p className="text-gray-600 mb-4">@{accountId}</p> */}
          <div className="markdown-content mb-6 rounded-lg bg-gray-50 p-4 text-left text-gray-700 shadow-inner">
            <ReactMarkdown>{profile?.description || ""}</ReactMarkdown>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {Object.entries(profile?.linktree || {}).map(
              ([platform, username]) => (
                <a
                  key={platform}
                  href={getSocialLink(platform, username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-opacity-600 hover:bg-opacity-700 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 text-white shadow-md transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  {getSocialIcon(platform)}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
