import { ID } from "react-native-appwrite";
import { appwrite, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwrite.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwrite.databaseId, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwrite.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwrite.bucketId, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: "image/png",
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile(
        appwrite.bucketId,
        ID.unique(),
        fileObj
    );

    return storage.getFileViewURL(appwrite.bucketId, file.$id);
}

async function seed(): Promise<void> {
    console.log("Seeding data...");
    // 1. Clear all
    await clearAll(appwrite.categorieCollectionId);
    await clearAll(appwrite.customizationCollectionId);
    await clearAll(appwrite.menuCollectionId);
    await clearAll(appwrite.menu_customizationCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwrite.databaseId,
            appwrite.categorieCollectionId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwrite.databaseId,
            appwrite.customizationCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwrite.databaseId,
            appwrite.menuCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwrite.databaseId,
                appwrite.menu_customizationCollectionId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customization: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;