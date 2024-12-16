declare module "profile/App" {
  import type { ComponentType } from "react";
  import type { Profile } from "@/lib/social";
  
  interface ProfileProps {
    profile?: Profile;
  }
  
  const Component: ComponentType<ProfileProps>;
  export default Component;
}
