import {Text, TouchableOpacity, Image, Platform} from 'react-native'
import {MenuItem} from "@/type";
import {appwrite} from "@/lib/appwrite";

const MenuCard = ({ item: {  image_url, name, price }}: { item: MenuItem}) => {
    const imageUrl = `${image_url}?project=${appwrite.project}`;


    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            <Image source={{ uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
            <TouchableOpacity>
                <Text className="base-bold text-primary">Add to cart</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
export default MenuCard