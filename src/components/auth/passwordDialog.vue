<template>
    <Dialog :visible="authStore.isPasswordDialogVisible" modal @update:visible="hideDialog" header="Sign In"
        :style="{ width: '25rem' }" pt:mask:class="backdrop-blur-sm">
        <form @submit.prevent="signIn">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Enter your password.</span>
            <div class="flex items-center gap-4 mb-8">
                <label for="password" class="font-semibold w-24">Password</label>
                <div class="flex-auto">
                    <!-- <InputText id="password" v-model="password" type="password" class="flex-auto" autocomplete="off"
                        :class="{ 'p-invalid': errors.password }" /> -->
                    <Password id="password" v-model="password" class="flex-auto" autocomplete="off" :feedback="false"
                        :input-class="{ 'p-invalid': errors.password }" />
                    <small class="p-error block">{{ errors.password }}</small>

                </div>

            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="hideDialog"></Button>
                <Button type="submit" enter label="Sign In"></Button>
            </div>
        </form>

    </Dialog>
</template>
<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup';
import { useForm } from 'vee-validate';

// Define validation schema using Yup
const schema = yup.object({
    password: yup.string().required().min(4).label('Password'),
});

// Setup form with Vee Validate
const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const [password] = defineField('password');

const authStore = useAuthStore()


const hideDialog = () => {
    authStore.showPasswordDialog()
    // emit('update:visible', false);
};

const signIn = handleSubmit((values) => {
    // Handle signup logic
    authStore.login(values.password);
});



</script>