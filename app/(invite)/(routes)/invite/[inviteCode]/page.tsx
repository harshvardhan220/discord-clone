import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  //Fetch Current Profile
  if (!profile) {
    return redirectToSignIn();
  }

  //Check if he has invite-code
  if (!params.inviteCode) {
    return redirect("/");
  }

  // If we match the invite code we want to join and we are already a member of that server, no need to join
  //again. Redirect him back to that server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  //update the server with unique invite code, create a new mwmber
  const server = await db.server.update({
    where: {
      inviteCode: params?.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id, // we dont have to specify role of new mwmber, bcoz default role is guest in the schema.
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server?.id}`);
  }

  return null;
};

export default InviteCodePage;
