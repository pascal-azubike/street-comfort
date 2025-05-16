import clientPromise from "@/lib/mongodb"
import { ObjectId, Document } from "mongodb"

interface WishlistItem {
  _id: string
  name: string
  price: string
  size: string
  image: string
  category: string
  addedAt: Date
}

interface Wishlist extends Document {
  _id: ObjectId
  userId: ObjectId
  items: WishlistItem[]
  createdAt: Date
  updatedAt: Date
}

async function cleanupWishlist() {
  try {
    console.log("Starting wishlist cleanup...")
    const client = await clientPromise
    const db = client.db()

    // Get all users with multiple wishlists
    const duplicateWishlists = await db.collection("wishlist").aggregate([
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray()

    console.log(`Found ${duplicateWishlists.length} users with duplicate wishlists`)

    for (const userWishlists of duplicateWishlists) {
      const userId = userWishlists._id
      const wishlists = userWishlists.docs as Wishlist[]

      // Sort by creation date, keep the oldest one
      wishlists.sort((a: Wishlist, b: Wishlist) => a.createdAt.getTime() - b.createdAt.getTime())
      const oldestWishlist = wishlists[0]
      const otherWishlists = wishlists.slice(1)

      console.log(`Processing user ${userId}: ${wishlists.length} wishlists found`)

      // Get all unique items from all wishlists
      const allItems = new Map<string, WishlistItem>()
      wishlists.forEach(wishlist => {
        wishlist.items?.forEach(item => {
          if (!allItems.has(item._id)) {
            allItems.set(item._id, item)
          }
        })
      })

      // Update the oldest wishlist with all unique items
      await db.collection("wishlist").updateOne(
        { _id: oldestWishlist._id },
        {
          $set: {
            items: Array.from(allItems.values()),
            updatedAt: new Date()
          }
        }
      )

      // Delete other wishlists
      await db.collection("wishlist").deleteMany({
        userId,
        _id: { $ne: oldestWishlist._id }
      })

      console.log(`Updated wishlist for user ${userId}`)
    }

    console.log("Wishlist cleanup completed successfully")
  } catch (error) {
    console.error("Error during wishlist cleanup:", error)
  } finally {
    process.exit(0)
  }
}

cleanupWishlist()
