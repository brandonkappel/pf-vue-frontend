<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
    <div class="w-full max-w-sm px-4">

      <div class="flex flex-col items-center mb-6">
        <span class="pi pi-bolt text-4xl text-primary mb-3 p-4 bg-primary/10 rounded-full" />
        <h1 class="text-3xl font-bold">Progressional Fitness</h1>
      </div>

      <form @submit.prevent="handleLogin">
        <Card>
          <template #title>Welcome back</template>
          <template #subtitle>Enter your email to continue</template>
          <template #content>
            <div class="flex flex-col gap-2 mt-2">
              <FloatLabel class="w-full">
                <InputText id="email" size="large" class="w-full" v-model="email" :class="{ 'p-invalid': errors.email }" />
                <label for="email">Email</label>
              </FloatLabel>
              <small class="p-error">{{ errors.email }}</small>
            </div>
          </template>
          <template #footer>
            <div class="flex flex-col gap-3">
              <Button type="submit" label="Continue" class="w-full" />
              <Button type="button" label="Create an account" severity="secondary" outlined class="w-full"
                @click="authStore.showSignupDialog()" />
            </div>
          </template>
        </Card>
      </form>

      <p v-if="errorMessage" class="text-red-500 text-center mt-4 text-sm">{{ errorMessage }}</p>
    </div>
  </div>

  <SignupDialog />
  <PasswordDialog />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth'
import SignupDialog from '@/components/auth/signupDialog.vue';
import PasswordDialog from '@/components/auth/passwordDialog.vue';
import { useForm } from 'vee-validate';

const schema = yup.object({
  email: yup.string().email('Email is invalid').required('Email is required'),
});

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const [email] = defineField('email')
const errorMessage = ref('')
const authStore = useAuthStore()

const handleLogin = handleSubmit(async (values) => {
  authStore.findUser(values.email)
})
</script>
