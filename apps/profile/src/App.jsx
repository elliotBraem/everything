const fallbackBgUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect width='400' height='160' fill='%23f3f4f6'/%3E%3C/svg%3E";

export default function ({ profile }) {
  return (
    <div className="mb-4 bg-white p-4">
      <div
        className="h-40 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url(${profile?.backgroundImage ? getImageUrl(profile.backgroundImage) : fallbackBgUrl})`
        }}
      ></div>
      <div className="-mt-12 ml-4 flex items-center">
        <div className="h-24 w-24">
          {/* <Avatar
            url={profile?.image ? getImageUrl(profile?.image) : null}
            alt={profile.name}
          /> */}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        {profile.description && (
          <p className="mt-2 text-gray-600">{profile.description}</p>
        )}
      </div>
    </div>
  );
}
