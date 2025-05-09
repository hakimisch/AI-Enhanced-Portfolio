import clientPromise from '../../../../libs/mongodb';

export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db("users");
      const collections = await db.collections();
      return new Response(JSON.stringify({ collections: collections.map(c => c.collectionName) }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("MongoDB Connection Error:", e); // Add this
      return new Response(JSON.stringify({ error: 'Database connection failed' }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }