import {View, Text, Button, Alert} from 'react-native'
import React, {useState} from 'react'
import {Link, router, Slot} from "expo-router";
import CustomInput from "@/component/CustomInput";
import CustomButton from "@/component/CustomButton";
import {createUser} from "@/lib/appwrite";


const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const submit = async () => {
        const { name ,email, password } = form;

        if(!name|| !email || !password) return Alert.alert('Error', 'Please enter valid name,  email address & password.');

        setIsSubmitting(true)

        try {
            await createUser({name,email,password})
            Alert.alert('Success', 'Account created successfully.');
            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className={'gap-10 bg-white rounded-lg p-5 mt-5'}>
            <CustomInput
                placeholder='Enter Your Name'
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label='Full Name'
            />
            <CustomInput
                placeholder='Enter email address'
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label='Email'
                keyboardType='email-address'
            />
            <CustomInput
                placeholder='Enter Your password'
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label='password'
                secureTextEntry={true}
            />
            <CustomButton
                title={'Sign Up'}
                isLoading={isSubmitting}
                onPress={submit}
            />
            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href="/sign-in" className="base-bold text-primary">
                    Sign In
                </Link>
            </View>

        </View>
    )
}
export default SignUp
