import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AddressList } from "./components/address-list";
import { ObjectId } from "mongodb";
import { PageHero } from "@/app/(pages)/pageHero";

interface Address {
  _id: string;
  type: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  instructions?: string;
  isDefault: boolean;
  userId?: string;
}

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  try {
    // Fetch addresses on the server
    const addresses = await db.collection("addresses")
      .find({ 
        userId: new ObjectId(session.user.id)
      })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray();

    // Serialize the addresses with all required fields
    const serializedAddresses: Address[] = addresses.map(addr => ({
      _id: addr._id.toString(),
      type: addr.type || '',
      label: addr.label || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      landmark: addr.landmark,
      instructions: addr.instructions,
      isDefault: addr.isDefault || false,
      userId: addr.userId.toString()
    }));

    return (
      <>
        <PageHero 
          title="My Addresses" 
          description="Manage your delivery addresses for a seamless shopping experience."
        />
        <div className="container max-w-4xl mx-auto py-8">
          <AddressList initialAddresses={serializedAddresses} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return (
      <>
        <PageHero 
          title="My Addresses" 
          description="Manage your delivery addresses for a seamless shopping experience."
        />
        <div className="container max-w-4xl px-8 mx-auto py-8">
          <AddressList initialAddresses={[]} />
        </div>
      </>
    );
  }
}