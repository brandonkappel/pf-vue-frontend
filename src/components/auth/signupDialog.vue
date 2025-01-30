<template>
    <Dialog :visible="authStore.isSignupDialogVisible" modal @update:visible="hideDialog" header="Create Account"
        :style="{ width: '35rem' }" pt:mask:class="backdrop-blur-sm">
        <div v-if="createAccount">
            <span class="text-surface-500 dark:text-surface-400 block mb-8"> Enter verification code</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="code" class="font-semibold w-24">Code</label>
                <!-- <InputText id="firstName" v-model="firstName" class="flex-auto" autocomplete="off" /> -->
                <InputOtp id="code" v-model="code" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="firstName" class="font-semibold w-24">First Name</label>
                <InputText id="firstName" v-model="firstName" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="lastName" class="font-semibold w-24">Last Name</label>
                <InputText id="lastName" v-model="lastName" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="password" class="font-semibold w-24">Password</label>
                <!-- <InputText id="password" v-model="password" class="flex-auto" autocomplete="off" /> -->
                <Password id="password" v-model="password" class="flex-auto" autocomplete="off" :feedback="false" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="hideDialog"></Button>
                <Button type="button" label="Sign up" @click="signUp"></Button>
            </div>

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
import { ref, defineEmits, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
const code = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const createAccount = ref(false)

const authStore = useAuthStore()


const hideDialog = () => {
    authStore.showSignupDialog()

    // emit('update:visible', false);
};

const setUpAccount = async () => {
    const response = await authStore.setUpUser()

    if (response === 'Email sent') {
        console.log(response)
        createAccount.value = true
    }
}

const signUp = () => {
    // Handle signup logic
    authStore.createUser({ code: code.value, firstName: firstName.value, lastName: lastName.value, password: password.value })
};

</script>