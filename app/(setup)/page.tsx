import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  //If user is a part of any server.
  const server = await db.server.findFirst({ 
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if(server) {
    return redirect(`/servers/${server.id}`) //If he is a part of a server, then redirect him to that specific server.
  }
  
  return <div>Create A Server</div>; //If user is not a part of any server.
};

export default SetupPage;
