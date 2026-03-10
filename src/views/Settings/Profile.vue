<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="My Profile"
      subtitle="Manage your personal information and preferences"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Settings', to: '/settings' },
        { title: 'Profile', disabled: true },
      ]"
    />

    <v-row>
      <v-col cols="12" md="4">
        <v-card variant="flat" border rounded="xl" class="text-center py-6">
          <v-avatar size="120" color="primary" class="mb-4">
            <span class="text-h3 text-white">AD</span>
          </v-avatar>
          <div class="text-h5 font-weight-bold mb-1">Admin Manager</div>
          <div class="text-medium-emphasis mb-4">Super Admin</div>
          <v-btn variant="outlined" class="text-none">Change Avatar</v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card variant="flat" border rounded="xl">
          <v-card-text class="pa-5">
            <div class="text-subtitle-1 font-weight-bold mb-4">Personal Information</div>
            <v-text-field label="Full Name" variant="outlined" model-value="Admin Manager" density="comfortable" class="mb-3" />
            <v-text-field label="Email Address" variant="outlined" model-value="admin@example.com" density="comfortable" class="mb-3" />
            <v-text-field label="Phone Number" variant="outlined" density="comfortable" />
          </v-card-text>
          <v-card-actions class="px-5 pb-5 pt-0">
            <v-btn color="primary" variant="flat" class="text-none">Update Profile</v-btn>
            <v-spacer />
            <v-btn variant="text" class="text-none">Change Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
