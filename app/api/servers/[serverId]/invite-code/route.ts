import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// export async function DELETE(
//   req: Request,
//   { params }: { params: { serverId: string } }
// ) {
//   try {
//     const profile = await currentProfile();

//     if (!profile) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const server = await db.server.delete({
//       where: {
//         id: params.serverId,
//         profileId: profile.id,
//       }
//     });

//     return NextResponse.json(server);
//   } catch (error) {
//     console.log("[SERVER_ID_DELETE]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("ServerID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, //we are checking for admin. Profile Id is only of creator of server.
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
