const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://trekhive:n5QZQGRJ8jd0UkRa@cluster0.wtx9jbs.mongodb.net/TrekHive?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const Dbconnect = async () => {
    try {
        await client.connect()
        console.log('TrekHive Database Connected Successfully');
    }
    catch (error) {
        console.log(error.name, error.message);
    }
}
Dbconnect();
const AllusersCollection = client.db('TrekHive').collection('users');
const PackagesCollection = client.db('TrekHive').collection('packages');
const BookingsCollection = client.db('TrekHive').collection('Bookings');
const WishlistCollection = client.db('TrekHive').collection('Wishlists');
const tourGuidesCollection = client.db('TrekHive').collection('Guides');
const StoryCollection = client.db('TrekHive').collection('stories');

module.exports = {
    AllusersCollection,
    PackagesCollection,
    BookingsCollection,
    WishlistCollection,
    tourGuidesCollection,
    StoryCollection
}