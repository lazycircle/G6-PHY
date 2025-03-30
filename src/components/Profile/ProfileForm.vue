<template>
    <form @submit.prevent="updateProfile" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input id="name" v-model="profile.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" v-model="profile.email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
        <input id="newPassword" v-model="newPassword" type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Update Profile
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '../../store/auth'
  
  const authStore = useAuthStore()
  
  const profile = ref({
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
  })
  
  const newPassword = ref('')
  
  const updateProfile = async () => {
    try {
      const updateData = {
        name: profile.value.name,
        email: profile.value.email,
      }
      if (newPassword.value) {
        updateData.password = newPassword.value
      }
      await authStore.updateProfile(updateData)
      // Show success message
    } catch (error) {
      console.error('Profile update failed:', error)
      // Show error message
    }
  }
  </script>