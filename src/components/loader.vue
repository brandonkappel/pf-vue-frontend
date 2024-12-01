<!-- components/GlobalLoader.vue -->
<script setup>

</script>

<template>
    <div class="global-loader">
        <!-- Customize your loader style here, e.g., spinner -->
        <div class="spinner"></div>
    </div>
</template>

<style scoped>
.global-loader {
    position: fixed;
    /* top: 0;
    left: 0; */
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s infinite linear;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
