import {Account, Avatars, Client, Databases, ID, Query} from "react-native-appwrite";
import {CreateUserParams, SignInParams} from "@/type";

export const appwrite = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: 'com.jsm.food',
    databaseId: '68711a960038fd3b1636',
    userCollectionId: '68711ada0023c5b0fa00'
}

export const client = new Client()

client
    .setEndpoint(appwrite.endpoint)
    .setProject(appwrite.project)
    .setPlatform(appwrite.platform)


export const account = new Account(client)
export const databases = new Databases(client)
const avatar = new Avatars(client)

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatar.getInitialsURL(name);

        return await databases.createDocument(
            appwrite.databaseId,
            appwrite.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}


export const signIn = async ({email,password}:SignInParams)=>{
   try{
       const sesssion = await account.createEmailPasswordSession(email,password)

   }catch(error: any){
       throw new Error(error);
   }
}

export const getCurrentUser = async ()=>{
    try {
        const currentAccount = await account.get()
        if(!currentAccount){
            throw new Error('Error getting user')
        }
        const currentUser = await databases.listDocuments(
            appwrite.databaseId,
            appwrite.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)],
        )
        if(!currentUser){
            throw new Error('Error getting user')
        }
        return currentUser.documents[0];
    }catch(error: any){
        console.log(error)
    }
}