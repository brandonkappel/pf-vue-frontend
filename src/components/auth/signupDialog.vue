<template>
    <Dialog :visible="authStore.isSignupDialogVisible" modal @update:visible="hideDialog" header="Create Account"
        :style="{ width: '35rem' }" pt:mask:class="backdrop-blur-sm">
        <div v-if="createAccount">
            <form @submit.prevent="handleSignup" :validation-schema="schema">

                <span class="text-surface-500 dark:text-surface-400 block mb-8"> Enter verification code</span>
                <div class="flex items-center gap-4 mb-4">
                    <label for="code" class="font-semibold w-24">Code</label>
                    <!-- <InputText id="firstName" v-model="firstName" class="flex-auto" autocomplete="off" /> -->
                    <InputOtp id="code" v-model="code" :input-class="{ 'p-invalid': errors.code }" />
                    <small class="p-error">{{ errors.code }}</small>
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <label for="firstName" class="font-semibold w-24">First Name</label>
                    <InputText id="firstName" v-model="firstName" class="flex-auto" autocomplete="off"
                        :class="{ 'p-invalid': errors.firstName }" />
                    <small class="p-error">{{ errors.firstName }}</small>
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <label for="lastName" class="font-semibold w-24">Last Name</label>
                    <InputText id="lastName" v-model="lastName" class="flex-auto" autocomplete="off"
                        :class="{ 'p-invalid': errors.lastName }" />
                    <small class="p-error">{{ errors.lastName }}</small>
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="password" class="font-semibold w-24">Password</label>
                    <!-- <InputText id="password" v-model="password" class="flex-auto" autocomplete="off" /> -->
                    <Password id="password" v-model="password" class="flex-auto" autocomplete="off" :feedback="false"
                        :input-class="{ 'p-invalid': errors.password }" />
                    <small class="p-error">{{ errors.password }}</small>
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="password" class="font-semibold w-24">Confirm Password</label>
                    <!-- <InputText id="password" v-model="password" class="flex-auto" autocomplete="off" /> -->
                    <Password id="password" v-model="passwordConfirm" class="flex-auto" autocomplete="off" :feedback="false"
                        :input-class="{ 'p-invalid': errors.passwordConfirm }" />
                    <small class="p-error">{{ errors.passwordConfirm }}</small>
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="hideDialog"></Button>
                    <Button label="Sign up" type="submit"></Button>
                </div>
            </form>

        </div>
        <div v-else>
            <span class="italic">
                No account associated with {{ authStore.userEmail }}
            </span>
            <div class="flex justify-center my-5 text-xl">
                <h3>Would you like to create an account?</h3>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="hideDialog"></Button>
                <Button type="button" label="Sign up" @click="setUpAccount"></Button>
            </div>
        </div>

    </Dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import { ref, defineEmits, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'vee-validate';

const schema = yup.object({
    code: yup.string().required('Code is required'),
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    password: yup.string().required().min(6).label('Password'),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required()
        .label('Password confirmation'),
});

// Setup form with Vee Validate
const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});
const [code] = defineField('code');
const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [password] = defineField('password');
const [passwordConfirm] = defineField('passwordConfirm');
const createAccount = ref(false)

const authStore = useAuthStore()


const hideDialog = () => {
    authStore.showSignupDialog()
};


const handleSignup = handleSubmit(async (values) => {
    console.error(values)
    // Handle signup logic
    authStore.createUser({ code: code.value, firstName: firstName.value, lastName: lastName.value, password: password.value })
});

const setUpAccount = async () => {
    const response = await authStore.setUpUser()

    if (response === 'Email sent') {
        console.log(response)
        createAccount.value = true
    }
}

</script>