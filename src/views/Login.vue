<template>
  <form @submit.prevent="handleLogin">
    <Card class="m-4">
      <template #title>
        <h1 class="text-4xl text-center pt-4">Progressional Fitness</h1>
      </template>
      <template #subtitle>
        <p class="text-center pb-4">Login/Sign-up</p>
      </template>
      <template #content>
        <div class="field grid gap-6 justify-items-center ">
          <FloatLabel class="w-full lg:w-1/2">
            <InputText id="email" size="large" class="w-full" v-model="email" :class="{ 'p-invalid': errors.email }" />
            <label for="email">Email</label>
            <small class="p-error">{{ errors.email }}</small>

          </FloatLabel>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1 justify-center">
          <!-- <Button label="Sign up" @click="showSignupDialog" severity="secondary" outlined /> -->
          <Button type="submit" label="Lets Go" />
        </div>
      </template>
    </Card>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
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

// Define validation schema using Yup
const schema = yup.object({
  email: yup.string().email('Email is invalid').required('Email is required'),
});

// Setup form with Vee Validate
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const [email] = defineField('email')
const errorMessage = ref('')
const authStore = useAuthStore()
// console.error(email)


const handleLogin = handleSubmit(async (values) => {
  authStore.findUser(values.email)
})
</script>
  
<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.error {
  color: red;
}
</style>
  