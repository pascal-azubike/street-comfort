import clientPromise from "./mongodb";

export async function expireUserSession(sessionToken: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Update the session to expire immediately
    const result = await db.collection("sessions").updateOne(
      { sessionToken },
      { 
        $set: { 
          expires: new Date(),
          status: 'expired',
          logoutTime: new Date()
        } 
      }
    );

    console.log(`[SESSION_MANAGEMENT] Session ${sessionToken} expired at logout`);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("[SESSION_MANAGEMENT_ERROR]", error);
    return false;
  }
}
